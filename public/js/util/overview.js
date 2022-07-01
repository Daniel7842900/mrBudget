let onClickOverview = (
  overviewType,
  isClicked,
  overviewDataObj,
  monthMap,
  totalIncome,
  totalExpense
) => {
  //   isClicked = false;
  $(`#${overviewType}-expand`).on("click", function (e) {
    e.preventDefault();
    $(`#${overviewType}-detail`).empty();
    if (!isClicked) {
      $(`#${overviewType}-expand`).text("Collapse");
      let curYear = moment().year();

      // Convert an object to map
      const overviewData = new Map(Object.entries(overviewDataObj));

      // Get each month's amount in curYear and display them
      for (let [key, value] of overviewData.entries()) {
        const month = monthMap.get(parseInt(key));
        let newValue = "";
        if (!(typeof value === "string")) {
          value = _.round(value, 2);
          newValue = "$" + value;
        } else {
          newValue = value + "";
        }
        const $div = $("<div>");
        $div.append($("<span>", { text: month + " " + curYear }));
        $div.append($("<span>", { text: newValue }).addClass("float-right"));
        $(`#${overviewType}-detail`).append($div);
      }
      isClicked = true;
    } else {
      $(`#${overviewType}-expand`).text("View all");

      // Get total in curYear and display it
      let total = 0;
      if (overviewType == "cashflow") {
        total = totalIncome - totalExpense;
      } else if (overviewType == "expense") {
        total = totalExpense;
      } else {
        total = totalIncome;
      }
      $(`#${overviewType}-detail`).append($("<span>", { text: "Total" }));
      $(`#${overviewType}-detail`).append(
        $("<span>", { text: "$" + _.round(total, 2) }).addClass("float-right")
      );
      isClicked = false;
    }
  });
};
