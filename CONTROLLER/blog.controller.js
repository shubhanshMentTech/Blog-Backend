const Blog = require("../MODEL/blog.model")
const User = require("../MODEL/user.model")

exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body
    const user = req.user;

    if (!title || !content ) {
      return res.status(400).json({ message: "Missing required fields" })
    }

     // Fetch user by email
    // const user = await User.findOne({ email })
    // if (!user) {
    //   return res.status(404).json({ message: "User not found" })
    // }

    const newBlog = await Blog.create({
      title,
      content,
      owners: [user._id],
    })

    // Push blog to user's blogs array
    await User.findByIdAndUpdate(user._id, {
      $push: { blogs: newBlog._id },
    })

    res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog,
    })
  } catch (error) {
    console.error("Blog creation error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}


exports.getBlogs = async (req, res) => {
    try {
      const from = typeof req.body === "object" && req.body !== null ? req.body.from : undefined;

      if (typeof from !== "number" || from < 0) {
        return res.status(400).json({ message: "Invalid or missing 'from' value" });
      }

      const blogs = await Blog.find({})
        .sort({ createdAt: -1 })
        .skip(from)
        .limit(5)
        .lean();

      res.status(200).json(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
}


exports.getSingleBlog = async(req,res) => {

  
  try {
    const { id } = req.body

    if (!id) {
      return res.status(400).json({ message: "Missing required blog id" })
    }
        const blogs = await Blog.findById(id);
        res.status(200).json(blogs);
    } catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.getMyBlogs = async (req, res) => {
    try {

      const { id } = req.body
      
      if (!id) {
        return res.status(400).json({ message: "Missing required user id" })
      }
        // Find the user and populate their blogs array, sorted by createdAt descending
        const user = await User.findById(id).populate({
          path: 'blogs',
          select: '_id title content createdAt updatedAt likes comments mainImage',
          options: { sort: { createdAt: -1 } }
        });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.blogs);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


exports.addParticipant = async (req, res) => {
    try {

      const { email, blogId} = req.body
      
      if (!blogId) {
        return res.status(400).json({ message: "Missing required user email" })
      }
        // Find the user and populate their blogs array, sorted by createdAt descending
        const user = await User.findOneAndUpdate(
          { email },
          { $push: { blogs: blogId } },
          { new: true }
        );

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.blogs);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

