module.exports = (app) => {
  const expense = require("../controllers/expense.js");

  let router = require("express").Router();

  router.post("/new", expense.store);

  router.get("/new", expense.create);

  router.get("/edit", expense.edit);

  router.post("/edit", expense.update);

  //   router.delete("/delete", expense.delete);

  router.get("/", expense.findOne);

  app.use("/expense", router);
};
