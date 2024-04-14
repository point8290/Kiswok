const express = require("express");
const controller = require("../controller/upload.controller");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let ext = file.originalname.split(".")[1];
    cb(null, `${uniqueSuffix}.${ext}`);
  },
});

const upload = multer({ storage });

const fileUpload = upload.fields([
  { name: "excelFile", maxCount: 1 },
  { name: "pdfFile", maxCount: 1 },
]);

router.post("/:id", fileUpload, controller.upload);

module.exports = router;
