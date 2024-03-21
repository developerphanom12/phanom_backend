const buyerService = require("../service/buyerservice");
const bcrypt = require("bcrypt");
let saltRounds = 10;

const buyercreate = async (req, res) => {
    try {
      
        
        const { username, password, email } = req.body;
    
        const image = req.file; 
    
        if (!image) {
            return res.status(400).json({ status: 400, message: "Image file is required" });
        }
    
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        const usernameCheck = await buyerService.checkusername(username);
        if (usernameCheck) {
            return res.status(404).json({ status: 400, message: "Username already registered" });
        }
    
        const dataCreate = await buyerService.buyerRegister(
            username,
            hashedPassword,
            email,
            image.filename 
        );
    
        res.status(201).json({
            status: 201,
            message: dataCreate,
        });
    } catch (error) {
        console.error("Error in add buyer:", error);
        res.status(500).json({
            status: 500,
            error: "Failed to create buyer",
            message: error.message,
            stack: error.stack,
        });
    }
};





const loginbuYer = async (req, res) => {
    const { username, password } = req.body;
    try {
      buyerService.loginbuyer(username, password, (err, result) => {
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
          message: "buyer login success",
          status: 200,
          data: result.data,
          token: result.token,
        });
      });
    } catch (error) {
      console.error("Error logging in buyer:", error);
      res.status(500).json({
        status: 500,
        error: "Failed to login buyer",
        message: error.message,
        stack: error.stack,
      });
    }
  };
  
module.exports = {
    buyercreate,
    loginbuYer
}