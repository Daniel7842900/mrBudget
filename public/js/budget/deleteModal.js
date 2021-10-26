$(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlParams.entries());
  let start = params.start;
  let end = params.end;

  const deleteBtn = $("#delete-btn");
  const deleteModal = $("#delete-modal");
  const cancelBtns = $(".cancel-btn");
  const confirmBtn = $("#confirm-btn");

  deleteBtn.on("click", function () {
    console.log("hello");
    deleteModal.removeClass("hidden");
  });

  cancelBtns.on("click", function () {
    deleteModal.addClass("hidden");
  });

  confirmBtn.on("click", function () {
    let date = $("#datepicker").val();
    $.ajax({
      url: "/budget/delete",
      type: "DELETE",
      dataType: "json",
      data: JSON.stringify({
        date: date,
      }),

      // contentType json is essential to make server
      //understand that data is JSON
      contentType: "application/json",

      // Here, success is a callback function
      //after we get a response from server side
      success: function (res) {
        // Show success toastr message on current page
        //and redirect after 1 second
        toastr.options.onHidden = function () {
          window.location.assign("/budget");
        };
        toastr.success("The budget is deleted!", "Success", { timeOut: 1000 });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Redirecting to new budget page again to display
        //error message.
        toastr.error(jqXHR.responseJSON["message"], "Error", { timeOut: 1000 });
        // window.location.assign("/budget/new");
      },
    });
  });
});
