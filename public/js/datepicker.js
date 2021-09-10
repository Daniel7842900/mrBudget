const urlParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlParams.entries());

if (_.isEmpty(params)) {
  $("#datepicker").daterangepicker({
    locale: {
      format: "MMM DD YYYY",
    },
  });
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
}
