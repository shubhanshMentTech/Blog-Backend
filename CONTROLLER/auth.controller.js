const express = require('express')
//Importing the JWT package
const jwt = require('jsonwebtoken')
//Importing the bcrypt package
const bcrypt = require('bcryptjs')
//Imprtong the user model 
const userModel = require('../MODEL/user.model')
//Importing the express-async-handler package
const asyncHandler = require("express-async-handler");
//Importing the uuidv4 package to generate userId
const {v4 : uuidv4} = require('uuid')




//register controller:

const register = asyncHandler(async (req, res) => {

    //Destructuing the inputs from req.body 
    const { fullName, email, password, phoneNumber, role } = req.body;

    //Verifying the email address inputed is not used already 
    const verifyEmail = await userModel.findOne({ email: email })
    try {
        if (verifyEmail) {
            return res.status(403).json({
                message: "Email already used"
            })
        } else {
            //generating userId
            const userId = uuidv4()
            //using bcrypt to hash the password sent from the user
            bcrypt.hash(req.body.password, 10).then((hash) => {
                //Registering the user
                const user = new userModel({
                    userId: userId,
                    fullName: fullName,
                    email: email,
                    password: hash,
                    phoneNumber: phoneNumber
                });

                let jwtToken = jwt.sign(
                    {
                        email:email,
                        userId: user._id,
                        role: role,
                    },
                    //Signign the token with the JWT_SECRET in the .env
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1d"
                    }
                )

                //saving the data to the mongodb user collection
                user.save().then((response) => {
                    return res.status(201).json({
                        message: 'user successfully created!',
                        result: response,
                        accessToken: jwtToken,
                        userId: user._id,
                        success: true
                    })
                })
                .catch((error) => {
                    res.status(500).json({
                        error: error,
                    })
                })
            })
        }
    } catch (error) {
        return res.status(412).send({
            success: false,
            message: error.message
        })
    }

})



// login controller:

const login = asyncHandler(async (req, res) => {
    
    const { email, password } = req.body

    let getUser

    //verifying that the user with the email exist or not
    userModel.findOne({
        email: email
    }).then((user) => {
        if (!user) {
            //if user does not exist responding Authentication Failed
            return res.status(401).json({
                message: "Authentication Failed: no user found for the email",
            })

        }
        //assigned the user to getUser variable
        getUser = user
        
        return bcrypt.compare(password, user.password)
    })
        .then((response) => {
            if (!response) {
                return res.status(401).json({
                    message: "Authentication Failed: password incorrect"
                })
            } else {
                let jwtToken = jwt.sign(
                    {
                        email: getUser.email,
                        userId: getUser.userId,
                        role: getUser.role
                    },
                    //Signign the token with the JWT_SECRET in the .env
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1d"
                    }
                )
                return res.status(200).json({
                    accessToken: jwtToken,

                    //logged in in order to fetch his data and display
                    userId: getUser._id,
                })

            }

        })
        .catch((err) => {
            return res.status(401).json({
                messgae: err.message,
                success: false
            })
        })
})



// Profile:

const userProfile = asyncHandler(async (req, res, next) => {

    //Destructing id from the req.params
    const { id } = req.params;

    try {
        //verifying if the user exist in the database
        const verifyUser = await userModel.findOne({ userId: id })
        if (!verifyUser) {
            return res.status(403).json({
                message: "user not found",
                success: false,
            })
        } else {
            return res.status(200).json({
                messgae: `user ${verifyUser.fullName}`,
                success: true
            })
        }
    }
    catch (error) {
        return res.status(401).json({
            sucess: false,
            message: error.message,
            req: req.params
        })
    }
});





module.exports = {
    register,
    login,
    userProfile,
    // users
}
