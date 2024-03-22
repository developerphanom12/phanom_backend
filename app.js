const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const authenticateToken = require("./Middleware/Authentication");
const app = express();
const httpServer = require("http").createServer(app);
const db = require("./Database/connection");
const socketio = require("socket.io");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();

app.use(bodyParser.json()); 
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsInVzZXJuYW1lIjoiYWRtaW4xIiwicm9sZSI6InRlbGVjYWxsZXIiLCJpYXQiOjE3MTA3NTE2MDJ9.uKbNNQ0bXw91b-bglMxoUHkC7ktFlF9Lr3xo2zGAk3w";

const io = socketio(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

function loginTelecaller(username, passsword, callback) {
  const query = "SELECT * FROM tellecaler_data  WHERE username = ?";
  db.query(query, [username], async (err, results) => {
    if (err) {
      return callback(err, null);
    }

    if (results.length === 0) {
      return callback(null, { error: "Invalid user" });
    }

    const user = results[0];

    const passwordMatch = await bcrypt.compare(passsword, user.passsword);

    if (!passwordMatch) {
      return callback(null, { error: "Invalid password" });
    }

    if (user.is_deleted === 1) {
      return callback(null, { error: "User not found" });
    }
    if (user.is_approved !== 1) {
      return callback(null, { error: "You are not approved at this moment" });
    }

    const secretKey = process.env.SECRET_KEY || "secretkey";
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      secretKey
    );
    return callback(null, {
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        token: token,
      },
    });
  });
}

app.post("/login", (req, res) => {
  const { username, passsword } = req.body;
  try {
    loginTelecaller(username, passsword, async (err, result) => {
      if (err) {
        console.error("Error:", err);
        return res
          .status(500)
          .json({ error: "An internal server error occurred" });
      }

      if (result.error) {
        return res.status(401).json({ error: result.error });
      }

      res.status(201).json({
        message: "Telecaller login success",
        status: 201,
        data: result.data,
      });
    });
  } catch (error) {
    console.error("Error logging in telecaller:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
});

app.get("/chat/:otherUser", authenticateToken, (req, res) => {
  const currentUser = req.user.username;
  const otherUser = req.params.otherUser;
  db.query(
    "SELECT * FROM chat WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?) ORDER BY creation_date",
    [currentUser, otherUser, otherUser, currentUser],
    (error, results) => {
      if (error) {
        console.error("Error fetching chat history:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      const chatHistory = results.map((result) => ({
        sender: result.sender,
        receiver: result.receiver,
        message: result.message,
      }));
      res.json({ chatHistory: chatHistory });
    }
  );
});

app.get("/users", authenticateToken, (req, res) => {
  const currentUser = req.user.username;
  db.query(
    "SELECT * FROM tellecaler_data WHERE username != ?",
    [currentUser],
    (error, results) => {
      if (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      const users = results;
      res.json({ users: users });
    }
  );
});
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      throw new Error("Authentication error: Token not provided");
    }
    const decoded = jwt.verify(token, "secretkey");
    socket.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };
    next();
  } catch (error) {
    next(new Error("Authentication error: Invalid token"));
  }
}).on("connection", (socket) => {
  console.log(`User ${socket.user.username} connected`);


  socket.on("sendMessage", (data) => {
    const { receiver, message } = data;
    const senderId = socket.user.id;
    const senderUsername = socket.user.username;
  
    const sql = "INSERT INTO chat (sender, receiver, message) VALUES (?, ?, ?)";
    db.query(sql, [senderId, receiver, message], (err, result) => {
      if (err) {
        console.error("Error inserting message into database:", err);
        socket.emit("sendMessageError", { error: "Internal server error" });
        return;
      }
  
      io.to(receiver).emit("newMessage", {
        senderId: senderId,
        senderUsername: senderUsername,
        receiver: receiver,
        message: message,
      });
  
      socket.emit("newMessage", {
        senderId: senderId,
        senderUsername: senderUsername,
        receiver: receiver,
        message: message,
      });
  
      socket.emit("sendMessageSuccess", { senderId: senderId, message: message });
    });
  });
  
  
  
  socket.on("getChatHistory", (data) => {
    const userId = data.userId;
    console.log("user", userId);
    const sql =
      "SELECT chat.*, tellecaler_data.username AS senderName FROM chat LEFT JOIN tellecaler_data ON chat.sender = tellecaler_data.id WHERE sender = ? OR receiver = ? ORDER BY creation_date";
    db.query(sql, [userId, userId], (error, results) => {
      if (error) {
        console.error("Error fetching chat history:", error);
        return;
      }
      const chatHistory = results.map((result) => ({
        sender: result.senderName,
        receiver: result.receiver,
        message: result.message,
      }));

      console.log("Chathistory:", chatHistory);

      socket.emit("chatHistory", { chatHistory: chatHistory });
    });
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.user.username} disconnected`);
    console.log(`User ${socket.user.id} disconnected`);

  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
