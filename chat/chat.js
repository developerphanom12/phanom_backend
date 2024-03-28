const dotenv = require("dotenv");
const db = require("./Database/connection");
const jwt = require("jsonwebtoken");
const io = require("../app");


io.use(async (socket, next) => {
  try {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsInVzZXJuYW1lIjoiYWRtaW4xIiwicm9sZSI6InRlbGVjYWxsZXIiLCJpYXQiOjE3MTE2MTc3MzN9.SaxsqeMw1QhdQl-sIhChiuzEEU5r89nl4yECAApsCvI";
    console.log("dfnbjsdnf",token)
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

      console.log("Chat history:", chatHistory);

      socket.emit("chatHistory", { chatHistory: chatHistory });
    });
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.user.username} disconnected`);
  });
});
