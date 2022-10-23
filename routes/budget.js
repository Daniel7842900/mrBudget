const budget = require("../controllers/budget.js");
const finance = require("../controllers/finance.js");
const auth = require("./auth.js");
let router = require("express").Router();

let loadRouter = (app) => {
  router.post("/new", auth.isLoggedIn, finance.store);

  router.get("/new", auth.isLoggedIn, finance.create);

  router.get("/edit", auth.isLoggedIn, finance.edit);

  router.post("/edit", auth.isLoggedIn, finance.update);

  router.delete("/delete", auth.isLoggedIn, finance.delete);

  router.get("/", auth.isLoggedIn, finance.findOne);

  app.use("/budget", router);
};

module.exports = {
  loadRouter: loadRouter,
};
