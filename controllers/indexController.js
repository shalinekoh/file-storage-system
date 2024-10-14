const passport = require("passport");
const db = require("../db/queries");

const indexGet = (req, res) => {
  res.render("index");
};

const signUpGet = (req, res) => {
  res.render("forms/sign-up-form");
};

const signUpPost = async (req, res) => {
  const { username, password1, password2 } = req.body;
  try {
    if (password1 !== password2) {
      // i can add in error message here in partials/error then include it in all views & pass it as message
      console.log("Passwords do not match. ");
      return res.redirect("/signup");
    }

    const user = await db.addUser(username, password1);

    if (user) {
      res.redirect("/login");
    } else {
      console.log("User creation failed");
      res.redirect("/signup");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/signup");
  }
};

const logInGet = (req, res) => {
  res.render("forms/log-in-form");
};

const logInPost = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      //TODO pass in error message
      return res.render("forms/log-in-form");
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
    res.redirect("/login");
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
