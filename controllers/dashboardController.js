const db = require("../db/queries");
const cloudinary = require("../utils/cloudinary.config");
const fs = require("fs");

const getRoot = async (req, res) => {
  // redirect to root folder
  const rootFolderId = await db.getRootFolder(req.user.id);
  res.redirect(`/dashboard/${rootFolderId}`);
};

const getFolders = async (req, res) => {
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
};

const uploadFile = async (req, res) => {
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
};

const createFolder = async (req, res) => {
  const folderName = req.body.folderName;
  const userId = req.user.id;
  const parentId = req.params.folderId;

  await db.createFolder(folderName, userId, parentId);
  res.redirect(`/dashboard/${parentId}`);
};

const updateFolder = async (req, res) => {
  const folderId = req.params.folderId;
  const newName = req.body.updatedFolderName;
  const parentId = await db.updateFolder(folderId, newName);
  res.redirect(`/dashboard/${parentId}`);
};

const deleteFolder = async (req, res) => {
  const folderId = req.params.folderId;
  const parentId = await db.deleteFolder(folderId);
  res.redirect(`/dashboard/${parentId}`);
};

const updateFile = async (req, res) => {
  const fileId = req.params.fileId;
  const newName = req.body.updatedFileName;
  const parentId = await db.updateFile(fileId, newName);
  res.redirect(`/dashboard/${parentId}`);
};

const deleteFile = async (req, res) => {
  const fileId = req.params.fileId;
  const parentId = await db.deleteFile(fileId);
  res.redirect(`/dashboard/${parentId}`);
};

module.exports = {
  getRoot,
  getFolders,
  uploadFile,
  createFolder,
  updateFolder,
  deleteFolder,
  updateFile,
  deleteFile,
};
