const  express = require('express')
const router = express.Router();
const sellercontroller = require('../controller/sellerController');
const { validateSeller} = require('../Validation/Validation');

router.post('/sellerRegister',validateSeller , sellercontroller.createseller);





module.exports = router;

