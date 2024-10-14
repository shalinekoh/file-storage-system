const { PrismaClient } = require("@prisma/client");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const findUser = async (username) => {
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

const addUser = async (username, password) => {
  try {
    const user = await findUser(username);
    if (!user) {
      const hashedPassword = await bcrypt(password, 10);
      return await prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
        },
      });
    }
    console.log("User exist!");
  } catch (error) {
    console.log("Error creating user", error);
    throw error;
  }
};

module.exports = { findUser, addUser };
