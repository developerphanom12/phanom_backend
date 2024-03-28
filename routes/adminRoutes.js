const express = require("express");
const router = express.Router();
const authenticateToken = require("../Middleware/Authentication");
const db = require("../Database/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


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

    const secretKey = "secretkey";
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

router.post("/login", (req, res) => {
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

router.get("/chat/:otherUser", authenticateToken, (req, res) => {
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

router.get("/users", authenticateToken, (req, res) => {
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
module.exports = router;

