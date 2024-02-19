const  express = require('express')
const router = express.Router();
const admincontroller = require('../controller/categoryController');
const { validatecategory, validateSubcategory } = require('../Validation/Validation');
const authenticateToken = require('../Middleware/Authentication')


router.post('/categoryAdd',validatecategory , authenticateToken ,admincontroller.categoryadd);

router.post('/subcategoryadd',validateSubcategory , authenticateToken ,admincontroller.subcategoryadd);

router.get('/liscategory',admincontroller.ListCategory);



module.exports = router;

