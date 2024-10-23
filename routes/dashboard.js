const { Router } = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const db = require("../db/queries");
const cloudinary = require("../utils/cloudinary.config");

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

router.get("/:folderId", async (req, res) => {
  // display all folders/files
  const folderId = req.params.folderId;
  const userId = req.user.id;
  const folderData = await db.getAllFolders(userId, folderId);
  const { subFolders, files } = folderData;
  res.render("dashboard", {
    folderId: folderId,
    subfolders: subFolders,
    files: files,
  });
});

router.post("/:folderId/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  const parentId = req.params.folderId;
  const { originalname, size, path } = req.file;
  try {
    const uploadResult = await cloudinary.uploader.upload(path, {
      resource_type: "auto",
    });

    console.log(uploadResult);
    await db.addFile(originalname, uploadResult.secure_url, size, parentId);

    fs.unlinkSync(path);

    res.redirect(`/dashboard/${parentId}`);
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).send("File upload failed. Please try again.");
  }
});

router.post("/:folderId/createFolder", async (req, res) => {
  const folderName = req.body.folderName;
  const userId = req.user.id;
  const parentId = req.params.folderId;

  await db.createFolder(folderName, userId, parentId);
  res.redirect(`/dashboard/${parentId}`);
});

router.post("/:folderId/update", async (req, res) => {
  const folderId = req.params.folderId;
  const newName = req.body.updatedFolderName;
  const parentId = await db.updateFolder(folderId, newName);
});

router.post("/:folderId/delete", async (req, res) => {
  const folderId = req.params.folderId;
  const parentId = await db.deleteFolder(folderId);
  res.redirect(`/dashboard/${parentId}`);
});

module.exports = router;
