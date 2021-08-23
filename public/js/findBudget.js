$(document).ready(function () {
  $("#datepicker").on("apply.daterangepicker", function (ev, picker) {
    let date = $(this).val().trim();
    console.log(date);

    let dateArr = date.split("-");
    let startDate = dateArr[0].trim(),
      endDate = dateArr[1].trim();

    startDate = moment(startDate, "MMM DD YYYY").format("MM-DD-YYYY");
    endDate = moment(endDate, "MMM DD YYYY").format("MM-DD-YYYY");

    console.log("/budget?start=" + startDate + "&end=" + endDate);

    // window.location.href = "/budget?start=" + startDate + "&end=" + endDate;

    // console.log("moved");

    // TODO finish the GET ajax call
    $.ajax({
      url: "/budget?start=" + startDate + "&end=" + endDate,
      type: "GET",
      success: function (data) {
        console.log(data);
        // TODO display income & summary with the given data
        console.log("inside the success");
      },
      error: function () {
        console.log("inside the error");
      },
    });
  });
});
