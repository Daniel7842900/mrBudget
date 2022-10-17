const db = require("../models/index");
const Finance = db.finance;
const Item = db.item;
const moment = require("moment");
const _ = require("lodash");
const { Op } = require("sequelize");
const {
  catToCatId,
  catIdToCat,
  getCatDisplay,
} = require("../controllers/util/convertCategories");
const {
  subCatToId,
  subCatIdToSubCat,
  getSubCatDisplay,
} = require("../controllers/util/convertSubcategories");

exports.findAll = async (req, res) => {
  let user = req.user;
  try {
    /**
     *  Retrieve every budget records to display on the calendar
     *  @return An array of budget objects
     */
    const budgets = await Finance.findAll({
      where: {
        financeTypeId: 1,
        userId: user.id,
      },
      raw: true,
    });
    return budgets;
  } catch (error) {
    console.log(error);
    return req.flash("budget_err");
  }
};

exports.findOne = async (req, res) => {
  let itemizedItems = [];
  let user = req.user;
  let budget;
  let items;
  let startDate = req.query.start,
    endDate = req.query.end;

  startDate = moment(startDate, "MM-DD-YYYY").format("YYYY-MM-DD");
  endDate = moment(endDate, "MM-DD-YYYY").format("YYYY-MM-DD");

  // Condition for finding a budget
  let filter = {
    where: {
      startDate: startDate,
      endDate: endDate,
      financeTypeId: 1,
      userId: user.id,
    },
    raw: true,
  };

  try {
    /**
     *  Retrieve one budget to display on edit page
     *  @return An object
     */
    budget = await Finance.findOne(filter);
  } catch (error) {
    console.log(error);
  }

  try {
    /**
     *  Retrieve all items that belong to the budget
     *  @return An array of item objects
     */
    items = await Item.findAll({
      where: { financeId: budget.id },
      raw: true,
    });
  } catch (error) {
    console.log(error);
  }

  items.forEach((item) => {
    // new obj for formatted data
    let itemizedItem = {};

    // Assign amount to a new obj
    itemizedItem.amount = parseFloat(item["amount"]);

    // Assign description to a new obj
    itemizedItem.description = item["description"];

    // Convert category id & subCategory id to category value & subCategory value
    catIdToCat(item, itemizedItem);
    subCatIdToSubCat(item, itemizedItem);

    // Add a new obj to the list
    itemizedItems.push(itemizedItem);
  });

  return itemizedItems;
};
