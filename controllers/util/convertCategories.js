const _ = require("lodash");

const convertCatToCatId = (obj) => {
  delete obj.idx;
  switch (_.toLower(obj.category)) {
    case _.toLower("income"):
      obj.categoryId = 1;
      delete obj.category;
      break;
    case _.toLower("grocery"):
      obj.categoryId = 2;
      delete obj.category;
      break;
    case _.toLower("rent"):
      obj.categoryId = 3;
      delete obj.category;
      break;
    case _.toLower("utility"):
      obj.categoryId = 4;
      delete obj.category;
      break;
    case _.toLower("dine out"):
      obj.categoryId = 5;
      delete obj.category;
      break;
    case _.toLower("investment"):
      obj.categoryId = 6;
      delete obj.category;
      break;
    case _.toLower("shopping"):
      obj.categoryId = 7;
      delete obj.category;
      break;
    case _.toLower("alcohol"):
      obj.categoryId = 8;
      delete obj.category;
      break;
    case _.toLower("leisure"):
      obj.categoryId = 9;
      delete obj.category;
      break;
    case _.toLower("insurance"):
      obj.categoryId = 10;
      delete obj.category;
      break;
    case _.toLower("loan"):
      obj.categoryId = 11;
      delete obj.category;
      break;
    case _.toLower("subscription"):
      obj.categoryId = 12;
      delete obj.category;
      break;
    case _.toLower("transportation"):
      obj.categoryId = 13;
      delete obj.category;
      break;
    case _.toLower("etc"):
      obj.categoryId = 14;
      delete obj.category;
      break;
    case _.toLower("personal maintenance"):
      obj.categoryId = 15;
      delete obj.category;
      break;
    default:
  }
};

const convertCatIdToCat = (dbObj, newObj) => {
  switch (dbObj.categoryId) {
    case 1:
      newObj.category = _.toLower("income");
      break;
    case 2:
      newObj.category = _.toLower("grocery");
      break;
    case 3:
      newObj.category = _.toLower("rent");
      break;
    case 4:
      newObj.category = _.toLower("utility");
      break;
    case 5:
      newObj.category = _.toLower("dine out");
      break;
    case 6:
      newObj.category = _.toLower("investment");
      break;
    case 7:
      newObj.category = _.toLower("shopping");
      break;
    case 8:
      newObj.category = _.toLower("alcohol");
      break;
    case 9:
      newObj.category = _.toLower("leisure");
      break;
    case 10:
      newObj.category = _.toLower("insurance");
      break;
    case 11:
      newObj.category = _.toLower("loan");
      break;
    case 12:
      newObj.category = _.toLower("subscription");
      break;
    case 13:
      newObj.category = _.toLower("transportation");
      break;
    case 14:
      newObj.category = _.toLower("etc");
      break;
    case 15:
      newObj.category = _.toLower("personal maintenance");
      break;
    default:
  }
};

module.exports = {
  catToCatId: convertCatToCatId,
  catIdToCat: convertCatIdToCat,
};
