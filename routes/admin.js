const express = require("express");

const multer = require("multer");

const path = require("path");

const router = express.Router();

const adminController = require("../controllers/admin");

const auth = require("../middleware/auth");

var Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
var upload = multer({
  storage: Storage,
}).single("file");

router.get(
  "/admin/addProducts",
  auth.authenticate,
  adminController.getAddProducts
);

router.post(
  "/admin/addProducts",
  auth.authenticate,
  upload,
  adminController.postAddProducts
);

module.exports = router;
