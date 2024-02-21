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
      error: "Failed to create seller",
      message: error.message, 
      stack: error.stack,
    });
  }
};

const addgigadata = async (req, res) => {
  const userId = req.user.id;

  if (req.user.role !== "seller") {
    return res
      .status(403)
      .json({ status: 403, error: "Forbidden for regular users" });
  }

  const { gig_title, category_id, subcategory_id, service_type, tags } = req.body;
  try {
    const catId = await sellerService.checkcatid(category_id);
    if (!catId) {
      return res
        .status(404)
        .json({ status: 404, message: "Category not found" });
    }

    const subcategoryId = await sellerService.CheckSubCategory(category_id);
    if (!subcategoryId) {
      return res
        .status(404)
        .json({ status: 404, message: "Sub Category not found" });
    }

    const userid = await sellerService.insertGigsData(
      gig_title,
      category_id,
      subcategory_id,
      service_type,
      tags,
      userId
    );

    res.status(201).json({
      message: "Data added successfully",
      status: 201,
      data: userid,
    });
  } catch (error) {
    console.error("Error in add gigs:", error);
    res.status(500).json({
      status: 500,
      error: "Failed to create gigs data ",
      message: error.message,
      stack: error.stack,
    });
  }
};

const loginseller = async (req, res) => {
  const { username, password } = req.body;
  try {
    sellerService.loginseller(username, password, (err, result) => {
      if (err) {
        console.error("Error:", err);
        return res
          .status(500)
          .json({ error: "An internal server error occurred" });
      }

      if (result.error) {
        return res.status(401).json({ error: result.error });
      }

      res.status(200).json({
        message: "seller login success",
        status: 200,
        data: result.data,
        token: result.token,
      });
    });
  } catch (error) {
    console.error("Error logging in seller:", error);
    res.status(500).json({
      status: 500,
      error: "Failed to login seller",
      message: error.message,
      stack: error.stack,
    });
  }
};

const addingarraydata = async (req, res) => {
  const userId = req.user.id;

  if (req.user.role !== "seller") {
    return res
      .status(403)
      .json({ status: 403, error: "Forbidden for regular users" });
  }

  const { gig_id, programing_language, website_feature } = req.body;
  try {
    const gigId = await sellerService.checkGigid(gig_id);
    if (!gigId) {
      return res.status(404).json({ status: 404, message: "gig id not found" });
    }

    await sellerService.insertprograminglan(gig_id, programing_language);

    await sellerService.insertweblanguage(gig_id, website_feature);

    res.status(201).json({
      message: "Data added successfully",
      status: 201,
      data: userId,
    });
  } catch (error) {
    console.error("Error in add Programming language:", error);
    res.status(500).json({
      status: 500,
      error: "Failed to add multi data of programing language",
      message: error.message,
      stack: error.stack,
    });
  }
};

const addingGigsPrice = async (req, res) => {
  if (req.user.role !== "seller") {
    return res
      .status(403)
      .json({ status: 403, error: "Forbidden for regular users" });
  }

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
  } = req.body;

  const data = {
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
  };

  try {
    const gigId = await sellerService.checkGigid(gig_id);
    if (!gigId) {
      return res.status(404).json({ status: 404, message: "gig id not found" });
    }

    const userid = await sellerService.insertPriceData(data);

    res.status(201).json({
      message: "Data added successfully",
      status: 201,
      data: userid,
    });
  } catch (error) {
    console.error("Error in add Price:", error);
    res.status(500).json({
      status: 500,
      error: "Failed to add Price data ",
      message: error.message, 
      stack: error.stack,
    });
  }
};

const addgigsQuestion = async (req, res) => {
  const userId = req.user.id;

  if (req.user.role !== "seller") {
    return res
      .status(403)
      .json({ status: 403, error: "Forbidden for regular users" });
  }

  const { gig_id, questionsAnswers } = req.body;

  if (!gig_id || !questionsAnswers || !Array.isArray(questionsAnswers)) {
    return res.status(400).json({
      status: 400,
      error: "Invalid request body format",
    });
  }

  try {
    const gigId = await sellerService.checkGigid(gig_id);
    if (!gigId) {
      return res.status(404).json({ status: 404, message: "gig id not found" });
    }

    await sellerService.gigsQuestion(gig_id, questionsAnswers);

    res.status(201).json({
      message: "Data added successfully",
      status: 201,
      data: userId,
    });
  } catch (error) {
    console.error("Error in add Question:", error);
    res.status(500).json({
      status: 500,
      error: "Failed to add Question",
      message: error.message,
      stack: error.stack,
    });
  }
};

const addingContent = async (req, res) => {
  if (req.user.role !== "seller") {
    return res
      .status(403)
      .json({ status: 403, error: "Forbidden for regular users" });
  }

  const { gig_id, content } = req.body;

  const data = {
    gig_id,
    content,
  };
  try {
    const catId = await sellerService.checkGigid(gig_id);
    if (!catId) {
      return res
        .status(404)
        .json({ status: 404, message: "Category not found" });
    }

    const userid = await sellerService.addCOntentforgigs(data);

    res.status(201).json({
      message: "Data added successfully",
      status: 201,
      data: userid,
    });
  } catch (error) {
    console.error("Error in add COntent:", error);
    res.status(500).json({
      status: 500,
      error: "Failed to add Content",
      message: error.message, 
      stack: error.stack,
    });
  }
};

const addingmediaGigs = async (req, res) => {
  if (req.user.role !== "seller") {
    return res
      .status(403)
      .json({ status: 403, error: "Forbidden for regular users" });
  }

  const { gig_id } = req.body;
  const { image1, image2, image3, vedio } = req.files;

  if (
    !isValidImagePath(image1[0].path) ||
    !isValidImagePath(image2[0].path) ||
    !isValidImagePath(image3[0].path) ||
    !isValidvedioPath(vedio[0].path)
  ) {
    return res
      .status(400)
      .json({ status: 400, error: "Invalid image paths  " });
  }

  const image1Folder = image1[0].path.split("/")[1];
  const image2Folder = image2[0].path.split("/")[1];
  const image3Folder = image3[0].path.split("/")[1];
  const vedioFolder = vedio[0].path.split("/")[1];

  const data = {
    gig_id,
    image1: image1Folder,
    image2: image2Folder,
    image3: image3Folder,
    vedio: vedioFolder,
  };

  try {
    const catId = await sellerService.checkGigid(gig_id);
    if (!catId) {
      return res
        .status(404)
        .json({ status: 404, message: "Category not found" });
    }

    const userid = await sellerService.addmediadata(data);

    res.status(201).json({
      message: "Data added successfully",
      status: 201,
      data: userid,
    });
  } catch (error) {
    console.error("Error in add vedio images:", error);
    res.status(500).json({
      status: 500,
      error: "Failed to add vedio images",
      message: error.message, 
      stack: error.stack,
    });
  }
};

function isValidImagePath(path) {
  if (typeof path !== "string") {
    return false;
  }

  const trimmedPath = path.trim();

  if (trimmedPath === "") {
    return false;
  }

  const validExtensions = [".jpg", ".jpeg", ".png"];
  const lowercasePath = trimmedPath.toLowerCase();
  if (!validExtensions.some((ext) => lowercasePath.endsWith(ext))) {
    return false;
  }

  console.log("ddd", lowercasePath);
  return true;
}

function isValidvedioPath(path) {
  if (typeof path !== "string") {
    return false;
  }

  const trimmedPath = path.trim();

  if (trimmedPath === "") {
    return false;
  }

  const validExtensions = [".mp4", ".mov"];
  const lowercasePath = trimmedPath.toLowerCase();
  if (!validExtensions.some((ext) => lowercasePath.endsWith(ext))) {
    return false;
  }

  console.log("ddd", lowercasePath);
  return true;
}



const listdata = async (req, res) => {
  const gigId = req.params.id;

  if(!gigId){
    res.status(404).json({message:'please provide Id',status:404}) 
  }
  try {
    const data = await sellerService.listgigsdata(gigId);

    if (!data || data.length === 0) {
      return res.status(404).json({ status: 404, error: "Data not found" });
    }
    res.status(201).json({
      status: 201, 
      message: data,
    });
  } catch (error) {
    console.error("Error to get data:", error);
    res.status(500).json({
      status: 500,
      error: "failed to get data ",
      message: error.message, 
      stack: error.stack,
    });
  }
};




const subcateogydata = async (req, res) => {
  const subId = req.params.id;

  try {
    const data = await sellerService.getSubcategoryId(subId);
   console.log("dtatata",data)
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


const addingrating = async (req, res) => {
  const userId = req.user.id;

  if (req.user.role !== "seller") {
    return res
      .status(403)
      .json({ status: 403, error: "Forbidden for regular users" });
  }

  const { gig_id,rating } = req.body;
  try {

    const ratings = {gig_id,rating}

    const categoryids = await sellerService.checkGigid(gig_id);
    if (!categoryids) {
      return res
        .status(404)
        .json({ status: 404, message: "Gig id not found" });
    }

    
    const userid = await sellerService.insertRating( ratings ,userId);

    res.status(201).json({
      message: "Data added successfully",
      status: 201,
      data: userid,
    });
  } catch (error) {
    console.error("Error in add rating of gigs:", error);
    res.status(500).json({
      status: 500,
      error: "Failed to add rating",
      message: error.message,
      stack: error.stack,
    });
  }
};


module.exports = {
  createseller,
  addgigadata,
  loginseller,
  addingarraydata,
  addingGigsPrice,
  addgigsQuestion,
  addingContent,
  addingmediaGigs,
  listdata,
  subcateogydata,
  addingrating
};
