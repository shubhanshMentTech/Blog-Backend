const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    if(!token) token = req.body.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Authentification Failed"
    });
  }
};
