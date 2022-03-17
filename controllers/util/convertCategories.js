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
    case _.toLower("fee"):
      obj.categoryId = 3;
      delete obj.category;
      break;
    case _.toLower("utility"):
      obj.categoryId = 4;
      delete obj.category;
      break;
    case _.toLower("food"):
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
    case _.toLower("entertainment"):
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
    case _.toLower("personal care"):
      obj.categoryId = 15;
      delete obj.category;
      break;
    case _.toLower("travel"):
      obj.categoryId = 16;
      delete obj.category;
      break;
    case _.toLower("health"):
      obj.categoryId = 17;
      delete obj.category;
      break;
    case _.toLower("gift"):
      obj.categoryId = 18;
      delete obj.category;
      break;
    case _.toLower("business service"):
      obj.categoryId = 19;
      delete obj.category;
      break;
    case _.toLower("tax"):
      obj.categoryId = 20;
      delete obj.category;
      break;
    case _.toLower("housing"):
      obj.categoryId = 21;
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
      newObj.category = _.toLower("fee");
      break;
    case 4:
      newObj.category = _.toLower("utility");
      break;
    case 5:
      newObj.category = _.toLower("food");
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
      newObj.category = _.toLower("entertainment");
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
      newObj.category = _.toLower("personal care");
      break;
    case 16:
      newObj.category = _.toLower("travel");
      break;
    case 17:
      newObj.category = _.toLower("health");
      break;
    case 18:
      newObj.category = _.toLower("gift");
      break;
    case 19:
      newObj.category = _.toLower("business service");
      break;
    case 20:
      newObj.category = _.toLower("tax");
      break;
    case 21:
      newObj.category = _.toLower("housing");
      break;
    default:
  }
};

module.exports = {
  catToCatId: convertCatToCatId,
  catIdToCat: convertCatIdToCat,
};
