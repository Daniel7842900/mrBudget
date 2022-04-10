// Create database connection
const db = require("../models");
const Finance = db.finance;
const Item = db.item;
const moment = require("moment");
const _ = require("lodash");
const { Op } = require("sequelize");
const { catToCatId, catIdToCat } = require("./util/convertCategories");
const { subCatToId, subCatIdToSubCat } = require("./util/convertSubcategories");

// Controller for displaying a new budget page
exports.create = async (req, res) => {
  let itemizedItems = [];
  let budgetsArr = [];
  let user = req.user;
  console.log(user);

  // Retrieve every budget records to display on the calendar
  const budgets = await Finance.findAll({
    where: {
      financeTypeId: 1,
      userId: user.id,
    },
  });

  Promise.all([budgets])
    .then((responses) => {
      const budgetInsts = responses[0];
      budgetInsts.forEach((budgetInst) => {
        let budgetData = budgetInst.get();
        budgetsArr.push(budgetData);
      });
      res.render("pages/budget/create", {
        user: user,
        budgets: budgetsArr,
        itemizedItems: itemizedItems,
        err_message: req.flash("err_message"),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Controller for saving a new budget
exports.store = async (req, res) => {
  let date = req.body.date,
    income = parseFloat(req.body.income),
    list = req.body.list,
    user = req.user;

  let dateArr = date.split("-");
  let startDate = dateArr[0].trim(),
    endDate = dateArr[1].trim();

  startDate = moment(startDate, "MMM DD YYYY").format("YYYY-MM-DD");
  endDate = moment(endDate, "MMM DD YYYY").format("YYYY-MM-DD");

  console.log(list);

  // Condition to check if there is already a budget/budgets within the input date range.
  //This filter is to FIND a budget/budgets
  let filter = {
    where: {
      [Op.or]: [
        // first case, input startDate or input endDate is equal to startDate
        //OR input startDate or input endDate is equal to endDate
        {
          [Op.or]: [
            {
              startDate: {
                [Op.or]: [startDate, endDate],
              },
            },
            // {
            //   endDate: {
            //     [Op.or]: [startDate, endDate],
            //   },
            // },
          ],
        },
        // second case, input startDate < startDate < input endDate
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
        // third case, startDate < input startDate AND input endDate < endDate
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
        // forth case, startDate < input startDate AND endDate < input endDate
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
      financeTypeId: 1,
      userId: user.id,
    },
  };

  // Check if there is a budget on selected dates
  const budgetCount = await Finance.count(filter);
  if (budgetCount === 0) {
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

    // TODO there must be better way to do this...
    let itemizedIncome = {
      amount: income,
      category: _.toLower("income"),
      description: _.toLower("income"),
    };

    list.push(itemizedIncome);

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
    const budget = {
      startDate: startDate,
      endDate: endDate,
      financeTypeId: 1,
      userId: user.id,
      items: itemizedList,
    };

    console.log("budget is:");
    console.log(budget);

    await Finance.create(budget, {
      include: [Item],
    })
      .then((data) => {
        req.flash("success_message", "New budget is created!");
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Something wrong while creating budget",
        });
      });
  } else {
    req.flash("budget_err_message", "No more budget on these dates!");
    return res.status(400).send({
      message: "No more budget on these dates!",
    });
  }

  // TODO figure out what these 2 lines mean
  // res.set("Content-Type", "application/json");
  // var jsonData = JSON.stringify(req.body);

  // We should return the resonse otherwise the POST request
  //on client side will get stuck (pending).
  // status 201 is "Created"
  // return res.status(201).json(req.body);
};

// Controller for displaying a budget
exports.findOne = async (req, res) => {
  let itemizedItems = [];
  let budgetsArr = [];
  let user = req.user;

  if (_.isEmpty(req.query)) {
    var budgetData = {};
    console.log(budgetData);

    // Retrieve every budget records to display on the calendar
    const budgets = await Finance.findAll({
      where: {
        financeTypeId: 1,
        userId: user.id,
      },
    });

    Promise.all([budgets])
      .then((responses) => {
        const budgetInsts = responses[0];
        budgetInsts.forEach((budgetInst) => {
          let budgetData = budgetInst.get();
          budgetsArr.push(budgetData);
        });
        res.render("pages/budget", {
          user: user,
          budgets: budgetsArr,
          budget: budgetData,
          itemizedItems: itemizedItems,
          error: req.flash("budget_err"),
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

    var budgetData = {};

    startDate = moment(startDate, "YYYY-MM-DD").format("MM-DD-YYYY");
    endDate = moment(endDate, "YYYY-MM-DD").format("MM-DD-YYYY");

    Promise.all([budgets, budget])
      .then((responses) => {
        const budgetInsts = responses[0];
        budgetInsts.forEach((budgetInst) => {
          let budgetData = budgetInst.get();
          budgetsArr.push(budgetData);
        });
        const budgetInst = responses[1];
        budgetData = budgetInst.get();
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
          console.log(itemData);

          // Assign amount to a new obj
          itemizedItem.amount = parseFloat(itemData["amount"]);

          // Convert category id to category string
          catIdToCat(itemData, itemizedItem);
          subCatIdToSubCat(itemData, itemizedItem);

          // Add a new obj to the list
          itemizedItems.push(itemizedItem);
        });

        res.render("pages/budget", {
          user: user,
          budgets: budgetsArr,
          budget: budgetData,
          itemizedItems: itemizedItems,
          startDate: startDate,
          endDate: endDate,
          error: req.flash("budget_err"),
        });
      })
      .catch((err) => {
        req.flash("budget_err", "Budget doesn't exist!");
        res.render("pages/budget", {
          user: user,
          budgets: budgetsArr,
          budget: budgetData,
          itemizedItems: itemizedItems,
          startDate: startDate,
          endDate: endDate,
          error: req.flash("budget_err"),
        });
      });
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

        // Convert category id to category string
        catIdToCat(itemData, itemizedItem);

        // Add a new obj to the list
        itemizedItems.push(itemizedItem);
      });

      res.render("pages/budget/edit", {
        user: user,
        budgets: budgetsArr,
        itemizedItems: itemizedItems,
        startDate: startDate,
        endDate: endDate,
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
  };

  // Add income obj to the list
  list.push(itemizedIncome);

  // Format the records from db and push it to
  //a new array
  let itemizedList = [];
  list.forEach((obj) => {
    catToCatId(obj);
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
    .then((res) => {
      const budgetInsts = res[0];
      budgetInsts.forEach((budgetInst) => {
        let budgetInstData = budgetInst.get();
        budgetsArr.push(budgetInstData);
      });
      const budgetInst = res[1];
      budgetData = budgetInst.get();
      if (budgetData === null) {
        throw "error";
      }
      return Item.findAll({
        where: { financeId: budgetData.id },
      });
    })
    .then(async (itemInsts) => {
      // Set up the list with items that originally existed in db
      const originalList = [];
      itemInsts.forEach((itemInst) => {
        let itemData = itemInst.get();
        originalList.push(itemData);
      });

      const originalListSize = originalList.length;
      const newListSize = itemizedList.length;

      // If new list is empty send error message
      if (newListSize === 0) {
        req.flash(
          "edit_empty_err_message",
          "Please delete the budget instead of editing!"
        );
        return res.status(400).send({
          message: "Please delete the budget instead of editing!",
        });
      }

      // Compare original list and new list based on new list
      for (let i = 0; i < newListSize; i++) {
        let newItem = itemizedList[i];
        for (let j = 0; j < originalListSize; j++) {
          let oldItem = originalList[j];

          if (newItem.categoryId === oldItem.categoryId) {
            let updateItemProm = await Item.update(
              { amount: newItem.amount },
              {
                where: {
                  financeId: budgetData.id,
                  categoryId: oldItem.categoryId,
                },
              }
            );
            itemPromises.push(updateItemProm);
            break;
          } else if (
            newItem.categoryId !== oldItem.categoryId &&
            j === originalListSize - 1
          ) {
            let createItemProm = await Item.create({
              amount: newItem.amount,
              categoryId: newItem.categoryId,
              financeId: budgetData.id,
            });
            itemPromises.push(createItemProm);
          } else if (
            newItem.categoryId !== oldItem.categoryId &&
            j !== originalListSize - 1
          ) {
          }
        }
      }

      // Compare original list and new list based on original list
      for (let i = 0; i < originalListSize; i++) {
        let oldItem = originalList[i];
        for (let j = 0; j < newListSize; j++) {
          let newItem = itemizedList[j];
          if (oldItem.categoryId === newItem.categoryId) {
            break;
          } else if (
            oldItem.categoryId !== newItem.categoryId &&
            j === newListSize - 1
          ) {
            let itemDestroyProm = await Item.destroy({
              where: {
                categoryId: oldItem.categoryId,
                financeId: budgetData.id,
              },
            });
            itemPromises.push(itemDestroyProm);
          } else if (
            oldItem.categoryId !== newItem.categoryId &&
            j !== newListSize - 1
          ) {
          }
        }
      }

      Promise.all(itemPromises);
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
