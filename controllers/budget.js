// Create database connection
const db = require("../models");
const Finance = db.finance;
// const { list } = require("../public/js/createList.js");

// Create a new Finance and save
exports.create = (req, res) => {
  res.render("pages/budget/create", {
    err_message: req.flash("err_message"),
  });
};

exports.store = (req, res) => {
  // console.log("success!");
  console.log(req.body);
  let income = req.body.income;
  let list = req.body.list;

  // if((req.body.income === null || req.body.income === "") && ) {

  // }

  if (income === null || income === "") {
    if (list.length === 0) {
      console.log("income is empty & list is empty as well");
      req.flash("err_message", "Please fill out the form!");
      // console.log(req.flash("messages"));
      // console.log(req.flash());
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
      // return res.render("pages/budget/create", {
      //   error: req.flash("error"),
      // });
    }

    console.log("there is no income");
  }

  // TODO figure out what these 2 lines mean
  // res.set("Content-Type", "application/json");
  // var jsonData = JSON.stringify(req.body);

  // We should return the resonse otherwise the POST request
  //on client side will get stuck (pending).
  // status 201 is "Created"
  return res.status(201).json(req.body);
};

exports.findAll = (req, res) => {
  res.render("pages/budget");
};
