$(function () {
  // Month total variables
  const monthTotal = $("#month-total")[0].getContext("2d");
  const monthBudT = JSON.parse(monthBudTotal);
  const monthExpT = JSON.parse(monthExpTotal);
  const monthTotalData = [monthBudT, monthExpT];
  const monthTotalLabels = ["Budget", "Expense"];

  // Month budget category variables
  const monthBudCat = $("#month-budget-category")[0].getContext("2d");
  const monthBudCatData = JSON.parse(monthBudCatJSON);
  const mBudgetCatData = Object.values(monthBudCatData);
  const mBudgetCatLables = Object.keys(monthBudCatData);

  // Month expense category variables
  const monthExpCat = $("#month-expense-category")[0].getContext("2d");
  const monthExpCatData = JSON.parse(monthExpCatJSON);
  const mExpenseCatData = Object.values(monthExpCatData);
  const mExpenseCatLables = Object.keys(monthExpCatData);

  // Create a bar chart for monthly total
  createChart(monthTotal, "bar", monthTotalData, monthTotalLabels);

  // Create a pie chart for monthly budget by category
  createChart(monthBudCat, "pie", mBudgetCatData, mBudgetCatLables, "Budget");

  // Create a pie chart for monthly expense by category
  createChart(
    monthExpCat,
    "pie",
    mExpenseCatData,
    mExpenseCatLables,
    "Expense"
  );
});
