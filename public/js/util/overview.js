let onClickOverview = (
  overviewType,
  isClicked,
  overviewDataObj,
  monthMap,
  totalIncome,
  totalExpense
) => {
  $(`#${overviewType}-expand`).on("click", function (e) {
    e.preventDefault();
    console.log("clicked");
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

//expenseByCat, budgetByCat
// View all & Collapse details of categories
let onClickCategoryExpand = (financeType, isClicked, expenseByCat) => {
  $(`#${financeType}-category-expand`).on("click", function (e) {
    e.preventDefault();
    $(`#${financeType}-category-detail`).empty();
    let selectedYear = $(`#${financeType}-category-selected-year`)
      .text()
      .trim();
    let curYear = moment().year();
    let yearData = expenseByCat.get(0);
    if (curYear - selectedYear == 0) {
      yearData = expenseByCat.get(0);
    } else if (curYear - selectedYear == 1) {
      yearData = expenseByCat.get(1);
    } else {
      yearData = expenseByCat.get(2);
    }
    if (!isClicked) {
      $(`#${financeType}-category-expand`).text("Collapse");
      yearData.forEach((category) => {
        const $div = $("<div>");
        $div.append($("<span>", { text: category["category"] }));
        $div.append(
          $("<span>", { text: "$" + _.round(category["total"], 2) }).addClass(
            "float-right"
          )
        );
        $(`#${financeType}-category-detail`).append($div);
      });
      isClicked = true;
    } else {
      $(`#${financeType}-category-expand`).text("View all");
      const $div = $("<div>");
      $div.append($("<span>", { text: yearData[0]["category"] }));
      $div.append(
        $("<span>", {
          text: "$" + _.round(yearData[0]["total"], 2),
        }).addClass("float-right")
      );
      $(`#${financeType}-category-detail`).append($div);
      isClicked = false;
    }
  });
};

// Expand year filter
let onClickCategoryFilter = (financeType) => {
  $(`#${financeType}-category-data`).on(
    "click",
    `#${financeType}-category-filter`,
    function (e) {
      console.log("clicked");
      // Prevent onClick event
      // e.preventDefault();
      if ($(`#${financeType}-category-options`).hasClass("hidden")) {
        $(`#${financeType}-category-options`).removeClass("hidden");
      } else {
        $(`#${financeType}-category-options`).addClass("hidden");
      }
    }
  );
};

// Change category data depending on selected year
let onClickCategoryYear = (financeType, expenseByCat) => {
  $(`#${financeType}-category-data`).on(
    "click",
    `#${financeType}-category-options ul li`,
    function (e) {
      let $selectedElement = $(this);
      let curYear = moment().year();
      let selectedYear = $selectedElement.text().trim();
      let yearData = expenseByCat.get(0);
      if (curYear - selectedYear == 0) {
        yearData = expenseByCat.get(0);
      } else if (curYear - selectedYear == 1) {
        yearData = expenseByCat.get(1);
      } else {
        yearData = expenseByCat.get(2);
      }
      // $("#expense-category-selected-year").text(selectedYear);
      $(`#${financeType}-category-options`).addClass("hidden");

      html = ejs.render(
        `<dt
      class="text-md font-medium text-gray-500 truncate mb-3"
    >
    <% let fType = _.upperFirst(financeType); %>
      <span> <%= fType %></span>
      <span class="float-right">
        <div
          id="<%= financeType %>-category-filter"
          class="border-2 border-gray-500 bg-gray-50 text-gray-500 hover:border-cyan-700 text-sm hover:bg-cyan-50 py-1 px-2 rounded-lg"
        >
          <% let thisYear = new Date().getFullYear(); %>
          <div class="hover:text-cyan-700">
            <span id="<%= financeType %>-category-selected-year"
              ><%= selectedYear %></span
            >
            <i class="fas fa-caret-down"></i>
          </div>
        </div>
        <div
          id="<%= financeType %>-category-options"
          class="border-2 rounded-lg border-gray-500 text-gray-500 text-sm text-center hidden"
        >
          <ul>
            <li
              class="hover:text-cyan-900 hover:bg-cyan-50 rounded-lg"
            >
              <%= thisYear;%>
            </li>
            <li
              class="hover:text-cyan-900 hover:bg-cyan-50"
            >
              <%= thisYear-1;%>
            </li>
            <li
              class="hover:text-cyan-900 hover:bg-cyan-50 rounded-lg"
            >
              <%= thisYear-2;%>
            </li>
          </ul>
        </div>
      </span>
    </dt>
    <dd>
      <div class="text-lg font-medium text-gray-900">
        <% if(yearData.length == 0) { %>
        <div class="text-center">
          <span>Not Available!</span>
        </div>
        <% } else { %>
        <div id="<%= financeType %>-category-detail">
          <span
            ><%= yearData[0]["category"]
            %></span
          >
          <span class="float-right"
            >$<%=
            _.round(yearData[0]["total"],2)
            %></span
          >
        </div>
        <% } %>
      </div>
    </dd>`,
        {
          selectedYear: selectedYear,
          yearData: yearData,
          financeType: financeType,
        }
      );

      $.get(`/report`, function () {
        $(`#${financeType}-category-data`).html(html);
      });
    }
  );
};
