const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const admin = require('./routes/adminRoutes')
const category = require('./routes/categoryRoutes')
const seller = require('./routes/sellerRoutes')
const buyer = require('./routes/buyerRoutes')
const socketio = require("socket.io");
const httpServer = require("http").createServer(app);
const jwt = require("jsonwebtoken");
const db = require("./Database/connection");

dotenv.config();

app.use(express.json()); 
app.use(cors({ origin: true }));
app.use(cors({ origin: ["http://localhost:3000"] }));
app.use('/api/admin',admin)
app.use('/api/category',category)
app.use('/api/seller',seller)
app.use('/api/buyer',buyer)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const io = socketio(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    }, 
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
});
io.on("connection", (socket) => {
    console.log(`User ${socket.user.username} connected`);
    
    socket.join(socket.user.id);
  
    socket.on("sendMessage", (data) => {
      const { receiver, message } = data;
      const senderId = socket.user.id;
      const sql = "INSERT INTO chat (sender, receiver, message) VALUES (?, ?, ?)";
      db.query(sql, [senderId, receiver, message], (err, result) => {
        if (err) {
          console.error("Error inserting message into database:", err);
          socket.emit("sendMessageError", { error: "Internal server error" });
          return;
        }
  
        io.to(receiver).emit("newMessage", {
          senderId: senderId,
          message: message,
        });
  
        socket.emit("sendMessageSuccess", { success: true });
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
  
  
        socket.emit("chatHistory", { chatHistory: chatHistory });
      });
    });
  
    socket.on("disconnect", () => {
      console.log(`User ${socket.user.username} disconnected`);
      socket.leave(socket.user.id);

    });
  });


const port = process.env.PORT || 4000;
httpServer.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

module.exports = io;
