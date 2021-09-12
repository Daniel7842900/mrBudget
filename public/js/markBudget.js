const budgetJson = JSON.parse(budgetData);

$(document).on("click", "#datepicker", function (e) {
  markBudget();

  // Mark budgets when prev btn clicked
  $(".drp-calendar.left").on("click", "th.prev", function (e) {
    markBudget();
  });

  // Mark budgets when next btn clicked
  $(".drp-calendar.right").on("click", "th.next", function (e) {
    markBudget();
  });

  // TODO Mark budgets when any dates are clicked
});

// Mark budgets
function markBudget() {
  // Get the DOM elements of month and year from a calendar
  let monYrsDom = $("thead").find("th.month");
  let monYrs = [];
  let leftDates = [];
  let rightDates = [];
  let leftFullDates = [];
  let rightFullDates = [];
  let leftMonYr, rightMonYr;

  // Store the value of DOM elements of month and year to an array
  monYrsDom.each(function (i, obj) {
    monYrs.push($(this).text());
  });

  leftMonYr = monYrs[0];
  rightMonYr = monYrs[1];

  // Get the DOM elements of dates of left calendar
  let leftDatesDom = $("body div.drp-calendar.left")
    .find("td.available")
    .not("td.off");

  // Get the DOM elements of dates of right calendar
  let rightDatesDom = $("div.drp-calendar.right")
    .find("td.available")
    .not("td.off");

  // Store the value of DOM elements of left calendar dates to an array
  leftDatesDom.each(function (index) {
    let date = $(this).text();
    // $(this).attr("data-date", date);
    leftDates.push(date);
  });

  // Store the value of DOM elements of right calendar dates to an array
  rightDatesDom.each(function () {
    rightDates.push($(this).text());
  });

  // Concatenate month, date, and year of left calendar to one and re-format the date
  leftDates.forEach((day) => {
    let date = day.concat(" ", leftMonYr);
    date = moment(date, "DD MMM YYYY").format("YYYY-MM-DD");
    leftFullDates.push(date);
  });

  // Concatenate month, date, and year of right calendar to one and re-format the date
  rightDates.forEach((day) => {
    let date = day.concat(" ", rightMonYr);
    date = moment(date, "DD MMM YYYY").format("YYYY-MM-DD");
    rightFullDates.push(date);
  });

  // Go through each budget we get from db
  //TODO find a better way to implement this
  budgetJson.forEach((budget) => {
    let start = budget.startDate;
    let end = budget.endDate;
    let startMonth = start.split("-")[1];
    let startDate = start.split("-")[2];
    let endMonth = end.split("-")[1];
    let endDate = end.split("-")[2];

    // Check every date of left calendar
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
}
