const Joi = require("joi");

const adminregister = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
});

const validatevalue = (req, res, next) => {
  const { error } = adminregister.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }   

  next();
};

const categoryadd = Joi.object({
  category_name: Joi.string().required(),
});

const validatecategory = (req, res, next) => {
  const { error } = categoryadd.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const Subcategoryadd = Joi.object({
  category_id: Joi.number().required(),
  name: Joi.string().required(),
});

const validateSubcategory = (req, res, next) => {
  const { error } = Subcategoryadd.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const sellergister = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  category_id: Joi.number().required(),
  technology_name: Joi.string().required(),
});

const validateSeller = (req, res, next) => {
  const { error } = sellergister.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const gigscreate = Joi.object({
  gig_title:Joi.string().required(),
  category_id: Joi.number().required(),
  subcategory_id: Joi.number().required(),
  service_type: Joi.string().required(),
  tags: Joi.string().required(),
  programing_language: Joi.array().items(Joi.string()).required(),
  website_feature: Joi.array().items(Joi.string()).required(),
});

const validatecreategigs = (req, res, next) => {
  const { error } = gigscreate.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const sellerlogin = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const validatesellerlogin = (req, res, next) => {
  const { error } = sellerlogin.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const gigsarraydata = Joi.object({
  gig_id: Joi.number().required(),
  programing_language: Joi.array().items(Joi.string()).required(),
  website_feature: Joi.array().items(Joi.string()).required(),
});

const validateaaraydata = (req, res, next) => {
  const { error } = gigsarraydata.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const gigsPlantypeSchema = Joi.object({
  gig_id: Joi.number().integer().required(),
  title: Joi.string().max(255).required(),
  description: Joi.string().max(255).required(),
  delivery_time: Joi.number().integer().required(),
  number_of_pages: Joi.number().integer().min(1).max(10).required(),
  revision: Joi.number().integer().min(1).max(10).required(),
  plugin_extension: Joi.number().integer().min(1).max(10).required(),
  price: Joi.number().precision(2).required(),
  plan_type: Joi.string().valid("standard", "basic", "premium").required(),
  content_upload: Joi.boolean().default(true),
});

const validategigs = (req, res, next) => {
  const { error } = gigsPlantypeSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const questionAnswerSchema = Joi.object({
  question: Joi.string().required(),
  answer: Joi.string().required(),
});

const schema = Joi.object({
  gig_id: Joi.string().required(),
  questionsAnswers: Joi.array().items(questionAnswerSchema).min(1).required(),
});

const validatequestionSchema = (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const gigcontentschema = Joi.object({
  gig_id: Joi.number().required(),
  content: Joi.string().required(),
});

const validatecontentschema = (req, res, next) => {
  const { error } = gigcontentschema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const gigsrating = Joi.object({
  gig_id: Joi.number().required(),
  rating: Joi.number().min(1).max(5).precision(1).required(),
  comment :Joi.string().required()
});

const validaterating = (req, res, next) => {
  const { error } = gigsrating.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};



const offerupdate = Joi.object({
  id : Joi.number().required(),
  status: Joi.string().valid("pending", "approved", "cancel").required(),
});

const validateoffer = (req, res, next) => {
  const { error } = offerupdate.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};


const singlePaymentSchema = Joi.object({
  describe_offer: Joi.string().required(),
  revision: Joi.number().integer().min(0).required(),
  delivery_day: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).required(),
});

const milestoneSchema = Joi.object({
  describe_offer1: Joi.string().required(),
  revision1: Joi.number().integer().min(0).required(),
  delivery_day1: Joi.number().integer().min(1).required(),
  price1: Joi.number().min(0).required(),
});

const createOfferSchema = Joi.object({
  gigs_id: Joi.string().required(),
  offer_type: Joi.string().valid('singlepayment', 'milestone').required(),
  receive_id: Joi.string().required(),
  offer_expire: Joi.date().required(),
  describe_offer: Joi.when('offer_type', {
    is: 'singlepayment',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  revision: Joi.when('offer_type', {
    is: 'singlepayment',
    then: Joi.number().required(),
    otherwise: Joi.forbidden()
  }),
  delivery_day: Joi.when('offer_type', {
    is: 'singlepayment',
    then: Joi.number().required(),
    otherwise: Joi.forbidden()
  }),
  price: Joi.when('offer_type', {
    is: 'singlepayment',
    then: Joi.number().min(0).required(),
    otherwise: Joi.forbidden()
  }),
}).options({ abortEarly: false });

const createOffer = async (req, res) => {
  const { error } = createOfferSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ status: 400, error: error.details.map(detail => detail.message) });
  }

  if (req.body.offer_type === 'singlepayment') {
    const { error: singlePaymentError } = singlePaymentSchema.validate(req.body);
    if (singlePaymentError) {
      return res.status(400).json({ status: 400, error: singlePaymentError.details.map(detail => detail.message) });
    }
  } else if (req.body.offer_type === 'milestone') {
    const { error: milestoneError } = milestoneSchema.validate(req.body);
    if (milestoneError) {
      return res.status(400).json({ status: 400, error: milestoneError.details.map(detail => detail.message) });
    }
  }
}



const buyergister = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().required().email(),
});

const vaildatebuyer = (req, res, next) => {
  const { error } = buyergister.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};



const updategigsPlantypeSchema = Joi.object({
  title: Joi.string().max(255).optional(),
  description: Joi.string().max(255).optional(),
  delivery_time: Joi.number().integer().optional(),
  number_of_pages: Joi.number().integer().min(1).max(10).optional(),
  revision: Joi.number().integer().min(1).max(10).optional(),
  plugin_extension: Joi.number().integer().min(1).max(10).optional(),
  price: Joi.number().precision(2).optional(),
  content_upload: Joi.boolean().default(true),
});

const updatevalidategigs = (req, res, next) => {
  const { error } = updategigsPlantypeSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

module.exports = {
  validatevalue,
  validatecategory,
  validateSubcategory,
  validateSeller,
  validatecreategigs,
  validatesellerlogin,
  validateaaraydata,
  validategigs,
  validatequestionSchema,
  validatecontentschema,
  validaterating,
  validateoffer,
  createOffer,
  vaildatebuyer,
  updatevalidategigs
};
