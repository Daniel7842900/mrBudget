let markFinance = (parentElement, event, targetBtn, data) => {
  $(parentElement).on(event, targetBtn, function (e) {
    highlight(data);

    // Mark finance when prev btn clicked
    $(".drp-calendar.left").on("click", "th.prev", function (e) {
      highlight(data);
    });

    // Let finance stay marked when dates are clicked
    $(".drp-calendar.left").on("mousedown", "td.available", function (e) {
      highlight(data);
    });

    // Mark finance when next btn clicked
    $(".drp-calendar.right").on("click", "th.next", function (e) {
      highlight(data);
    });

    // Let finance stay marked when dates are clicked
    $(".drp-calendar.right").on("mousedown", "td.available", function (e) {
      highlight(data);
    });
  });
};

// Mark finance
function highlight(data) {
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
  leftDatesDom.each(function () {
    let date = $(this).text();
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

  // Go through each finance we get from db
  //TODO find a better way to implement this
  data.forEach((finance) => {
    let start = finance.startDate;
    let end = finance.endDate;

    let startYear = parseInt(start.split("-")[0], 10);
    let startMonth = parseInt(start.split("-")[1], 10);
    let startDate = parseInt(start.split("-")[2], 10);
    let endYear = parseInt(end.split("-")[0], 10);
    let endMonth = parseInt(end.split("-")[1], 10);
    let endDate = parseInt(end.split("-")[2], 10);

    // Check every date of left calendar
    for (let i = 0; i < leftFullDates.length; i++) {
      // Get year, month, and date from the full date
      let leftFullYear = parseInt(leftFullDates[i].split("-")[0], 10);
      let leftFullMon = parseInt(leftFullDates[i].split("-")[1], 10);
      let leftFullDate = parseInt(leftFullDates[i].split("-")[2], 10);

      if (leftFullYear === startYear) {
        // If start date and end date are in the same month
        //else if start date is on left calendar and end date is on right calendar
        if (leftFullMon === startMonth && leftFullMon === endMonth) {
          // If dates are starting/ending dates
          //else if dates are in between starting/ending dates
          if (leftFullDate === startDate || leftFullDate === endDate) {
            if (leftFullDate === startDate && leftFullDate === endDate) {
              let occupiedBoth = leftDatesDom.get(i);
              $(occupiedBoth).addClass("occupied-both");
            } else if (leftFullDate === startDate && leftFullDate !== endDate) {
              let occupiedLeft = leftDatesDom.get(i);
              $(occupiedLeft).addClass("occupied-left");
            } else if (leftFullDate !== startDate && leftFullDate === endDate) {
              let occupiedRight = leftDatesDom.get(i);
              $(occupiedRight).addClass("occupied-right");
            }
          } else if (leftFullDate > startDate && leftFullDate < endDate) {
            let occupiedInRange = leftDatesDom.get(i);
            $(occupiedInRange).addClass("occupied-in-range");
          }
        } else if (leftFullMon === startMonth && leftFullMon !== endMonth) {
          // If date is starting date
          //else if dates are after starting date
          if (leftFullDate === startDate) {
            let occupiedLeft = leftDatesDom.get(i);
            $(occupiedLeft).addClass("occupied-left");
          } else if (leftFullDate > startDate) {
            let occupiedInRange = leftDatesDom.get(i);
            $(occupiedInRange).addClass("occupied-in-range");
          }
        }
      }
    }

    // Check every date of right calendar
    for (let i = 0; i < rightFullDates.length; i++) {
      // Get year, month, and date from the full date
      let rightFullYear = parseInt(rightFullDates[i].split("-")[0], 10);
      let rightFullMon = parseInt(rightFullDates[i].split("-")[1], 10);
      let rightFullDate = parseInt(rightFullDates[i].split("-")[2], 10);

      if (rightFullYear === startYear) {
        // If start date and end date are in the same month
        //else if start date is on left calendar and end date is on right calendar
        if (rightFullMon === startMonth && rightFullMon === endMonth) {
          // If dates are starting/ending dates
          //else if dates are in between starting/ending dates
          if (rightFullDate === startDate || rightFullDate === endDate) {
            if (rightFullDate === startDate && rightFullDate === endDate) {
              let occupiedBoth = rightDatesDom.get(i);
              $(occupiedBoth).addClass("occupied-both");
            } else if (
              rightFullDate === startDate &&
              rightFullDate !== endDate
            ) {
              let occupiedLeft = rightDatesDom.get(i);
              $(occupiedLeft).addClass("occupied-left");
            } else if (
              rightFullDate !== startDate &&
              rightFullDate === endDate
            ) {
              let occupiedRight = rightDatesDom.get(i);
              $(occupiedRight).addClass("occupied-right");
            }
          } else if (rightFullDate > startDate && rightFullDate < endDate) {
            let occupiedInRange = rightDatesDom.get(i);
            $(occupiedInRange).addClass("occupied-in-range");
          }
        } else if (rightFullMon !== startMonth && rightFullMon === endMonth) {
          // If date is ending date
          //else if dates are before ending date
          if (rightFullDate === endDate) {
            let occupiedRight = rightDatesDom.get(i);
            $(occupiedRight).addClass("occupied-right");
          } else if (rightFullDate < endDate) {
            let occupiedInRange = rightDatesDom.get(i);
            $(occupiedInRange).addClass("occupied-in-range");
          }
        }
      }
    }
  });
}
