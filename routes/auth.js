var passport = require("../passport/passport.js");
var path = require("path");
var db = require("../models");
module.exports = function (app, passport) {
  /**
   * Login route
   */
  app.get("/login", function (req, res) {
    // console.log(req.flash("error"));
    // res.sendFile(path.join(__dirname, "../login/index.html"));
    const errFlash = req.flash("error");
    // res.cookie("name", "express");
    // console.log("Cookies: ", req.cookies);
    // console.log("session: ", req.session);
    // console.log(req);
    let view = "login";
    let isAuth = req.isAuthenticated();
    if (req.isAuthenticated()) {
      let view = "/dashboard";
      res.redirect(view);
    } else {
      res.render(view, {
        errFlash: errFlash,
        isAuth: isAuth,
      });
    }
  });

  /**
   * Logout route
   */
  //   app.get("/logout", function (req, res) {
  //     console.log("Log Out Route Hit");
  //     req.session.destroy(function (err) {
  //       if (err) console.log(err);
  //       res.redirect("/");
  //     });
  //   });

  /**
   * Register route
   */
  //   app.post(
  //     "/signup/newuser",
  //     passport.authenticate("local-signup"),
  //     function (req, res) {
  //       console.log(req.user);
  //       res.render("homepage");
  //     }
  //   );

  /**
   * Login handler
   */
  app.post(
    "/login",
    passport.authenticate("local-signin", {
      successRedirect: "/dashboard",
      failureRedirect: "/login",
      failureFlash: true,
    })
    // function (req, res) {
    //   console.log(req.user);
    //   //   res.render(__dirname, "../pages/dashboard/index.html");
    //   res.redirect("/dashboard");
    // }
  );

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
  }
};
