// MIDDLEWARE/verifyToken.js
const jwt = require("jsonwebtoken");
const User = require("../MODEL/user.model"); // adjust path as needed

const verifyToken = async (req, res, next) => {
  try {
    // 1. Get token from headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Optional: fetch user from DB
    const user = await User.findOne({email: decoded.email}).select("-password");
    // console.log("user from decode.email", decoded.email);
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // 4. Attach user to request
    req.user = user;
    next();

  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = verifyToken;
