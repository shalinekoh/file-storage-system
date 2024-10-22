const { PrismaClient } = require("@prisma/client");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const findUserbyName = async (username) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    return user;
  } catch (error) {
    console.log("Error finding user", error);
    throw error;
  }
};

const findUserbyID = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    return user;
  } catch (error) {
    console.log("Error finding user", error);
    throw error;
  }
};

const addUser = async (username, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.log("Error creating user", error);
    throw error;
  }
};

const createFolder = async (folderName, userId, parentId) => {
  try {
    const folder = await prisma.folder.create({
      data: {
        name: folderName,
        userId: userId,
        parentId: parentId,
      },
    });
    return folder;
  } catch (error) {
    throw error;
  }
};

const getRootFolder = async (userId) => {
  try {
    const rootFolder = await prisma.folder.findFirst({
      where: {
        userId: userId,
        parentId: null,
      },
    });
    if (!rootFolder) {
      const rootFolder = await createFolder("Root", userId, null);
    }
    return rootFolder.id;
  } catch (error) {
    throw error;
  }
};

const getAllFolders = async (userId, folderId) => {
  const folderData = await prisma.folder.findUnique({
    where: {
      userId: userId,
      id: folderId,
    },
    include: {
      subFolders: true,
      files: true,
    },
  });
  return folderData;
};

module.exports = {
  findUserbyName,
  findUserbyID,
  addUser,
  createFolder,
  getRootFolder,
  getAllFolders,
};
