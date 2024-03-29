// Include Express
const express = require("express");

// Middlewares
var cors = require("cors");
const bodyParser = require("body-parser");
const { validationResult } = require("express-validator");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const path = require("path");
const mysql = require("mysql");
const { v4: uuidv4 } = require("uuid");
const auth = require("./validation/authValidation.js");
const passport = require("passport");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const _ = require("lodash");

// Create an Express app
const app = express();

// Static files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/img", express.static(__dirname + "/pulbic/img"));

// Nav static files
app.use("/navJs", express.static(__dirname + "/views/partial/nav"));

// Set the view engine to ejs
app.set("view engine", "ejs");

// Cors
app.use(cors());
app.options("*", cors());

// cookie parser
app.use(cookieParser());

// Add & configure session middleware
//session needs to be used before passport.session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
    },
  })
);

// bodyparser, use qs library
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use connect-flash for flash messages stored in session
app.use(flash());

// To solve, its MIME type ('text/html') is not a supported stylesheet MIME type, and strict MIME checking is enabled. cors
//build is for Tailwind CSS
app.use("/build", express.static("build"));

// Set lodash in locals in order to use in ejs templates
app.locals._ = _;

// Create database connection
const db = require("./models");

// Passport
app.use(passport.initialize());
app.use(passport.session());

// load passport strategies
require("./passport/passport.js")(passport, db.user);

// Import router objects
const authRouter = require("./routes/auth.js");
const budgetRouter = require("./routes/budget.js");
const expenseRouter = require("./routes/expense.js");
const dashboardRouter = require("./routes/dashboard.js");
const reportRouter = require("./routes/report.js");

// Call routers
authRouter.loadRouter(app, passport);
budgetRouter.loadRouter(app);
expenseRouter.loadRouter(app);
dashboardRouter.loadRouter(app);
reportRouter.loadRouter(app);

app.get("/", function (req, res) {
  const viewPath = req.isAuthenticated() ? "/dashboard" : "/login";
  res.redirect(viewPath);
});

db.sequelize.sync({ force: false }).then(function () {
  app.listen(3000, function () {
    console.log("server is successfully running!");
  });
});
