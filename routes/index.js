const { Router } = require("express");
const indexController = require("../controllers/indexController");

const router = Router();

router.get("/", indexController.indexGet);

router.get("/signup", indexController.signUpGet);
router.post("/signup", indexController.signUpPost);

router.get("/login", indexController.logInGet);
router.post("/login", indexController.logInPost);

// router.get("/logout", indexController.logOutGet);

module.exports = router;
