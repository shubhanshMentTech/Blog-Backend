const { required } = require("joi");
const mongoose = require("mongoose");

const blogUserSchema = new mongoose.Schema(
    {
        blog:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
            required: true
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    }
);

module.exports = mongoose.model("BlogUser", blogUserSchema);