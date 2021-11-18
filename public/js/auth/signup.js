$(function () {
  const submitBtn = $("#submit_btn");

  $(submitBtn).on("click", function (e) {
    e.preventDefault();
    const email = $("#email_address").val().trim();
    const password = $("#password").val().trim();
    const firstName = $("#firstname").val().trim();
    const lastName = $("#lastname").val().trim();
    console.log(email);
    console.log(password);
    console.log(firstName);
    console.log(lastName);

    $.ajax({
      url: "/signup",
      type: "POST",
      data: JSON.stringify({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      }),

      // contentType json is essential to make server
      //understand that data is JSON
      contentType: "application/json",

      // Here, success is a callback function
      //after we get a response from server side
      success: function (res) {
        // res is data that we get from server side
        //in our case, from controller

        // Show success toastr message on current page
        //and redirect after 1 second
        toastr.options.onHidden = function () {
          window.location.assign("/login");
        };
        toastr.success("Account is successfully created!", "Success", {
          timeOut: 1000,
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("this is an error from ajax call error");
        // Redirecting to new budget page again to display
        //error message.
        // TODO research if there is any way to display error
        //message not redirecting
        // toastr.error(jqXHR.responseJSON["message"], "Error", { timeOut: 1000 });
        // window.location.assign("/budget/new");
      },
    });
  });
});
