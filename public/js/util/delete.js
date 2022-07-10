// $(function () {
console.log("util delete");
const urlParam = new URLSearchParams(window.location.search);
const param = Object.fromEntries(urlParam.entries());
let start = param.start;
let end = param.end;

let onClickShow = (targetBtn, event, modal) => {
  $(targetBtn).on(event, function () {
    modal.removeClass("hidden");
  });
};

let onClickCancel = (targetBtn, event, modal) => {
  $(targetBtn).on(event, function () {
    modal.addClass("hidden");
  });
};

let onClickConfirm = (targetBtn, event, financeType) => {
  $(targetBtn).on(event, function () {
    let date = $("#datepicker").val();
    $.ajax({
      url: `/${financeType}/delete`,
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
          window.location.assign(`/${financeType}`);
        };
        toastr.success(`The ${financeType} is deleted!`, "Success", {
          timeOut: 1000,
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Redirecting to new budget page again to display
        //error message.
        toastr.error(jqXHR.responseJSON["message"], "Error", {
          timeOut: 1000,
        });
        // window.location.assign("/budget/new");
      },
    });
  });
};
// });
