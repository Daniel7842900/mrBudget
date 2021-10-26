$(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlParams.entries());

  let idx = 0;
  let itemizedItemsJSON = JSON.parse(itemizedItems);
  let start = params.start;
  let end = params.end;
  let catMap = new Map([
    [_.toLower("grocery"), false],
    [_.toLower("rent"), false],
    [_.toLower("utility"), false],
    [_.toLower("dine out"), false],
    [_.toLower("investment"), false],
    [_.toLower("saving"), false],
    [_.toLower("alcohol"), false],
    [_.toLower("leisure"), false],
    [_.toLower("insurance"), false],
    [_.toLower("loan"), false],
    [_.toLower("streaming service"), false],
    [_.toLower("transportation"), false],
    [_.toLower("etc"), false],
  ]);

  // Remove "Income" from the list
  // for (let i = itemizedItemsJSON.length - 1; i >= 0; i -= 1) {
  //   if (itemizedItemsJSON[i].category === _.toLower("income")) {
  //     console.log("getting rid of income?");
  //     itemizedItemsJSON.splice(i, 1);
  //   }
  // }

  itemizedItemsJSON.forEach((itemObj) => {
    // Mark existing category
    catMap.set(itemObj.category, true);

    // Assign idx to already existing items
    itemObj.idx = idx;
    idx++;
    console.log("logging itemObj");
    console.log(itemObj);
  });

  // Onclick event for adding an object
  //to the list
  $("#add_btn").on("click", function (e) {
    e.preventDefault();
    // Create a js object for category & amount
    let obj = {};

    //TODO dine out and streaming service doesn't work because text() and val()
    //are different. fix this.
    // let objCat = $("#category").children("option:selected").text();
    let objCat = $("#category").children("option:selected").val();
    objCat = _.toLower(objCat);
    console.log(objCat);

    if (catMap.get(objCat) === false) {
      let amount = $("#amount").val();

      // Change the text to number
      amount = parseFloat(amount);

      // Round the number until 2 decimals
      amount = Math.round(amount * 100) / 100;

      if (_.isNaN(amount) === true || amount === 0) {
        // Reset the values after adding
        $("#amount").val("");

        // Prevent onClick event
        e.preventDefault();

        toastr.warning("Please enter the amount!", "Warning", {
          timeOut: 1000,
        });
        return false;
      } else {
        catMap.set(objCat, true);

        obj.idx = idx;
        obj.category = _.startCase(objCat);
        obj.amount = amount;

        console.log("logging obj category");
        console.log(obj.category);

        // Push the object into the list
        itemizedItemsJSON.push(obj);

        // Reset the values after adding
        $("#category option:first").prop("selected", true);
        $("#amount").val("");

        // Increment the index
        idx++;

        console.log("add list");
        console.log(itemizedItemsJSON);

        // Render table rows using the list that contains js objects.
        //this is done in client-side because we can't pass the list
        //to server-side.
        html = ejs.render(
          `<% list.forEach(function(obj) { %>
            <tr>
              <td
                class="
                  px-6
                  py-4
                  whitespace-nowrap
                  text-sm
                  font-medium
                  text-gray-900
                "
              >
                <%= obj.category %>
              </td>
              <td
                class="
                  px-6
                  py-4
                  whitespace-nowrap
                  text-sm text-gray-500
                "
              >
                $ <%= obj.amount %>
              </td>
              <td
                class="
                  px-6
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
        $.get(`/expense/edit?start=${start}&end=${end}`, function () {
          $("#summary_data").html(html);
        });
      }
    } else if (catMap.get(objCat) === true) {
      toastr.warning("No same category!", "Warning", {
        timeOut: 1000,
      });
    }
  });

  // Onclick event for removing an object
  //from the list
  $("#summary_data").on("click", ".remove_btn", function (e) {
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

        html = ejs.render(
          `<% list.forEach(function(obj) { %>
              <tr>
                <td
                  class="
                    px-6
                    py-4
                    whitespace-nowrap
                    text-sm
                    font-medium
                    text-gray-900
                  "
                >
                  <%= obj.category %>
                </td>
                <td
                  class="
                    px-6
                    py-4
                    whitespace-nowrap
                    text-sm text-gray-500
                  "
                >
                  $ <%= obj.amount %>
                </td>
                <td
                  class="
                    px-6
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

        $.get(`/expense/edit?start=${start}&end=${end}`, function () {
          $("#summary_data").html(html);
        });
      }
    }
  });

  $("#submit_btn").on("click", function (e) {
    let date = $("#datepicker").val();
    console.log(date);
    // let income = $("#income").val();
    // console.log(income);

    itemizedItemsJSON.forEach((obj) => {
      obj.category = obj.category.trim();
      console.log(obj);
    });

    e.preventDefault();
    $.ajax({
      url: "/expense/edit",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        date: date,
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
        console.log(res);
        console.log("edit was success");

        // Show success toastr message on current page
        //and redirect after 1 second
        // toastr.options.onHidden = function () {
        //   window.location.assign(`/expense/edit?start=${start}&end=${end}`);
        // };
        toastr.success("The expense is edited!", "Success", { timeOut: 1000 });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Redirecting to new budget page again to display
        //error message.
        // TODO research if there is any way to display error
        //message not redirecting
        // window.location.assign("/budget/new");
        console.log("edit error caught");
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  });
});
