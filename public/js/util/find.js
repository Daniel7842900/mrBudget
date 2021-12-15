let findFinance = (targetBtn, event, financeType) => {
  $(targetBtn).on(event, function (ev, picker) {
    let date = $(this).val().trim();

    let dateArr = date.split("-");
    let startDate = dateArr[0].trim(),
      endDate = dateArr[1].trim();

    startDate = moment(startDate, "MMM DD YYYY").format("MM-DD-YYYY");
    endDate = moment(endDate, "MMM DD YYYY").format("MM-DD-YYYY");

    window.location.href =
      `/${financeType}?start=` + startDate + "&end=" + endDate;
  });
};
