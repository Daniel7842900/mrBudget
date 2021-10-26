const expenseJson = JSON.parse(expenseData);

$(document).on("click", "#datepicker", function (e) {
  markExpense();

  // Mark budgets when prev btn clicked
  $(".drp-calendar.left").on("click", "th.prev", function (e) {
    markExpense();
  });

  // Let budgets stay marked when dates are clicked
  $(".drp-calendar.left").on("mousedown", "td.available", function (e) {
    markExpense();
  });

  // Mark budgets when next btn clicked
  $(".drp-calendar.right").on("click", "th.next", function (e) {
    markExpense();
  });

  // Let budgets stay marked when dates are clicked
  $(".drp-calendar.right").on("mousedown", "td.available", function (e) {
    markExpense();
  });
});

// Mark budgets
function markExpense() {
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
  expenseJson.forEach((budget) => {
    let start = budget.startDate;
    let end = budget.endDate;

    let startMonth = parseInt(start.split("-")[1], 10);
    let startDate = parseInt(start.split("-")[2], 10);
    let endMonth = parseInt(end.split("-")[1], 10);
    let endDate = parseInt(end.split("-")[2], 10);

    // Check every date of left calendar
    for (let i = 0; i < leftFullDates.length; i++) {
      // Get month and date from the full date
      let leftFullMon = parseInt(leftFullDates[i].split("-")[1], 10);
      let leftFullDate = parseInt(leftFullDates[i].split("-")[2], 10);

      // If start date and end date are in the same month
      //else if start date is on left calendar and end date is on right calendar
      if (leftFullMon === startMonth && leftFullMon === endMonth) {
        // If dates are starting/ending dates
        //else if dates are in between starting/ending dates
        if (leftFullDate === startDate || leftFullDate === endDate) {
          let occupiedEnd = leftDatesDom.get(i);
          $(occupiedEnd).addClass("occupied-end");
        } else if (leftFullDate > startDate && leftFullDate < endDate) {
          let occupiedInRange = leftDatesDom.get(i);
          $(occupiedInRange).addClass("occupied-in-range");
        }
      } else if (leftFullMon === startMonth && leftFullMon !== endMonth) {
        // If date is starting date
        //else if dates are after starting date
        if (leftFullDate === startDate) {
          let occupiedEnd = leftDatesDom.get(i);
          $(occupiedEnd).addClass("occupied-end");
        } else if (leftFullDate > startDate) {
          let occupiedInRange = leftDatesDom.get(i);
          $(occupiedInRange).addClass("occupied-in-range");
        }
      }
    }

    // Check every date of right calendar
    for (let i = 0; i < rightFullDates.length; i++) {
      // Get month and date from the full date
      let rightFullMon = parseInt(rightFullDates[i].split("-")[1], 10);
      let rightFullDate = parseInt(rightFullDates[i].split("-")[2], 10);

      // If start date and end date are in the same month
      //else if start date is on left calendar and end date is on right calendar
      if (rightFullMon === startMonth && rightFullMon === endMonth) {
        // If dates are starting/ending dates
        //else if dates are in between starting/ending dates
        if (rightFullDate === startDate || rightFullDate === endDate) {
          let occupiedEnd = rightDatesDom.get(i);
          $(occupiedEnd).addClass("occupied-end");
        } else if (rightFullDate > startDate && rightFullDate < endDate) {
          let occupiedInRange = rightDatesDom.get(i);
          $(occupiedInRange).addClass("occupied-in-range");
        }
      } else if (rightFullMon !== startMonth && rightFullMon === endMonth) {
        // If date is ending date
        //else if dates are before ending date
        if (rightFullDate === endDate) {
          let occupiedEnd = rightDatesDom.get(i);
          $(occupiedEnd).addClass("occupied-end");
        } else if (rightFullDate < endDate) {
          let occupiedInRange = rightDatesDom.get(i);
          $(occupiedInRange).addClass("occupied-in-range");
        }
      }
    }
  });
}
