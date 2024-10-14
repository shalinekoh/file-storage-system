module.exports = {
  isAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      console.error("Please log in first. ");
      res.redirect("/");
    }
  },
};
