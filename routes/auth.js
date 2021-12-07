var passport = require("../passport/passport.js");
var db = require("../models");

let loadRouter = (app, passport) => {
  /**
   * Login route
   */
  app.get("/login", function (req, res) {
    const errFlash = req.flash("error");
    let path = "auth/login";
    let isAuth = req.isAuthenticated();
    if (req.isAuthenticated()) {
      path = "/dashboard";
      res.redirect(path);
    } else {
      res.render(path, {
        errFlash: errFlash,
        isAuth: isAuth,
      });
    }
  });

  /**
   * Logout route
   */
  app.get("/logout", function (req, res) {
    console.log("Log Out Route Hit");
    req.logout();
    res.redirect("/login");
  });

  /**
   * Register route
   */
  app.get("/signup", function (req, res) {
    const errFlash = req.flash("error");
    res.render("auth/signup", {
      errFlash: errFlash,
    });
  });

  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      failureFlash: true,
      session: false,
    }),
    function (req, res) {
      const errFlash = req.flash("error");
      res.render("auth/login", {
        errFlash: errFlash,
      });
    }
  );

  /**
   * Login handler
   */
  app.post(
    "/login",
    passport.authenticate("local-signin", {
      successRedirect: "/dashboard",
      failureRedirect: "/login",
      failureFlash: true,
      session: true,
    })
  );
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = {
  loadRouter: loadRouter,
  isLoggedIn: isLoggedIn,
};
