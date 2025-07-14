const express = require("express");
const router = express.Router();

const blogRoutes = require("./blog.routes");

router.use("/blog", blogRoutes);

module.exports = router;
