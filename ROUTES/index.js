

const express = require("express");
const router = express.Router();

const authRoutes = require("./v1/auth.routes");
const blogRoutes = require("./v1/blog.routes");

// Mount with versioning prefix
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/blog", blogRoutes);

module.exports = router;
