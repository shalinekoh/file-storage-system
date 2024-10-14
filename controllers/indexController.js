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
      res.redirect("signup");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/signup");
  }
};

const logInGet = (req, res) => {};

const logInPost = (req, res) => {};

const logOutGet = (req, res) => {};

module.exports = {
  indexGet,
  signUpGet,
  signUpPost,
  //   logInGet,
  //   logInPost,
  //   logOutGet,
};
