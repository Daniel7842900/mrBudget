// Create database connection
const db = require("../models");
const Finance = db.finance;
// const { list } = require("../public/js/createList.js");

// Create a new Finance and save
exports.create = (req, res) => {
  res.render("pages/budget/create");
};

exports.store = (req, res) => {
  console.log("success!");
  console.log(req.body);

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
