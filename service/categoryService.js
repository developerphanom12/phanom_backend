const db = require("../Database/connection");

function addcategory(category_name) {
  return new Promise((resolve, reject) => {
    const insertSql = `
        INSERT INTO category(category_name) 
        VALUES (?)`;

    const values = [category_name];

    db.query(insertSql, values, (error, result) => {
      if (error) {
        console.error("Error inserting data:", error);
        reject(error);
      } else {
        const adminId = result.insertId;

        if (adminId > 0) {
          const successMessage = "add category name  successful";
          resolve(successMessage);
        } else {
          const errorMessage = "add category  failed";
          reject(errorMessage);
        }
      }
    });
  });
}

function addsubcategory(category_id, name) {
  return new Promise((resolve, reject) => {
    const insertSql = `
        INSERT INTO sub_category(category_id,name) 
        VALUES (?,?)`;

    const values = [category_id, name];

    db.query(insertSql, values, (error, result) => {
      if (error) {
        console.error("Error inserting data:", error);
        reject(error);
      } else {
        const subId = result.insertId;

        if (subId > 0) {
          const successMessage = "add subcategorysuccessful";
          resolve(successMessage);
        } else {
          const errorMessage = "add subcategory  failed";
          reject(errorMessage);
        }
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


function checkduplicateCategoryname(category_name) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM category WHERE category_name = ?";
      db.query(query, [category_name], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.length > 0 ? true : false);
        }
      });
    });
  }


  function ListCategorywithsubcategory() {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                c.id as category_id,
                c.category_name,
                c.create_date as category_create_date,
                c.update_date as category_update_date,
                u.id as subcategory_id,
                u.name as subcategory_name,
                u.create_date as subcategory_create_date,
                u.update_date as subcategory_update_date
            FROM 
                category c
            INNER JOIN  
                sub_category u ON c.id = u.category_id;
        `;

        db.query(query, (error, results) => {
            if (error) {
                console.error("Error executing query:", error);
                reject(error);
            } else {
                const categoryMap = new Map();

                results.forEach((result) => {
                    const categoryId = result.category_id;

                    if (!categoryMap.has(categoryId)) {
                        categoryMap.set(categoryId, {
                            category_id: categoryId,
                            category_name: result.category_name,
                            create_date: result.category_create_date,
                            update_date: result.category_update_date,
                            subcategories: [],
                        });
                    }

                    categoryMap.get(categoryId).subcategories.push({
                        subcategory_id: result.subcategory_id,
                        subcategory_name: result.subcategory_name,
                        create_date: result.subcategory_create_date,
                        update_date: result.subcategory_update_date,
                    });
                });

                const categoriesWithSubcategories = Array.from(categoryMap.values());

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

  function checkduplicateCategoryname(category_name) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM category WHERE category_name = ?";
      db.query(query, [category_name], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.length > 0 ? true : false);
        }
      });
    });
  }
  
module.exports = {
  addcategory,
  addsubcategory,
  checkcatid,
  checkduplicateCategoryname,
  ListCategorywithsubcategory
};
