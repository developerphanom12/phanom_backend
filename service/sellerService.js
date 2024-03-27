const db = require("../Database/connection");
const bcrypt = require("bcrypt");
const { func } = require("joi");
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
async function insertprograminglan(userid, programing_languages) {
  const query = `
    INSERT INTO  gigs_programlang 
    (gig_id, programing_language)
    VALUES (?, ?)
  `;

  const values = programing_languages.map((language) => [userid, language]);

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

async function insertweblanguage(userid, website_feature) {
  const query = `
    INSERT INTO  gigs_websitefeature 
    (gig_id, website_feature)
    VALUES (?, ?)
  `;

  const values = website_feature.map((language) => [userid, language]);

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

function listgigsdata(gigId) {
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
          pu.update_date as program_update_date,
          gg.id as guestion_id,
          gg.gig_id,
          gg.question,
          gg.answer,
          gg.create_date as question_create_date,
          gg.update_date as question_update_date,
          gt.id as texteditor_id,
          gt.gig_id,
          gt.content,
          gt.create_date,
          gt.update_date,
          gw.id as web_id,
          gw.gig_id,
          gw.website_feature,
          gw.create_date,
          gw.update_date,
          gp.id AS content_id,
          gp.gig_id,
          gp.image1,
          gp.image2,
          gp.image3,
          gp.vedio,
          grr.id AS rating_id,
          grr.gig_id,
          grr.seller_id,
          grr.rating,
          grr.comment
      FROM  gigs_create c
      LEFT JOIN  gigs_plantype u ON c.id = u.gig_id
      LEFT JOIN  seller s ON c.seller_id = s.id
      LEFT JOIN  category ci ON c.category_id = ci.id
      LEFT JOIN  sub_category sub ON c.subcategory_id = sub.id
      LEFT JOIN  gigs_programlang pu ON c.id = pu.gig_id
      LEFT JOIN  gigs_texteditor gt ON c.id = gt.gig_id
      LEFT JOIN gigs_question gg ON c.id = gg.gig_id
      LEFT JOIN  gigs_websitefeature gw ON c.id = gw.gig_id
      LEFT JOIN  gigs_imagedata gp ON c.id = gp.gig_id
      LEFT JOIN  gigs_rating grr ON c.id = grr.gig_id
       WHERE c.id = ?;
    `;

    db.query(query, gigId, (error, results) => {
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
              rating: [],
              plantypes: [],
              programing: [],
              question: [],
              websiteFeatures: [],
              EditorData: {
                texteditor_id: result.texteditor_id,
                gig_id: result.gig_id,
                content: result.content,
                create_date: result.create_date,
                update_date: result.update_date,
              },
              images: {
                content_id: result.content_id,
                gig_id: result.gig_id,
                image1: result.image1,
                image2: result.image1,
                image3: result.image1,
                vedio: result.vedio,
              },
            });
          }

          if (
            !gigsMap
              .get(gigsId)
              .programing.some(
                (program) => program.program_id === result.program_id
              )
          ) {
            gigsMap.get(gigsId).programing.push({
              program_id: result.program_id,
              gig_id: result.gig_id,
              programing_language: result.programing_language,
              create_date: result.program_create_date,
              update_date: result.program_update_date,
            });
          }

          if (
            !gigsMap
              .get(gigsId)
              .plantypes.some((plantype) => plantype.plan_id === result.plan_id)
          ) {
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
              price: result.price,
            });
          }
          if (
            !gigsMap
              .get(gigsId)
              .question.some(
                (questions) => questions.guestion_id === result.guestion_id
              )
          ) {
            gigsMap.get(gigsId).question.push({
              guestion_id: result.guestion_id,
              gig_id: result.gig_id,
              question: result.question,
              answer: result.answer,
              create_date: result.question_create_date,
              update_date: result.question_update_date,
            });
          }

          if (
            !gigsMap
              .get(gigsId)
              .websiteFeatures.some(
                (website) => website.web_id === result.web_id
              )
          ) {
            gigsMap.get(gigsId).websiteFeatures.push({
              web_id: result.web_id,
              gig_id: result.gig_id,
              website_feature: result.website_feature,
              create_date: result.create_date,
              update_date: result.update_date,
            });
          }

          if (
            !gigsMap
              .get(gigsId)
              .rating.some((ratings) => ratings.rating_id === result.rating_id)
          ) {
            gigsMap.get(gigsId).rating.push({
              rating_id: result.rating_id,
              gig_id: result.gig_id,
              seller: {
                seller_id: result.seller_id,
                username: result.username,
              },
              rating: result.rating,
              comment: result.comment,
            });
          }
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

function insertRating(data, userId) {
  const { gig_id, rating, comment } = data;
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO gigs_rating
      (gig_id,seller_id,rating,comment)
      VALUES (?, ?, ?, ?)
    `;

    console.log("Executing query:", query);
    const values = [gig_id, userId, rating, comment];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error in insert query:", err);
        return reject(err);
      }
      resolve(result.insertId);
    });
  });
}

// function getSubcategoryId(subId) {
//   return new Promise((resolve, reject) => {
//     const query = `
//         SELECT DISTINCT
//             c.id AS subcategory_id,
//             c.category_id,
//             c.name,
//             gd.id as gig_id,
//             gd.subcategory_id,
//             gd.gig_title,
//             ss.id as seller_id,
//             ss.username,
//             ss.image,
//             pp.id as plan_type,
//             pp.gig_id,
//             pp.price,
//             gi.id as content_id,
//             gi.gig_id,
//             gi.image1,
//             gi.image2,
//             gi.image3,
//             gi.vedio
//             FROM  sub_category c
//         LEFT JOIN gigs_create gd ON c.id = gd.subcategory_id
//         LEFT JOIN seller ss ON gd.seller_id = ss.id
//         LEFT JOIN gigs_plantype pp ON gd.id = pp.gig_id
//         LEFT JOIN gigs_imagedata gi ON gd.id = gi.gig_id

//         WHERE c.id = ?;`;

//     db.query(query, subId, (error, results) => {
//       if (error) {
//         console.error("Error executing query:", error);
//         reject(error);
//       }

//       else {
//         const gigsMap = new Map();

//         results.forEach((result) => {
//           const gigsId = result.subcategory_id;

//           if (!gigsMap.has(gigsId)) {
//             gigsMap.set(gigsId, {
//               category_id: gigsId,
//               category_id: result.category_id,
//               name : result.name,
//               gigsData :{
//                 gig_id: result.gig_id,
//                 subcategory_id: result.subcategory_id,
//                 gig_title : result.gig_title,
//               },
//               seller : {
//                 seller_id: result.seller_id,
//                 username: result.username,
//                 image  : result.image,
//               },
//               gigsimages : {
//                 content_id: result.content_id,
//                 gig_id: result.gig_id,
//                 image1: result.image1,
//                 image2  : result.image2,
//                 image3  : result.image3,
//                 vedio  : result.vedio,

//               },
//               plantypes: [],

//             });
//           }

//           if (!gigsMap.get(gigsId).plantypes.some(plantype => plantype.plan_type === result.plan_type)) {
//             gigsMap.get(gigsId).plantypes.push({
//               plan_type: result.plan_type,
//               gig_id: result.gig_id,
//               price  : result.price,
//             });
//           }

//         });

//         const categoriesWithSubcategories = Array.from(gigsMap.values());

//         if (categoriesWithSubcategories.length === 0) {
//           resolve(null);
//         } else {
//           resolve(categoriesWithSubcategories);
//           console.log("Data retrieved successfully");
//         }
//       }
//     });
//   });
// }

function getSubcategoryId(cd) {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT DISTINCT
            c.id AS cd,
            c.category_id,
            c.name,
            gd.id as gig_ids,
            gd.subcategory_id,
            gd.gig_title,
            ss.id as seller_id,
            ss.username,
            ss.image,
            pp.id as plan_type,
            pp.gig_id, 
            pp.price,
            gi.id as content_id,
            gi.gig_id,
            gi.image1,
            gi.image2,
            gi.image3,
            gi.vedio
            FROM  sub_category c
        LEFT JOIN gigs_create gd ON c.id = gd.subcategory_id
        LEFT JOIN seller ss ON gd.seller_id = ss.id
        LEFT JOIN gigs_plantype pp ON gd.id = pp.gig_id
        LEFT JOIN gigs_imagedata gi ON gd.id = gi.gig_id

        WHERE c.id = ? AND pp.plan_type = 'basic';`;

    db.query(query, cd, (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        reject(error);
      } else {
        const data = results.map((row) => ({
          cd: row.cd,
          category_id: results.category_id,
          name: row.name,
          gigsData: {
            gig_ids: row.gig_ids,
            subcategory_id: row.subcategory_id,
            gig_title: row.gig_title,
          },
          seller: {
            seller_id: row.seller_id,
            username: row.username,
            image: row.image,
          },
          gigsimages: {
            content_id: row.content_id,
            gig_id: row.gig_id,
            image1: row.image1,
            image2: row.image2,
            image3: row.image3,
            vedio: row.vedio,
          },

          price: {
            plan_type: row.plan_type,
            gig_id: row.gig_id,
            price: row.price,
          },
        }));

        resolve(data);

        console.log("All data retrieved successfully");
      }
    });
  });
}

function checkGigidout(gigs_id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM gigs_create WHERE id = ?";
    db.query(query, [gigs_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0 ? results[0] : null);
      }
    });
  });
}

function CreateOffer(
  gigs_id,
  offer_type,
  creator_id,
  receive_id,
  offer_expire,
  role
) {
  return new Promise((resolve, reject) => {
    if (
      !gigs_id ||
      !offer_type ||
      !creator_id ||
      !receive_id ||
      !offer_expire ||
      !role
    ) {
      return reject("Missing required parameters");
    }

    const query = `
      INSERT INTO offer_create 
      (gigs_id, offer_type, creator_id, receive_id, offer_expire,role)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    console.log("Executing query:", query);

    const values = [
      gigs_id,
      offer_type,
      creator_id,
      receive_id,
      offer_expire,
      role,
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

function offertype(offer_id, describe_offer, revision, delivery_day, price) {
  return new Promise((resolve, reject) => {
    if (!offer_id || !describe_offer || !revision || !delivery_day || !price) {
      return reject("Missing required parameters");
    }

    const query = `
      INSERT INTO  offer_singlepayment 
      (offer_id, describe_offer, revision, delivery_day, price)
      VALUES (?, ?, ?, ?, ?)
    `;

    console.log("Executing query:", query);

    const values = [offer_id, describe_offer, revision, delivery_day, price];
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error in insert query:", err);
        return reject(err);
      }

      resolve(result.insertId);
    });
  });
}

const aprrovedOffer = (status, id) => {
  const updateQuery = "UPDATE offer_create SET status = ? WHERE id = ?";

  const values = [status, id];

  return new Promise((resolve, reject) => {
    try {
      db.query(updateQuery, values, (err, result) => {
        if (err) {
          console.error("Error in update query:", err);
          reject(err);
          return;
        }

        if (result.affectedRows === 0) {
          reject({ status: 404, error: "Offer not found" });
          return;
        }

        resolve({ id, message: "Offer status updated successfully" });
      });
    } catch (error) {
      console.error("Caught error:", error);
      reject({ status: error.status || 500, error });
    }
  });
};

async function getOfferById(offerId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM offer_create WHERE id = ?";
    db.query(query, [offerId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0 ? results[0] : null);
      }
    });
  });
}

async function odersales(n, userId, role) {
  return new Promise(async (resolve, reject) => {
    const query = `
      SELECT
          DAY(update_date) AS day,
          WEEK(update_date) AS week,
          MONTH(update_date) AS month,
          DATE(update_date) AS date,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS total_pending,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS total_sales
         
      FROM
          offer_create
      WHERE
          status IN ('pending', 'approved') AND
          creator_id = ? AND
          role = ? AND
          update_date >= CURDATE() - INTERVAL ? DAY
      GROUP BY
          day, week, month, date
      ORDER BY
          month, week, day, date;
    `;

    const queryParams = [userId, role, n];

    db.query(query, queryParams, (err, result) => {
      if (err) {
        console.error("Error in query:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function totalgetorders(n, userId, role) {
  return new Promise(async (resolve, reject) => {
    const query = `
      SELECT
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS total_pending,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS total_sales
      FROM
          offer_create
      WHERE
          status IN ('pending', 'approved') AND
          creator_id = ? AND
          role = ? AND
          update_date >= CURDATE() - INTERVAL ? DAY;
              `;

    const queryParams = [userId, role, n];

    db.query(query, queryParams, (err, result) => {
      if (err) {
        console.error("Error in query:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function yearlyCheck(month = null, userId, userRole) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT
          DAY(update_date) AS day,
          WEEK(update_date) AS week,
          MONTH(update_date) AS month,
          DATE(update_date) AS date,
          COUNT(*) AS total_sales
      FROM
          offer_create
      WHERE
          status = 'approved' AND 
          creator_id = ? AND
          role = ?
    `;

    if (month) {
      query += ` AND MONTH(update_date) = ? `;
    }

    query += `
      GROUP BY
          day, week, month, date
      ORDER BY
          month, week, day, date;
    `;

    const queryParams = month ? [userId, userRole, month] : [userId, userRole];

    db.query(query, queryParams, (err, result) => {
      if (err) {
        console.error("Error in query:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function getsellerdata(cd) {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT DISTINCT
            c.id AS cd,
            c.username,
            c.category_id,
            c.technology_name,
            cd.id as category_id,
            cd.category_name
            FROM  seller c
        LEFT JOIN category cd ON c.category_id = cd.id
        WHERE c.id = ? ;`;

    db.query(query, cd, (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        reject(error);
      } else {
        const data = results.map((row) => ({
          cd: row.cd,
          username: row.username,
          technology_name: row.technology_name,
          category: {
            category_id: row.category_id,
            category_name: row.category_name,
          },
        }));

        resolve(data);

        console.log("All data retrieved successfully", data);
      }
    });
  });
}

const activategig = (is_open, id, callback) => {
  const updateQuery = "UPDATE gigs_create SET is_open = ? WHERE id = ?";
  try {
    db.query(updateQuery, [is_open, id], (updateError, updateResult) => {
      if (updateError) {
        console.error("Error updating telecaller status:", updateError);
        return callback({
          status: 500,
          error: "Failed to update telecaller status.",
        });
      }

      if (updateResult.affectedRows === 0) {
        console.error("gig not found in the update:", updateResult);
        return callback({ error: "gig not found" });
      }

      callback(null, { message: "gig activate successfully" });
    });
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
};

function activegigsdget(userid, isOpen) {
  return new Promise((resolve, reject) => {
    let query;
    if (isOpen === 1) {
      query = `
        SELECT DISTINCT
          gd.id as gig_ids,
          gd.subcategory_id,
          gd.gig_title,
          gd.create_date as date_create,
          ss.id as seller_id,
          ss.username,
          gi.id as content_id,
          gi.gig_id,
          gi.image1,
          gi.image2,
          gi.image3,
          gi.vedio
        FROM gigs_create gd
        LEFT JOIN seller ss ON gd.seller_id = ss.id
        LEFT JOIN gigs_imagedata gi ON gd.id = gi.gig_id
        WHERE gd.seller_id = ? AND gd.is_open = 1  AND gd.is_deleted = 0;`;
    } else if (isOpen === 0) {
      query = `
        SELECT DISTINCT
          gd.id as gig_ids,
          gd.subcategory_id,
          gd.gig_title,
          gd.create_date as date_create,
          ss.id as seller_id,
          ss.username,
          gi.id as content_id,
          gi.gig_id,
          gi.image1,
          gi.image2,
          gi.image3,
          gi.vedio
        FROM gigs_create gd
        LEFT JOIN seller ss ON gd.seller_id = ss.id
        LEFT JOIN gigs_imagedata gi ON gd.id = gi.gig_id
        WHERE gd.seller_id = ? AND gd.is_open = 0 AND gd.is_deleted = 0;`;
    } else {
      reject("Invalid value for isOpen parameter");
      return;
    }

    db.query(query, userid, (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        reject(error);
      } else {
        const data = results.map((row) => ({
          gig_ids: row.gig_ids,
          subcategory_id: row.subcategory_id,
          gig_title: row.gig_title,
          date_create: row.date_create,
          seller: {
            seller_id: row.seller_id,
            username: row.username,
          },
          gigsimages: {
            content_id: row.content_id,
            gig_id: row.gig_id,
            image1: row.image1,
            image2: row.image2,
            image3: row.image3,
            vedio: row.vedio,
          },
        }));

        resolve(data);
      }
    });
  });
}

function updatecreatedata(id, updatedUserData) {
  return new Promise((resolve, reject) => {
    const { gig_title, category_id, subcategory_id, service_type, tags } =
      updatedUserData;

    const updateQuery = `
          UPDATE gigs_create u
          SET 
              u.gig_title = COALESCE(?, u.gig_title),
              u.category_id = COALESCE(?, u.category_id),
              u.subcategory_id = COALESCE(?, u.subcategory_id),
              u.service_type = COALESCE(?, u.service_type),
              u.tags = COALESCE(?, u.tags)
          WHERE u.id = ?;
      `;

    db.query(
      updateQuery,
      [gig_title, category_id, subcategory_id, service_type, tags, id],
      (updateError, updateResult) => {
        if (updateError) {
          reject(updateError);
          console.error(
            "Error updating courses information and tutionfees:",
            updateError
          );
        } else {
          if (updateResult.affectedRows > 0) {
            const fetchQuery = `
                          SELECT * FROM gigs_create u
                          WHERE u.id = ?;
                      `;

            db.query(fetchQuery, [id], (fetchError, fetchResult) => {
              if (fetchError) {
                reject(fetchError);
                console.error(
                  "Error fetching updated courses data:",
                  fetchError
                );
              } else {
                if (fetchResult.length > 0) {
                  const updatedUserData = fetchResult[0];
                  resolve(updatedUserData);
                  console.log(
                    "courses information and tutionfees updated successfully",
                    updatedUserData
                  );
                } else {
                  resolve(null);
                }
              }
            });
          } else {
            resolve(null);
          }
        }
      }
    );
  });
}
const updateplantypedata = async (id, updatedUserData) => {
  try {
    const {
      title,
      description,
      delivery_time,
      number_of_pages,
      revision,
      plugin_extension,
      price,
    } = updatedUserData;

    const updateQuery = `
      UPDATE gigs_plantype u
      SET 
          u.title = COALESCE(?, u.title),
          u.description = COALESCE(?, u.description),
          u.delivery_time = COALESCE(?, u.delivery_time),
          u.number_of_pages = COALESCE(?, u.number_of_pages),
          u.revision = COALESCE(?, u.revision),
          u.plugin_extension = COALESCE(?, u.plugin_extension),
          u.price = COALESCE(?, u.price)
      WHERE u.id = ?;
    `;

    const updateResult = await new Promise((resolve, reject) => {
      db.query(
        updateQuery,
        [
          title,
          description,
          delivery_time,
          number_of_pages,
          revision,
          plugin_extension,
          price,
          id,
        ],
        (updateError, updateResult) => {
          if (updateError) {
            reject(updateError);
          } else {
            resolve(updateResult);
          }
        }
      );
    });

    if (updateResult.affectedRows > 0) {
      const fetchQuery = `
        SELECT * FROM gigs_plantype u
        WHERE u.id = ?;
      `;

      const fetchResult = await new Promise((resolve, reject) => {
        db.query(fetchQuery, [id], (fetchError, fetchResult) => {
          if (fetchError) {
            reject(fetchError);
          } else {
            resolve(fetchResult);
          }
        });
      });

      if (fetchResult.length > 0) {
        return fetchResult[0];
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error updating gig plantype:", error);
    throw new Error("Failed to update gig plantype data");
  }
};

// const updategigPLantype = async (req, res) => {
//   const id = req.params.id;
//   const userRole = req.user.role;
//   const { title, description, delivery_time, number_of_pages, revision, plugin_extension, price } = req.body;

//   try {
//     if (userRole !== "seller") {
//       return res.status(403).json({ status: 403, message: "Forbidden for regular user" });
//     }

//     const updatedGig = await updateplantypedata(id, {
//       title,
//       description,
//       delivery_time,
//       number_of_pages,
//       revision,
//       plugin_extension,
//       price
//     });

//     if (!updatedGig) {
//       return res.status(400).json({ status: 400, error: "Failed to update gig data" });
//     }

//     return res.status(200).json({
//       status: 200,
//       message: "Gig data updated successfully",
//       data: updatedGig,
//     });
//   } catch (error) {
//     console.error("Internal Server Error:", error);
//     return res.status(500).json({
//       status: 500,
//       errorMessage: error.message,
//     });
//   }
// };



const updateContents = async (id, updatedUserData) => {
  try {
    const {
      content,
      
    } = updatedUserData;

    const updateQuery = `
      UPDATE gigs_texteditor u
      SET 
          u.content = COALESCE(?, u.content)
      WHERE u.id = ?;
    `;

    const updateResult = await new Promise((resolve, reject) => {
      db.query(
        updateQuery,
        [
         content,
          id,
        ],
        (updateError, updateResult) => {
          if (updateError) {
            reject(updateError);
          } else {
            resolve(updateResult);
          }
        }
      );
    });

    if (updateResult.affectedRows > 0) {
      const fetchQuery = `
        SELECT * FROM gigs_texteditor u
        WHERE u.id = ?;
      `;

      const fetchResult = await new Promise((resolve, reject) => {
        db.query(fetchQuery, [id], (fetchError, fetchResult) => {
          if (fetchError) {
            reject(fetchError);
          } else {
            resolve(fetchResult);
          }
        });
      });

      if (fetchResult.length > 0) {
        return fetchResult[0];
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error updating gig plantype:", error);
    throw new Error("Failed to update gig plantype data");
  }
};




const deletegig = (is_deleted, id, callback) => {
  const updateQuery = "UPDATE gigs_create SET is_deleted = ? WHERE id = ?";
  try {
    db.query(updateQuery, [is_deleted, id], (updateError, updateResult) => {
      if (updateError) {
        console.error("Error Delete gig:", updateError);
        return callback({
          status: 500,
          error: "Failed to  Delete gig.",
        });
      }

      if (updateResult.affectedRows === 0) {
        console.error("gig not found in the update:", updateResult);
        return callback({ error: "gig not found" });
      }

      callback(null, { message: "gig  Delete  successfully" });
    });
  } catch (error) {
    console.error("Error to get data:", error);
    res.status(500).json({
      status: 500,
      error: "failed to delete gig data ",
      message: error.message,
    });
  }
};



function pausegigsadd (is_open, id, callback){
  const updateQuery = "UPDATE gigs_create SET is_open = ? WHERE id = ?";
  try {
    db.query(updateQuery, [is_open, id], (updateError, updateResult) => {
      if (updateError) {
        console.error("Error pause gig:", updateError);
        return callback({
          status: 500,
          error: "Failed to  pause gig.",
        });
      }

      if (updateResult.affectedRows === 0) {
        console.error("gig not found in the update:", updateResult);
        return callback({ error: "gig not found" });
      }

      callback(null, { message: " pause gig successfully" });
    });
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
};



function checkGigidinImageTable(gig_id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM gigs_imagedata WHERE id = ?";
    db.query(query, [gig_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0 ? results[0] : null);
      }
    });
  });
}



const updateImageContent = async (id, updatedUserData) => {
  try {
    const {
      image1,
      image2,
      image3,
      vedio,
     
    } = updatedUserData;

    const updateQuery = `
      UPDATE gigs_imagedata u
      SET 
          u.image1 = COALESCE(?, u.image1),
          u.image2 = COALESCE(?, u.image2),
          u.image3 = COALESCE(?, u.image3),
          u.vedio = COALESCE(?, u.vedio)
      WHERE u.id = ?;
    `;
const values =[image1,image2,image3,vedio,id]
    const updateResult = await new Promise((resolve, reject) => {
      db.query(
        updateQuery,values,  (updateError, updateResult) => {
          if (updateError) {
            reject(updateError);
          } else {
            resolve(updateResult);
          }
        }
      );
    });

    if (updateResult.affectedRows > 0) {
      const fetchQuery = `
        SELECT * FROM gigs_imagedata u
        WHERE u.id = ?;
      `;

      const fetchResult = await new Promise((resolve, reject) => {
        db.query(fetchQuery, [id], (fetchError, fetchResult) => {
          if (fetchError) {
            reject(fetchError);
          } else {
            resolve(fetchResult);
          }
        });
      });

      if (fetchResult.length > 0) {
        return fetchResult[0];
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error updating gig plantype:", error);
    throw new Error("Failed to update gig plantype data");
  }
};

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
  insertRating,
  getSubcategoryId,
  checkGigidout,
  CreateOffer,
  offertype,
  aprrovedOffer,
  getOfferById,
  odersales,
  totalgetorders,
  yearlyCheck,
  getsellerdata,
  activategig,
  activegigsdget,
  updatecreatedata,
  updateplantypedata,
  updateContents,
  deletegig,
  pausegigsadd,
  checkGigidinImageTable,
  updateImageContent
};
