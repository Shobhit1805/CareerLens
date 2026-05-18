const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middlewares/auth");
const { analyzeResume, downloadResume } = require("../controllers/aiController");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/analyze", auth, upload.single("resume"), analyzeResume);
router.post("/download-resume", auth, downloadResume);

module.exports = router;