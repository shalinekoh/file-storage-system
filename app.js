require("dotenv").config();

const express = require("express");
const path = require("path");

const passport = require("passport");
const initializePassport = require("./utils/passport.config");

const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");

const db = require("./db/queries");

const indexRoute = require("./routes/index");
const dashboardRoute = require("./routes/dashboard");

const app = express();
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: "a santa at nasa",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.session());
initializePassport(passport);

app.use("/dashboard", dashboardRoute);
app.use("/", indexRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
