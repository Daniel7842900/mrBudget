$(document).ready(function () {
  $("#datepicker").on("apply.daterangepicker", function (ev, picker) {
    // console.log($(this));
    // console.log($(this).val());
    let date = $(this).val().trim();

    let dateArr = date.split("-");
    let startDate = dateArr[0].trim(),
      endDate = dateArr[1].trim();

    startDate = moment(startDate, "MMM DD YYYY").format("MM-DD-YYYY");
    endDate = moment(endDate, "MMM DD YYYY").format("MM-DD-YYYY");

    window.location.href = "/budget?start=" + startDate + "&end=" + endDate;
  });
});
