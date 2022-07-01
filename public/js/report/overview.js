$(function () {
  const curYearCashFlow = JSON.parse(curYearCashFlowResult);
  const curYearIncome = JSON.parse(curYearIncomeResult);
  const curYearExpense = JSON.parse(curYearExpenseResult);
  const totalIncome = JSON.parse(totalIncomeResult);
  const totalExpense = JSON.parse(totalExpenseResult);
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
});
