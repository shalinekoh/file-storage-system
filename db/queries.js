const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const findUsers = async () => {
  const allUsers = await prisma.user.findMany();
  return allUsers;
};

const createUser = async (username, password) => {
  return await prisma.user.create({
    data: {
      username: username,
      password: password,
    },
  });
};

module.exports = { findUsers, createUser };
