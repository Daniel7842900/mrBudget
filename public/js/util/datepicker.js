const urlParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlParams.entries());

if (_.isEmpty(params)) {
  $("#datepicker").daterangepicker({
    locale: {
      format: "MMM DD YYYY",
    },

    // function() {
    //   $("#datepicker").on("click", function () {
    //     $(".daterangepicker").removeAttr("style");
    //   });
    // },
  });
  $("#datepicker").on("click", function () {
    $(".daterangepicker").removeAttr("style");
    $(".daterangepicker").css({
      top: "626px",
      left: "182px",
      right: "auto",
      display: "flex",
      "flex-direction": "column",
      height: "50%",
      width: "63%",
    });
  });
  // let data = $("#datepicker").data("daterangepicker");
  // console.log(data);
  // $(".daterangepicker").css("display", "flex");
} else {
  let start = params.start;
  let end = params.end;

  start = moment(start, "MM-DD-YYYY").format("MMM DD YYYY");
  end = moment(end, "MM-DD-YYYY").format("MMM DD YYYY");

  // Display the chosen dates inside the input field
  $("#datepicker").daterangepicker({
    startDate: start,
    endDate: end,
    locale: {
      format: "MMM DD YYYY",
    },
  });
  $("#datepicker").on("click", function () {
    $(".daterangepicker").removeAttr("style");
    $(".daterangepicker").css({
      top: "626px",
      left: "182px",
      right: "auto",
      display: "flex",
      "flex-direction": "column",
      height: "50%",
      width: "63%",
    });
  });
  // $(".daterangepicker").css("display", "flex");
}
