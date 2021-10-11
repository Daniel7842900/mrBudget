module.exports = (app) => {
  const budget = require("../controllers/budget.js");

  let router = require("express").Router();

  router.post("/new", budget.store);

  router.get("/new", budget.create);

  router.get("/edit", budget.edit);

  router.post("/edit", budget.update);

  router.get("/", budget.findOne);

  app.use("/budget", router);
};
