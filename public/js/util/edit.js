// $(function () {
// For some reasons, variable names urlParams and params break the app.
const urlParam = new URLSearchParams(window.location.search);
const param = Object.fromEntries(urlParam.entries());

let idx = 0;
let itemizedItemsJSON = JSON.parse(itemizedItems);
let start = param.start;
let end = param.end;

// Remove "Income" from the list
for (let i = itemizedItemsJSON.length - 1; i >= 0; i -= 1) {
  if (itemizedItemsJSON[i].category === _.toLower("income")) {
    itemizedItemsJSON.splice(i, 1);
  }
}

itemizedItemsJSON.forEach((itemObj) => {
  // Assign idx to already existing items
  itemObj.idx = idx;
  idx++;
});

let onChangeCategory = (sourceElement, event, targetElement) => {
  $(sourceElement).on(event, function (e) {
    const subCat = $(targetElement);

    subCat.empty().append(function () {
      let output = "";
      const noSubCat = "";

      output += `<option value="">` + noSubCat + "</option>";
      $.each(subCategory[$(sourceElement).val()], function (key, value) {
        output += `<option value="${key}">` + value + "</option>";
      });
      return output;
    });
  });
};

// Onclick event for adding an object to the list
let onClickAdd = (
  parentElement,
  targetBtn,
  event,
  financeType,
  itemizedItemsJSON
) => {
  $(targetBtn).on(event, function (e) {
    e.preventDefault();
    // Create a js object for category & amount
    let obj = {};
    let objCatVal = $("#category").children("option:selected").val();
    let objCatText = $("#category").children("option:selected").text();
    let objSubCatVal = $("#sub-category").children("option:selected").val();
    let objSubCatText = $("#sub-category").children("option:selected").text();
    let displayCat;
    objCatVal = _.toLower(objCatVal);
    objSubCatVal = _.toLower(objSubCatVal);
    let amount = $("#amount").val();
    let description = $("#description").val().trim();

    console.log("cat: " + objCatText);
    console.log("sub: " + objSubCatText);

    // Change the text to number
    amount = parseFloat(amount);

    // Round the number until 2 decimals
    amount = Math.round(amount * 100) / 100;

    if (_.isNaN(amount) === true || amount === 0) {
      // Reset the values after adding
      $("#amount").val("");
      $("#description").val("");

      // Prevent onClick event
      e.preventDefault();

      toastr.warning("Please enter the amount!", "Warning", {
        timeOut: 1000,
      });
      return false;
    } else {
      // if (objSubCatText === "") {
      //   displayCat = objCatText;
      // } else {
      //   displayCat = objSubCatText;
      // }

      obj.idx = idx;
      obj.category = _.startCase(objCatVal);
      obj.subCategory = _.startCase(objSubCatVal);
      obj.amount = amount;
      obj.description = description;
      // obj.displayCat = displayCat;

      // Push the object into the list
      itemizedItemsJSON.push(obj);

      // Reset the values after adding
      // $("#category option:first").prop("selected", true);
      $("#amount").val("");
      $("#description").val("");

      // Increment the index
      idx++;

      // Render table rows using the list that contains js objects.
      //this is done in client-side because we can't pass the list
      //to server-side.
      html = ejs.render(
        `<% list.forEach(function(obj) { %>
                <tr>
                  <td
                    class="
                      px-4
                      py-4
                      whitespace-nowrap
                      text-sm
                      font-medium
                      text-gray-900
                    "
                  >
                  <% if(obj.subCategory === "" || obj.subCategory
                  === undefined) { obj.category =
                  _.startCase(obj.category) %> <%= obj.category %>
                  <% } else { obj.subCategory =
                  _.startCase(obj.subCategory) %> <%=
                  obj.subCategory %> <% } %>
                  </td>
                  <td
                    class="
                      px-4
                      py-4
                      whitespace-nowrap
                      text-sm text-gray-500
                    "
                  >
                    $ <%= obj.amount %>
                  </td>
                  <td
                  scope="col"
                    class="
                      px-4
                      py-4
                      whitespace-nowrap
                      text-sm text-gray-500
                    "
                  >
                    <%= obj.description %>
                  </td>
                  <td
                    class="
                      px-4
                      py-4
                      whitespace-nowrap
                      text-sm text-gray-500
                    "
                  >
                    <button
                      class="
                        inline-flex
                        justify-center
                        py-2
                        px-4
                        border border-transparent
                        shadow-sm
                        text-sm
                        font-medium
                        rounded-md
                        text-white
                        bg-red-500
                        hover:bg-red-700
                        remove_btn
                      "
                      id="remove_btn_<%= obj.idx %>"
                    >
                      X
                    </button>
                  </td>
                </tr>
                <% });%>`,
        { list: itemizedItemsJSON }
      );

      // This is required for re-rendering table body element.
      //if this is not present, it will now show the list of objects
      //that we added above.
      $.get(`/${financeType}/edit?start=${start}&end=${end}`, function () {
        $(parentElement).html(html);
      });
    }
  });
};

// Onclick event for removing an object from the list
let onClickRemove = (
  parentElement,
  targetBtn,
  event,
  financeType,
  itemizedItemsJSON
) => {
  $(parentElement).on(event, targetBtn, function (e) {
    e.preventDefault();
    if (itemizedItemsJSON.length !== 0) {
      let rIdx = parseInt($(this).attr("id").split("_")[2]);
      console.log($(this));
      console.log("ridx: " + rIdx);

      if (rIdx > -1) {
        // Remove the object at index "rIdx"
        itemizedItemsJSON.splice(rIdx, 1);

        // Decrement idx inside of objects by 1
        itemizedItemsJSON.forEach((obj) => {
          console.log("idx: " + obj.idx);
          if (rIdx < obj.idx) {
            obj.idx--;
          }
        });

        // Decrement idx for future adding
        idx--;

        html = ejs.render(
          `<% list.forEach(function(obj) { %>
                <tr>
                  <td
                    class="
                      px-4
                      py-4
                      whitespace-nowrap
                      text-sm
                      font-medium
                      text-gray-900
                    "
                  >
                  <% if(obj.subCategory === "" || obj.subCategory
                  === undefined) { obj.category =
                  _.startCase(obj.category) %> <%= obj.category %>
                  <% } else { obj.subCategory =
                  _.startCase(obj.subCategory) %> <%=
                  obj.subCategory %> <% } %>
                  </td>
                  <td
                    class="
                      px-4
                      py-4
                      whitespace-nowrap
                      text-sm text-gray-500
                    "
                  >
                    $ <%= obj.amount %>
                  </td>
                  <td
                  scope="col"
                    class="
                      px-4
                      py-4
                      whitespace-nowrap
                      text-sm text-gray-500
                    "
                  >
                    <%= obj.description %>
                  </td>
                  <td
                    class="
                      px-4
                      py-4
                      whitespace-nowrap
                      text-sm text-gray-500
                    "
                  >
                    <button
                      class="
                        inline-flex
                        justify-center
                        py-2
                        px-4
                        border border-transparent
                        shadow-sm
                        text-sm
                        font-medium
                        rounded-md
                        text-white
                        bg-red-500
                        hover:bg-red-700
                        remove_btn
                      "
                      id="remove_btn_<%= obj.idx %>"
                    >
                      X
                    </button>
                  </td>
                </tr>
                <% });%>`,
          { list: itemizedItemsJSON }
        );

        $.get(`/${financeType}/edit?start=${start}&end=${end}`, function () {
          $(parentElement).html(html);
        });
      }
    }
  });
};

let onClickSubmit = (
  targetBtn,
  event,
  financeType,
  itemizedItemsJSON,
  incomeExist
) => {
  $(targetBtn).on(event, function (e) {
    let date = $("#datepicker").val();
    let income = incomeExist ? $("#income").val() : null;

    itemizedItemsJSON.forEach((obj) => {
      obj.category = obj.category.trim();
      obj.subCategory = obj.subCategory.trim();
      console.log(obj);
    });

    e.preventDefault();
    $.ajax({
      url: `/${financeType}/edit`,
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        date: date,
        income: income,
        list: itemizedItemsJSON,
      }),

      // contentType json is essential to make server
      //understand that data is JSON
      contentType: "application/json",

      // Here, success is a callback function
      //after we get a response from server side
      success: function (res) {
        // res is data that we get from server side
        //in our case, from controller
        // console.log(res);

        // Show success toastr message on current page
        //and redirect after 1 second
        toastr.options.onHidden = function () {
          window.location.assign(`/${financeType}?start=${start}&end=${end}`);
        };
        toastr.success(`The ${financeType} is edited!`, "Success", {
          timeOut: 1000,
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Redirecting to new budget page again to display
        //error message.
        // TODO research if there is any way to display error
        //message not redirecting
        // window.location.assign("/budget/new");
      },
    });
  });
};

// });
