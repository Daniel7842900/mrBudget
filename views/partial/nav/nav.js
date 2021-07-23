$(document).ready(function () {
  $("#user-menu-button").click(function (e) {
    if ($("#user-menu").hasClass("hidden")) {
      $("#user-menu").removeClass("hidden");
    } else {
      $("#user-menu").addClass("hidden");
    }
  });

  $("#mobile-menu-btn").click(function (e) {
    if ($("#mobile-menu").hasClass("hidden")) {
      $("#mobile-menu").removeClass("hidden");
    } else {
      $("#mobile-menu").addClass("hidden");
    }
  });
});
