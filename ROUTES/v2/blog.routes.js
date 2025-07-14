const express = require("express")
const { createBlog,  getMyBlogs, getMyBlogsFromBlogUser, addParticipant } = require("../../CONTROLLER/blog.controller")
const auth = require("../../MIDDLEWARE/auth.midddleware")

const router = express.Router()

const validate = require("../../MIDDLEWARE/validateRequest.middleware");
const { createBlogValidator, addParticipantValidator } = require("../../VALIDATOR/blog.validator");


router.post("/create", validate(createBlogValidator),auth, createBlog)
// router.post("/getBlogs", auth, getBlogs)
// router.post("/getBlog", getSingleBlog)
router.post("/getMyBlogs", auth, getMyBlogs)
router.post("/addParticipant", validate(addParticipantValidator), auth, addParticipant)

module.exports = router
