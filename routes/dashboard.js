const { Router } = require("express");
const multer = require("multer");
const dashboardController = require("../controllers/dashboardController");

const router = Router();

const upload = multer({
  limits: { fileSize: 10485760 },
  dest: "uploads/",
});

router.get("/", dashboardController.getRoot);

router.get("/:folderId", dashboardController.getFolders);

router.post(
  "/:folderId/upload",
  upload.single("file"),
  dashboardController.uploadFile
);

router.post("/:folderId/createFolder", dashboardController.createFolder);

router.post("/:folderId/update", dashboardController.updateFolder);

router.post("/:folderId/delete", dashboardController.deleteFolder);

router.post("/file/:fileId/update", dashboardController.updateFile);

router.post("/file/:fileId/delete", dashboardController.deleteFile);

module.exports = router;
