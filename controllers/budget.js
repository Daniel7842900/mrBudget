// Create database connection
const db = require("../models");
const Finance = db.finance;
const Item = db.item;
const moment = require("moment");
const _ = require("lodash");
const jquery = require("jquery");
const toastr = require("toastr");
// const { toSafeInteger } = require("lodash");

// Controller for displaying a new budget page
exports.create = (req, res) => {
  res.render("pages/budget/create", {
    err_message: req.flash("err_message"),
  });
};

// Controller for saving a new budget
exports.store = (req, res) => {
  let date = req.body.date,
    income = parseFloat(req.body.income),
    list = req.body.list;

  let dateArr = date.split("-");
  let startDate = dateArr[0].trim(),
    endDate = dateArr[1].trim();

  startDate = moment(startDate, "MMM DD YYYY").format("YYYY-MM-DD");
  endDate = moment(endDate, "MMM DD YYYY").format("YYYY-MM-DD");

  // Validate request
  if (income === null || income === 0) {
    if (list.length === 0) {
      req.flash("err_message", "Please fill out the form!");
      return res.status(400).send({
        message: "Content can not be empty!",
      });
    }
  }

  // TODO there must be better way to do this...
  let itemizedIncome = {
    amount: income,
    category: "Income",
  };

  list.push(itemizedIncome);

  let itemizedList = [];

  list.forEach((obj) => {
    delete obj.idx;
    switch (obj.category) {
      case "Income":
        obj.categoryId = 1;
        delete obj.category;
        break;
      case "Grocery":
        obj.categoryId = 2;
        delete obj.category;
        break;
      case "Rent":
        obj.categoryId = 3;
        delete obj.category;
        break;
      case "Utility":
        obj.categoryId = 4;
        delete obj.category;
        break;
      case "Dineout":
        obj.categoryId = 5;
        delete obj.category;
        break;
      case "Investment":
        obj.categoryId = 6;
        delete obj.category;
        break;
      case "Saving":
        obj.categoryId = 7;
        delete obj.category;
        break;
      case "Alcohol":
        obj.categoryId = 8;
        delete obj.category;
        break;
      case "Leisure":
        obj.categoryId = 9;
        delete obj.category;
        break;
      case "Insurance":
        obj.categoryId = 10;
        delete obj.category;
        break;
      case "Loan":
        obj.categoryId = 11;
        delete obj.category;
        break;
      case "Streaming Service":
        obj.categoryId = 12;
        delete obj.category;
        break;
      case "Transportation":
        obj.categoryId = 13;
        delete obj.category;
        break;
      case "Etc":
        obj.categoryId = 14;
        delete obj.category;
        break;
      default:
    }
    itemizedList.push(obj);
  });

  itemizedList.forEach((obj) => {
    console.log(obj);
  });

  // TODO complete the creating an object.
  // We need start date, end date, finance_type,
  //items.
  const budget = {
    startDate: startDate,
    endDate: endDate,
    financeTypeId: 1,
    items: itemizedList,
  };

  Finance.create(budget, {
    include: [Item],
  })
    .then((data) => {
      req.flash("success_message", "New budget is created!");
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Something wrong while creating finance",
      });
    });

  // TODO figure out what these 2 lines mean
  // res.set("Content-Type", "application/json");
  // var jsonData = JSON.stringify(req.body);

  // We should return the resonse otherwise the POST request
  //on client side will get stuck (pending).
  // status 201 is "Created"
  // return res.status(201).json(req.body);
};

exports.findAll = (req, res) => {
  let itemizedItems = [];
  let budgetsArr = [];

  // TODO it seems like the results don't get passed into the views
  //when it renders. figure this out.
  Finance.findAll({
    where: {
      financeTypeId: 1,
    },
  }).then((budgetInsts) => {
    console.log("hello");
    budgetInsts.forEach((budgetInst) => {
      let budgetData = budgetInst.get();
      console.log(budgetData);
      budgetsArr.push(budgetData);
    });
    res.render("pages/budget", {
      budgets: budgetsArr,
      itemizedItems: itemizedItems,
      error: req.flash("budget_err"),
    });
  });
};

// Controller for displaying a budget
exports.findOne = (req, res) => {
  // console.log(req.query);
  let itemizedItems = [];

  if (_.isEmpty(req.query)) {
    res.render("pages/budget", {
      budgets: budgetsArr,
      itemizedItems: itemizedItems,
      error: req.flash("budget_err"),
    });
  } else {
    let startDate = req.query.start,
      endDate = req.query.end;

    startDate = moment(startDate, "MM-DD-YYYY").format("YYYY-MM-DD");
    endDate = moment(endDate, "MM-DD-YYYY").format("YYYY-MM-DD");

    console.log(startDate);
    console.log(endDate);

    Finance.findOne({
      where: { startDate: startDate, endDate: endDate },
    })
      .then((budgetInst) => {
        // console.log(budgetInst);
        return budgetInst.get();
      })
      .then((budgetData) => {
        if (budgetData === null) {
          throw "error";
        }
        return Item.findAll({
          where: { financeId: budgetData.id },
        });
      })
      .then((items) => {
        // console.log(items);
        items.forEach((element) => {
          let itemizedItem = {};
          // console.log(element);
          itemizedItem.amount = element.dataValues.amount;
          switch (element.dataValues.categoryId) {
            case 1:
              itemizedItem.category = "Income";
              break;
            case 2:
              itemizedItem.category = "Grocery";
              break;
            case 3:
              itemizedItem.category = "Rent";
              break;
            case 4:
              itemizedItem.category = "Utility";
              break;
            case 5:
              itemizedItem.category = "Dineout";
              break;
            case 6:
              itemizedItem.category = "Investment";
              break;
            case 7:
              itemizedItem.category = "Saving";
              break;
            case 8:
              itemizedItem.category = "Alcohol";
              break;
            case 9:
              itemizedItem.category = "Leisure";
              break;
            case 10:
              itemizedItem.category = "Insurance";
              break;
            case 11:
              itemizedItem.category = "Loan";
              break;
            case 12:
              itemizedItem.category = "Streaming Service";
              break;
            case 13:
              itemizedItem.category = "Transportation";
              break;
            case 14:
              itemizedItem.category = "Etc";
              break;
            default:
          }
          itemizedItems.push(itemizedItem);
        });
        res.render("pages/budget", {
          budgets: budgetsArr,
          itemizedItems: itemizedItems,
          error: req.flash("budget_err"),
        });
      })
      .catch((err) => {
        req.flash("budget_err", "Budget doesn't exist!");
        res.render("pages/budget", {
          budgets: budgetsArr,
          itemizedItems: itemizedItems,
          error: req.flash("budget_err"),
        });
      });
  }
};
