const { Router } = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const db = require("../db/queries");

const router = Router();

const uploadFolder = path.join(__dirname, "uploads");

// Create the folder if it doesn't exist
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

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

router.get("/", async (req, res) => {
  // redirect to root folder
  const rootFolderId = await db.getRootFolder(req.user.id);
  res.redirect(`/dashboard/${rootFolderId}`);
});

router.get("/:folderId", (req, res) => {
  // display all folders/files
  const folderId = req.params.folderId;
  res.render("dashboard", { folderId: folderId });
});

router.post("/:folderId/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  // res.redirect("/dashboard");
  res.send("FILE UPLOADED");
});

router.post("/:folderId/createFolder", (req, res) => {
  const folderName = req.body.folder;
  const userId = req.user.id;
  const parentId = req.params.folderId;

  const newFolder = db.createFolder(folderName, userId, parentId);
  console.log(newFolder);
});

module.exports = router;
