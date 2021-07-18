$(document).ready(function () {
  $("#user-menu-button").click(function (e) {
    if ($("#user-menu").hasClass("hidden")) {
      $("#user-menu").removeClass("hidden");
    } else {
      $("#user-menu").addClass("hidden");
    }
  });
});
