const Joi = require('joi'); 

const middleware = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]); 
    const valid = error == null; 
    if (valid) { next(); } 
    else { 
      const { details } = error; 
      const message = details.map(i => i.message).join(',')
      console.log("VALIDATION MIDDLEWARE : " , req.originalUrl, message); 
      res.status(422).json({ error: message }) 
    } 
  } 
}

module.exports = middleware;