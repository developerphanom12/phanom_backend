const  express = require('express')
const router = express.Router();
const sellercontroller = require('../controller/sellerController');
const { validateSeller, validatecreategigs, validatesellerlogin, validateaaraydata, validategigs, validatequestionSchema, validatecontentschema, validaterating, validateoffer, createOffer, updatevalidategigs, updatevalidatDleletegig} = require('../Validation/Validation');
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

router.post('/offercreate',createOffer,authentication, sellercontroller.createOffer)

router.post('/offerupdate',validateoffer,authentication, sellercontroller.userApproved)

router.get('/ordersales',authentication, sellercontroller.checkordersales)

router.get('/sellerProfile',authentication,sellercontroller.profiledata);

router.post('/activategig', authentication, sellercontroller.activegigs)

router.get('/gigsdatatat', authentication, sellercontroller.checktellereport)

router.put('/updategigsdata/:id', authentication, sellercontroller.updateGigController)

router.put('/updategigsplantypedata/:id',updatevalidategigs, authentication, sellercontroller.updateplantype)

router.put('/updateContent/:id', authentication, sellercontroller.updatecontent)


router.post('/deletegig',updatevalidatDleletegig, authentication, sellercontroller.deletegig)

module.exports = router;

