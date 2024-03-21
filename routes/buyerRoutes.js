const  express = require('express')
const router = express.Router();
const buyercontroller = require('../controller/buyerController');
const {vaildatebuyer, validatesellerlogin} = require('../Validation/Validation');
const authentication = require('../Middleware/Authentication');
const { upload } = require('../Middleware/Multer');


router.post('/buyerRegister' ,upload.single('image'),vaildatebuyer, buyercontroller.buyercreate);

router.post('/buyerlogin',validatesellerlogin ,buyercontroller.loginbuYer);




module.exports = router;

