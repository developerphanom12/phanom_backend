const  express = require('express')
const router = express.Router();
const sellercontroller = require('../controller/sellerController');
const { validateSeller, validatecreategigs, validatesellerlogin, validateaaraydata, validategigs, validatequestionSchema, validatecontentschema, validaterating} = require('../Validation/Validation');
const authentication = require('../Middleware/Authentication');
const { upload } = require('../Middleware/Multer');



router.post('/sellerRegister',validateSeller , sellercontroller.createseller);

router.post('/loginseller',validatesellerlogin ,sellercontroller.loginseller);

router.post('/giggscreate',validatecreategigs ,authentication, sellercontroller.addgigadata);

router.post('/giggsarraydata',validateaaraydata ,authentication, sellercontroller.addingarraydata);

router.post('/gigspriceadd',validategigs ,authentication, sellercontroller.addingGigsPrice);

router.post('/gigsquestion',validatequestionSchema ,authentication, sellercontroller.addgigsQuestion);

router.post('/gigstexteditor',validatecontentschema, authentication, sellercontroller.addingContent);

router.post('/imageUpload', authentication,upload.fields([{ name: 'image1' }, { name: 'image2' },{ name: 'image3' }, { name: 'vedio' }]), sellercontroller.addingmediaGigs);


router.get('/gigslist/:id',sellercontroller.listdata);


router.post('/gigsrating',validaterating ,authentication, sellercontroller.addingrating);


router.get('/subcategoryData/:id',sellercontroller.subcateogydata);

router.post('/offercreate',authentication, sellercontroller.createOffer)


module.exports = router;

