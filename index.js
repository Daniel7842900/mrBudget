// Include Express
const express = require("express");

// Middlewares
var cors = require("cors");
const bodyParser = require("body-parser");
const { validationResult } = require("express-validator");
const session = require("express-session");
const path = require("path");
const mysql = require("mysql");
const { v4: uuidv4 } = require("uuid");
const auth = require("./validation/authValidation.js");
const passport = require("passport");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const _ = require("lodash");

// Controller
const budgetController = require("./controllers/budget.js");

// Create an Express app
const app = express();

// Static files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "/public/css"));
// console.log(__dirname + "/public/js");
app.use("/js", express.static(__dirname + "/public/js"));
// app.use("/budgetJs", express.static(__dirname + "/public/js/budget"));
app.use("/img", express.static(__dirname + "/pulbic/img"));

// Nav static files
app.use("/navJs", express.static(__dirname + "/views/partial/nav"));

// Set the view engine to ejs
app.set("view engine", "ejs");

// Cors
app.use(cors());
app.options("*", cors());

// bodyparser, use qs library
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser
app.use(cookieParser());

// use connect-flash for flash messages stored in session
app.use(flash());

// To solve, its MIME type ('text/html') is not a supported stylesheet MIME type, and strict MIME checking is enabled. cors
// build is for Tailwind CSS
app.use("/build", express.static("build"));

// Set lodash in locals in order to use in ejs templates
app.locals._ = _;

// Create database connection
const db = require("./models");

// Add & configure session middleware
app.use(
  session({
    secret: "keyboard cat",
    // resave: true,
    // saveUninitialized: true,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

require("./routes/auth.js")(app, passport);

// load passport strategies
require("./passport/passport.js")(passport, db.user);

app.get("/dashboard", function (req, res) {
  // console.log("we are at dashboard!");
  // res.sendFile(__dirname + "/views/pages/dashboard/index.html");
  // console.log("Cookies: ", req.cookies);
  // console.log("session: ", req.session);
  // console.log("passport: ", req.session.passport);
  res.render("pages/dashboard");
});

require("./routes/budget.js")(app);

require("./routes/expense.js")(app);

// app.get("/expense", function (req, res) {
//   res.render("pages/expense");
// });

app.get("/", function (req, res) {
  const viewPath = req.isAuthenticated() ? "/dashboard" : "/login";
  res.redirect(viewPath);
});

db.sequelize.sync({ force: false }).then(function () {
  app.listen(3000, function () {
    console.log("server is successfully running!");
  });
});
