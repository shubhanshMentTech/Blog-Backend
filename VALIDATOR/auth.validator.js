// VALIDATORS/authValidator.js
const Joi = require("joi");

const registerValidator = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
//   phoneNumber: Joi.string().length(10).required(),
});

const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  registerValidator,
  loginValidator,
};
