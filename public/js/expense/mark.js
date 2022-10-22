$(function () {
  const expenseJson = JSON.parse(financeData);
  markFinance(document, "click", "#datepicker", expenseJson);
});
