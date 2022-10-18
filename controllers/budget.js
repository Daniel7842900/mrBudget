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
  let user = req.user;
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
    startDate = moment(startDate, "YYYY-MM-DD").format("MM-DD-YYYY");
    endDate = moment(endDate, "YYYY-MM-DD").format("MM-DD-YYYY");
    try {
      const items = await financeService.findOne(req, res);

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
  }
};

// Controller for editing a budget
exports.edit = async (req, res) => {
  let itemizedItems = [];
  let budgetsArr = [];
  let startDate = req.query.start,
    endDate = req.query.end,
    user = req.user;

  startDate = moment(startDate, "MM-DD-YYYY").format("YYYY-MM-DD");
  endDate = moment(endDate, "MM-DD-YYYY").format("YYYY-MM-DD");

  // Retrieve every budget records to display on the calendar
  const budgets = await Finance.findAll({
    where: {
      financeTypeId: 1,
      userId: user.id,
    },
  });

  // Condition for finding a budget
  let filter = {
    where: {
      startDate: startDate,
      endDate: endDate,
      financeTypeId: 1,
      userId: user.id,
    },
  };

  startDate = moment(startDate, "YYYY-MM-DD").format("MM-DD-YYYY");
  endDate = moment(endDate, "YYYY-MM-DD").format("MM-DD-YYYY");

  // Retrieve one budget to display on edit page
  const budget = await Finance.findOne(filter);

  Promise.all([budgets, budget])
    .then((responses) => {
      const budgetInsts = responses[0];
      budgetInsts.forEach((budgetInst) => {
        let budgetData = budgetInst.get();
        budgetsArr.push(budgetData);
      });
      const budgetInst = responses[1];
      const budgetData = budgetInst.get();
      if (budgetData === null) {
        throw "error";
      }
      return Item.findAll({
        where: { financeId: budgetData.id },
      });
    })
    .then((itemInsts) => {
      itemInsts.forEach((itemInst) => {
        // new obj for formatted data
        let itemizedItem = {};

        // item record from db
        const itemData = itemInst.get();

        // Assign amount to a new obj
        itemizedItem.amount = parseFloat(itemData["amount"]);

        // Assign description to a new obj
        itemizedItem.description = itemData["description"];

        // Convert category id & subCategory id to category value & subCategory value
        catIdToCat(itemData, itemizedItem);
        subCatIdToSubCat(itemData, itemizedItem);

        // Add a new obj to the list
        itemizedItems.push(itemizedItem);
      });

      res.render("pages/budget/edit", {
        user: user,
        budgets: budgetsArr,
        itemizedItems: itemizedItems,
        startDate: startDate,
        endDate: endDate,
        getCatDisplay: getCatDisplay,
        getSubCatDisplay: getSubCatDisplay,
        error: req.flash("budget_err"),
        err_message: req.flash("err_message"),
      });
    })
    .catch((err) => {
      req.flash("budget_err", "Budget doesn't exist!");
      res.render("pages/budget/edit", {
        user: user,
        budgets: budgetsArr,
        itemizedItems: itemizedItems,
        startDate: startDate,
        endDate: endDate,
        getCatDisplay: getCatDisplay,
        getSubCatDisplay: getSubCatDisplay,
        error: req.flash("budget_err"),
        err_message: req.flash("err_message"),
      });
    });
};

// Controller for updating a budget
exports.update = async (req, res) => {
  let date = req.body.date,
    income = parseFloat(req.body.income),
    list = req.body.list,
    user = req.user;
  let itemPromises = [];
  let budgetsArr = [];

  let dateArr = date.split("-");
  let startDate = dateArr[0].trim(),
    endDate = dateArr[1].trim();

  startDate = moment(startDate, "MMM DD YYYY").format("YYYY-MM-DD");
  endDate = moment(endDate, "MMM DD YYYY").format("YYYY-MM-DD");

  // Validate request
  if (_.isNaN(income) || income === 0) {
    if (_.isNaN(income)) {
      req.flash("income_err_message", "If there is no income, enter 0!");
      return res.status(400).send({
        message: "If there is no income, enter 0!",
      });
    }
    if (list.length === 0) {
      req.flash("err_message", "Please fill out the form!");
      return res.status(400).send({
        message: "Please fill out the form!",
      });
    }
  }

  // Make the income field same format with others
  let itemizedIncome = {
    amount: income,
    category: _.toLower("income"),
    description: _.toLower("income"),
  };

  // Add income obj to the list
  list.push(itemizedIncome);

  list.forEach((element) => {
    console.log(element);
  });

  // Format the records from db and push it to
  //a new array
  let itemizedList = [];
  list.forEach((obj) => {
    // Delete idx that was used in front-end
    delete obj.idx;

    catToCatId(obj);
    subCatToId(obj);
    itemizedList.push(obj);
  });

  // Condition for finding a budget
  let filter = {
    where: {
      startDate: startDate,
      endDate: endDate,
      financeTypeId: 1,
      userId: user.id,
    },
  };

  // Retrieve every budget records to display on the calendar
  const budgets = await Finance.findAll({
    where: {
      financeTypeId: 1,
      userId: user.id,
    },
  });

  // Retrieve one budget to display on edit page
  const budget = await Finance.findOne(filter);
  let budgetData;

  // Change the date format to use in URL
  startDate = moment(startDate, "YYYY-MM-DD").format("MM-DD-YYYY");
  endDate = moment(endDate, "YYYY-MM-DD").format("MM-DD-YYYY");

  Promise.all([budgets, budget])
    .then(async (response) => {
      const budgetInsts = response[0];
      budgetInsts.forEach((budgetInst) => {
        let budgetInstData = budgetInst.get();
        budgetsArr.push(budgetInstData);
      });
      const budgetInst = response[1];
      budgetData = budgetInst.get();
      if (budgetData === null) {
        throw "error";
      }

      // Delete item records that are associated with the budget
      await Item.destroy({
        where: {
          financeId: budgetData.id,
        },
      });

      // Create items with the given details
      const newItems = await Item.bulkCreate(itemizedList);

      // Associate items with the budget
      await budgetInst.addItems(newItems);

      // Send the response back to front-end
      res.send(itemizedList);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Something wrong while editing budget",
      });
    });
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
