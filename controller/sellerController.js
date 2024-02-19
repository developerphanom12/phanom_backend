const sellerService = require("../service/sellerService");
const bcrypt = require("bcrypt");
let saltRounds = 10;




const createseller = async (req, res) => {
  try {
    const { username, password, category_id, technology_name } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const usernamecheck = await sellerService.checkusername(username);
    if (usernamecheck) {
      return res
        .status(404)
        .json({ status: 404, message: "Username already registered" });
    }

    const catId = await sellerService.checkcatid(category_id);
    if (!catId) {
      return res
        .status(404)
        .json({ status: 404, message: "Category not found" });
    }

    const catId1 = await sellerService.existidinSellerTbale(category_id);
    if (catId1) {
      return res
        .status(404)
        .json({ status: 404, message: "Category already exists" });
    }

    const datacreate = await sellerService.sellergister(
      username,
      hashedPassword,
      category_id,
      technology_name
    );

    res.status(201).json({
      status: 201,
      message: datacreate,
    });
  } catch (error) {
    console.error("Error in add seller:", error);
    res.status(500).json({
      status: 500,
      error: "Failed to add seller",
      stack: error.stack,
    });
  }
};

module.exports = {
  createseller,
};
