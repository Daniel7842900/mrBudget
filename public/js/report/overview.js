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

  onClickCategoryFilter("expense");
  onClickCategoryFilter("budget");

  // onClickCategoryExpand("expense", false, expenseByCat);
  // onClickCategoryYear("expense", expenseByCat);

  onClickCategoryYear("expense", expenseByCat);
  onClickCategoryExpand("expense", false, expenseByCat);

  onClickCategoryYear("budget", budgetByCat);
  onClickCategoryExpand("budget", false, budgetByCat);

  // onClickCategoryYear(curYrExpenseByCat, oneYrExpenseByCat, twoYrExpenseByCat);

  // onClickCategoryExpand("budget", false);
});
