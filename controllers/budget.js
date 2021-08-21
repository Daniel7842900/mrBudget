// Create database connection
const db = require("../models");
const Finance = db.finance;
const Item = db.item;
const moment = require("moment");

// Create a new Finance and save
exports.create = (req, res) => {
  res.render("pages/budget/create", {
    err_message: req.flash("err_message"),
  });
};

exports.store = (req, res) => {
  let date = req.body.date,
    income = parseFloat(req.body.income),
    list = req.body.list;

  let dateArr = date.split("-");
  let startDate = dateArr[0].trim(),
    endDate = dateArr[1].trim();

  startDate = moment(startDate, "MMM DD YYYY").format("YYYY-MM-DD HH:mm:ss");
  endDate = moment(endDate, "MMM DD YYYY").format("YYYY-MM-DD HH:mm:ss");

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
        obj.category_id = 1;
        delete obj.category;
        break;
      case "Grocery":
        obj.category_id = 2;
        delete obj.category;
        break;
      case "Rent":
        obj.category_id = 3;
        delete obj.category;
        break;
      case "Utility":
        obj.category_id = 4;
        delete obj.category;
        break;
      case "Dineout":
        obj.category_id = 5;
        delete obj.category;
        break;
      case "Investment":
        obj.category_id = 6;
        delete obj.category;
        break;
      case "Saving":
        obj.category_id = 7;
        delete obj.category;
        break;
      case "Alcohol":
        obj.category_id = 8;
        delete obj.category;
        break;
      case "Leisure":
        obj.category_id = 9;
        delete obj.category;
        break;
      case "Insurance":
        obj.category_id = 10;
        delete obj.category;
        break;
      case "Loan":
        obj.category_id = 11;
        delete obj.category;
        break;
      case "Streaming Service":
        obj.category_id = 12;
        delete obj.category;
        break;
      case "Transportation":
        obj.category_id = 13;
        delete obj.category;
        break;
      case "Etc":
        obj.category_id = 14;
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
    finance_type: 1,
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
  res.render("pages/budget");
};
