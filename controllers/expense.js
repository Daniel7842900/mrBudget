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
  let date = req.body.date,
    list = req.body.list,
    user = req.user;

  let dateArr = date.split("-");
  let startDate = dateArr[0].trim(),
    endDate = dateArr[1].trim();

  startDate = moment(startDate, "MMM DD YYYY").format("YYYY-MM-DD");
  endDate = moment(endDate, "MMM DD YYYY").format("YYYY-MM-DD");

  // Condition for finding an expense
  let filter = {
    where: {
      [Op.or]: [
        // first case, input s is equal or s or e or
        {
          [Op.or]: [
            {
              startDate: {
                [Op.or]: [startDate, endDate],
              },
            },
            {
              endDate: {
                [Op.or]: [startDate, endDate],
              },
            },
          ],
        },
        // second case, input s is smaller than s
        {
          [Op.and]: [
            {
              startDate: {
                [Op.gt]: startDate,
              },
            },
            {
              startDate: {
                [Op.lt]: endDate,
              },
            },
          ],
        },
        //third case, input s is greater than s
        {
          [Op.or]: [
            {
              [Op.and]: [
                {
                  startDate: {
                    [Op.lt]: startDate,
                  },
                },
                {
                  endDate: {
                    [Op.gt]: endDate,
                  },
                },
              ],
            },
            {
              [Op.and]: [
                {
                  startDate: {
                    [Op.lt]: startDate,
                  },
                },
                {
                  endDate: {
                    [Op.gt]: startDate,
                  },
                },
              ],
            },
          ],
        },
      ],
      financeTypeId: 2,
      userId: user.id,
    },
  };

  const expenseCount = await Finance.count(filter);
  if (expenseCount === 0) {
    // Check if there is an expense on selected dates
    if (list.length === 0) {
      req.flash("err_message", "Please fill out the form!");
      return res.status(400).send({
        message: "Please fill out the form!",
      });
    }

    let itemizedList = [];

    // Perform modification on an item object in order to match with db
    list.forEach((obj) => {
      // Delete idx that was used in front-end
      delete obj.idx;

      // Change category & subCategory values to ids
      catToCatId(obj);
      subCatToId(obj);

      itemizedList.push(obj);
    });

    // TODO complete the creating an object.
    // We need start date, end date, finance_type,
    //items.
    const expense = {
      startDate: startDate,
      endDate: endDate,
      financeTypeId: 2,
      userId: user.id,
      items: itemizedList,
    };

    await Finance.create(expense, {
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
  let expensesArr = [];
  let startDate = req.query.start,
    endDate = req.query.end,
    user = req.user;

  startDate = moment(startDate, "MM-DD-YYYY").format("YYYY-MM-DD");
  endDate = moment(endDate, "MM-DD-YYYY").format("YYYY-MM-DD");

  // Retrieve every expense records to display on the calendar
  const expenses = await Finance.findAll({
    where: {
      financeTypeId: 2,
      userId: user.id,
    },
  });

  // Condition for finding an expense
  let filter = {
    where: {
      startDate: startDate,
      endDate: endDate,
      financeTypeId: 2,
      userId: user.id,
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

        // Assign description to a new obj
        itemizedItem.description = itemData["description"];

        // Convert category id & subCategory id to category value & subCategory value
        catIdToCat(itemData, itemizedItem);
        subCatIdToSubCat(itemData, itemizedItem);

        // Add a new obj to the list
        itemizedItems.push(itemizedItem);
      });

      res.render("pages/expense/edit", {
        user: user,
        expenses: expensesArr,
        itemizedItems: itemizedItems,
        startDate: startDate,
        endDate: endDate,
        getCatDisplay: getCatDisplay,
        getSubCatDisplay: getSubCatDisplay,
        error: req.flash("expense_err"),
        err_message: req.flash("err_message"),
      });
    })
    .catch((err) => {
      req.flash("expense_err", "Expense doesn't exist!");
      res.render("pages/expense/edit", {
        user: user,
        expenses: expensesArr,
        itemizedItems: itemizedItems,
        startDate: startDate,
        endDate: endDate,
        getCatDisplay: getCatDisplay,
        getSubCatDisplay: getSubCatDisplay,
        error: req.flash("expense_err"),
        err_message: req.flash("err_message"),
      });
    });
};

// Controller for updating an expense
exports.update = async (req, res) => {
  let date = req.body.date,
    list = req.body.list,
    user = req.user;

  let itemPromises = [];
  let expensesArr = [];
  let dateArr = date.split("-");
  let startDate = dateArr[0].trim(),
    endDate = dateArr[1].trim();

  startDate = moment(startDate, "MMM DD YYYY").format("YYYY-MM-DD");
  endDate = moment(endDate, "MMM DD YYYY").format("YYYY-MM-DD");

  // Validate request
  if (list.length === 0) {
    req.flash("err_message", "Please fill out the form!");
    return res.status(400).send({
      message: "Please fill out the form!",
    });
  }

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

  // Condition for finding a expense
  let filter = {
    where: {
      startDate: startDate,
      endDate: endDate,
      financeTypeId: 2,
      userId: user.id,
    },
  };

  // Retrieve every expense records to display on the calendar
  const expenses = await Finance.findAll({
    where: {
      financeTypeId: 2,
      userId: user.id,
    },
  });

  // Retrieve one expense to display on edit page
  const expense = await Finance.findOne(filter);
  let expenseData;

  // Change the date format to use in URL
  startDate = moment(startDate, "YYYY-MM-DD").format("MM-DD-YYYY");
  endDate = moment(endDate, "YYYY-MM-DD").format("MM-DD-YYYY");

  Promise.all([expenses, expense])
    .then(async (response) => {
      const expenseInsts = response[0];
      expenseInsts.forEach((expenseInst) => {
        let expenseInstData = expenseInst.get();
        expensesArr.push(expenseInstData);
      });
      const expenseInst = response[1];
      expenseData = expenseInst.get();
      if (expenseData === null) {
        throw "error";
      }

      // Delete item records that are associated with the budget
      await Item.destroy({
        where: {
          financeId: expenseData.id,
        },
      });

      // Create items with the given details
      const newItems = await Item.bulkCreate(itemizedList);

      // Associate items with the budget
      await expenseInst.addItems(newItems);

      // Send the response back to front-end
      res.send(itemizedList);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Something wrong while editing expense",
      });
    });
};

// Controller for deleting an expense
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
      financeTypeId: 2,
      userId: user.id,
    },
  };

  const expense = await Finance.findOne(filter);
  const destroyedExpense = await Finance.destroy(filter);

  Promise.all([expense, destroyedExpense])
    .then((response) => {
      const expenseInst = response[0];
      const expenseData = expenseInst.get();
      res.send(expenseData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Something wrong while deleting expense",
      });
    });
};
