const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    mainImage: {
      type: String, // The first image src from content
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    likes: {
      type: Number,
      default: 0,
    },

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    owners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Pre-save hook to extract first image src from content
blogSchema.pre("save", function (next) {
  if (this.content) {
    // Regex to find first <img src="...">
    const match = this.content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match && match[1]) {
      this.mainImage = match[1];
    } else {
      this.mainImage = undefined;
    }
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
