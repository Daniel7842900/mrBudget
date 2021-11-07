$(function () {
  const deleteModal = $("#delete-modal");

  // Onclick event for showing up a modal
  onClickShow("#delete-btn", "click", deleteModal);

  // Onclick event for closing a modal
  onClickCancel(".cancel-btn", "click", deleteModal);

  // Onclick event for confirming/submitting for delete
  onClickConfirm("#confirm-btn", "click", "budget");
});
