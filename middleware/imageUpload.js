const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  
  destination: function (req, file, cb) {
    const rootDir = path.dirname(require.main.filename);
    cb(null, path.join(rootDir, "public/images"));
  },
  filename: function (req, file, cb) {
    const randomId = uuidv4();
    const extension = file.mimetype.split("/")[1];
    req.savedImage = "user_" + randomId + "." + extension;
    cb(null, req.savedImage);
  },
});
const fileFilter = (req, file, cb) => {
  let allowedMimeTypes = ["image/jpg", "image/gif", "image/jpeg", "image/png"];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new CustomError("Please provide a valid image file", 400), false);
  }
  return cb(null, true);
};
const profileImageUpload = multer({ storage, fileFilter });

module.exports = profileImageUpload;
