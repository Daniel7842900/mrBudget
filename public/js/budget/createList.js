$(function () {
  // Onclick event for adding an object to the list
  onClickAdd("#summary_data", "#add_btn", "click", "budget", catMap, list, idx);

  // Onclick event for removing an object to the list
  onClickRemove("#summary_data", ".remove_btn", "click", "budget", list, idx);

  // Onclick event for submiting the list
  onClickSubmit("#submit_btn", "click", "budget", list, true);
});
