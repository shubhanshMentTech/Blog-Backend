const express = require("express");
const router = express.Router();

//Imporing the authvalidation functions for login and register 
const {  regsiterValidation, loginValidation} = require("../MIDDLEWARE/authValidation")
//Importing functions from auth controller
const { login, register, userProfile} = require("../CONTROLLER/auth")
//Importing the JWT verifyer from auth middleware 
const verifyToken = require("../MIDDLEWARE/auth") 

//Register route with register validation 
router.post("/register", regsiterValidation, register);
//Login route with register validation
router.post("/login", loginValidation, login);
//Profile route with register validation
router.get("/profile/:id", verifyToken, userProfile);

module.exports = router;