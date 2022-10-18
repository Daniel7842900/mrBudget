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

exports.store = async (req, res) => {
  let { date, income, list } = req.body;
  income = parseFloat(income);
  let { user } = req;

  let dateArr = date.split("-");
  let startDate = dateArr[0].trim(),
    endDate = dateArr[1].trim();

  startDate = moment(startDate, "MMM DD YYYY").format("YYYY-MM-DD");
  endDate = moment(endDate, "MMM DD YYYY").format("YYYY-MM-DD");

  /**
   *  Condition to check if there is already a budget/budgets within the input date range.
   *  This filter is to FIND a budget/budgets
   */
  let filter = {
    where: {
      [Op.or]: [
        /**
         *  Case 1: input startDate or input endDate is equal to startDate
         *       OR input startDate or input endDate is equal to endDate
         */
        {
          [Op.or]: [
            {
              startDate: {
                [Op.or]: [startDate, endDate],
              },
            },
          ],
        },
        /**
         *  Case 2: input startDate < startDate < input endDate
         */
        {
          [Op.and]: [
            {
              startDate: {
                [Op.gt]: startDate,
              },
            },
            {
              startDate: {
                [Op.lt]: endDate,
              },
            },
          ],
        },
        /**
         *  Case 3: startDate < input startDate AND input endDate < endDate
         */
        {
          [Op.and]: [
            {
              startDate: {
                [Op.lt]: startDate,
              },
            },
            {
              endDate: {
                [Op.gt]: endDate,
              },
            },
          ],
        },
        /**
         *  Case 4: startDate < input startDate AND endDate < input endDate
         */
        {
          [Op.and]: [
            {
              startDate: {
                [Op.lt]: startDate,
              },
            },
            {
              endDate: {
                [Op.gt]: startDate,
              },
            },
          ],
        },
      ],
      financeTypeId: 1,
      userId: user.id,
    },
  };

  let budgetCount;
  try {
    /**
     *  Check if there is a budget on selected dates
     *  @return number
     */
    budgetCount = await Finance.count(filter);
  } catch (error) {
    console.log(error);
  }

  let error;
  if (budgetCount === 0) {
    // Validate request
    if (_.isNaN(income) || (income === 0 && list.length === 0)) {
      // req.flash("income_err_message", "If there is no income, enter 0!");
      if (_.isNaN(income)) error = new Error("If there is no income, enter 0!");
      if (income === 0 && list.length === 0)
        error = new Error("Please fill out the form!");
      error.type = "invalid-input";
      throw error;
    }

    // TODO there must be better way to do this...
    let itemizedIncome = {
      amount: income,
      category: _.toLower("income"),
      description: _.toLower("income"),
    };

    list.push(itemizedIncome);

    let itemizedList = [];

    // Perform modification on an item object in order to match with db
    list.forEach((obj) => {
      // Delete idx that was used in front-end
      delete obj.idx;

      // Change category & subCategory values to ids
      catToCatId(obj);
      subCatToId(obj);

      itemizedList.push(obj);
    });

    const budget = {
      startDate: startDate,
      endDate: endDate,
      financeTypeId: 1,
      userId: user.id,
      items: itemizedList,
    };

    /**
     *  Create a budget with a list of items
     *  @return Sequelize finance object
     */
    const newBudget = await Finance.create(budget, {
      include: [Item],
    });

    return newBudget;
  } else {
    error = new Error("No more budget on these dates!");
    error.type = "invalid-input";
    throw error;
  }
};
