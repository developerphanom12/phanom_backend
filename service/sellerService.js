const db = require("../Database/connection");

function sellergister(username, password, category_id, technology_name) {
  return new Promise((resolve, reject) => {
    const insertSql = `
    INSERT INTO seller(username,password,category_id,technology_name) 
    VALUES (?, ?, ?, ?)
    `;

    const values = [username, password, category_id, technology_name];

    db.query(insertSql, values, (error, result) => {
      if (error) {
        console.error("Error inserting data:", error);
        reject(error);
      } else {
        const adminId = result.insertId;

        if (adminId > 0) {
          const successMessage = "created seller successful";
          resolve(successMessage);
        } else {
          const errorMessage = "created seller  failed";
          reject(errorMessage);
        }
      }
    });
  });
}

function checkusername(username) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM seller WHERE username = ?";
    db.query(query, [username], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0 ? true : false);
      }
    });
  });
}

function checkcatid(category_id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM category WHERE id = ?";
    db.query(query, [category_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0 ? results[0] : null);
      }
    });
  });
}

function existidinSellerTbale(catId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM seller WHERE category_id = ?";
    db.query(query, [catId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0 ? true : false);
      }
    });
  });
}

module.exports = {
  sellergister,
  checkusername,
  checkcatid,
  existidinSellerTbale,
};
