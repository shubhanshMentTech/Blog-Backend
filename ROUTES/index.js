const express = require("express");
const router = express.Router();

const v1Routes = require("./v1");
const v2Routes = require("./v2");

// Mount with version prefixes
router.use("/api/v1", v1Routes);
router.use("/api/v2", v2Routes);

module.exports = router;
