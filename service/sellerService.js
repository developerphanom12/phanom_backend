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
    content_upload,
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
  const { gig_id, content } = data;

  return new Promise((resolve, reject) => {
    if (!gig_id || !content) {
      return reject(new Error("Missing required parameters"));
    }

    const query = `
      INSERT INTO gigs_texteditor 
      (gig_id,content)
      VALUES (?, ?)
    `;

    console.log("Executing query:", query);
    const values = [gig_id, content];

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
  const { gig_id, image1, image2, image3, vedio } = data;

  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO gigs_imagedata 
      (gig_id,image1,image2,image3,vedio)
      VALUES (?, ?, ?, ?, ?)
    `;

    console.log("Executing query:", query);
    const values = [gig_id, image1, image2, image3, vedio];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error in insert query:", err);
        return reject(err);
      }
      resolve(result.insertId);
    });
  });
}


function listgigsdata() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT DISTINCT
          c.id as gigs_id,
          c.gig_title,
          c.category_id,
          c.subcategory_id,
          c.service_type,
          c.tags,
          c.seller_id,
          c.create_date,
          c.update_date,
          s.id as seller_id,
          s.username,
          ci.id as category_id,
          ci.category_name,
          u.id as plan_id,
          u.gig_id,
          u.title,
          u.description,
          u.delivery_time,
          u.number_of_pages,
          u.revision,
          u.plugin_extension,
          u.price,
          u.plan_type,
          u.content_upload,
          u.create_date,
          u.update_date,
          sub.id as subcategory_id,
          sub.category_id,
          sub.name,
          pu.id as program_id,
          pu.gig_id,
          pu.programing_language,
          pu.create_date as program_create_date,
          pu.update_date as program_update_date
      FROM  gigs_create c
      LEFT JOIN  gigs_plantype u ON c.id = u.gig_id
      LEFT JOIN  seller s ON c.seller_id = s.id
      LEFT JOIN  category ci ON c.category_id = ci.id
      LEFT JOIN  sub_category sub ON c.subcategory_id = sub.id
      LEFT JOIN  gigs_programlang pu ON c.id = pu.gig_id
    `;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        reject(error);
      } else {
        const gigsMap = new Map();

        results.forEach((result) => {
          const gigsId = result.gigs_id;

          if (!gigsMap.has(gigsId)) {
            gigsMap.set(gigsId, {
              gigs_id: gigsId,
              gig_title: result.gig_title,
              service_type: result.service_type,
              tags: result.tags,
              create_date: result.create_date,
              update_date: result.update_date,
              seller: {
                seller_id: result.seller_id,
                username: result.username,
              },
              category: {
                category_id: result.category_id,
                category_name: result.category_name,
              },
              subcategory: {
                subcategory_id: result.subcategory_id,
                category_id: result.category_id,
                name: result.name,
              },
              plantypes: [],
              programing: [],
            });
          }

          gigsMap.get(gigsId).programing.push({
            program_id: result.program_id,
            gig_id: result.gig_id,
            programing_language: result.programing_language,
            create_date: result.program_create_date,
            update_date: result.program_update_date,
          });

          gigsMap.get(gigsId).plantypes.push({
            plan_id: result.plan_id,
            gig_id: result.gig_id,
            title: result.title,
            description: result.description,
            delivery_time: result.delivery_time,
            number_of_pages: result.number_of_pages,
            revision: result.revision,
            plugin_extension: result.plugin_extension,
            plan_type: result.plan_type,
            content_upload: result.content_upload,
            create_date: result.create_date,
            update_date: result.update_date,
          });
        });

        const categoriesWithSubcategories = Array.from(gigsMap.values());

        if (categoriesWithSubcategories.length === 0) {
          resolve(null);
        } else {
          resolve(categoriesWithSubcategories);
          console.log("Data retrieved successfully");
        }
      }
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
  addmediadata,
  listgigsdata,
};
