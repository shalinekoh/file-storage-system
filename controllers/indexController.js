const passport = require("passport");
const db = require("../db/queries");
const validators = require("../utils/validators");
const { validationResult } = require("express-validator");

const indexGet = (req, res) => {
  res.render("index");
};

const signUpGet = (req, res) => {
  res.render("forms/sign-up-form");
};

const signUpPost = [
  validators.validateSignUp,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("forms/sign-up-form", { errors: errors.array() });
    }
    const { username, password1, password2 } = req.body;
    const user = await db.addUser(username, password1);

    if (user) {
      res.redirect("/login");
    } else {
      console.log("User creation failed");
      res.redirect("/signup");
    }
  },
];

const logInGet = (req, res) => {
  res.render("forms/log-in-form");
};

const logInPost = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("forms/log-in-form", {
        errors: [{ msg: "Invalid username or password" }],
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/dashboard");
    });
  })(req, res, next);
};

const logOutGet = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

module.exports = {
  indexGet,
  signUpGet,
  signUpPost,
  logInGet,
  logInPost,
  logOutGet,
};
