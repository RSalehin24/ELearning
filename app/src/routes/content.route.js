const express = require("express");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const {
  insertFileName,
  readFile,
  deleteFile,
  getAllFiles,
  getSingleFile,
  getContent,
  getContentsByCourseID,
} = require("../controller/content.controller");
const {
  requireSignIn,
  validateInstructorRole,
  validateOwner,
} = require("../controller/auth.controller");

const router = express.Router();

router.use(methodOverride("_method"));
router.use(bodyParser.json());

const storage = new GridFsStorage({
  url: "mongodb://localhost/e-learning",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename =
          req.query.userID + req.query.courseID + file.originalname;
        const fileInfo = {
          filename: filename,
          aliases: file.originalname,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

router.get("/files", getAllFiles);
router.get("/:courseID/files", getContent);
router.post(
  "/content/upload",
  requireSignIn,
  validateInstructorRole,
  validateOwner,
  upload.single("file"),
  insertFileName
);
router.get("/files/:filename", getSingleFile);
router.get("/content/getAllContent", getContentsByCourseID);
router.get("/content/read",  readFile);
router.delete("/files/:filename", requireSignIn, deleteFile);

module.exports = router;
