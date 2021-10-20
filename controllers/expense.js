// Create database connection
const db = require("../models");
const Finance = db.finance;
const Item = db.item;
const moment = require("moment");
const _ = require("lodash");

// Controller for displaying a new expense page
exports.create = async (req, res) => {
  let itemList = [];
  let expensesArr = [];

  // Retrieve every expense records to display on the calendar
  const expenses = await Finance.findAll({
    where: {
      financeTypeId: 2,
    },
  });

  Promise.all([expenses])
    .then((responses) => {
      const expenseInsts = responses[0];
      expenseInsts.forEach((expenseInst) => {
        let expenseData = expenseInst.get();
        expensesArr.push(expenseData);
      });
      res.render("pages/expense/create", {
        expenses: expensesArr,
        itemList: itemList,
        err_message: req.flash("err_message"),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Controller for saving a new expense
exports.store = async (req, res) => {
  let date = req.body.date,
    list = req.body.list;

  let dateArr = date.split("-");
  let startDate = dateArr[0].trim(),
    endDate = dateArr[1].trim();

  startDate = moment(startDate, "MMM DD YYYY").format("YYYY-MM-DD");
  endDate = moment(endDate, "MMM DD YYYY").format("YYYY-MM-DD");

  // Condition for finding an expense
  let filter = {
    where: {
      startDate: startDate,
      endDate: endDate,
      financeTypeId: 2,
    },
  };

  const expenseCount = await Finance.count(filter);
  if (expenseCount !== 1) {
    // Check if there is an expense on selected dates
    if (list.length === 0) {
      req.flash("err_message", "Please fill out the form!");
      return res.status(400).send({
        message: "Please fill out the form!",
      });
    }

    let itemizedList = [];

    list.forEach((obj) => {
      convertCatToCatId(obj);
      itemizedList.push(obj);
    });

    // TODO complete the creating an object.
    // We need start date, end date, finance_type,
    //items.
    const expense = {
      startDate: startDate,
      endDate: endDate,
      financeTypeId: 2,
      items: itemizedList,
    };

    Finance.create(expense, {
      include: [Item],
    })
      .then((data) => {
        req.flash("success_message", "New expense is created!");
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Something wrong while creating expense",
        });
      });
  } else {
    req.flash("expense_err_message", "No more expense on these dates!");
    return res.status(400).send({
      message: "No more expense on these dates!",
    });
  }
};

exports.findOne = async (req, res) => {
  let itemizedItems = [];
  let expensesArr = [];

  if (_.isEmpty(req.query)) {
    var expenseData = {};
    console.log(expenseData);

    // Retrieve every expense records to display on the calendar
    const expenses = await Finance.findAll({
      where: {
        financeTypeId: 2,
      },
    });

    Promise.all([expenses])
      .then((responses) => {
        const expenseInsts = responses[0];
        expenseInsts.forEach((expenseInst) => {
          let expenseData = expenseInst.get();
          expensesArr.push(expenseData);
        });
        res.render("pages/expense", {
          expenses: expensesArr,
          expense: expenseData,
          itemizedItems: itemizedItems,
          error: req.flash("expense_err"),
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    let startDate = req.query.start,
      endDate = req.query.end;

    startDate = moment(startDate, "MM-DD-YYYY").format("YYYY-MM-DD");
    endDate = moment(endDate, "MM-DD-YYYY").format("YYYY-MM-DD");

    // Condition for finding an expense
    let filter = {
      where: {
        startDate: startDate,
        endDate: endDate,
        financeTypeId: 2,
      },
    };

    // Retrieve every expense records to display on the calendar
    const expenses = await Finance.findAll({
      where: {
        financeTypeId: 2,
      },
    });

    // Retrieve one expense to display on edit page
    const expense = await Finance.findOne(filter);

    var expenseData = {};

    startDate = moment(startDate, "YYYY-MM-DD").format("MM-DD-YYYY");
    endDate = moment(endDate, "YYYY-MM-DD").format("MM-DD-YYYY");

    Promise.all([expenses, expense])
      .then((responses) => {
        const expenseInsts = responses[0];
        expenseInsts.forEach((expenseInst) => {
          let expenseData = expenseInst.get();
          expensesArr.push(expenseData);
        });
        const expenseInst = responses[1];
        expenseData = expenseInst.get();
        if (expenseData === null) {
          throw "error";
        }
        return Item.findAll({
          where: { financeId: expenseData.id },
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

          // Convert category id to category string
          convertCatIdToCat(itemData, itemizedItem);

          // Add a new obj to the list
          itemizedItems.push(itemizedItem);
        });

        res.render("pages/expense", {
          expenses: expensesArr,
          expense: expenseData,
          itemizedItems: itemizedItems,
          startDate: startDate,
          endDate: endDate,
          error: req.flash("expense_err"),
        });
      })
      .catch((err) => {
        req.flash("expense_err", "Expense doesn't exist!");
        res.render("pages/expense", {
          expenses: expensesArr,
          expense: expenseData,
          itemizedItems: itemizedItems,
          startDate: startDate,
          endDate: endDate,
          error: req.flash("expense_err"),
        });
      });
  }
};

exports.edit = async (req, res) => {
  let itemizedItems = [];
  let expensesArr = [];
  let startDate = req.query.start,
    endDate = req.query.end;

  startDate = moment(startDate, "MM-DD-YYYY").format("YYYY-MM-DD");
  endDate = moment(endDate, "MM-DD-YYYY").format("YYYY-MM-DD");

  // Retrieve every expense records to display on the calendar
  const expenses = await Finance.findAll({
    where: {
      financeTypeId: 2,
    },
  });

  // Condition for finding an expense
  let filter = {
    where: {
      startDate: startDate,
      endDate: endDate,
      financeTypeId: 2,
    },
  };

  startDate = moment(startDate, "YYYY-MM-DD").format("MM-DD-YYYY");
  endDate = moment(endDate, "YYYY-MM-DD").format("MM-DD-YYYY");

  // Retrieve one expense to display on edit page
  const expense = await Finance.findOne(filter);

  Promise.all([expenses, expense])
    .then((responses) => {
      const expenseInsts = responses[0];
      expenseInsts.forEach((expenseInst) => {
        let expenseData = expenseInst.get();
        expensesArr.push(expenseData);
      });
      const expenseInst = responses[1];
      const expenseData = expenseInst.get();
      if (expenseData === null) {
        throw "error";
      }
      return Item.findAll({
        where: { financeId: expenseData.id },
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

        // Convert category id to category string
        convertCatIdToCat(itemData, itemizedItem);

        // Add a new obj to the list
        itemizedItems.push(itemizedItem);
      });

      res.render("pages/expense/edit", {
        expenses: expensesArr,
        itemizedItems: itemizedItems,
        startDate: startDate,
        endDate: endDate,
        error: req.flash("expense_err"),
        err_message: req.flash("err_message"),
      });
    })
    .catch((err) => {
      req.flash("expense_err", "Expense doesn't exist!");
      res.render("pages/expense/edit", {
        expenses: expensesArr,
        itemizedItems: itemizedItems,
        startDate: startDate,
        endDate: endDate,
        error: req.flash("expense_err"),
        err_message: req.flash("err_message"),
      });
    });
};

var toLower = (word) => {
  return _.toLower(word);
};

var convertCatToCatId = (obj) => {
  delete obj.idx;
  switch (toLower(obj.category)) {
    case toLower("grocery"):
      obj.categoryId = 2;
      delete obj.category;
      break;
    case toLower("rent"):
      obj.categoryId = 3;
      delete obj.category;
      break;
    case toLower("utility"):
      obj.categoryId = 4;
      delete obj.category;
      break;
    case toLower("dine out"):
      obj.categoryId = 5;
      delete obj.category;
      break;
    case toLower("investment"):
      obj.categoryId = 6;
      delete obj.category;
      break;
    case toLower("saving"):
      obj.categoryId = 7;
      delete obj.category;
      break;
    case toLower("alcohol"):
      obj.categoryId = 8;
      delete obj.category;
      break;
    case toLower("leisure"):
      obj.categoryId = 9;
      delete obj.category;
      break;
    case toLower("insurance"):
      obj.categoryId = 10;
      delete obj.category;
      break;
    case toLower("loan"):
      obj.categoryId = 11;
      delete obj.category;
      break;
    case toLower("streaming service"):
      obj.categoryId = 12;
      delete obj.category;
      break;
    case toLower("transportation"):
      obj.categoryId = 13;
      delete obj.category;
      break;
    case toLower("etc"):
      obj.categoryId = 14;
      delete obj.category;
      break;
    default:
  }
};

var convertCatIdToCat = (dbObj, newObj) => {
  switch (dbObj.categoryId) {
    case 1:
      newObj.category = toLower("income");
      break;
    case 2:
      newObj.category = toLower("grocery");
      break;
    case 3:
      newObj.category = toLower("rent");
      break;
    case 4:
      newObj.category = toLower("utility");
      break;
    case 5:
      newObj.category = toLower("dine out");
      break;
    case 6:
      newObj.category = toLower("investment");
      break;
    case 7:
      newObj.category = toLower("saving");
      break;
    case 8:
      newObj.category = toLower("alcohol");
      break;
    case 9:
      newObj.category = toLower("leisure");
      break;
    case 10:
      newObj.category = toLower("insurance");
      break;
    case 11:
      newObj.category = toLower("loan");
      break;
    case 12:
      newObj.category = toLower("streaming service");
      break;
    case 13:
      newObj.category = toLower("transportation");
      break;
    case 14:
      newObj.category = toLower("etc");
      break;
    default:
  }
};
