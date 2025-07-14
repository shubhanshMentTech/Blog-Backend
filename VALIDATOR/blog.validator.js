// VALIDATORS/blogValidator.js
const Joi = require("joi");

const createBlogValidator = Joi.object({
  title: Joi.string().min(3).required(),
  content: Joi.string().required(),// MongoDB ObjectId
});

const addParticipantValidator = Joi.object({
  email: Joi.string().email().required(),
  blogId: Joi.string().length(24).required(), // MongoDB ObjectId
});

module.exports = {
  createBlogValidator,
  addParticipantValidator
};
