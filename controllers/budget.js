// Create database connection
const db = require("../models");
const Finance = db.finance;
const Item = db.item;
const moment = require("moment");
const _ = require("lodash");
const jquery = require("jquery");
const toastr = require("toastr");

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

  // itemizedList.forEach((obj) => {
  //   console.log(obj);
  // });

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
        message: err.message || "Something wrong while creating budget",
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

// Controller for displaying a budget
exports.findOne = async (req, res) => {
  let itemizedItems = [];
  let budgetsArr = [];

  if (_.isEmpty(req.query)) {
    // console.log("going into no query param if");

    const budgets = await Finance.findAll({
      where: {
        financeTypeId: 1,
      },
    });

    Promise.all([budgets])
      .then((responses) => {
        const budgetInsts = responses[0];
        budgetInsts.forEach((budgetInst) => {
          let budgetData = budgetInst.get();
          // console.log(budgetData);
          budgetsArr.push(budgetData);
        });
        res.render("pages/budget", {
          budgets: budgetsArr,
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

    const budgets = await Finance.findAll({
      where: {
        financeTypeId: 1,
      },
    });

    startDate = moment(startDate, "YYYY-MM-DD").format("MM-DD-YYYY");
    endDate = moment(endDate, "YYYY-MM-DD").format("MM-DD-YYYY");

    const budget = await Finance.findOne({
      where: { startDate: startDate, endDate: endDate },
    });

    Promise.all([budgets, budget])
      .then((responses) => {
        // console.log("going in?");
        // console.log(responses[0]);
        // console.log(responses[1]);

        const budgetInsts = responses[0];
        budgetInsts.forEach((budgetInst) => {
          let budgetData = budgetInst.get();
          // console.log(budgetData);
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
        // console.log("reaching here?");
        res.render("pages/budget", {
          budgets: budgetsArr,
          itemizedItems: itemizedItems,
          startDate: startDate,
          endDate: endDate,
          error: req.flash("budget_err"),
        });
      })
      .catch((err) => {
        req.flash("budget_err", "Budget doesn't exist!");
        res.render("pages/budget", {
          budgets: budgetsArr,
          itemizedItems: itemizedItems,
          startDate: startDate,
          endDate: endDate,
          error: req.flash("budget_err"),
        });
      });

    // Finance.findOne({
    //   where: { startDate: startDate, endDate: endDate },
    // })
    //   .then((budgetInst) => {
    //     // console.log(budgetInst);
    //     return budgetInst.get();
    //   })
    //   .then((budgetData) => {
    //     if (budgetData === null) {
    //       throw "error";
    //     }
    //     return Item.findAll({
    //       where: { financeId: budgetData.id },
    //     });
    //   })
    //   .then((items) => {
    //     // console.log(items);
    //     items.forEach((element) => {
    //       let itemizedItem = {};
    //       // console.log(element);
    //       itemizedItem.amount = element.dataValues.amount;
    //       switch (element.dataValues.categoryId) {
    //         case 1:
    //           itemizedItem.category = "Income";
    //           break;
    //         case 2:
    //           itemizedItem.category = "Grocery";
    //           break;
    //         case 3:
    //           itemizedItem.category = "Rent";
    //           break;
    //         case 4:
    //           itemizedItem.category = "Utility";
    //           break;
    //         case 5:
    //           itemizedItem.category = "Dineout";
    //           break;
    //         case 6:
    //           itemizedItem.category = "Investment";
    //           break;
    //         case 7:
    //           itemizedItem.category = "Saving";
    //           break;
    //         case 8:
    //           itemizedItem.category = "Alcohol";
    //           break;
    //         case 9:
    //           itemizedItem.category = "Leisure";
    //           break;
    //         case 10:
    //           itemizedItem.category = "Insurance";
    //           break;
    //         case 11:
    //           itemizedItem.category = "Loan";
    //           break;
    //         case 12:
    //           itemizedItem.category = "Streaming Service";
    //           break;
    //         case 13:
    //           itemizedItem.category = "Transportation";
    //           break;
    //         case 14:
    //           itemizedItem.category = "Etc";
    //           break;
    //         default:
    //       }
    //       itemizedItems.push(itemizedItem);
    //     });
    //     console.log("reaching here?");
    //     res.render("pages/budget", {
    //       budgets: budgetsArr,
    //       itemizedItems: itemizedItems,
    //       error: req.flash("budget_err"),
    //     });
    //   })
    //   .catch((err) => {
    //     req.flash("budget_err", "Budget doesn't exist!");
    //     res.render("pages/budget", {
    //       budgets: budgetsArr,
    //       itemizedItems: itemizedItems,
    //       error: req.flash("budget_err"),
    //     });
    //   });
  }
};

exports.edit = async (req, res) => {
  let itemizedItems = [];
  let budgetsArr = [];
  let startDate = req.query.start,
    endDate = req.query.end;

  startDate = moment(startDate, "MM-DD-YYYY").format("YYYY-MM-DD");
  endDate = moment(endDate, "MM-DD-YYYY").format("YYYY-MM-DD");

  // console.log(startDate);
  // console.log(endDate);

  const budgets = await Finance.findAll({
    where: {
      financeTypeId: 1,
    },
  });

  startDate = moment(startDate, "YYYY-MM-DD").format("MM-DD-YYYY");
  endDate = moment(endDate, "YYYY-MM-DD").format("MM-DD-YYYY");

  const budget = await Finance.findOne({
    where: { startDate: startDate, endDate: endDate },
  });

  Promise.all([budgets, budget])
    .then((responses) => {
      // console.log("going in?");
      // console.log(responses[0]);
      // console.log(responses[1]);

      const budgetInsts = responses[0];
      budgetInsts.forEach((budgetInst) => {
        let budgetData = budgetInst.get();
        // console.log(budgetData);
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
      // console.log(itemInsts);
      itemInsts.forEach((itemInst) => {
        let itemizedItem = {};
        const itemData = itemInst.get();
        // console.log(itemData);
        // console.log("trimmed");
        // console.log(element.dataValues.amount);
        // console.log(element.dataValues.amount.trim());
        // console.log("???");
        itemizedItem.amount = parseFloat(itemData["amount"]);
        // console.log("printing amount");
        // if (itemizedItem.amount === "1000") {
        //   console.log("string");
        // } else if (itemizedItem.amount === 1000) {
        //   console.log("number");
        // }
        // console.log(itemizedItem.amount);
        switch (itemData.categoryId) {
          case 1:
            itemizedItem.category = toLower("income");
            break;
          case 2:
            itemizedItem.category = toLower("grocery");
            break;
          case 3:
            itemizedItem.category = toLower("rent");
            break;
          case 4:
            itemizedItem.category = toLower("utility");
            break;
          case 5:
            itemizedItem.category = toLower("dine out");
            break;
          case 6:
            itemizedItem.category = toLower("investment");
            break;
          case 7:
            itemizedItem.category = toLower("saving");
            break;
          case 8:
            itemizedItem.category = toLower("alcohol");
            break;
          case 9:
            itemizedItem.category = toLower("leisure");
            break;
          case 10:
            itemizedItem.category = toLower("insurance");
            break;
          case 11:
            itemizedItem.category = toLower("loan");
            break;
          case 12:
            itemizedItem.category = toLower("streaming service");
            break;
          case 13:
            itemizedItem.category = toLower("transportation");
            break;
          case 14:
            itemizedItem.category = toLower("etc");
            break;
          default:
        }
        itemizedItems.push(itemizedItem);
      });
      // console.log("reaching here?");
      // console.log("itemizedItems are:");
      itemizedItems.forEach((item) => {
        console.log(item);
      });
      res.render("pages/budget/edit", {
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
        budgets: budgetsArr,
        itemizedItems: itemizedItems,
        startDate: startDate,
        endDate: endDate,
        error: req.flash("budget_err"),
        err_message: req.flash("err_message"),
      });
    });

  // res.render("pages/budget/edit", {
  //   err_message: req.flash("err_message"),
  // });
};

exports.update = async (req, res) => {
  // console.log(req.body);
  let date = req.body.date,
    income = parseFloat(req.body.income),
    list = req.body.list;
  let itemPromises = [];
  let budgetsArr = [];

  let dateArr = date.split("-");
  let startDate = dateArr[0].trim(),
    endDate = dateArr[1].trim();

  startDate = moment(startDate, "MMM DD YYYY").format("YYYY-MM-DD");
  endDate = moment(endDate, "MMM DD YYYY").format("YYYY-MM-DD");

  // console.log(startDate);
  // console.log(endDate);
  console.log("this is list from update");
  list.forEach((element) => {
    console.log(element);
  });

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
    category: toLower("income"),
  };

  list.push(itemizedIncome);

  let itemizedList = [];

  list.forEach((obj) => {
    delete obj.idx;
    switch (toLower(obj.category)) {
      case toLower("income"):
        obj.categoryId = 1;
        delete obj.category;
        break;
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
    // console.log("this is obj after assigning cat id?");
    // console.log(obj);
    itemizedList.push(obj);
  });

  console.log("this is itemized list");
  itemizedList.forEach((obj) => {
    console.log(obj);
  });

  //TODO implement the update
  //TODO I need to change the structure so that there can be only one category on each budget.
  let filter = {
    where: {
      startDate: startDate,
      endDate: endDate,
      financeTypeId: 1,
    },
  };

  const budgets = await Finance.findAll({
    where: {
      financeTypeId: 1,
    },
  });

  const budget = await Finance.findOne(filter);
  let budgetData;
  startDate = moment(startDate, "YYYY-MM-DD").format("MM-DD-YYYY");
  endDate = moment(endDate, "YYYY-MM-DD").format("MM-DD-YYYY");

  Promise.all([budgets, budget])
    .then((res) => {
      const budgetInsts = res[0];
      budgetInsts.forEach((budgetInst) => {
        let budgetInstData = budgetInst.get();
        // console.log(budgetData);
        budgetsArr.push(budgetInstData);
      });
      const budgetInst = res[1];
      budgetData = budgetInst.get();
      if (budgetData === null) {
        throw "error";
      }
      console.log(budgetData);
      return Item.findAll({
        where: { financeId: budgetData.id },
      });
    })
    .then(async (itemInsts) => {
      const originalList = [];
      itemInsts.forEach((itemInst) => {
        let itemData = itemInst.get();
        console.log("this is item data");
        console.log(itemData);
        originalList.push(itemData);
      });

      const originalListSize = originalList.length;
      const newListSize = itemizedList.length;

      if (newListSize === 0) {
        req.flash(
          "edit_empty_err_message",
          "Please delete the budget instead of editing!"
        );
        return res.status(400).send({
          message: "Please delete the budget instead of editing!",
        });
      }

      console.log("going through new list");
      for (let i = 0; i < newListSize; i++) {
        let newItem = itemizedList[i];
        console.log("i:" + i);
        for (let j = 0; j < originalListSize; j++) {
          let oldItem = originalList[j];
          console.log("J:" + j);
          if (newItem.categoryId === oldItem.categoryId) {
            console.log("before updating");
            let updateItemProm = await Item.update(
              { amount: newItem.amount },
              {
                where: {
                  financeId: budgetData.id,
                  categoryId: oldItem.categoryId,
                },
              }
            );
            console.log("passing update");
            itemPromises.push(updateItemProm);
            break;
          } else if (
            newItem.categoryId !== oldItem.categoryId &&
            j === originalListSize - 1
          ) {
            console.log("before creating");
            let createItemProm = await Item.create({
              amount: newItem.amount,
              categoryId: newItem.categoryId,
              financeId: budgetData.id,
            });
            console.log("after creating");
            itemPromises.push(createItemProm);
          } else if (
            newItem.categoryId !== oldItem.categoryId &&
            j !== originalListSize - 1
          ) {
          }
        }
      }

      console.log("going through original list");
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
      console.log("before itemPromises");
      Promise.all(itemPromises);
      console.log("after itemPromises");
      req.flash("budget_err", "Budget doesn't exist!");

      //Example of this:
      // if there are 2 deleted rows, 1 updated row, and 1 created row,
      // it will send an array of [[1], [1], {updated row info}, 1]
      //TODO find out if there is any way to send all the detailed info.
      res.send(itemizedList);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Something wrong while editing budget",
      });
    });

  // Finance.create(budget, {
  //   include: [Item],
  // })
  //   .then((data) => {
  //     req.flash("success_message", "New budget is created!");
  //     res.send(data);
  //   })
  //   .catch((err) => {
  //     res.status(500).send({
  //       message: err.message || "Something wrong while creating finance",
  //     });
  //   });

  // TODO figure out what these 2 lines mean
  // res.set("Content-Type", "application/json");
  // var jsonData = JSON.stringify(req.body);

  // We should return the resonse otherwise the POST request
  //on client side will get stuck (pending).
  // status 201 is "Created"
  // return res.status(201).json(req.body);
};

let toLower = (word) => {
  return _.toLower(word);
};
