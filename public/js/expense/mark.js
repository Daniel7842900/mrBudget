$(function () {
  const expenseJson = JSON.parse(expenseData);
  markFinance(document, "click", "#datepicker", expenseJson);
});
