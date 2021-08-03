$(document).ready(function () {
  let list = [];
  let idx = 0;

  // Onclick event for adding an object
  //to the list
  $("#add_btn").click(function (e) {
    e.preventDefault();
    // Create a js object for category & amount
    let obj = {};
    obj.idx = idx;
    obj.category = $("#category").children("option:selected").text();
    let amount = $("#amount").val();

    // Change the text to number
    amount = parseFloat(amount);

    // Round the number until 2 decimals
    amount = Math.round(amount * 100) / 100;

    obj.amount = amount;

    if (obj.amount === 0 || isNaN(obj.amount) === true) {
      // Reset the values after adding
      $("#amount").val("");

      // Prevent onClick event
      e.preventDefault();
      return false;
    }

    // console.log(obj);

    // Push the object into the list
    list.push(obj);

    // Reset the values after adding
    $("#category option:first").prop("selected", true);
    $("#amount").val("");

    // Increment the index
    idx++;

    console.log("add list");
    console.log(list);

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
      { list: list }
    );

    // This is required for re-rendering table body element.
    //if this is not present, it will now show the list of objects
    //that we added above.
    $.get("/budget/new", function () {
      $("#summary_data").html(html);
    });
  });

  // Onclick event for removing an object
  //from the list
  $("#summary_data").on("click", ".remove_btn", function () {
    if (list.length !== 0) {
      let rIdx = parseInt($(this).attr("id").split("_")[2]);

      if (rIdx > -1) {
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
          { list: list }
        );

        $.get("/budget/new", function () {
          $("#summary_data").html(html);
        });
      }
    }
  });

  $("#submit_btn").click(function (e) {
    e.preventDefault();
    $.ajax({
      url: "/budget/new",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        income: $("#income").val(),
        list: list,
      }),

      // Here, success is a callback function
      //after we get a response from server side
      success: function (res) {
        // res is response that we get from server side
        //in our case, from controller
        console.log(res);
        window.location.assign("/budget");
      },
      error: function () {
        alert("There is something wrong the request!");
      },
    });
  });
});
