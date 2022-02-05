$(function () {
  // Month total variables
  if ($("#month-total").length) {
    const monthTotal = $("#month-total")[0].getContext("2d");
    const monthBudT = JSON.parse(monthBudTotal);
    const monthExpT = JSON.parse(monthExpTotal);
    const monthTotalData = [monthBudT, monthExpT];
    const monthTotalLabels = ["Budget", "Expense"];

    // Create a bar chart for monthly total
    createChart(monthTotal, "bar", monthTotalData, monthTotalLabels);
  }

  if ($("#month-budget-category").length) {
    // Month budget category variables
    const monthBudCat = $("#month-budget-category")[0].getContext("2d");
    const monthBudCatData = JSON.parse(monthBudCatJSON);
    const mBudgetCatData = Object.values(monthBudCatData);
    const mBudgetCatLables = Object.keys(monthBudCatData);

    // Create a pie chart for monthly budget by category
    createChart(monthBudCat, "pie", mBudgetCatData, mBudgetCatLables, "Budget");
  }

  if ($("#month-expense-category").length) {
    // Month expense category variables
    const monthExpCat = $("#month-expense-category")[0].getContext("2d");
    const monthExpCatData = JSON.parse(monthExpCatJSON);
    const mExpenseCatData = Object.values(monthExpCatData);
    const mExpenseCatLables = Object.keys(monthExpCatData);

    // Create a pie chart for monthly expense by category
    createChart(
      monthExpCat,
      "pie",
      mExpenseCatData,
      mExpenseCatLables,
      "Expense"
    );
  }

  if ($("#week-total").length) {
    // Week total variables
    const weekTotal = $("#week-total")[0].getContext("2d");
    const weekBudT = JSON.parse(weekBudTotal);
    const weekExpT = JSON.parse(weekExpTotal);
    const weekTotalData = [weekBudT, weekExpT];
    const weekTotalLabels = ["Budget", "Expense"];

    // Create a bar chart for weekly total
    createChart(weekTotal, "bar", weekTotalData, weekTotalLabels);
  }

  if ($("#week-budget-category").length) {
    // Week budget category variables
    const weekBudCat = $("#week-budget-category")[0].getContext("2d");
    const weekBudCatData = JSON.parse(weekBudCatJSON);
    const wBudgetCatData = Object.values(weekBudCatData);
    const wBudgetCatLables = Object.keys(weekBudCatData);

    // Create a pie chart for weekly budget by category
    createChart(weekBudCat, "pie", wBudgetCatData, wBudgetCatLables, "Budget");
  }

  if ($("#week-expense-category").length) {
    // Week expense category variables
    const weekExpCat = $("#week-expense-category")[0].getContext("2d");
    const weekExpCatData = JSON.parse(weekExpCatJSON);
    const wExpenseCatData = Object.values(weekExpCatData);
    const wExpenseCatLables = Object.keys(weekExpCatData);

    // Create a pie chart for weekly expense by category
    createChart(
      weekExpCat,
      "pie",
      wExpenseCatData,
      wExpenseCatLables,
      "Expense"
    );
  }
});
