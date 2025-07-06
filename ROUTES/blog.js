const express = require("express")
const { createBlog, getBlogs, get_a_blog, get_my_blogs, addParticipant } = require("../CONTROLLER/blog")
const verifyToken = require("../MIDDLEWARE/auth")

const router = express.Router()

router.post("/create", createBlog)
router.post("/getBlogs", getBlogs)
router.post("/getBlog", get_a_blog)
router.post("/getMyBlogs", get_my_blogs)
router.post("/addParticipant", addParticipant)

module.exports = router
