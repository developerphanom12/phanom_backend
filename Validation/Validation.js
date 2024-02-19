const  Joi = require('joi');
 
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
    name:Joi.string().required()
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

  module.exports ={
    validatevalue,
    validatecategory,
    validateSubcategory,
    validateSeller
  }