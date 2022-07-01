// Create database connection
const db = require("../models");
const Finance = db.finance;
const Item = db.item;
const moment = require("moment");
const _ = require("lodash");
const { Op } = require("sequelize");
const { sequelize } = require("../models");
const { catIdToCat } = require("./util/convertCategories");

exports.findAll = async (req, res) => {
  let user = req.user;
  const budgetTypeId = 1;
  const expenseTypeId = 2;
  let curYearIncomeResult = new Map([
    [1, "N/A"],
    [2, "N/A"],
    [3, "N/A"],
    [4, "N/A"],
    [5, "N/A"],
    [6, "N/A"],
    [7, "N/A"],
    [8, "N/A"],
    [9, "N/A"],
    [10, "N/A"],
    [11, "N/A"],
    [12, "N/A"],
  ]);
  let curYearExpenseResult = new Map([
    [1, "N/A"],
    [2, "N/A"],
    [3, "N/A"],
    [4, "N/A"],
    [5, "N/A"],
    [6, "N/A"],
    [7, "N/A"],
    [8, "N/A"],
    [9, "N/A"],
    [10, "N/A"],
    [11, "N/A"],
    [12, "N/A"],
  ]);
  let curYearCashFlowResult = new Map([
    [1, "N/A"],
    [2, "N/A"],
    [3, "N/A"],
    [4, "N/A"],
    [5, "N/A"],
    [6, "N/A"],
    [7, "N/A"],
    [8, "N/A"],
    [9, "N/A"],
    [10, "N/A"],
    [11, "N/A"],
    [12, "N/A"],
  ]);

  // Get the income of all time
  const totalIncome = await Item.sum("amount", {
    replacements: [user.id, budgetTypeId],
    where: {
      financeId: {
        [Op.in]: sequelize.literal(
          `(SELECT f.id FROM finances f
            WHERE f.userId = ?
            AND f.financeTypeId = ?
            )`
        ),
      },
      categoryId: 1,
    },
  });

  // Get the incomes of this year
  const curYearIncomes = await Item.findAll({
    attributes: ["id", "amount", "financeId"],
    replacements: [user.id, budgetTypeId],
    include: [
      {
        model: Finance,
        attributes: ["startDate", "endDate"],
        required: true,
      },
    ],
    where: {
      financeId: {
        [Op.in]: sequelize.literal(
          `(SELECT f.id FROM finances f
            WHERE f.userId = ?
            AND f.financeTypeId = ?
            AND YEAR(f.startDate) = YEAR(SYSDATE())
            )`
        ),
      },
      categoryId: 1,
    },
  });

  // Get total expense of all time
  const totalExpense = await Item.sum("amount", {
    replacements: [user.id, expenseTypeId],
    where: {
      financeId: {
        [Op.in]: sequelize.literal(
          `(SELECT f.id FROM finances f
            WHERE f.userId = ?
            AND f.financeTypeId = ?
            )`
        ),
      },
    },
  });

  // Get the expenses of this year
  const curYearExpenses = await Item.findAll({
    attributes: ["id", "amount", "financeId"],
    replacements: [user.id, expenseTypeId],
    include: [
      {
        model: Finance,
        attributes: ["startDate", "endDate"],
        required: true,
      },
    ],
    where: {
      financeId: {
        [Op.in]: sequelize.literal(
          `(SELECT f.id FROM finances f
              WHERE f.userId = ?
              AND f.financeTypeId = ?
              AND YEAR(f.startDate) = YEAR(SYSDATE())
              )`
        ),
      },
    },
  });

  Promise.all([totalIncome, curYearIncomes, totalExpense, curYearExpenses])
    .then((response) => {
      totalIncomeInsts = response[0];
      curYearIncomesInsts = response[1];
      totalExpenseInsts = response[2];
      curYearExpensesInsts = response[3];

      // Re-format Objects
      const curYearIncomesStr = JSON.stringify(curYearIncomes, null, 2);
      const curYearIncomesObj = JSON.parse(curYearIncomesStr);

      // Process the sum on each month
      for (const income of curYearIncomesObj) {
        let date = moment(income.finance.startDate, "YYYY-MM-DD");
        let month = date.month() + 1;
        if (curYearIncomeResult.has(month)) {
          if (curYearIncomeResult.get(month) === "N/A") {
            // Change the string value to int value first
            curYearIncomeResult.set(month, 0);

            // Add amount based on existing value
            curYearIncomeResult.set(
              month,
              curYearIncomeResult.get(month) + income.amount
            );
          } else {
            // Add amount based on existing value
            curYearIncomeResult.set(
              month,
              curYearIncomeResult.get(month) + income.amount
            );
          }
        }
      }

      // Re-format Objects
      const curYearExpensesStr = JSON.stringify(curYearExpenses, null, 2);
      const curYearExpensesObj = JSON.parse(curYearExpensesStr);

      // Process the sum on each month
      for (const expense of curYearExpensesObj) {
        let date = moment(expense.finance.startDate, "YYYY-MM-DD");
        let month = date.month() + 1;
        if (curYearExpenseResult.has(month)) {
          if (curYearExpenseResult.get(month) === "N/A") {
            // Change the string value to int value first
            curYearExpenseResult.set(month, 0);

            // Add amount based on existing value
            curYearExpenseResult.set(
              month,
              curYearExpenseResult.get(month) + expense.amount
            );
          } else {
            // Add amount based on existing value
            curYearExpenseResult.set(
              month,
              curYearExpenseResult.get(month) + expense.amount
            );
          }
        }
      }

      for (let [key, value] of curYearCashFlowResult) {
        let cashflow;
        // if income is 0 and expense is n/a then 0
        // if income is n/a and expense is n/a then n/a
        // if income is n/a and expense is number then -number
        //
        if (
          !_.isNumber(curYearIncomeResult.get(key)) &&
          !_.isNumber(curYearExpenseResult.get(key))
        ) {
          cashflow = "N/A";
        } else {
          if (!_.isNumber(curYearExpenseResult.get(key))) {
            cashflow = curYearIncomeResult.get(key);
          } else if (!_.isNumber(curYearIncomeResult.get(key))) {
            cashflow = curYearExpenseResult.get(key);
          } else {
            cashflow =
              curYearIncomeResult.get(key) - curYearExpenseResult.get(key);
          }
        }
        curYearCashFlowResult.set(key, cashflow);
      }

      // JSON.stringify and JSON.parse don't work for maps
      //Convert maps to objects
      curYearIncomeResult = Object.fromEntries(curYearIncomeResult);
      curYearExpenseResult = Object.fromEntries(curYearExpenseResult);
      curYearCashFlowResult = Object.fromEntries(curYearCashFlowResult);

      res.render("pages/report", {
        user: user,
        totalIncomeResult: totalIncome,
        curYearIncomeResult: curYearIncomeResult,
        totalExpenseResult: totalExpense,
        curYearExpenseResult: curYearExpenseResult,
        curYearCashFlowResult: curYearCashFlowResult,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
