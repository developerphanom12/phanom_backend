const categoryService = require("../service/categoryService");

const categoryadd = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  console.log("User role:", role);
  console.log("User ID:", userId);

  try {
    if (role !== "admin") {
      return res
        .status(403)
        .json({ status: 403, error: "Forbidden for regular users" });
    }

    const { category_name } = req.body;

    const catName = await categoryService.checkduplicateCategoryname(
      category_name
    );
    if (catName) {
      return res
        .status(404)
        .json({ status: 404, message: "Category name already register" });
    }

    const category = await categoryService.addcategory(category_name);

    res.status(201).json({
      status: 201,
      message: category,
    });
  } catch (error) {
    console.error("Error in add category:", error);
    res.status(500).json({
      status: 500,
      error: "Failed to add category",
      stack: error.stack,
    });
  }
};

const subcategoryadd = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  console.log("User role:", role);
  console.log("User ID:", userId);

  try {
    if (role !== "admin") {
      return res
        .status(403)
        .json({ status: 403, error: "Forbidden for regular users" });
    }

    const { category_id, name } = req.body;

    const catId = await categoryService.checkcatid(category_id);
    if (!catId) {
      return res
        .status(404)
        .json({ status: 404, message: "Category not found" });
    }

    const data = await categoryService.addsubcategory(category_id, name);

    if (!data) {
      return res.status(404).json({ status: 404, error: "data not found" });
    }

    res.status(201).json({
      status: 201,
      message: data,
    });
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({
      status: 500,
      error: "Failed to add subcategory",
      stack: error.stack,
    });
  }
};

const ListCategory = async (req, res) => {
  try {
    const data = await categoryService.ListCategorywithsubcategory();

    if (!data || data.length === 0) {
      return res.status(404).json({ status: 404, error: "Data not found" });
    }
    res.status(201).json({
      status: 201,
      message: data,
    });
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({
      status: 500,
      error: "Failed to add subcategory",
      stack: error.stack,
    });
  }
};

module.exports = {
  categoryadd,
  subcategoryadd,
  ListCategory,
};
