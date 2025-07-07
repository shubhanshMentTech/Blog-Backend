const express = require("express");
const router = express.Router();

//Imporing the authvalidation functions for login and register 
const {  regsiterValidation, loginValidation} = require("../../MIDDLEWARE/authValidation.middleware")
//Importing functions from auth controller
const { login, register, userProfile} = require("../../CONTROLLER/auth.controller")
//Importing the JWT verifyer from auth middleware 
const verifyToken = require("../../MIDDLEWARE/auth.midddleware"); 
const validate = require("../../MIDDLEWARE/validateRequest.middleware");
const { registerValidator, loginValidator } = require("../../VALIDATOR/auth.validator");

//Register route with register validation 
router.post("/register", validate(registerValidator) , regsiterValidation, register);
//Login route with register validation
router.post("/login", validate(loginValidator), loginValidation, login);
//Profile route with register validation
router.get("/profile/:id", verifyToken, userProfile);

module.exports = router;