const db = require("../Database/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

function CheckSubCategory(subcategory_id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM sub_category WHERE id = ?";
    db.query(query, [subcategory_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0 ? results[0] : null);
      }
    });
  });
}

function insertGigsData(
  gig_title,
  category_id,
  subcategory_id,
  service_type,
  tags,
  userId
) {
  return new Promise((resolve, reject) => {
    if (
      !gig_title ||
      !category_id ||
      !subcategory_id ||
      !service_type ||
      !tags ||
      !userId
    ) {
      return reject("Missing required parameters");
    }

    const query = `
      INSERT INTO gigs_create 
      (gig_title, category_id, subcategory_id, service_type, tags, seller_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    console.log("Executing query:", query);

    db.query(
      query,
      [gig_title, category_id, subcategory_id, service_type, tags, userId],
      (err, result) => {
        if (err) {
          console.error("Error in insert query:", err);
          return reject(err);
        }

        resolve(result.insertId);
      }
    );
  });
}

function loginseller(username, password, callback) {
  const query = "SELECT * FROM seller  WHERE username = ?";
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
async function insertprograminglan(gig_id, programing_languages) {
  const query = `
    INSERT INTO  gigs_programlang 
    (gig_id, programing_language)
    VALUES (?, ?)
  `;

  const values = programing_languages.map((language) => [gig_id, language]);

  try {
    const results = await Promise.all(
      values.map((value) => {
        return new Promise((resolve, reject) => {
          db.query(query, value, (err, result) => {
            if (err) {
              console.error("Error in insert query:", err);
              reject(err);
            } else {
              resolve(result.insertId);
            }
          });
        });
      })
    );

    return results;
  } catch (error) {
    throw error;
  }
}

function checkGigid(gig_id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM gigs_create WHERE id = ?";
    db.query(query, [gig_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0 ? results[0] : null);
      }
    });
  });
}

async function insertweblanguage(gig_id, website_feature) {
  const query = `
    INSERT INTO  gigs_websitefeature 
    (gig_id, website_feature)
    VALUES (?, ?)
  `;

  const values = website_feature.map((language) => [gig_id, language]);

  try {
    const results = await Promise.all(
      values.map((value) => {
        return new Promise((resolve, reject) => {
          db.query(query, value, (err, result) => {
            if (err) {
              console.error("Error in insert query:", err);
              reject(err);
            } else {
              resolve(result.insertId);
            }
          });
        });
      })
    );

    return results;
  } catch (error) {
    throw error;
  }
}

async function insertprograminglan(gig_id, programing_languages) {
  const query = `
    INSERT INTO  gigs_programlang 
    (gig_id, programing_language)
    VALUES (?, ?)
  `;

  const values = programing_languages.map((language) => [gig_id, language]);

  try {
    const results = await Promise.all(
      values.map((value) => {
        return new Promise((resolve, reject) => {
          db.query(query, value, (err, result) => {
            if (err) {
              console.error("Error in insert query:", err);
              reject(err);
            } else {
              resolve(result.insertId);
            }
          });
        });
      })
    );

    return results;
  } catch (error) {
    throw error;
  }
}

function insertPriceData(data) {
  const {
    gig_id,
    title,
    description,
    delivery_time,
    number_of_pages,
    revision,
    plugin_extension,
    price,
    plan_type,
    content_upload
  } = data;
  
  return new Promise((resolve, reject) => {
    if (
      !gig_id ||
      !title ||
      !description ||
      !delivery_time ||
      !number_of_pages ||
      !revision ||
      !plugin_extension ||
      !price ||
      !plan_type
    ) {
      return reject(new Error("Missing required parameters"));
    }

    const query = `
      INSERT INTO gigs_plantype 
      (gig_id, title, description, delivery_time, number_of_pages ,revision,plugin_extension,price,plan_type,content_upload)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    console.log("Executing query:", query);
    const values = [
      gig_id,
      title,
      description,
      delivery_time,
      number_of_pages,
      revision,
      plugin_extension,
      price,
      plan_type,
      content_upload,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error in insert query:", err);
        return reject(err);
      }
      resolve(result.insertId);
    });
  });
}



async function gigsQuestion(gig_id, questionsAnswers) {
  const query = `
    INSERT INTO  gigs_question 
    (gig_id, question, answer)
    VALUES (?, ?, ?)
  `;

  try {
    const results = await Promise.all(
      questionsAnswers.map(({ question, answer }) => {
        const values = [gig_id, question, answer];
        return new Promise((resolve, reject) => {
          db.query(query, values, (err, result) => {
            if (err) {
              console.error("Error in insert query:", err);
              reject(err);
            } else {
              resolve(result.insertId);
            }
          });
        });
      })
    );

    return results;
  } catch (error) {
    throw error;
  }
}


function addCOntentforgigs(data) {
  const {
    gig_id,
    content
  } = data;
  
  return new Promise((resolve, reject) => {
    if (
      !gig_id || !content 
    ) {
      return reject(new Error("Missing required parameters"));
    }

    const query = `
      INSERT INTO gigs_texteditor 
      (gig_id,content)
      VALUES (?, ?)
    `;

    console.log("Executing query:", query);
    const values = [
      gig_id,
     content
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error in insert query:", err);
        return reject(err);
      }
      resolve(result.insertId);
    });
  });
}





function addmediadata(data) {
  const {
    gig_id,
    image1,
    image2,
    image3,
    vedio
  } = data;
  
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO gigs_imagedata 
      (gig_id,image1,image2,image3,vedio)
      VALUES (?, ?, ?, ?, ?)
    `;

    console.log("Executing query:", query);
    const values = [
      gig_id,
     image1,
     image2,
     image3,
     vedio
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error in insert query:", err);
        return reject(err);
      }
      resolve(result.insertId);
    });
  });
}

module.exports = {
  sellergister,
  checkusername,
  checkcatid,
  existidinSellerTbale,
  CheckSubCategory,
  insertGigsData,
  loginseller,
  insertprograminglan,
  checkGigid,
  insertweblanguage,
  insertPriceData,
  gigsQuestion,
  addCOntentforgigs,
  addmediadata
};
