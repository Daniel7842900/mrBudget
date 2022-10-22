const _ = require("lodash");
const { getCatDisplay } = require("./util/convertCategories");
const { getSubCatDisplay } = require("./util/convertSubcategories");
const financeService = require("../services/finance");

// Controller for displaying a finance
exports.findOne = async (req, res) => {
  let { user, originalUrl } = req;
  let financeTypeUrl = originalUrl.split("?")[0].slice(1).trim();

  const finances = await financeService.findAll(req, res);
  let itemizedItems = [];

  if (_.isEmpty(req.query)) {
    res.render(`pages/${financeTypeUrl}`, {
      user: user,
      finances: finances,
      itemizedItems: itemizedItems,
      error: req.flash("finance_err"),
    });
  } else {
    let startDate = req.query.start,
      endDate = req.query.end;
    let items;

    try {
      items = await financeService.findOne(req, res);
    } catch (error) {
      console.log(error);
      req.flash(
        "finance_err",
        `${_.upperFirst(financeTypeUrl)} doesn't exist!`
      );
      res.render(`pages/${financeTypeUrl}`, {
        user: user,
        finances: finances,
        itemizedItems: itemizedItems,
        startDate: startDate,
        endDate: endDate,
        getCatDisplay: getCatDisplay,
        getSubCatDisplay: getSubCatDisplay,
        error: req.flash("finance_err"),
      });
    }

    res.render(`pages/${financeTypeUrl}`, {
      user: user,
      finances: finances,
      itemizedItems: items,
      startDate: startDate,
      endDate: endDate,
      getCatDisplay: getCatDisplay,
      getSubCatDisplay: getSubCatDisplay,
      error: req.flash("finance_err"),
    });
  }
};

// Controller for displaying a new finance page
exports.create = async (req, res) => {
  let itemizedItems = [];
  let { user, originalUrl } = req;
  let financeTypeUrl = originalUrl.split("/")[1].trim();

  let finances;
  try {
    finances = await financeService.findAll(req, res);
  } catch (error) {
    console.log(error);
  }

  res.render(`pages/${financeTypeUrl}/create`, {
    user: user,
    finances: finances,
    itemizedItems: itemizedItems,
    err_message: req.flash("err_message"),
  });
};
