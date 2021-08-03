module.exports = (app) => {
  const budget = require("../controllers/budget.js");

  let router = require("express").Router();

  router.post("/new", budget.store);

  router.get("/new", budget.create);

  router.get("/", budget.findAll);

  app.use("/budget", router);
};
