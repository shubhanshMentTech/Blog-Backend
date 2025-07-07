const express = require("express")
const { createBlog, getBlogs, get_a_blog, get_my_blogs, addParticipant, getSingleBlog, getMyBlogs } = require("../../CONTROLLER/blog.controller")
const verifyToken = require("../../MIDDLEWARE/auth.midddleware")

const router = express.Router()

const validate = require("../../MIDDLEWARE/validateRequest.middleware");
const { createBlogValidator, addParticipantValidator } = require("../../VALIDATOR/blog.validator");


router.post("/create", validate(createBlogValidator),verifyToken, createBlog)
router.post("/getBlogs", verifyToken, getBlogs)
router.post("/getBlog", getSingleBlog)
router.post("/getMyBlogs", verifyToken, getMyBlogs)
router.post("/addParticipant", validate(addParticipantValidator), verifyToken, addParticipant)

module.exports = router
