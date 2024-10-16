const { Router } = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const router = Router();

const uploadFolder = path.join(__dirname, "uploads");

// Create the folder if it doesn't exist
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

router.get("/", (req, res) => {
  res.render("dashboard");
});

router.get("/upload", (req, res) => {
  res.render("forms/upload-form");
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  // res.redirect("/dashboard");
  res.send("FILE UPLOADED");
});

router.post("/createFolder", (req, res) => {
  res.send("FOLDER CREATED");
});

module.exports = router;
