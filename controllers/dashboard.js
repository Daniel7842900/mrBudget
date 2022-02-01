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

  // Get local time zone
  let tz = moment.tz.guess();

  // Convert local time zone to date
  let localTime = moment.tz(tz).format("YYYY-MM-DD");
  let parsedLocalTime = moment(localTime, "YYYY-MM-DD");

  // Get the start date of the current month
  const startDateOfCurrentMonth = parsedLocalTime
    .startOf("month")
    .format("YYYY-MM-DD");

  // Get the end date of the current month
  const endDateOfCurrentMonth = parsedLocalTime
    .endOf("month")
    .format("YYYY-MM-DD");

  console.log(parsedLocalTime.startOf("month").format("YYYY-MM-DD"));
  console.log(parsedLocalTime.endOf("month").format("YYYY-MM-DD"));
  //month expense - how much we spent in this month.
  //month expense - how much we spent on each category this month.
  //month budget - how much we predicted in this month.
  //month budget - how much we predicted on each category this month.
  // we are essentially grabing only items using finance ids.
  //from here, we can sum the total -> the total amount of expense or budget for the month.
  //we can also group by category id and then this would be used on pie chart.

  // Find all expense items in the current month
  const monthExpenseItems = await Item.findAll({
    attributes: ["amount", "categoryId"],
    where: {
      financeId: {
        [Op.in]: sequelize.literal(
          `(SELECT f.id FROM finances f
                WHERE f.financeTypeId = 2
                AND f.userId = ${user.id}
                AND f.startDate >= '${startDateOfCurrentMonth}'
                AND f.endDate <= '${endDateOfCurrentMonth}'
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
                AND f.startDate >= '${startDateOfCurrentMonth}'
                AND f.endDate <= '${endDateOfCurrentMonth}'
              )`
        ),
      },
    },
  });

  Promise.all([monthExpenseItems, monthBudgetItems])
    .then((response) => {
      const monthExpItemInsts = response[0];
      const monthBudItemInsts = response[1];
      // console.log("this is month expense item insts:");
      // console.log(monthExpItemInsts);

      // console.log("this is month budget item insts");
      // console.log(monthBudItemInsts);

      monthExpItemInsts.forEach((monthExpItemInst) => {
        let monthExpItemData = monthExpItemInst.get();
        // console.log(monthExpItemData);
        monthExpItemArr.push(monthExpItemData);
      });

      monthBudItemInsts.forEach((budgetItemInst) => {
        let monthBudItemData = budgetItemInst.get();
        // console.log(monthBudItemData);
        monthBudItemArr.push(monthBudItemData);
      });

      let monthExpTotal = 0;
      let monthBudTotal = 0;
      let monthBudIncome = 0;
      let newMonthExpItemArr = [];
      let newMonthBudItemArr = [];
      let monthExpByCategory = {};
      let monthBudByCategory = {};

      // Re-format the month expense objects and put them into a new array
      monthExpItemArr.forEach((monthExpItem) => {
        let monthExpNewItem = {};
        monthExpTotal += monthExpItem.amount;

        monthExpNewItem.amount = parseFloat(monthExpItem.amount);

        convertCatIdToCat(monthExpItem, monthExpNewItem);

        newMonthExpItemArr.push(monthExpNewItem);
      });
      console.log("month expense total except income" + monthExpTotal);
      console.log(monthExpTotal);

      // Re-format the month budget objects and put them into a new array
      monthBudItemArr.forEach((monthBudItem) => {
        let monthBudNewItem = {};
        monthBudNewItem.amount = parseFloat(monthBudItem.amount);
        convertCatIdToCat(monthBudItem, monthBudNewItem);
        newMonthBudItemArr.push(monthBudNewItem);
      });

      newMonthBudItemArr.forEach((newBudItem) => {
        if (_.toLower(newBudItem.category) === "income") {
          monthBudIncome += newBudItem.amount;
        } else {
          monthBudTotal += newBudItem.amount;
        }
      });
      console.log("month budget total except income" + monthBudTotal);
      console.log("month budget income: " + monthBudIncome);

      newMonthExpItemArr.forEach((monthExpNewItem) => {
        // console.log(monthExpNewItem);
        const cat = monthExpNewItem.category;
        const amount = monthExpNewItem.amount;
        if (cat in monthExpByCategory) {
          monthExpByCategory[cat] = monthExpByCategory[cat] + amount;
        } else {
          monthExpByCategory[cat] = cat;
          monthExpByCategory[cat] = amount;
        }
      });

      newMonthBudItemArr.forEach((monthBudNewItem) => {
        // console.log(monthBudNewItem);
        const cat = _.upperFirst(monthBudNewItem.category);
        const amount = monthBudNewItem.amount;
        if (_.toLower(cat) !== "income") {
          if (cat in monthBudByCategory) {
            monthBudByCategory[cat] = monthBudByCategory[cat] + amount;
          } else {
            monthBudByCategory[cat] = cat;
            monthBudByCategory[cat] = amount;
          }
        }
      });

      let keys = Object.keys(monthBudByCategory);
      console.log(keys);

      let values = Object.values(monthBudByCategory);
      console.log(values);

      res.render("pages/dashboard", {
        user: user,
        monthExpTotal: monthExpTotal,
        monthExpCat: monthExpByCategory,
        monthBudTotal: monthBudTotal,
        monthBudIncome: monthBudIncome,
        monthBudCat: monthBudByCategory,
      });
    })
    .catch((err) => {
      console.log(err);
    });

  //   const weekExpenses = await Finance.findAll({
  //     where: {
  //       financeType: 2,
  //       userId: user.id,
  //     },
  //   });

  //week expense - how much we spent in this week.
  //week expense - how much we spent on each category this week.
  //week budget - how much we predicted in this week.
  //week budget - how much we predicted on each category this week.

  // console.log("we are at dashboard!");
  // res.sendFile(__dirname + "/views/pages/dashboard/index.html");
  // console.log("Cookies: ", req.cookies);
  console.log("session: ", req.session);
  // console.log("passport: ", req.session.passport);
  // res.render("pages/dashboard", {
  //   user: user,
  // });
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

var convertCatIdToCat = (dbObj, newObj) => {
  switch (dbObj.categoryId) {
    case 1:
      newObj.category = _.toLower("income");
      break;
    case 2:
      newObj.category = _.toLower("grocery");
      break;
    case 3:
      newObj.category = _.toLower("rent");
      break;
    case 4:
      newObj.category = _.toLower("utility");
      break;
    case 5:
      newObj.category = _.toLower("dine out");
      break;
    case 6:
      newObj.category = _.toLower("investment");
      break;
    case 7:
      newObj.category = _.toLower("saving");
      break;
    case 8:
      newObj.category = _.toLower("alcohol");
      break;
    case 9:
      newObj.category = _.toLower("leisure");
      break;
    case 10:
      newObj.category = _.toLower("insurance");
      break;
    case 11:
      newObj.category = _.toLower("loan");
      break;
    case 12:
      newObj.category = _.toLower("streaming service");
      break;
    case 13:
      newObj.category = _.toLower("transportation");
      break;
    case 14:
      newObj.category = _.toLower("etc");
      break;
    default:
  }
};
