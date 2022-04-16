$(function () {
  // Onchange event for dynamically rendering subcategories
  onChangeCategory("#category", "change", "#sub-category");

  // Onclick event for adding an object to the list
  onClickAdd("#summary_data", "#add_btn", "click", "expense");

  // Onclick event for removing an object to the list
  onClickRemove("#summary_data", ".remove_btn", "click", "expense");

  // Onclick event for submiting the list
  onClickSubmit("#submit_btn", "click", "expense", false);
});
