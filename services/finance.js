const db = require("../models/index");
const Finance = db.finance;
const FinanceType = db.finance_type;
const Item = db.item;
const moment = require("moment");
const _ = require("lodash");
const { Op } = require("sequelize");
const {
  catToCatId,
  catIdToCat,
} = require("../controllers/util/convertCategories");
const {
  subCatToId,
  subCatIdToSubCat,
} = require("../controllers/util/convertSubcategories");

exports.findAll = async (req, res) => {
  let { user, originalUrl } = req;
  let financeTypeUrl = originalUrl.split("/")[1].split("?")[0].trim();

  let financeType;
  try {
    financeType = await FinanceType.findOne({
      where: {
        type: _.upperFirst(financeTypeUrl),
      },
      raw: true,
    });
  } catch (error) {
    console.log(error);
  }

  let result;
  try {
    /**
     *  Retrieve every budget records to display on the calendar
     *  @return An array of budget objects
     */
    result = await Finance.findAll({
      where: {
        financeTypeId: financeType.id,
        userId: user.id,
      },
      raw: true,
    });
  } catch (error) {
    console.log(error);
    return req.flash("budget_err");
  }

  return result;
};

exports.findOne = async (req, res) => {
  let itemizedItems = [];
  let { user, originalUrl } = req;
  let financeTypeUrl = originalUrl.split("/")[1].split("?")[0].trim();
  let finance, items;
  let startDate = req.query.start,
    endDate = req.query.end;

  startDate = moment(startDate, "MM-DD-YYYY").format("YYYY-MM-DD");
  endDate = moment(endDate, "MM-DD-YYYY").format("YYYY-MM-DD");

  let financeType;
  try {
    financeType = await FinanceType.findOne({
      where: {
        type: _.upperFirst(financeTypeUrl),
      },
      raw: true,
    });
  } catch (error) {
    console.log(error);
  }

  // Condition for finding a finance
  let filter = {
    where: {
      startDate: startDate,
      endDate: endDate,
      financeTypeId: financeType.id,
      userId: user.id,
    },
    raw: true,
  };

  try {
    /**
     *  Retrieve one finance to display on edit page
     *  @return An object
     */
    finance = await Finance.findOne(filter);
  } catch (error) {
    console.log(error);
  }

  try {
    /**
     *  Retrieve all items that belong to the finance
     *  @return An array of item objects
     */
    items = await Item.findAll({
      where: { financeId: finance.id },
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
  let { user, originalUrl } = req;
  let financeTypeUrl = originalUrl.split("/")[1].trim();

  let dateArr = date.split("-");
  let startDate = dateArr[0].trim(),
    endDate = dateArr[1].trim();

  startDate = moment(startDate, "MMM DD YYYY").format("YYYY-MM-DD");
  endDate = moment(endDate, "MMM DD YYYY").format("YYYY-MM-DD");

  let financeType;
  try {
    financeType = await FinanceType.findOne({
      where: {
        type: _.upperFirst(financeTypeUrl),
      },
      raw: true,
    });
  } catch (error) {
    console.log(error);
  }

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
      financeTypeId: financeType.id,
      userId: user.id,
    },
  };

  let financeCount;
  try {
    /**
     *  Check if there is a budget on selected dates
     *  @return number
     */
    financeCount = await Finance.count(filter);
  } catch (error) {
    console.log(error);
  }

  let error;
  if (financeCount === 0) {
    if (financeTypeUrl === "budget") {
      // Validate request
      if (_.isNaN(income)) {
        if (_.isNaN(income))
          error = new Error("If there is no income, enter 0!");
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
    }
    // Validate request
    if (list.length === 0) {
      error = new Error("Please fill out the form!");
      error.type = "invalid-input";
      throw error;
    }

    // Perform modification on an item object in order to match with db
    let itemizedList = [];
    list.forEach((obj) => {
      // Delete idx that was used in front-end
      delete obj.idx;

      // Change category & subCategory values to ids
      catToCatId(obj);
      subCatToId(obj);

      itemizedList.push(obj);
    });

    // Condition to create a budget
    const finance = {
      startDate: startDate,
      endDate: endDate,
      financeTypeId: financeType.id,
      userId: user.id,
      items: itemizedList,
    };

    /**
     *  Create a finance with a list of items
     *  @return Sequelize finance object
     */
    const newFinance = await Finance.create(finance, {
      include: [Item],
    });

    return newFinance;
  } else {
    error = new Error(`No more ${financeTypeUrl} on these dates!`);
    error.type = "invalid-input";
    throw error;
  }
};

exports.update = async (req, res) => {
  let { date, income, list } = req.body;
  let { user, originalUrl } = req;
  let financeTypeUrl = originalUrl.split("/")[1].split("?")[0].trim();
  income = parseFloat(income);

  let dateArr = date.split("-");
  let startDate = dateArr[0].trim(),
    endDate = dateArr[1].trim();

  /**
   *  Change the date format to match with the format from db
   */
  startDate = moment(startDate, "MMM DD YYYY").format("YYYY-MM-DD");
  endDate = moment(endDate, "MMM DD YYYY").format("YYYY-MM-DD");

  let error;
  if (financeTypeUrl === "budget") {
    // Validate request
    if (_.isNaN(income)) {
      if (_.isNaN(income)) error = new Error("If there is no income, enter 0!");
      error.type = "invalid-input";
      throw error;
    }

    /**
     *  Re-format the income object to match with the format of other objects
     */
    let itemizedIncome = {
      amount: income,
      category: _.toLower("income"),
      description: _.toLower("income"),
    };

    // Add income obj to the list
    list.push(itemizedIncome);
  }

  // Validate request
  if (list.length === 0) {
    error = new Error("Please fill out the form!");
    error.type = "invalid-input";
    throw error;
  }

  /**
   *  Format the records from db and push it to a new array
   */
  let itemizedList = [];
  list.forEach((obj) => {
    // Delete idx that was used in front-end
    delete obj.idx;

    // Change category & subCategory values to ids
    catToCatId(obj);
    subCatToId(obj);

    itemizedList.push(obj);
  });

  let financeType;
  try {
    financeType = await FinanceType.findOne({
      where: {
        type: _.upperFirst(financeTypeUrl),
      },
      raw: true,
    });
  } catch (error) {
    console.log(error);
  }

  // Condition to find a budget
  let filter = {
    where: {
      startDate: startDate,
      endDate: endDate,
      financeTypeId: financeType.id,
      userId: user.id,
    },
  };

  // Retrieve one budget to display on edit page
  let budgetInstance;
  try {
    budgetInstance = await Finance.findOne(filter);
  } catch (error) {
    console.log(error);
  }

  const budget = budgetInstance.get();

  let destroyedItems;
  try {
    /**
     *  Destroy items that have the budget id.
     *  @return Number of destroyed items
     */
    destroyedItems = await Item.destroy({
      where: {
        financeId: budget.id,
      },
    });
  } catch (error) {
    console.log(error);
  }

  let newItems;
  try {
    /**
     *  Create items with the given list
     *  @return An array of Sequelize Item objects
     */
    newItems = await Item.bulkCreate(itemizedList);
  } catch (error) {
    console.log(error);
  }

  try {
    /**
     *  Add Sequelize Item objects to the budget
     */
    await budgetInstance.addItems(newItems);
  } catch (error) {
    console.log(error);
  }

  return newItems;
};

exports.delete = async (req, res) => {
  let { date } = req.body;
  let { user } = req;

  let dateArr = date.split("-");
  let startDate = dateArr[0].trim(),
    endDate = dateArr[1].trim();

  startDate = moment(startDate, "MMM DD YYYY").format("YYYY-MM-DD");
  endDate = moment(endDate, "MMM DD YYYY").format("YYYY-MM-DD");

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

  /**
   *  Delete the budget
   *  @return Number of deleted budget
   */
  const destroyedBudget = await Finance.destroy(filter);

  return destroyedBudget;
};
