const report = require("../controllers/report.js");
const auth = require("./auth.js");
let router = require("express").Router();

let loadRouter = (app) => {
  // app.get("/dashboard", function (req, res) {
  //   let user = req.user;
  //   // console.log("we are at dashboard!");
  //   // res.sendFile(__dirname + "/views/pages/dashboard/index.html");
  //   // console.log("Cookies: ", req.cookies);
  //   console.log("session: ", req.session);
  //   // console.log("passport: ", req.session.passport);
  //   res.render("pages/dashboard", {
  //     user: user,
  //   });
  // });

  router.get("/", auth.isLoggedIn, report.findAll);

  app.use("/report", router);
};

module.exports = {
  loadRouter: loadRouter,
};
