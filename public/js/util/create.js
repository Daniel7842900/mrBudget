let list = [];
let idx = 0;
let catMap = new Map([
  [_.toLower("grocery"), false],
  [_.toLower("rent"), false],
  [_.toLower("utility"), false],
  [_.toLower("dine out"), false],
  [_.toLower("investment"), false],
  [_.toLower("shopping"), false],
  [_.toLower("alcohol"), false],
  [_.toLower("leisure"), false],
  [_.toLower("insurance"), false],
  [_.toLower("loan"), false],
  [_.toLower("subscription"), false],
  [_.toLower("transportation"), false],
  [_.toLower("etc"), false],
  [_.toLower("personal maintenance"), false],
]);

// Onclick event for adding an object to the list
let onClickAdd = (parentElement, targetBtn, event, financeType) => {
  $(targetBtn).on(event, function (e) {
    // Prevent onClick event
    e.preventDefault();

    // Create a js object for category & amount
    let obj = {};
    let objCat = $("#category").children("option:selected").val();
    objCat = _.toLower(objCat);
    if (catMap.get(objCat) === false) {
      let amount = $("#amount").val();

      // Change the text to number
      amount = parseFloat(amount);

      // Round the number until 2 decimals
      amount = Math.round(amount * 100) / 100;

      if (_.isNaN(amount) === true || amount === 0) {
        // Reset the values after adding
        $("#amount").val("");

        toastr.warning("Please enter the amount!", "Warning", {
          timeOut: 1000,
        });
        return false;
      } else {
        catMap.set(objCat, true);

        obj.category = _.startCase(objCat);
        obj.idx = idx;
        obj.amount = amount;

        // Push the object into the list
        list.push(obj);

        // Reset the values after adding
        $("#category option:first").prop("selected", true);
        $("#amount").val("");

        // Increment the index
        idx++;

        // Render table rows using the list that contains js objects.
        //this is done in client-side because we can't pass the list
        //to server-side.
        html = ejs.render(
          `<% list.forEach(function(obj) {
              obj.category = _.startCase(obj.category) %>
              <tr>
                <td
                scope="col"
                  class="
                    px-4
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
                scope="col"
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
          { list: list }
        );

        // This is required for re-rendering table body element.
        //if this is not present, it will now show the list of objects
        //that we added above.
        $.get(`/${financeType}/new`, function () {
          $(parentElement).html(html);
        });
      }
    } else if (catMap.get(objCat) === true) {
      toastr.warning("No same category!", "Warning", {
        timeOut: 1000,
      });
    }
  });
};

//TODO allow item be able to added after clear up once
//TODO investigate the issue that is not allowing removing items after the list is fully cleared up.
// Onclick event for removing an object from the list
let onClickRemove = (parentElement, targetBtn, event, financeType) => {
  $(parentElement).on(event, targetBtn, function (e) {
    // Prevent onClick event
    e.preventDefault();
    if (list.length !== 0) {
      let rIdx = parseInt($(this).attr("id").split("_")[2]);

      if (rIdx > -1) {
        // Change category availability to false if item is getting removed
        let curObj = list[rIdx];
        catMap.set(_.toLower(curObj.category), false);

        // Remove the object at index "rIdx"
        list.splice(rIdx, 1);

        // Decrement idx inside of objects by 1
        list.forEach((obj) => {
          if (rIdx < obj.idx) {
            obj.idx--;
          }
        });
        // Decrement idx for future adding
        idx--;

        html = ejs.render(
          `<% list.forEach(function(obj) {
            obj.category = _.startCase(obj.category) %>
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
              <%= obj.category %>
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
          { list: list }
        );

        $.get(`/${financeType}/new`, function () {
          $(parentElement).html(html);
        });
      }
    }
  });
};

// Onclick event for submiting the list
let onClickSubmit = (targetBtn, event, financeType, incomeExist) => {
  $(targetBtn).on(event, function (e) {
    let date = $("#datepicker").val();

    let income = incomeExist ? $("#income").val() : null;

    list.forEach((obj) => {
      obj.category = obj.category.trim();
    });

    e.preventDefault();
    $.ajax({
      url: `/${financeType}/new`,
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        date: date,
        income: income,
        list: list,
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
          window.location.assign(`/${financeType}`);
        };
        toastr.success(`New ${financeType} is created!`, "Success", {
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
