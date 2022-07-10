// Create database connection
const db = require("../models");
const Finance = db.finance;
const Item = db.item;
const moment = require("moment");
const _ = require("lodash");
const { Op, QueryTypes } = require("sequelize");
const { sequelize } = require("../models");
const { catIdToCat } = require("./util/convertCategories");

exports.findAll = async (req, res) => {
  let user = req.user;
  const budgetTypeId = 1;
  const expenseTypeId = 2;
  let curYear = moment().year();
  let curYrExpenseByCat = [];
  let oneYrExpenseByCat = [];
  let twoYrExpenseByCat = [];
  let curYrBudgetByCat = [];
  let oneYrBudgetByCat = [];
  let twoYrBudgetByCat = [];
  let curYrExpenseBySubCat = [];
  let oneYrExpenseBySubCat = [];
  let twoYrExpenseBySubCat = [];
  let curYrBudgetBySubCat = [];
  let oneYrBudgetBySubCat = [];
  let twoYrBudgetBySubCat = [];
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

  // Get the sum of each category for expenses within 3 years
  const expenseByCat = await sequelize.query(
    `
    SELECT sum(i.amount) AS total, c.type AS category, YEAR(f.startDate) AS year FROM items i
    JOIN finances f
    ON i.financeId = f.id
    LEFT JOIN categories c
    ON i.categoryId = c.id
    where f.userId = ?
    AND f.financeTypeId = ?
    AND YEAR(f.startDate) between YEAR(SYSDATE())-2 AND YEAR(SYSDATE())
    GROUP BY i.categoryId, YEAR(f.startDate)
    ORDER BY YEAR(f.startDate) DESC, SUM(i.amount) DESC;`,
    {
      replacements: [user.id, expenseTypeId],
      type: QueryTypes.SELECT,
    }
  );

  // Get the sum of each category for budgets within 3 years
  const budgetByCat = await sequelize.query(
    `
    SELECT sum(i.amount) AS total, c.type AS category, YEAR(f.startDate) AS year FROM items i
    JOIN finances f
    ON i.financeId = f.id
    LEFT JOIN categories c
    ON i.categoryId = c.id
    where f.userId = ?
    AND f.financeTypeId = ?
    AND i.categoryId <> ?
    AND YEAR(f.startDate) between YEAR(SYSDATE())-2 AND YEAR(SYSDATE())
    GROUP BY i.categoryId, YEAR(f.startDate)
    ORDER BY YEAR(f.startDate) DESC, SUM(i.amount) DESC;`,
    {
      replacements: [user.id, budgetTypeId, "1"],
      type: QueryTypes.SELECT,
    }
  );

  // Get the sum of each category for expenses within 3 years
  const expenseBySubCat = await sequelize.query(
    `
      SELECT sum(i.amount) AS total, sc.type AS subcategory, YEAR(f.startDate) AS year FROM items i
      JOIN finances f
      ON i.financeId = f.id
      LEFT JOIN sub_categories sc
      ON i.subCategoryId = sc.id
      where f.userId = ?
      AND f.financeTypeId = ?
      AND i.subCategoryId is not null
      AND YEAR(f.startDate) between YEAR(SYSDATE())-2 AND YEAR(SYSDATE())
      GROUP BY i.subCategoryId, YEAR(f.startDate)
      ORDER BY YEAR(f.startDate) DESC, SUM(i.amount) DESC;`,
    {
      replacements: [user.id, expenseTypeId],
      type: QueryTypes.SELECT,
    }
  );

  // Get the sum of each category for budgets within 3 years
  const budgetBySubCat = await sequelize.query(
    `
      SELECT sum(i.amount) AS total, sc.type AS subcategory, YEAR(f.startDate) AS year FROM items i
      JOIN finances f
      ON i.financeId = f.id
      LEFT JOIN sub_categories sc
      ON i.subCategoryId = sc.id
      where f.userId = ?
      AND f.financeTypeId = ?
      AND i.subCategoryId is not null
      AND YEAR(f.startDate) between YEAR(SYSDATE())-2 AND YEAR(SYSDATE())
      GROUP BY i.subCategoryId, YEAR(f.startDate)
      ORDER BY YEAR(f.startDate) DESC, SUM(i.amount) DESC;`,
    {
      replacements: [user.id, budgetTypeId],
      type: QueryTypes.SELECT,
    }
  );

  // console.log(expenseByCat);
  // console.log(budgetByCat);

  Promise.all([
    totalIncome,
    curYearIncomes,
    totalExpense,
    curYearExpenses,
    expenseByCat,
    budgetByCat,
    expenseBySubCat,
    budgetBySubCat,
  ])
    .then((response) => {
      totalIncomeInsts = response[0];
      curYearIncomesInsts = response[1];
      totalExpenseInsts = response[2];
      curYearExpensesInsts = response[3];
      expenseByCatInsts = response[4];
      budgetByCatInsts = response[5];
      expenseBySubCatInsts = response[6];
      budgetBySubCatInsts = response[7];

      console.log(expenseByCat);
      console.log(budgetByCat);

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

      // Split the array for expense by category into 3 years - current, a year, 2 years ago
      try {
        let expCatIdx = 0;
        while (expenseByCat.length != 0 && expCatIdx < expenseByCat.length) {
          if (expenseByCat[expCatIdx]["year"] == curYear) {
            curYrExpenseByCat.push(expenseByCat[expCatIdx]);
          } else if (expenseByCat[expCatIdx]["year"] == curYear - 1) {
            oneYrExpenseByCat.push(expenseByCat[expCatIdx]);
          } else if (expenseByCat[expCatIdx]["year"] == curYear - 2) {
            twoYrExpenseByCat.push(expenseByCat[expCatIdx]);
          }
          expCatIdx++;
        }
      } catch (error) {
        console.log(error);
      }

      console.log(curYrExpenseByCat);

      // Split the array for expense by category into 3 years - current, a year, 2 years ago
      try {
        let budCatIdx = 0;
        while (budgetByCat.length != 0 && budCatIdx < budgetByCat.length) {
          if (budgetByCat[budCatIdx]["year"] == curYear) {
            curYrBudgetByCat.push(budgetByCat[budCatIdx]);
          } else if (budgetByCat[budCatIdx]["year"] == curYear - 1) {
            oneYrBudgetByCat.push(budgetByCat[budCatIdx]);
          } else if (budgetByCat[budCatIdx]["year"] == curYear - 2) {
            twoYrBudgetByCat.push(budgetByCat[budCatIdx]);
          }
          budCatIdx++;
        }
      } catch (error) {
        console.log(error);
      }

      // Split the array for expense by category into 3 years - current, a year, 2 years ago
      try {
        let expSubCatIdx = 0;
        while (
          expenseBySubCat.length != 0 &&
          expSubCatIdx < expenseBySubCat.length
        ) {
          if (expenseBySubCat[expSubCatIdx]["year"] == curYear) {
            curYrExpenseBySubCat.push(expenseBySubCat[expSubCatIdx]);
          } else if (expenseBySubCat[expSubCatIdx]["year"] == curYear - 1) {
            oneYrExpenseBySubCat.push(expenseBySubCat[expSubCatIdx]);
          } else if (expenseBySubCat[expSubCatIdx]["year"] == curYear - 2) {
            twoYrExpenseBySubCat.push(expenseBySubCat[expSubCatIdx]);
          }
          expSubCatIdx++;
        }
      } catch (error) {
        console.log(error);
      }

      // Split the array for budget by subcategory into 3 years - current, a year, 2 years ago
      try {
        let budSubCatIdx = 0;
        while (
          budgetBySubCat.length != 0 &&
          budSubCatIdx < budgetBySubCat.length
        ) {
          if (budgetBySubCat[budSubCatIdx]["year"] == curYear) {
            curYrBudgetBySubCat.push(budgetBySubCat[budSubCatIdx]);
          } else if (budgetBySubCat[budSubCatIdx]["year"] == curYear - 1) {
            oneYrBudgetBySubCat.push(budgetBySubCat[budSubCatIdx]);
          } else if (budgetBySubCat[budSubCatIdx]["year"] == curYear - 2) {
            twoYrBudgetBySubCat.push(budgetBySubCat[budSubCatIdx]);
          }
          budSubCatIdx++;
        }
      } catch (error) {
        console.log(error);
      }

      // Split the array for expense by category into 3 years - current, a year, 2 years ago
      // try {
      //   let expCatIdx = 0;
      //   while (expenseByCat.length != 0 && expCatIdx < expenseByCat.length) {
      //     if (expenseByCat[expCatIdx]["year"] == curYear) {
      //       curYrExpenseByCat.push(expenseByCat[expCatIdx]);
      //     } else if (expenseByCat[expCatIdx]["year"] == curYear - 1) {
      //       oneYrExpenseByCat.push(expenseByCat[expCatIdx]);
      //     } else if (expenseByCat[expCatIdx]["year"] == curYear - 2) {
      //       twoYrExpenseByCat.push(expenseByCat[expCatIdx]);
      //     }
      //     expCatIdx++;
      //   }
      // } catch (error) {
      //   console.log(error);
      // }

      res.render("pages/report", {
        user: user,
        totalIncomeResult: totalIncome,
        curYearIncomeResult: curYearIncomeResult,
        totalExpenseResult: totalExpense,
        curYearExpenseResult: curYearExpenseResult,
        curYearCashFlowResult: curYearCashFlowResult,
        curYrExpenseByCatResult: curYrExpenseByCat,
        oneYrExpenseByCatResult: oneYrExpenseByCat,
        twoYrExpenseByCatResult: twoYrExpenseByCat,
        curYrBudgetByCatResult: curYrBudgetByCat,
        oneYrBudgetByCatResult: oneYrBudgetByCat,
        twoYrBudgetByCatResult: twoYrBudgetByCat,
        curYrExpenseBySubCatResult: curYrExpenseBySubCat,
        oneYrExpenseBySubCatResult: oneYrExpenseBySubCat,
        twoYrExpenseBySubCatResult: twoYrExpenseBySubCat,
        curYrBudgetBySubCatResult: curYrBudgetBySubCat,
        oneYrBudgetBySubCatResult: oneYrBudgetBySubCat,
        twoYrBudgetBySubCatResult: twoYrBudgetBySubCat,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
