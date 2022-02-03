$(function () {
  const budgetJson = JSON.parse(budgetData);
  console.log(budgetJson);
  markFinance(document, "click", "#datepicker", budgetJson);
});
