const blogModel = require("../MODEL/blog.model");
const Blog = require("../MODEL/blog.model");
const BlogUser = require("../MODEL/blogUser.model");
const User = require("../MODEL/user.model")

exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body
    const user = req.user;

    if (!title || !content ) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const newBlog = await Blog.create({
      title,
      content,
    })

    // Push blog and user to Blog_User schema
    const newBlogUser = await BlogUser.create({
      newBlog,
      user
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
    const userId = req.user._id;

    // 1. Fetch blogs from BlogUser model
    const blogUserEntries = await BlogUser.find({ users: userId }).populate("blogs");

    const blogsFromBlogUser = blogUserEntries.flatMap(entry => entry.blog);

    // 2. Fetch user's blogs from old User model
    const user = await User.findById(userId).populate("blogs");
    const blogsFromUser = user.blogs || [];

    // 3. Merge both lists and remove duplicates
    const mergedBlogs = [
      ...blogsFromBlogUser.filter(blog => !blogsFromUser.some(b => b._id.equals(blog._id))),
      ...blogsFromUser
    ];

    // 4. Convert to array and sort by createdAt descending
    const sortedBlogs = Array.from(mergedBlogs.values()).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({ blogs: sortedBlogs });

  } catch (error) {
    console.error("Error fetching my blogs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getMyBlogsFromBlogUser = async (req, res) => {
  try {
    const user = req.user;

    const blogUserRecords = await BlogUser.find({ users: user._id })
      .populate({
        path: "blogs",
      });

    // Step 2: Extract all blogs from those records
    const blogs = blogUserRecords.flatMap(record => record.blogs);

    return res.status(200).json(blogs);

  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addParticipant = async (req, res) => {
  try {
    const { email, blogId } = req.body;

    if (!email || !blogId) {
      return res.status(400).json({ message: "Email and Blog ID are required." });
    }

    const requestingUser = req.user;

    if (!requestingUser) {
      return res.status(401).json({ message: "Unauthorized request." });
    }

    // Find participant user
    const participant = await User.findOne({ email });
    if (!participant) {
      return res.status(404).json({ message: "Participant user not found." });
    }

    // Find blog
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    // Prevent duplicate entry (optional)
    const existingEntry = await BlogUser.findOne({
      user: participant._id,
      blog: blog._id,
    });

    if (existingEntry) {
      return res.status(400).json({ message: "Participant already added to this blog." });
    }

    // Create or update BlogUser relationship
    const blogUser = await BlogUser.create({
      user: [participant._id],
      blog: [blog._id],
    });

    return res.status(200).json({ message: "Participant added successfully.", blogUser });

  } catch (error) {
    console.error("Error adding participant:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


