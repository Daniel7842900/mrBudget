$(function () {
  const curYearCashFlow = JSON.parse(curYearCashFlowResult);
  const curYearIncome = JSON.parse(curYearIncomeResult);
  const curYearExpense = JSON.parse(curYearExpenseResult);
  const totalIncome = JSON.parse(totalIncomeResult);
  const totalExpense = JSON.parse(totalExpenseResult);
  const curYrExpenseByCat = JSON.parse(curYrExpenseByCatResult);
  const oneYrExpenseByCat = JSON.parse(oneYrExpenseByCatResult);
  const twoYrExpenseByCat = JSON.parse(twoYrExpenseByCatResult);

  const curYrBudgetByCat = JSON.parse(curYrBudgetByCatResult);
  const oneYrBudgetByCat = JSON.parse(oneYrBudgetByCatResult);
  const twoYrBudgetByCat = JSON.parse(twoYrBudgetByCatResult);

  const curYrExpenseBySubCat = JSON.parse(curYrExpenseBySubCatResult);
  const oneYrExpenseBySubCat = JSON.parse(oneYrExpenseBySubCatResult);
  const twoYrExpenseBySubCat = JSON.parse(twoYrExpenseBySubCatResult);

  const curYrBudgetBySubCat = JSON.parse(curYrBudgetBySubCatResult);
  const oneYrBudgetBySubCat = JSON.parse(oneYrBudgetBySubCatResult);
  const twoYrBudgetBySubCat = JSON.parse(twoYrBudgetBySubCatResult);

  const expenseByCat = new Map([
    [0, curYrExpenseByCat],
    [1, oneYrExpenseByCat],
    [2, twoYrExpenseByCat],
  ]);

  const budgetByCat = new Map([
    [0, curYrBudgetByCat],
    [1, oneYrBudgetByCat],
    [2, twoYrBudgetByCat],
  ]);

  const expenseBySubCat = new Map([
    [0, curYrExpenseBySubCat],
    [1, oneYrExpenseBySubCat],
    [2, twoYrExpenseBySubCat],
  ]);

  const budgetBySubCat = new Map([
    [0, curYrBudgetBySubCat],
    [1, oneYrBudgetBySubCat],
    [2, twoYrBudgetBySubCat],
  ]);

  const monthMap = new Map([
    [1, "Jan"],
    [2, "Feb"],
    [3, "Mar"],
    [4, "Apr"],
    [5, "May"],
    [6, "Jun"],
    [7, "Jul"],
    [8, "Aug"],
    [9, "Sep"],
    [10, "Oct"],
    [11, "Nov"],
    [12, "Dec"],
  ]);

  onClickOverview(
    "cashflow",
    false,
    curYearCashFlow,
    monthMap,
    totalIncome,
    totalExpense
  );
  onClickOverview(
    "expense",
    false,
    curYearExpense,
    monthMap,
    totalIncome,
    totalExpense
  );
  onClickOverview(
    "income",
    false,
    curYearIncome,
    monthMap,
    totalIncome,
    totalExpense
  );

  onClickCatSubcatFilter("expense", false);
  onClickCatSubcatFilter("budget", false);
  onClickCatSubcatFilter("expense", true);
  onClickCatSubcatFilter("budget", true);

  onClickYear("expense", expenseByCat, expenseBySubCat, false);
  onClickExpand("expense", false, expenseByCat, expenseBySubCat, false);

  onClickYear("budget", budgetByCat, budgetBySubCat, false);
  onClickExpand("budget", false, budgetByCat, budgetBySubCat, false);

  onClickYear("expense", expenseByCat, expenseBySubCat, true);
  onClickExpand("expense", false, expenseByCat, expenseBySubCat, true);

  onClickYear("budget", budgetByCat, budgetBySubCat, true);
  onClickExpand("budget", false, budgetByCat, budgetBySubCat, true);
});
