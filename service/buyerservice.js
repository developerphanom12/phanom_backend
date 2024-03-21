const db = require("../Database/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function buyerRegister(username, password, email, image) {
  return new Promise((resolve, reject) => {
    const insertSql = `
    INSERT INTO buyer(username,password,email,image) 
    VALUES (?, ?, ?, ?)
    `;

    const values = [username, password, email, image];

    db.query(insertSql, values, (error, result) => {
      if (error) {
        console.error("Error inserting data:", error);
        reject(error);
      } else {
        const adminId = result.insertId;

        if (adminId > 0) {
          const successMessage = "created buyer successful";
          resolve(successMessage);
        } else {
          const errorMessage = "created buyer  failed";
          reject(errorMessage);
        }
      }
    });
  });
}

function checkusername(username) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM buyer WHERE username = ?";
    db.query(query, [username], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0 ? true : false);
      }
    });
  });
}


function loginbuyer(username, password, callback) {
    const query = "SELECT * FROM buyer  WHERE username = ?";
    db.query(query, [username], async (err, results) => {
      if (err) {
        return callback(err, null);
      }
  
      if (results.length === 0) {
        return callback(null, { error: "Invalid user" });
      }
  
      const user = results[0];
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return callback(null, { error: "Invalid password" });
      }
  
      const secretKey = "secretkey";
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        secretKey
      );
      console.log("token", token);
      return callback(null, {
        data: {
          id: user.id,
          username: user.username,
          password: user.password,
          role: user.role,
          token: token,
        },
      });
    });
  }
module.exports = {
    buyerRegister,
    checkusername,
    loginbuyer
}