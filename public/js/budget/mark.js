$(function () {
  const budgetJson = JSON.parse(financeData);
  markFinance(document, "click", "#datepicker", budgetJson);
});
