const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("../db/queries");

function initialize(passport) {
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.findUserbyName(username);

      if (!user) {
        return done(null, false, { message: "Username not found. " });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password. " });
      }

      return done(null, user);
    } catch (error) {
      return done(err);
    }
  });

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.findUserbyID(id);
      done(null, user);
    } catch (error) {
      return done(error);
    }
  });
}
