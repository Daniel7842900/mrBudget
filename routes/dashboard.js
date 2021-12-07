let loadRouter = (app) => {
  app.get("/dashboard", function (req, res) {
    let user = req.user;
    // console.log("we are at dashboard!");
    // res.sendFile(__dirname + "/views/pages/dashboard/index.html");
    // console.log("Cookies: ", req.cookies);
    console.log("session: ", req.session);
    // console.log("passport: ", req.session.passport);
    res.render("pages/dashboard", {
      user: user,
    });
  });
};

module.exports = {
  loadRouter: loadRouter,
};
