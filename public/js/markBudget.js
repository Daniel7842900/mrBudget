const budgetJson = JSON.parse(budgetData);

$(document).on("click", "#datepicker", function (e) {
  console.log("triggered?");
  let monYrsDom = $("thead").find("th.month");
  let monYrs = [];
  let leftMonth, leftYear, rightMonth, rightYear;

  monYrsDom.each(function (i, obj) {
    monYrs.push($(this).text());
  });

  leftMonth = monYrs[0].split(" ")[0];
  leftYear = monYrs[0].split(" ")[1];
  rightMonth = monYrs[1].split(" ")[0];
  rightYear = monYrs[1].split(" ")[1];

  let leftDatesDom = $("body div.drp-calendar.left")
    .find("td.available")
    .not("td.off");

  let leftDates = [];

  let rightDatesDom = $("div.drp-calendar.right")
    .find("td.available")
    .not("td.off");
  let rightDates = [];

  // Left calendar dates
  leftDatesDom.each(function (index) {
    let date = $(this).text();
    $(this).attr("data-date", date);
    leftDates.push(date);
  });

  // Right calendar dates
  rightDatesDom.each(function () {
    rightDates.push($(this).text());
  });

  let leftFullDates = [];
  let rightFullDates = [];

  leftDates.forEach((day) => {
    let date = leftMonth.concat(" ", day, " ", leftYear);
    date = moment(date, "MMM DD YYYY").format("YYYY-MM-DD");
    // console.log(date);
    leftFullDates.push(date);
  });

  rightDates.forEach((day) => {
    let date = rightMonth.concat(" ", day, " ", rightYear);
    date = moment(date, "MMM DD YYYY").format("YYYY-MM-DD");
    rightFullDates.push(date);
  });

  budgetJson.forEach((budget) => {
    let start = budget.startDate;
    let end = budget.endDate;
    let startMonth = start.split("-")[1];
    let startDate = start.split("-")[2];
    let endMonth = end.split("-")[1];
    let endDate = end.split("-")[2];

    // need to check each dates and if the month and date match.
    for (let i = 0; i < leftFullDates.length - 1; i++) {
      let leftFullDateMon = leftFullDates[i].split("-")[1];
      let leftFullDateDate = leftFullDates[i].split("-")[2];

      if (leftFullDateMon === startMonth) {
        if (leftFullDateDate === startDate || leftFullDateDate === endDate) {
          let occupiedEnd = leftDatesDom.get(i);
          // $(occupiedEnd).removeClass("available");
          $(occupiedEnd).addClass("occupied-end");
        } else if (
          parseInt(leftFullDateDate, 10) > parseInt(startDate, 10) &&
          parseInt(leftFullDateDate, 10) < parseInt(endDate, 10)
        ) {
          let occupiedInRange = leftDatesDom.get(i);
          $(occupiedInRange).addClass("occupied-in-range");
        }
      }
    }

    for (let i = 0; i < rightFullDates.length - 1; i++) {
      let rightFullDateMon = rightFullDates[i].split("-")[1];
      let rightFullDateDate = rightFullDates[i].split("-")[2];
      if (rightFullDateMon === startMonth) {
        if (rightFullDateDate === startDate || rightFullDateDate === endDate) {
          let occupiedEnd = rightDatesDom.get(i);
          // $(occupiedEnd).removeClass("available");
          $(occupiedEnd).addClass("occupied-end");
        } else if (
          parseInt(rightFullDateDate, 10) > parseInt(startDate, 10) &&
          parseInt(rightFullDateDate, 10) < parseInt(endDate, 10)
        ) {
          let occupiedInRange = rightDatesDom.get(i);
          $(occupiedInRange).addClass("occupied-in-range");
        }
      }
    }
  });
  leftDatesDom = [];
  rightDatesDom = [];

  let prev = $("thead").find("th.prev")[0];
  // var event = jQuery.Event("click");
  // event.target = prev;
  // $("body").trigger(event);

  $(document).on("click", prev, function () {
    console.log("prev triggered");
    let monYrsDom = $("thead").find("th.month");
    let monYrs = [];
    let leftMonth, leftYear, rightMonth, rightYear;

    monYrsDom.each(function (i, obj) {
      monYrs.push($(this).text());
    });

    leftMonth = monYrs[0].split(" ")[0];
    leftYear = monYrs[0].split(" ")[1];
    rightMonth = monYrs[1].split(" ")[0];
    rightYear = monYrs[1].split(" ")[1];

    let leftDatesDom = $("body div.drp-calendar.left")
      .find("td.available")
      .not("td.off");

    let leftDates = [];

    let rightDatesDom = $("div.drp-calendar.right")
      .find("td.available")
      .not("td.off");
    let rightDates = [];

    // Left calendar dates
    leftDatesDom.each(function (index) {
      let date = $(this).text();
      $(this).attr("data-date", date);
      leftDates.push(date);
    });

    // Right calendar dates
    rightDatesDom.each(function () {
      rightDates.push($(this).text());
    });

    let leftFullDates = [];
    let rightFullDates = [];

    leftDates.forEach((day) => {
      let date = leftMonth.concat(" ", day, " ", leftYear);
      date = moment(date, "MMM DD YYYY").format("YYYY-MM-DD");
      // console.log(date);
      leftFullDates.push(date);
    });

    rightDates.forEach((day) => {
      let date = rightMonth.concat(" ", day, " ", rightYear);
      date = moment(date, "MMM DD YYYY").format("YYYY-MM-DD");
      rightFullDates.push(date);
    });

    budgetJson.forEach((budget) => {
      let start = budget.startDate;
      let end = budget.endDate;
      let startMonth = start.split("-")[1];
      let startDate = start.split("-")[2];
      let endMonth = end.split("-")[1];
      let endDate = end.split("-")[2];

      // need to check each dates and if the month and date match.
      for (let i = 0; i < leftFullDates.length - 1; i++) {
        let leftFullDateMon = leftFullDates[i].split("-")[1];
        let leftFullDateDate = leftFullDates[i].split("-")[2];

        if (leftFullDateMon === startMonth) {
          if (leftFullDateDate === startDate || leftFullDateDate === endDate) {
            let occupiedEnd = leftDatesDom.get(i);
            // $(occupiedEnd).removeClass("available");
            $(occupiedEnd).addClass("occupied-end");
          } else if (
            parseInt(leftFullDateDate, 10) > parseInt(startDate, 10) &&
            parseInt(leftFullDateDate, 10) < parseInt(endDate, 10)
          ) {
            let occupiedInRange = leftDatesDom.get(i);
            $(occupiedInRange).addClass("occupied-in-range");
          }
        }
      }

      for (let i = 0; i < rightFullDates.length - 1; i++) {
        let rightFullDateMon = rightFullDates[i].split("-")[1];
        let rightFullDateDate = rightFullDates[i].split("-")[2];
        if (rightFullDateMon === startMonth) {
          if (
            rightFullDateDate === startDate ||
            rightFullDateDate === endDate
          ) {
            let occupiedEnd = rightDatesDom.get(i);
            // $(occupiedEnd).removeClass("available");
            $(occupiedEnd).addClass("occupied-end");
          } else if (
            parseInt(rightFullDateDate, 10) > parseInt(startDate, 10) &&
            parseInt(rightFullDateDate, 10) < parseInt(endDate, 10)
          ) {
            let occupiedInRange = rightDatesDom.get(i);
            $(occupiedInRange).addClass("occupied-in-range");
          }
        }
      }
    });
    leftDatesDom = [];
    rightDatesDom = [];
  });
});
