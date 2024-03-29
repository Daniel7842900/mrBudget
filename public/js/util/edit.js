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
  itemObj.categoryDisplay = getCatDisplay(itemObj.category);
  if (_.has(itemObj, `subCategory`)) {
    itemObj.subCategoryDisplay = getSubCatDisplay(
      itemObj.category,
      itemObj.subCategory
    );
  }
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
let onClickAdd = (parentElement, targetBtn, event, financeType) => {
  $(targetBtn).on(event, function (e) {
    e.preventDefault();

    /**
     *  Attach display properties again to the existing items
     *  when submit doesn't go through
     *
     */
    if (itemizedItemsJSON.length != 0) {
      itemizedItemsJSON.forEach((entry) => {
        entry.categoryDisplay = getCatDisplay(_.toLower(entry.category));
        entry.subCategoryDisplay = getSubCatDisplay(
          _.toLower(entry.category),
          _.toLower(entry.subCategory)
        );
      });
    }

    // Create a js object for category & amount
    let obj = {};
    let objCat = _.toLower($("#category").children("option:selected").val()),
      objSubCat = _.toLower(
        $("#sub-category").children("option:selected").val()
      ),
      amount = $("#amount").val(),
      description = $("#description").val().trim();
    let objCatDisplay = getCatDisplay(objCat);
    let objSubCatDisplay = getSubCatDisplay(objCat, objSubCat);

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
      obj.idx = idx;
      obj.category = _.startCase(objCat);
      obj.categoryDisplay = objCatDisplay;
      obj.subCategory = _.startCase(objSubCat);
      obj.subCategoryDisplay = objSubCatDisplay;
      obj.amount = amount;
      obj.description = description;

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
                  === undefined || obj.subCategory === null) { %> 
                    <%= obj.categoryDisplay %>
                  <% } else { %> 
                    <%= obj.subCategoryDisplay %> <% } %>
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
let onClickRemove = (parentElement, targetBtn, event, financeType) => {
  $(parentElement).on(event, targetBtn, function (e) {
    e.preventDefault();
    if (itemizedItemsJSON.length !== 0) {
      let rIdx = parseInt($(this).attr("id").split("_")[2]);

      if (rIdx > -1) {
        // Remove the object at index "rIdx"
        itemizedItemsJSON.splice(rIdx, 1);

        // Decrement idx inside of objects by 1
        itemizedItemsJSON.forEach((obj) => {
          if (rIdx < obj.idx) {
            obj.idx--;
          }
        });

        // Decrement idx for future adding
        idx--;

        /**
         *  Attach display properties again to the existing items
         *  when submit doesn't go through
         *
         */
        if (itemizedItemsJSON.length != 0) {
          itemizedItemsJSON.forEach((entry) => {
            entry.categoryDisplay = getCatDisplay(_.toLower(entry.category));
            entry.subCategoryDisplay = getSubCatDisplay(
              _.toLower(entry.category),
              _.toLower(entry.subCategory)
            );
          });
        }

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
                  === undefined || obj.subCategory === null) { %> 
                    <%= obj.categoryDisplay %>
                  <% } else { %> 
                    <%= obj.subCategoryDisplay %> <% } %>
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

let onClickSubmit = (targetBtn, event, financeType, incomeExist) => {
  $(targetBtn).on(event, function (e) {
    e.preventDefault();
    let date = $("#datepicker").val();
    let income = incomeExist ? $("#income").val() : null;

    itemizedItemsJSON.forEach((obj) => {
      delete obj.categoryDisplay;
      delete obj.subCategoryDisplay;
      obj.category = obj.category.trim();
      if (obj.subCategory) {
        obj.subCategory = obj.subCategory.trim();
      } else {
        obj.subCategory = null;
      }
    });

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
        toastr.error(jqXHR.responseJSON["message"], "Error", { timeOut: 1000 });
        // window.location.assign("/budget/new");
      },
    });
  });
};

// });
