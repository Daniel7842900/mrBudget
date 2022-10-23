// Create database connection
const db = require("../models");
const Finance = db.finance;
const Item = db.item;
const moment = require("moment");
const _ = require("lodash");
const { Op } = require("sequelize");
const financeService = require("../services/finance");
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

// Controller for displaying a new expense page
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

// Controller for saving a new expense
exports.store = async (req, res) => {
  let newFinance;
  try {
    newFinance = await financeService.store(req, res);
  } catch (error) {
    console.log("newFinance catching error");
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
  res.status(201).send(newFinance);
};

// Controller for displaying an expense
exports.findOne = async (req, res) => {
  let { user, originalUrl } = req;

  const finances = await financeService.findAll(req, res);
  let itemizedItems = [];

  if (_.isEmpty(req.query)) {
    res.render(`pages${originalUrl}`, {
      user: user,
      finances: finances,
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
      res.render(`pages${originalUrl}`, {
        user: user,
        finances: finances,
        itemizedItems: itemizedItems,
        startDate: startDate,
        endDate: endDate,
        getCatDisplay: getCatDisplay,
        getSubCatDisplay: getSubCatDisplay,
        error: req.flash("budget_err"),
      });
    }

    res.render(`pages${originalUrl}`, {
      user: user,
      finances: finances,
      itemizedItems: items,
      startDate: startDate,
      endDate: endDate,
      getCatDisplay: getCatDisplay,
      getSubCatDisplay: getSubCatDisplay,
      error: req.flash("budget_err"),
    });
  }
};

// Controller for editing an expense
exports.edit = async (req, res) => {
  let itemizedItems = [];
  let { user, originalUrl } = req;
  let financeTypeUrl = originalUrl.split("/")[1].split("?")[0].trim();
  let startDate = req.query.start,
    endDate = req.query.end;

  let finances;
  try {
    finances = await financeService.findAll(req, res);
  } catch (error) {
    console.log(error);
  }

  let items;
  try {
    items = await financeService.findOne(req, res);
  } catch (error) {
    console.log(error);
    res.render(`pages/${financeTypeUrl}/edit`, {
      user: user,
      finances: finances,
      itemizedItems: itemizedItems,
      startDate: startDate,
      endDate: endDate,
      getCatDisplay: getCatDisplay,
      getSubCatDisplay: getSubCatDisplay,
      error: req.flash("budget_err"),
      err_message: req.flash("err_message"),
    });
  }
  console.log(itemizedItems);
  res.render(`pages/${financeTypeUrl}/edit`, {
    user: user,
    finances: finances,
    itemizedItems: items,
    startDate: startDate,
    endDate: endDate,
    getCatDisplay: getCatDisplay,
    getSubCatDisplay: getSubCatDisplay,
    error: req.flash("budget_err"),
    err_message: req.flash("err_message"),
  });
};

// Controller for updating an expense
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

// Controller for deleting an expense
exports.delete = async (req, res) => {
  let destroyedExpense;
  try {
    destroyedExpense = await financeService.delete(req, res);
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
