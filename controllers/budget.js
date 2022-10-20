// Create database connection
const db = require("../models");
const Finance = db.finance;
const Item = db.item;
const moment = require("moment");
const _ = require("lodash");
const { Op } = require("sequelize");
const {
  catToCatId,
  catIdToCat,
  getCatDisplay,
} = require("./util/convertCategories");
const {
  subCatToId,
  subCatIdToSubCat,
  getSubCatDisplay,
} = require("./util/convertSubcategories");
const financeService = require("../services/finance");

// Controller for displaying a new budget page
exports.create = async (req, res) => {
  let itemizedItems = [];
  let user = req.user;
  let budgets;
  try {
    budgets = await financeService.findAll(req, res);
  } catch (error) {
    console.log(error);
  }

  res.render("pages/budget/create", {
    user: user,
    budgets: budgets,
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
  res.send(newBudget);
};

// Controller for displaying a budget
exports.findOne = async (req, res) => {
  let { user } = req;
  const budgets = await financeService.findAll(req, res);
  let itemizedItems = [];

  if (_.isEmpty(req.query)) {
    res.render("pages/budget", {
      user: user,
      budgets: budgets,
      itemizedItems: itemizedItems,
      error: req.flash("budget_err"),
    });
  } else {
    let startDate = req.query.start,
      endDate = req.query.end;
    let items;
    try {
      items = await financeService.findOne(req, res);
    } catch (error) {
      console.log(error);
      req.flash("budget_err", "Budget doesn't exist!");
      res.render("pages/budget", {
        user: user,
        budgets: budgets,
        itemizedItems: itemizedItems,
        startDate: startDate,
        endDate: endDate,
        getCatDisplay: getCatDisplay,
        getSubCatDisplay: getSubCatDisplay,
        error: req.flash("budget_err"),
      });
    }

    res.render("pages/budget", {
      user: user,
      budgets: budgets,
      itemizedItems: items,
      startDate: startDate,
      endDate: endDate,
      getCatDisplay: getCatDisplay,
      getSubCatDisplay: getSubCatDisplay,
      error: req.flash("budget_err"),
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
      res.status(500).send({
        message: error.message || "Something wrong while creating budget",
      });
    }
  }

  res.send(updatedItems);
};

// Controller for deleting a budget
exports.delete = async (req, res) => {
  let date = req.body.date,
    user = req.user;

  let dateArr = date.split("-");
  let startDate = dateArr[0].trim(),
    endDate = dateArr[1].trim();

  startDate = moment(startDate, "MMM DD YYYY").format("YYYY-MM-DD");
  endDate = moment(endDate, "MMM DD YYYY").format("YYYY-MM-DD");

  // Condition for finding a budget
  let filter = {
    where: {
      startDate: startDate,
      endDate: endDate,
      financeTypeId: 1,
      userId: user.id,
    },
  };

  const budget = await Finance.findOne(filter);
  const destroyedBudget = await Finance.destroy(filter);

  Promise.all([budget, destroyedBudget])
    .then((response) => {
      const budgetInst = response[0];
      const budgetData = budgetInst.get();
      res.send(budgetData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Something wrong while deleting budget",
      });
    });
};
