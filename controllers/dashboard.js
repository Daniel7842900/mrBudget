// Create database connection
const db = require("../models");
const Finance = db.finance;
const Item = db.item;
const moment = require("moment");
const _ = require("lodash");
const { Op } = require("sequelize");
const { sequelize } = require("../models");

// Controller for getting all finance information
exports.findAll = async (req, res) => {
  console.log("this is dashboard findAll controller");
  let user = req.user;
  let monthExpItemArr = [];
  let monthBudItemArr = [];
  let weekExpItemArr = [];
  let weekBudItemArr = [];

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

  console.log("start date of month: " + startDateOfMonth);
  console.log("end date of month: " + endDateOfMonth);
  console.log("start date of week: " + startDateOfWeek);
  console.log("end date of week: " + endDateOfWeek);

  // Find all expense items in the current month
  const monthExpenseItems = await Item.findAll({
    attributes: ["amount", "categoryId"],
    where: {
      financeId: {
        [Op.in]: sequelize.literal(
          `(SELECT f.id FROM finances f
                WHERE f.financeTypeId = 2
                AND f.userId = ${user.id}
                AND f.startDate >= '${startDateOfMonth}'
                AND f.endDate <= '${endDateOfMonth}'
              )`
        ),
      },
    },
  });

  // Find all budget items in the current month
  const monthBudgetItems = await Item.findAll({
    attributes: ["amount", "categoryId"],
    where: {
      financeId: {
        [Op.in]: sequelize.literal(
          `(SELECT f.id FROM finances f
                WHERE f.financeTypeId = 1
                AND f.userId = ${user.id}
                AND f.startDate >= '${startDateOfMonth}'
                AND f.endDate <= '${endDateOfMonth}'
              )`
        ),
      },
    },
  });

  // Find all expense items in the current week
  const weekExpenseItems = await Item.findAll({
    attributes: ["amount", "categoryId"],
    where: {
      financeId: {
        [Op.in]: sequelize.literal(
          `(SELECT f.id FROM finances f
                  WHERE f.financeTypeId = 2
                  AND f.userId = ${user.id}
                  AND f.startDate >= '${startDateOfWeek}'
                  AND f.endDate <= '${endDateOfWeek}'
                )`
        ),
      },
    },
  });

  // Find all budget items in the current week
  const weekBudgetItems = await Item.findAll({
    attributes: ["amount", "categoryId"],
    where: {
      financeId: {
        [Op.in]: sequelize.literal(
          `(SELECT f.id FROM finances f
                  WHERE f.financeTypeId = 1
                  AND f.userId = ${user.id}
                  AND f.startDate >= '${startDateOfWeek}'
                  AND f.endDate <= '${endDateOfWeek}'
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
        // console.log(monthExpItemData);
        monthExpItemArr.push(monthExpItemData);
      });

      // Re-format instances to data format for month budget items
      monthBudItemInsts.forEach((budgetItemInst) => {
        let monthBudItemData = budgetItemInst.get();
        // console.log(monthBudItemData);
        monthBudItemArr.push(monthBudItemData);
      });

      // Re-format instances to data format for week expense items
      weekExpItemInsts.forEach((weekExpItemInst) => {
        let weekExpItemData = weekExpItemInst.get();
        // console.log(weekExpItemData);
        weekExpItemArr.push(weekExpItemData);
      });

      // Re-format instances to data format for week budget items
      weekBudItemInsts.forEach((weekBudgetItemInst) => {
        let weekBudItemData = weekBudgetItemInst.get();
        // console.log(weekBudItemData);
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

        // Convert category id to category
        convertCatIdToCat(monthExpItem);

        // Add formatted item object to a new array
        newMonthExpItemArr.push(monthExpItem);
      });
      console.log("month expense total except income" + monthExpTotal);
      console.log(monthExpTotal);

      // Re-format the month budget objects and put them into a new array
      monthBudItemArr.forEach((monthBudItem) => {
        // Convert category id to category
        convertCatIdToCat(monthBudItem);

        // Add formatted item object to a new array
        newMonthBudItemArr.push(monthBudItem);
      });

      // Get monthly budget income and budget total except "income"
      newMonthBudItemArr.forEach((newBudItem) => {
        if (_.toLower(newBudItem.category) === "income") {
          monthBudIncome += newBudItem.amount;
        } else {
          monthBudTotal += newBudItem.amount;
        }
      });
      console.log("month budget total except income" + monthBudTotal);
      console.log("month budget income: " + monthBudIncome);

      // Create a new associative array with categories and summed up amount on each category for monthly expense
      newMonthExpItemArr.forEach((monthExpNewItem) => {
        // console.log(monthExpNewItem);
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
        // console.log(monthBudNewItem);
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

        // Convert category id to category
        convertCatIdToCat(weekExpItem);

        // Add formatted item object to a new array
        newWeekExpItemArr.push(weekExpItem);
      });
      console.log("week expense total except income: " + weekExpTotal);

      // Re-format the month budget objects and put them into a new array
      weekBudItemArr.forEach((weekBudItem) => {
        // Convert category id to category
        convertCatIdToCat(weekBudItem);

        // Add formatted item object to a new array
        newWeekBudItemArr.push(weekBudItem);
      });

      // Get monthly budget income and budget total except "income"
      newWeekBudItemArr.forEach((newBudItem) => {
        if (_.toLower(newBudItem.category) === "income") {
          weekBudIncome += newBudItem.amount;
        } else {
          weekBudTotal += newBudItem.amount;
        }
      });
      console.log("week budget total except income" + weekBudTotal);
      console.log("week budget income: " + weekBudIncome);

      // Create a new associative array with categories and summed up amount on each category for monthly expense
      newWeekExpItemArr.forEach((weekExpNewItem) => {
        // console.log(weekExpNewItem);
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
        // console.log(weekBudNewItem);
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

var convertCatToCatId = (obj) => {
  delete obj.idx;
  switch (_.toLower(obj.category)) {
    case _.toLower("income"):
      obj.categoryId = 1;
      delete obj.category;
      break;
    case _.toLower("grocery"):
      obj.categoryId = 2;
      delete obj.category;
      break;
    case _.toLower("rent"):
      obj.categoryId = 3;
      delete obj.category;
      break;
    case _.toLower("utility"):
      obj.categoryId = 4;
      delete obj.category;
      break;
    case _.toLower("dine out"):
      obj.categoryId = 5;
      delete obj.category;
      break;
    case _.toLower("investment"):
      obj.categoryId = 6;
      delete obj.category;
      break;
    case _.toLower("saving"):
      obj.categoryId = 7;
      delete obj.category;
      break;
    case _.toLower("alcohol"):
      obj.categoryId = 8;
      delete obj.category;
      break;
    case _.toLower("leisure"):
      obj.categoryId = 9;
      delete obj.category;
      break;
    case _.toLower("insurance"):
      obj.categoryId = 10;
      delete obj.category;
      break;
    case _.toLower("loan"):
      obj.categoryId = 11;
      delete obj.category;
      break;
    case _.toLower("streaming service"):
      obj.categoryId = 12;
      delete obj.category;
      break;
    case _.toLower("transportation"):
      obj.categoryId = 13;
      delete obj.category;
      break;
    case _.toLower("etc"):
      obj.categoryId = 14;
      delete obj.category;
      break;
    default:
  }
};

var convertCatIdToCat = (dbObj) => {
  switch (dbObj.categoryId) {
    case 1:
      dbObj.category = _.toLower("income");
      delete dbObj.categoryId;
      break;
    case 2:
      dbObj.category = _.toLower("grocery");
      delete dbObj.categoryId;
      break;
    case 3:
      dbObj.category = _.toLower("rent");
      delete dbObj.categoryId;
      break;
    case 4:
      dbObj.category = _.toLower("utility");
      delete dbObj.categoryId;
      break;
    case 5:
      dbObj.category = _.toLower("dine out");
      delete dbObj.categoryId;
      break;
    case 6:
      dbObj.category = _.toLower("investment");
      delete dbObj.categoryId;
      break;
    case 7:
      dbObj.category = _.toLower("saving");
      delete dbObj.categoryId;
      break;
    case 8:
      dbObj.category = _.toLower("alcohol");
      delete dbObj.categoryId;
      break;
    case 9:
      dbObj.category = _.toLower("leisure");
      delete dbObj.categoryId;
      break;
    case 10:
      dbObj.category = _.toLower("insurance");
      delete dbObj.categoryId;
      break;
    case 11:
      dbObj.category = _.toLower("loan");
      delete dbObj.categoryId;
      break;
    case 12:
      dbObj.category = _.toLower("streaming service");
      delete dbObj.categoryId;
      break;
    case 13:
      dbObj.category = _.toLower("transportation");
      delete dbObj.categoryId;
      break;
    case 14:
      dbObj.category = _.toLower("etc");
      delete dbObj.categoryId;
      break;
    default:
  }
};
