const adminservice = require("../service/adminSevice");
const bcrypt = require("bcrypt");

let saltRounds = 10;

const registerAdmin = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!password) {
      throw new Error("Password is required");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const adminId = await adminservice.adminregister({
      name,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "Admin registration successful",
      status: 201,
      data: adminId,
    });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({ status: 500, error: error.message });
  }
};

const loginAdmin = async (req, res) => {
  const { name, password } = req.body;
  try {
    adminservice.loginadmin(name, password, (err, result) => {
      if (err) {
        console.error("Error:", err);
        return res
          .status(500)
          .json({ error: "An internal server error occurred" });
      }

      if (result.error) {
        return res.status(401).json({ error: result.error });
      }

      res.status(201).json({
        message: "admin login success",
        status: 201,
        data: result.data,
        token: result.token,
      });
    });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res
      .status(500)
      .json({ error: "Failed to register admin", stack: error.stack });
  }
};

  

module.exports = {
  registerAdmin,
  loginAdmin
};
