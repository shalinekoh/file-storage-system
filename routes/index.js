const { Router } = require("express");
const indexController = require("../controllers/indexController");

const router = Router();

// Middleware to check if the user is logged in
function redirectIfLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  next();
}

router.get("/", indexController.indexGet);

router.get("/signup", redirectIfLoggedIn, indexController.signUpGet);
router.post("/signup", indexController.signUpPost);

router.get("/login", redirectIfLoggedIn, indexController.logInGet);
router.post("/login", indexController.logInPost);

router.get("/login-demo", indexController.logInDemo);

router.get("/logout", indexController.logOutGet);

module.exports = router;
