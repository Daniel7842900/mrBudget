// Create database connection
const db = require("../models");
const Finance = db.finance;
const Item = db.item;
const moment = require("moment");
const _ = require("lodash");
const { Op } = require("sequelize");
const { sequelize } = require("../models");
const { catIdToCat } = require("./util/convertCategories");

exports.findAll = async (req, res) => {
  let user = req.user;
  res.render("pages/report", {
    user: user,
  });
};
