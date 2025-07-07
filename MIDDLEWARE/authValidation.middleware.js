const Validator = require("validatorjs");

const regsiterValidation = (req, res, next) => {

    // console.log("got req for validator, req.body: ", req)
    const validateRule = {
        "fullName": "required|string|min:3",
        "email": "required|email",
        "password": "required|min:4",
        "phoneNumber": "required|digits:10"
    };

    const validation = new Validator(req.body, validateRule);

    if (validation.fails()) {
        return res.status(412).send({
            success: false,
            message: "Validation failed",
            data: validation.errors.all()
        });
    }

    next();
};

const loginValidation = (req, res, next) => {
    const validateRule = {
        "email": "required|email",
        "password": "required|min:4"
    };

    const validation = new Validator(req.body, validateRule);

    if (validation.fails()) {
        return res.status(412).send({
            success: false,
            message: "Validation failed",
            data: validation.errors.all()
        });
    }

    next();
};

module.exports = {
    regsiterValidation,
    loginValidation
};
