const expense = require("../controllers/expense.js");
const finance = require("../controllers/finance.js");
const auth = require("./auth.js");
let router = require("express").Router();

let loadRouter = (app) => {
  router.post("/new", auth.isLoggedIn, expense.store);

  router.get("/new", auth.isLoggedIn, expense.create);

  router.get("/edit", auth.isLoggedIn, expense.edit);

  router.post("/edit", auth.isLoggedIn, expense.update);

  router.delete("/delete", auth.isLoggedIn, expense.delete);

  router.get("/", auth.isLoggedIn, finance.findOne);

  app.use("/expense", router);
};

module.exports = {
  loadRouter: loadRouter,
};
