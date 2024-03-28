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

  const { gig_title, category_id, subcategory_id, service_type, tags } =
    req.body;
  try {
    const catId = await sellerService.checkcatid(category_id);
    if (!catId) {
      return res
        .status(404)
        .json({ status: 404, message: "Category not found" });
    }

    //     const subcategoryId = await sellerService.CheckSubCategory(category_id);
    //     if (!subcategoryId) {
    //       return res
    //         .status(404)
    //         .json({ status: 404, message: "Sub Category not found" });
    //     }
    // console.log("sub",subcategoryId)
    const userid = await sellerService.insertGigsData(
      gig_title,
      category_id,
      subcategory_id,
      service_type,
      tags,
      userId
    );

    if (userid && userid > 0) {
      const { programing_language, website_feature } = req.body;

      await sellerService.insertprograminglan(userid, programing_language);
      await sellerService.insertweblanguage(userid, website_feature);
    } else {
      throw new Error("Failed to insert gig data");
    }

    res.status(201).json({
      message: "Data added successfully",
      status: 201,
      data: {
        id: userid,
      },
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

  const image1Filename = image1 ? image1[0].filename : null;
  const image2Filename = image2 ? image2[0].filename : null;
  const image3Filename = image3 ? image3[0].filename : null;
  const vedioFilename = vedio ? vedio[0].filename : null;

  const data = {
    gig_id,
    image1: image1Filename,
    image2: image2Filename,
    image3: image3Filename,
    vedio: vedioFilename,
  };

  console.log("gogog", data);

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
    console.error("Error in add video images:", error);
    res.status(500).json({
      status: 500,
      error: "Failed to add video images",
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

  if (!gigId) {
    res.status(404).json({ message: "please provide Id", status: 404 });
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
  const cd = req.params.id;

  try {
    const data = await sellerService.getSubcategoryId(cd);
    console.log("dtatata", data);
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
      message: error.message,
      stack: error.stack,
    });
  }
};

const addingrating = async (req, res) => {
  const userId = req.user.id;

  if (req.user.role !== "buyer") {
    return res
      .status(403)
      .json({ status: 403, error: "Forbidden for regular users" });
  }

  const { gig_id, rating, comment } = req.body;
  try {
    const ratings = { gig_id, rating, comment };

    const categoryids = await sellerService.checkGigid(gig_id);
    if (!categoryids) {
      return res.status(404).json({ status: 404, message: "Gig id not found" });
    }

    const userid = await sellerService.insertRating(ratings, userId, comment);

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

const createOffer = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  if (req.user.role !== "seller" && req.user.role !== "buyer") {
    return res
      .status(403)
      .json({ status: 403, error: "Forbidden for regular users" });
  }

  const { gigs_id, offer_type, receive_id, offer_expire } = req.body;

  const expireDate = new Date(offer_expire);
  expireDate.setDate(
    expireDate.getDate() < new Date().getDate() + 7
      ? new Date().getDate() + 7
      : expireDate.getDate()
  );

  try {
    const gigId = await sellerService.checkGigidout(gigs_id);
    if (!gigId) {
      return res.status(404).json({ status: 404, message: "gig id not found" });
    }

    const userid = await sellerService.CreateOffer(
      gigs_id,
      offer_type,
      userId,
      receive_id,
      expireDate,
      userRole
    );

    if (offer_type === "singlepayment") {
      const { describe_offer, revision, delivery_day, price } = req.body;

      const userid11 = await sellerService.offertype(
        userid,
        describe_offer,
        revision,
        delivery_day,
        price
      );
      res.status(201).json({
        message: "Data added successfully",
        status: 201,
        data: userid11,
      });
    } else if (offer_type === "milestone") {
      const userid1 = await sellerService.CreateOffer(
        userid,
        describe_offer1,
        revision1,
        delivery_day1,
        price1
      );
      res.status(201).json({
        message: "Data added successfully",
        status: 201,
        data: userid1,
      });
    }
  } catch (error) {
    console.error("Error in add gigs:", error);
    res.status(500).json({
      status: 500,
      error: "Failed to create gigs data",
      message: error.message,
      stack: error.stack,
    });
  }
};

const userApproved = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const { id, status } = req.body;

    if (userRole !== "seller" && userRole !== "buyer") {
      throw {
        status: 403,
        error: "Forbidden. Only seller or seller can update order status.",
      };
    }

    const offer = await sellerService.getOfferById(id);
    if (!offer) {
      return res.status(404).json({ status: 404, message: "Offer not found" });
    }
    if (offer.creator_id !== userId || offer.role !== userRole) {
      return res
        .status(403)
        .json({
          status: 403,
          message: "userid and role not match with offer id",
        });
    }

    await sellerService.aprrovedOffer(status, id);

    res.status(200).json({
      status: 200,
      message: "Offer updated successfully",
    });
  } catch (error) {
    console.error("Error updating offer status:", error);
    res.status(error.status || 500).json({
      status: error.status || 500,
      error: "Failed to update offer status",
      message: error.message,
      stack: error.stack,
    });
  }
};

const checkordersales = async (req, res) => {
  const userSelection = req.query.selection;
  const userId = req.user.id;
  const userRole = req.user.role;
  const selectedMonth = req.query.month;

  try {
    if (userSelection === "last30days") {
      const last30DaysData = await sellerService.odersales(
        30,
        userId,
        userRole
      );
      const total30days = await sellerService.totalgetorders(
        30,
        userId,
        userRole
      );

      return res.status(200).json({
        status: 200,
        message: "Data fetched successfully",
        data: {
          last30DaysData,
          total30days,
        },
      });
    } else if (userSelection === "last90days") {
      const last90DaysData = await sellerService.odersales(
        90,
        userId,
        userRole
      );
      const total90days = await sellerService.totalgetorders(
        30,
        userId,
        userRole
      );

      return res.status(200).json({
        status: 200,
        message: "Data fetched successfully",
        data: {
          last90DaysData,
          total90days,
        },
      });
    } else if (selectedMonth === "currentMonth") {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentMonthData = await sellerService.yearlyCheck(
        currentMonth,
        userId,
        userRole
      );

      if (currentMonthData.length === 0) {
        return res.status(404).json({
          status: 404,
          error: `No sales data found for the current month`,
        });
      } else {
        return res.status(200).json({
          status: 200,
          message: "Data fetched successfully",
          data: {
            data: currentMonthData,
          },
        });
      }
    } else {
      return res.status(400).json({
        status: 400,
        error: "Invalid user selection",
      });
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      status: 500,
      error: "An unexpected error occurred. Please try again later.",
      errorMessage: error.message,
    });
  }
};

const profiledata = async (req, res) => {
  const cd = req.user.id;

  if (!cd) {
    res.status(404).json({ message: "please provide Id", status: 404 });
  }
  try {
    const data = await sellerService.getsellerdata(cd);

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

const activegigs = async (req, res) => {
  const { id, is_open } = req.body;

  try {
    if (req.user.role !== "seller") {
      throw {
        status: 403,
        error: "Forbidden. Only seller can activate gig.",
      };
    }

    if (is_open !== 1) {
      throw {
        status: 400,
        error: "Invalid is_open value. It must  1.",
      };
    }

    sellerService.activategig(is_open, id, (error, result) => {
      if (error) {
        console.error("Error updating activate gig:", error);
        throw {
          status: 500,
          error: "Failed to update  activate gig.",
        };
      }

      res.status(201).json({
        status: 201,
        message: result,
      });
    });
  }catch (error) {
    console.error("Error to get data:", error);
    res.status(500).json({
      status: 500,
      error: "failed to activate gig data ",
      message: error.message,
      stack: error.stack,
    });
  }
};

const checktellereport = async (req, res) => {
  const userSelection = req.query.selection;
  const userId = req.user.id;

  try {
    if (userSelection === "active") {
      const activeGigs = await sellerService.activegigsdget(userId, 1);
      return res.status(200).json({
        status: 200,
        message: "Active gigs fetched successfully",
        data: activeGigs,
      });
    } else if (userSelection === "inactive") {
      const inactiveGigs = await sellerService.activegigsdget(userId, 0);
      return res.status(200).json({
        status: 200,
        message: "Inactive gigs fetched successfully",
        data: inactiveGigs,
      });
    } else {
      return res.status(400).json({
        status: 400,
        error: "Invalid user selection",
      });
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      status: 500,
      error: "An unexpected error occurred. Please try again later.",
      errorMessage: error.message,
    });
  }
};


const updateGigData = async (id, updatedData) => {
  try {
    const updatedGig = await sellerService.updatecreatedata(id, updatedData);
    return updatedGig;
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      status: 500,
      errorMessage: error.message,
    });
  }
};
const updateGigController = async (req, res) => {
  const id = req.params.id;
  const userRole = req.user.role;
  const { gig_title, category_id, subcategory_id, service_type, tags } = req.body;

  try {
    if (userRole !== "seller") {
      return res.status(403).json({ status: 403, message: "Forbidden for regular user" });
    }
    const updatedGig = await updateGigData(id, { gig_title, category_id, subcategory_id, service_type, tags });
    if (!updatedGig) {
      return res.status(400).json({ status: 400, error: "Failed to update gig data" });
    }

    
    return res.status(200).json({
      status: 200,
      message: "Gig data updated successfully",
      data: updatedGig,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, error: "Internal server error" });
  }
};




const updatePlantype = async (id, updatedData) => {
  try {
    const updatedGig = await sellerService.updateplantypedata(id, updatedData);
    return updatedGig;
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      status: 500,
      errorMessage: error.message,
    });
  }
};



const updateplantype = async (req, res) => {
  const id = req.params.id;
  console.log("iudf",id)
  const userRole = req.user.role;
  const {    title,
    description,
    delivery_time,
    number_of_pages,
    revision,
    plugin_extension,
    price, } = req.body;

  try {
    if (userRole !== "seller") {
      return res.status(403).json({ status: 403, message: "Forbidden for regular user" });
    }
    const updatedGig = await updatePlantype(id, {    title,
      description,
      delivery_time,
      number_of_pages,
      revision,
      plugin_extension,
      price, });
    if (!updatedGig) {
      return res.status(400).json({ status: 400, error: "Failed to update gig data" });
    }

    
    return res.status(200).json({
      status: 200,
      message: "Gig data updated successfully",
      data: updatedGig,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, error: "Internal server error" });
  }
};







const updateContents = async (id, updatedData) => {
  try {
    const updatedGig = await sellerService.updateContents(id, updatedData);
    return updatedGig;
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      status: 500,
      errorMessage: error.message,
    });
  }
};

const updatecontent = async (req, res) => {
  const id = req.params.id;
  console.log("iudf",id)
  const userRole = req.user.role;
  const { content } = req.body;

  try {
    if (userRole !== "seller") {
      return res.status(403).json({ status: 403, message: "Forbidden for regular user" });
    }
    const updatedGig = await updateContents(id, {    
      content
     });
    if (!updatedGig) {
      return res.status(400).json({ status: 400, error: "Failed to update gig data" });
    }

    
    return res.status(200).json({
      status: 200,
      message: "Gig data updated successfully",
      data: updatedGig,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, error: "Internal server error" });
  }
};

const deletegig = async (req, res) => {
  const { id, is_deleted } = req.body;

  try {
    if (req.user.role !== "seller") {
      throw {
        status: 403,
        error: "Forbidden. Only seller can activate gig.",
      };
    }

    if (is_deleted !== 1) {
     
      return res.status(400).json({
        status: 400,
        error: "Invalid is_deleted value. It must  1.",
      });
    }

    sellerService.deletegig(is_deleted, id, (error, result) => {
      if (error) {
        console.error("Error updating activate gig:", error);
        throw {
          status: 500,
          error: "Failed to update  activate gig.",
        };
      }

      res.status(201).json({
        status: 201,
        message: result,
      });
    });
  }catch (error) {
    console.error("Error to get data:", error);
    res.status(500).json({
      status: 500,
      error: "failed to delete gig data ",
      message: error.message,
      stack: error.stack,
    });
  }
};



const pausegigs = async (req, res) => {
  const { id, is_open } = req.body;

  try {
    if (req.user.role !== "seller") {
      throw {
        status: 403,
        error: "Forbidden. Only seller can activate gig.",
      };
    }

    if (is_open !== 0) {
      throw {
        status: 400,
        error: "Invalid is_open value. It must  1.",
      };
    }

    sellerService.pausegigsadd(is_open, id, (error, result) => {
      if (error) {
        console.error("Error to pause  gig:", error);
        throw {
          status: 500,
          error: "Failed to pause  gig.",
        };
      }

      res.status(201).json({
        status: 201,
        data: result,
      });
    });
  }catch (error) {
    console.error("Error to get data:", error);
    res.status(500).json({
      status: 500,
      error: "failed to activate gig data ",
      message: error.message,
      stack: error.stack,
    });
  }
};




const updategigImages = async (req, res) => {
  const id = req.params.id;
console.log("idfdd",id)
  if (req.user.role !== "seller") {
    return res
      .status(403)
      .json({ status: 403, error: "Forbidden for regular users" });
  }

  const { image1, image2, image3, vedio } = req.files;

  const image1Filename = image1 ? image1[0].filename : null;
  const image2Filename = image2 ? image2[0].filename : null;
  const image3Filename = image3 ? image3[0].filename : null;
  const vedioFilename = vedio ? vedio[0].filename : null;

  const updatedUserData = {
    image1: image1Filename,
    image2: image2Filename,
    image3: image3Filename,
    vedio: vedioFilename,
  };


  try {
    const catId = await sellerService.checkGigidinImageTable(id);
    if (!catId) {
      return res
        .status(404)
        .json({ status: 404, message: "id not found" });
    }

    const userid = await sellerService.updateImageContent(id,updatedUserData);

    res.status(201).json({
      message: "Data added successfully",
      status: 201,
      data: userid,
    });
  } catch (error) {
    console.error("Error in add video images:", error);
    res.status(500).json({
      status: 500,
      error: "Failed to add video images",
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
  addingrating,
  createOffer,
  userApproved,
  checkordersales,
  profiledata,
  activegigs,
  checktellereport,
  updateGigController,
  updateplantype,
  updatecontent,
  deletegig,
  pausegigs,
  updategigImages
};
