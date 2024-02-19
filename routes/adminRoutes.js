const  express = require('express')
const router = express.Router();
const admincontroller = require('../controller/adminController');
const { validatevalue} = require('../Validation/Validation');

router.post('/adminreg',validatevalue , admincontroller.registerAdmin);


router.post('/adminlog',validatevalue , admincontroller.loginAdmin);



module.exports = router;

