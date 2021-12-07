$(function () {
  const budgetJson = JSON.parse(budgetData);
  markFinance(document, "click", "#datepicker", budgetJson);
});
