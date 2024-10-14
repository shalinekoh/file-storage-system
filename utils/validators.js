const { body } = require("express-validator");
const db = require("../db/queries");

const validateSignUp = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    // .isAlphanumeric()
    // .withMessage("Username should only consist of letters and numbers. ")
    .custom(async (value) => {
      const user = await db.findUserbyName(value);
      if (user) {
        throw new Error("Username is already taken. ");
      } else {
        return true;
      }
    }),

  body("password1")
    .trim()
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("password2")
    .trim()
    .notEmpty()
    .withMessage("Confirmed password cannot be empty. ")
    .custom((value, { req }) => {
      if (value !== req.body.password1) {
        throw new Error("Passwords do not match. ");
      }
      return true;
    }),
];

module.exports = { validateSignUp };
