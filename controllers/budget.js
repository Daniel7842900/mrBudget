// Create database connection
const _ = require("lodash");
const { getCatDisplay } = require("./util/convertCategories");
const { getSubCatDisplay } = require("./util/convertSubcategories");
const financeService = require("../services/finance");

// Controller for displaying a new budget page
exports.create = async (req, res) => {
  let itemizedItems = [];
  let { user, originalUrl } = req;
  let financeTypeUrl = originalUrl.split("/")[1].trim();

  let finances;
  try {
    finances = await financeService.findAll(req, res);
  } catch (error) {
    console.log(error);
  }

  res.render(`pages/${financeTypeUrl}/create`, {
    user: user,
    finances: finances,
    itemizedItems: itemizedItems,
    err_message: req.flash("err_message"),
  });
};

// Controller for saving a new budget
exports.store = async (req, res) => {
  let newBudget;
  try {
    newBudget = await financeService.store(req, res);
  } catch (error) {
    console.log("newBudget catching error");
    if (error.type == "invalid-input") {
      res.status(400).send({
        message: error.message,
      });
    } else {
      res.status(500).send({
        message: error.message || "Something wrong while creating budget",
      });
    }
  }

  req.flash("success_message", "New budget is created!");
  res.status(201).send(newBudget);
};

// Controller for displaying a budget
exports.findOne = async (req, res) => {
  let { user, originalUrl } = req;
  let financeTypeUrl = originalUrl.split("?")[0].slice(1).trim();

  const finances = await financeService.findAll(req, res);
  let itemizedItems = [];

  if (_.isEmpty(req.query)) {
    res.render(`pages/${financeTypeUrl}`, {
      user: user,
      finances: finances,
      itemizedItems: itemizedItems,
      error: req.flash("finance_err"),
    });
  } else {
    let startDate = req.query.start,
      endDate = req.query.end;
    let items;

    try {
      items = await financeService.findOne(req, res);
    } catch (error) {
      console.log(error);
      req.flash(
        "finance_err",
        `${_.upperFirst(financeTypeUrl)} doesn't exist!`
      );
      res.render(`pages/${financeTypeUrl}`, {
        user: user,
        finances: finances,
        itemizedItems: itemizedItems,
        startDate: startDate,
        endDate: endDate,
        getCatDisplay: getCatDisplay,
        getSubCatDisplay: getSubCatDisplay,
        error: req.flash("finance_err"),
      });
    }

    res.render(`pages/${financeTypeUrl}`, {
      user: user,
      finances: finances,
      itemizedItems: items,
      startDate: startDate,
      endDate: endDate,
      getCatDisplay: getCatDisplay,
      getSubCatDisplay: getSubCatDisplay,
      error: req.flash("finance_err"),
    });
  }
};

// Controller for editing a budget
exports.edit = async (req, res) => {
  let itemizedItems = [];
  let { user } = req;
  let startDate = req.query.start,
    endDate = req.query.end;

  let budgets;
  try {
    budgets = await financeService.findAll(req, res);
  } catch (error) {
    console.log(error);
  }

  let items;
  try {
    items = await financeService.findOne(req, res);
  } catch (error) {
    console.log(error);
    res.render("pages/budget/edit", {
      user: user,
      budgets: budgets,
      itemizedItems: itemizedItems,
      startDate: startDate,
      endDate: endDate,
      getCatDisplay: getCatDisplay,
      getSubCatDisplay: getSubCatDisplay,
      error: req.flash("budget_err"),
      err_message: req.flash("err_message"),
    });
  }

  res.render("pages/budget/edit", {
    user: user,
    budgets: budgets,
    itemizedItems: items,
    startDate: startDate,
    endDate: endDate,
    getCatDisplay: getCatDisplay,
    getSubCatDisplay: getSubCatDisplay,
    error: req.flash("budget_err"),
    err_message: req.flash("err_message"),
  });
};

// Controller for updating a budget
exports.update = async (req, res) => {
  let updatedItems;
  try {
    updatedItems = await financeService.update(req, res);
  } catch (error) {
    if (error.type == "invalid-input") {
      return res.status(400).send({
        message: error.message,
      });
    } else {
      return res.status(500).send({
        message: error.message || "Something wrong while creating budget",
      });
    }
  }

  return res
    .status(204)
    .send({ message: "The budget is successfully updated!" });
};

// Controller for deleting a budget
exports.delete = async (req, res) => {
  let destroyedBudget;
  try {
    destroyedBudget = await financeService.delete(req, res);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: err.message || "Something wrong while deleting budget",
    });
  }

  return res
    .status(200)
    .send({ message: "The budget is successfully deleted!" });
};
