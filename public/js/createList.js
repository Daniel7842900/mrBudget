$(document).ready(function () {
  let list = [];
  $("#addBtn").click(function (e) {
    // Create a js object for category & amount
    let obj = {};
    obj.category = $("#category").children("option:selected").text();
    obj.amount = $("#amount").val();

    // Push the object into the list
    list.push(obj);

    // Reset the values after adding
    $("#category option:first").prop("selected", true);
    $("#amount").val("");

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
});
