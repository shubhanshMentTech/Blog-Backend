const multer = require("multer");

// Use memory storage (no file handling)
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Middleware to parse only form fields (not files) from multipart/form-data,
 * and convert any JSON-stringified values back into actual JS objects.
 */
const parseFormData = upload.none(); // Accept only fields, no files

const formToJson = (req, res, next) => {
  parseFormData(req, res, (err) => {
    if (err) return next(err);

    // Convert stringified JSON fields into real objects
    for (const key in req.body) {
      const value = req.body[key];
      try {
        // Try parsing if it's a JSON string (e.g., arrays or objects)
        req.body[key] = JSON.parse(value);
      } catch {
        // Leave as-is if not JSON
        req.body[key] = value;
      }
    }

    next();
  });
};

module.exports = formToJson;
