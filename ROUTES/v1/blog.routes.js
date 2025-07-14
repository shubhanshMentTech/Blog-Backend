const express = require("express")
const { createBlog, getBlogs, get_a_blog, get_my_blogs, addParticipant, getSingleBlog, getMyBlogs } = require("../../CONTROLLER/blog.controller")
const auth = require("../../MIDDLEWARE/auth.midddleware")
const checkRole = require("../../MIDDLEWARE/role.middleware")
const router = express.Router()

const validate = require("../../MIDDLEWARE/validateRequest.middleware");
const { createBlogValidator, addParticipantValidator } = require("../../VALIDATOR/blog.validator");
const formToJson = require("../../UTILS/fromToJson")


router.post("/create", formToJson, validate(createBlogValidator),auth, checkRole("admin", "editor"), createBlog)
router.post("/getBlogs", auth, getBlogs)
router.post("/getBlog", getSingleBlog)
router.post("/getMyBlogs", auth, getMyBlogs)
router.post("/addParticipant",formToJson, validate(addParticipantValidator), auth, addParticipant)

module.exports = router
