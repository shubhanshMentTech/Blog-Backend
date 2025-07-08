const { required } = require("joi");
const mongoose = require("mongoose");

const blogUserSchema = new mongoose.Schema(
    {
        blog:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog"
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    }
);

module.exports = mongoose.model("BlogUser", blogUserSchema);