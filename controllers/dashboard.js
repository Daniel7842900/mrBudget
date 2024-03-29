// Create database connection
const db = require("../models");
const Finance = db.finance;
const Item = db.item;
const moment = require("moment");
const _ = require("lodash");
const { Op } = require("sequelize");
const { sequelize } = require("../models");
const { catIdToCat } = require("./util/convertCategories");

// Controller for getting all finance information
exports.findAll = async (req, res) => {
  let user = req.user;
  let monthExpItemArr = [];
  let monthBudItemArr = [];
  let weekExpItemArr = [];
  let weekBudItemArr = [];
  const budgetTypeId = 1;
  const expenseTypeId = 2;

  // Get local time zone
  let tz = moment.tz.guess();

  // Convert local time zone to date
  let localTime = moment.tz(tz).format("YYYY-MM-DD");
  let parsedLocalTime = moment(localTime, "YYYY-MM-DD");
  let localTime2 = moment.tz(tz).format("YYYY-MM-DD");
  let parsedLocalTime2 = moment(localTime2, "YYYY-MM-DD");

  // Get the start date of the current month
  const startDateOfMonth = parsedLocalTime
    .startOf("month")
    .format("YYYY-MM-DD");

  // Get the end date of the current month
  const endDateOfMonth = parsedLocalTime.endOf("month").format("YYYY-MM-DD");

  // Get the start date of the current week
  const startDateOfWeek = parsedLocalTime2.startOf("week").format("YYYY-MM-DD");

  // Get the end date of the current week
  const endDateOfWeek = parsedLocalTime2.endOf("week").format("YYYY-MM-DD");

  // Find all expense items in the current month
  const monthExpenseItems = await Item.findAll({
    attributes: ["amount", "categoryId"],
    replacements: [expenseTypeId, user.id, startDateOfMonth, endDateOfMonth],
    where: {
      financeId: {
        [Op.in]: sequelize.literal(
          `(SELECT f.id FROM finances f
                WHERE f.financeTypeId = ?
                AND f.userId = ?
                AND f.startDate >= ?
                AND f.endDate <= ?
              )`
        ),
      },
    },
  });

  // Find all budget items in the current month
  const monthBudgetItems = await Item.findAll({
    attributes: ["amount", "categoryId"],
    replacements: [budgetTypeId, user.id, startDateOfMonth, endDateOfMonth],
    where: {
      financeId: {
        [Op.in]: sequelize.literal(
          `(SELECT f.id FROM finances f
                WHERE f.financeTypeId = ?
                AND f.userId = ?
                AND f.startDate >= ?
                AND f.endDate <= ?
              )`
        ),
      },
    },
  });

  // Find all expense items in the current week
  const weekExpenseItems = await Item.findAll({
    attributes: ["amount", "categoryId"],
    replacements: [expenseTypeId, user.id, startDateOfWeek, endDateOfWeek],
    where: {
      financeId: {
        [Op.in]: sequelize.literal(
          `(SELECT f.id FROM finances f
                  WHERE f.financeTypeId = ?
                  AND f.userId = ?
                  AND f.startDate >= ?
                  AND f.endDate <= ?
                )`
        ),
      },
    },
  });

  // Find all budget items in the current week
  const weekBudgetItems = await Item.findAll({
    attributes: ["amount", "categoryId"],
    replacements: [budgetTypeId, user.id, startDateOfWeek, endDateOfWeek],
    where: {
      financeId: {
        [Op.in]: sequelize.literal(
          `(SELECT f.id FROM finances f
                  WHERE f.financeTypeId = ?
                  AND f.userId = ?
                  AND f.startDate >= ?
                  AND f.endDate <= ?
                )`
        ),
      },
    },
  });

  Promise.all([
    monthExpenseItems,
    monthBudgetItems,
    weekExpenseItems,
    weekBudgetItems,
  ])
    .then((response) => {
      const monthExpItemInsts = response[0];
      const monthBudItemInsts = response[1];
      const weekExpItemInsts = response[2];
      const weekBudItemInsts = response[3];

      // Re-format instances to data format for month expense items
      monthExpItemInsts.forEach((monthExpItemInst) => {
        let monthExpItemData = monthExpItemInst.get();
        monthExpItemArr.push(monthExpItemData);
      });

      // Re-format instances to data format for month budget items
      monthBudItemInsts.forEach((budgetItemInst) => {
        let monthBudItemData = budgetItemInst.get();
        monthBudItemArr.push(monthBudItemData);
      });

      // Re-format instances to data format for week expense items
      weekExpItemInsts.forEach((weekExpItemInst) => {
        let weekExpItemData = weekExpItemInst.get();
        weekExpItemArr.push(weekExpItemData);
      });

      // Re-format instances to data format for week budget items
      weekBudItemInsts.forEach((weekBudgetItemInst) => {
        let weekBudItemData = weekBudgetItemInst.get();
        weekBudItemArr.push(weekBudItemData);
      });

      // monthly expense & budget variables
      let monthExpTotal = 0;
      let monthBudTotal = 0;
      let monthBudIncome = 0;
      let newMonthExpItemArr = [];
      let newMonthBudItemArr = [];
      let monthExpByCategory = {};
      let monthBudByCategory = {};

      // weekly expense & budget variables
      let weekExpTotal = 0;
      let weekBudTotal = 0;
      let weekBudIncome = 0;
      let newWeekExpItemArr = [];
      let newWeekBudItemArr = [];
      let weekExpByCategory = {};
      let weekBudByCategory = {};

      // Re-format the month expense objects and put them into a new array
      monthExpItemArr.forEach((monthExpItem) => {
        // Add each amount to monthly expense total
        monthExpTotal += parseFloat(monthExpItem.amount);

        let newMonthExpItem = {};
        newMonthExpItem.amount = monthExpItem.amount;

        // Convert category id to category
        catIdToCat(monthExpItem, newMonthExpItem);

        // Add formatted item object to a new array
        newMonthExpItemArr.push(newMonthExpItem);
      });

      // Re-format the month budget objects and put them into a new array
      monthBudItemArr.forEach((monthBudItem) => {
        let newMonthBudItem = {};
        newMonthBudItem.amount = monthBudItem.amount;

        // Convert category id to category
        catIdToCat(monthBudItem, newMonthBudItem);

        // Add formatted item object to a new array
        newMonthBudItemArr.push(newMonthBudItem);
      });

      // Get monthly budget income and budget total except "income"
      newMonthBudItemArr.forEach((newBudItem) => {
        if (_.toLower(newBudItem.category) === "income") {
          monthBudIncome += newBudItem.amount;
        } else {
          monthBudTotal += newBudItem.amount;
        }
      });

      // Create a new associative array with categories and summed up amount on each category for monthly expense
      newMonthExpItemArr.forEach((monthExpNewItem) => {
        const cat = _.upperFirst(monthExpNewItem.category);
        const amount = monthExpNewItem.amount;

        if (cat in monthExpByCategory) {
          // Add amount on exisiting amount
          monthExpByCategory[cat] = monthExpByCategory[cat] + amount;
        } else {
          // Add category as a new key and amount as a new value
          monthExpByCategory[cat] = cat;
          monthExpByCategory[cat] = amount;
        }
      });

      //  Create a new associative array with categories and summed up amount on each category for monthly budget
      newMonthBudItemArr.forEach((monthBudNewItem) => {
        const cat = _.upperFirst(monthBudNewItem.category);
        const amount = monthBudNewItem.amount;

        if (_.toLower(cat) !== "income") {
          if (cat in monthBudByCategory) {
            // Add amount on exisiting amount
            monthBudByCategory[cat] = monthBudByCategory[cat] + amount;
          } else {
            // Add category as a new key and amount as a new value
            monthBudByCategory[cat] = cat;
            monthBudByCategory[cat] = amount;
          }
        }
      });

      // Re-format the month expense objects and put them into a new array
      weekExpItemArr.forEach((weekExpItem) => {
        // Add each amount to monthly expense total
        weekExpTotal += parseFloat(weekExpItem.amount);

        let newWeekExpItem = {};
        newWeekExpItem.amount = weekExpItem.amount;

        // Convert category id to category
        catIdToCat(weekExpItem, newWeekExpItem);

        // Add formatted item object to a new array
        newWeekExpItemArr.push(newWeekExpItem);
      });

      // Re-format the month budget objects and put them into a new array
      weekBudItemArr.forEach((weekBudItem) => {
        let newWeekBudItem = {};
        newWeekBudItem.amount = weekBudItem.amount;

        // Convert category id to category
        catIdToCat(weekBudItem, newWeekBudItem);

        // Add formatted item object to a new array
        newWeekBudItemArr.push(newWeekBudItem);
      });

      // Get monthly budget income and budget total except "income"
      newWeekBudItemArr.forEach((newBudItem) => {
        if (_.toLower(newBudItem.category) === "income") {
          weekBudIncome += newBudItem.amount;
        } else {
          weekBudTotal += newBudItem.amount;
        }
      });

      // Create a new associative array with categories and summed up amount on each category for monthly expense
      newWeekExpItemArr.forEach((weekExpNewItem) => {
        const cat = _.upperFirst(weekExpNewItem.category);
        const amount = weekExpNewItem.amount;

        if (cat in weekExpByCategory) {
          // Add amount on exisiting amount
          weekExpByCategory[cat] = weekExpByCategory[cat] + amount;
        } else {
          // Add category as a new key and amount as a new value
          weekExpByCategory[cat] = cat;
          weekExpByCategory[cat] = amount;
        }
      });

      //  Create a new associative array with categories and summed up amount on each category for monthly budget
      newWeekBudItemArr.forEach((weekBudNewItem) => {
        const cat = _.upperFirst(weekBudNewItem.category);
        const amount = weekBudNewItem.amount;

        if (_.toLower(cat) !== "income") {
          if (cat in weekBudByCategory) {
            // Add amount on exisiting amount
            weekBudByCategory[cat] = weekBudByCategory[cat] + amount;
          } else {
            // Add category as a new key and amount as a new value
            weekBudByCategory[cat] = cat;
            weekBudByCategory[cat] = amount;
          }
        }
      });

      // let keys = Object.keys(monthBudByCategory);
      // console.log(keys);

      // let values = Object.values(monthBudByCategory);
      // console.log(values);

      res.render("pages/dashboard", {
        user: user,
        monthExpTotal: monthExpTotal,
        monthExpCat: monthExpByCategory,
        monthBudTotal: monthBudTotal,
        monthBudIncome: monthBudIncome,
        monthBudCat: monthBudByCategory,
        weekExpTotal: weekExpTotal,
        weekExpCat: weekExpByCategory,
        weekBudTotal: weekBudTotal,
        weekBudIncome: weekBudIncome,
        weekBudCat: weekBudByCategory,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
