const convertSubCatToId = (obj) => {
  switch (_.toLower(obj.subCategory)) {
    case _.toLower("grocery"):
      obj.subCategoryId = 1;
      delete obj.subCategory;
      break;
    case _.toLower("coffee"):
      obj.subCategoryId = 2;
      delete obj.subCategory;
      break;
    case _.toLower("fast"):
      obj.subCategoryId = 3;
      delete obj.subCategory;
      break;
    case _.toLower("restaurant"):
      obj.subCategoryId = 4;
      delete obj.subCategory;
      break;
    case _.toLower("take out"):
      obj.subCategoryId = 5;
      delete obj.subCategory;
      break;
    case _.toLower("delivery"):
      obj.subCategoryId = 6;
      delete obj.subCategory;
      break;
    case _.toLower("alcohol"):
      obj.subCategoryId = 7;
      delete obj.subCategory;
      break;
    case _.toLower("rent"):
      obj.subCategoryId = 8;
      delete obj.subCategory;
      break;
    case _.toLower("mortgage"):
      obj.subCategoryId = 9;
      delete obj.subCategory;
      break;
    case _.toLower("property insurance"):
      obj.subCategoryId = 10;
      delete obj.subCategory;
      break;
    case _.toLower("maintenance good"):
      obj.subCategoryId = 11;
      delete obj.subCategory;
      break;
    case _.toLower("maintenance service"):
      obj.subCategoryId = 12;
      delete obj.subCategory;
      break;
    case _.toLower("clothing"):
      obj.subCategoryId = 13;
      delete obj.subCategory;
      break;
    case _.toLower("book"):
      obj.subCategoryId = 14;
      delete obj.subCategory;
      break;
    case _.toLower("electronic"):
      obj.subCategoryId = 15;
      delete obj.subCategory;
      break;
    case _.toLower("hobby"):
      obj.subCategoryId = 16;
      delete obj.subCategory;
      break;
    case _.toLower("sporting good"):
      obj.subCategoryId = 17;
      delete obj.subCategory;
      break;
    case _.toLower("laundry"):
      obj.subCategoryId = 18;
      delete obj.subCategory;
      break;
    case _.toLower("hair"):
      obj.subCategoryId = 19;
      delete obj.subCategory;
      break;
    case _.toLower("massage"):
      obj.subCategoryId = 20;
      delete obj.subCategory;
      break;
    case _.toLower("dentist"):
      obj.subCategoryId = 21;
      delete obj.subCategory;
      break;
    case _.toLower("doctor"):
      obj.subCategoryId = 22;
      delete obj.subCategory;
      break;
    case _.toLower("eye"):
      obj.subCategoryId = 23;
      delete obj.subCategory;
      break;
    case _.toLower("pharmacy"):
      obj.subCategoryId = 24;
      delete obj.subCategory;
      break;
    case _.toLower("health insurance"):
      obj.subCategoryId = 25;
      delete obj.subCategory;
      break;
    case _.toLower("gym"):
      obj.subCategoryId = 26;
      delete obj.subCategory;
      break;
    case _.toLower("sports"):
      obj.subCategoryId = 27;
      delete obj.subCategory;
      break;
    case _.toLower("service fee"):
      obj.subCategoryId = 28;
      delete obj.subCategory;
      break;
    case _.toLower("late"):
      obj.subCategoryId = 29;
      delete obj.subCategory;
      break;
    case _.toLower("finance"):
      obj.subCategoryId = 30;
      delete obj.subCategory;
      break;
    case _.toLower("atm"):
      obj.subCategoryId = 31;
      delete obj.subCategory;
      break;
    case _.toLower("bank"):
      obj.subCategoryId = 32;
      delete obj.subCategory;
      break;
    case _.toLower("commission"):
      obj.subCategoryId = 33;
      delete obj.subCategory;
      break;
    case _.toLower("television"):
      obj.subCategoryId = 34;
      delete obj.subCategory;
      break;
    case _.toLower("phone"):
      obj.subCategoryId = 35;
      delete obj.subCategory;
      break;
    case _.toLower("internet"):
      obj.subCategoryId = 36;
      delete obj.subCategory;
      break;
    case _.toLower("gas"):
      obj.subCategoryId = 37;
      delete obj.subCategory;
      break;
    case _.toLower("electricity"):
      obj.subCategoryId = 38;
      delete obj.subCategory;
      break;
    case _.toLower("other"):
      obj.subCategoryId = 39;
      delete obj.subCategory;
      break;
    case _.toLower("deposit"):
      obj.subCategoryId = 40;
      delete obj.subCategory;
      break;
    case _.toLower("withdrawal"):
      obj.subCategoryId = 41;
      delete obj.subCategory;
      break;
    case _.toLower("dividend"):
      obj.subCategoryId = 42;
      delete obj.subCategory;
      break;
    case _.toLower("cap"):
      obj.subCategoryId = 43;
      delete obj.subCategory;
      break;
    case _.toLower("buy"):
      obj.subCategoryId = 44;
      delete obj.subCategory;
      break;
    case _.toLower("sell"):
      obj.subCategoryId = 45;
      delete obj.subCategory;
      break;
    case _.toLower("art"):
      obj.subCategoryId = 46;
      delete obj.subCategory;
      break;
    case _.toLower("music"):
      obj.subCategoryId = 47;
      delete obj.subCategory;
      break;
    case _.toLower("movie"):
      obj.subCategoryId = 48;
      delete obj.subCategory;
      break;
    case _.toLower("newspaper"):
      obj.subCategoryId = 49;
      delete obj.subCategory;
      break;
    case _.toLower("air"):
      obj.subCategoryId = 50;
      delete obj.subCategory;
      break;
    case _.toLower("hotel"):
      obj.subCategoryId = 51;
      delete obj.subCategory;
      break;
    case _.toLower("rental"):
      obj.subCategoryId = 52;
      delete obj.subCategory;
      break;
    case _.toLower("vacation"):
      obj.subCategoryId = 53;
      delete obj.subCategory;
      break;
    case _.toLower("gasoline"):
      obj.subCategoryId = 54;
      delete obj.subCategory;
      break;
    case _.toLower("parking"):
      obj.subCategoryId = 55;
      delete obj.subCategory;
      break;
    case _.toLower("service"):
      obj.subCategoryId = 56;
      delete obj.subCategory;
      break;
    case _.toLower("parts"):
      obj.subCategoryId = 57;
      delete obj.subCategory;
      break;
    case _.toLower("payment"):
      obj.subCategoryId = 58;
      delete obj.subCategory;
      break;
    case _.toLower("auto insurance"):
      obj.subCategoryId = 59;
      delete obj.subCategory;
      break;
    case _.toLower("transit"):
      obj.subCategoryId = 60;
      delete obj.subCategory;
      break;
    case _.toLower("taxi"):
      obj.subCategoryId = 61;
      delete obj.subCategory;
      break;
    case _.toLower("gift"):
      obj.subCategoryId = 62;
      delete obj.subCategory;
      break;
    case _.toLower("charity"):
      obj.subCategoryId = 63;
      delete obj.subCategory;
      break;
    case _.toLower("advertising"):
      obj.subCategoryId = 64;
      delete obj.subCategory;
      break;
    case _.toLower("office supply"):
      obj.subCategoryId = 65;
      delete obj.subCategory;
      break;
    case _.toLower("printing"):
      obj.subCategoryId = 66;
      delete obj.subCategory;
      break;
    case _.toLower("shipping"):
      obj.subCategoryId = 67;
      delete obj.subCategory;
      break;
    case _.toLower("legal"):
      obj.subCategoryId = 68;
      delete obj.subCategory;
      break;
    case _.toLower("federal"):
      obj.subCategoryId = 69;
      delete obj.subCategory;
      break;
    case _.toLower("state"):
      obj.subCategoryId = 70;
      delete obj.subCategory;
      break;
    case _.toLower("local"):
      obj.subCategoryId = 71;
      delete obj.subCategory;
      break;
    case _.toLower("sales"):
      obj.subCategoryId = 72;
      delete obj.subCategory;
      break;
    case _.toLower("property"):
      obj.subCategoryId = 73;
      delete obj.subCategory;
      break;
    default:
  }
};

const convertSubCatIdToCat = (dbObj, newObj) => {
  switch (dbObj.subCategoryId) {
    case 1:
      newObj.subCategory = _.toLower("grocery");
      break;
    case 2:
      newObj.subCategory = _.toLower("coffee");
      break;
    case 3:
      newObj.subCategory = _.toLower("fast");
      break;
    case 4:
      newObj.subCategory = _.toLower("restaurant");
      break;
    case 5:
      newObj.subCategory = _.toLower("take out");
      break;
    case 6:
      newObj.subCategory = _.toLower("delivery");
      break;
    case 7:
      newObj.subCategory = _.toLower("alcohol");
      break;
    case 8:
      newObj.subCategory = _.toLower("rent");
      break;
    case 9:
      newObj.subCategory = _.toLower("mortgage");
      break;
    case 10:
      newObj.subCategory = _.toLower("property insurance");
      break;
    case 11:
      newObj.subCategory = _.toLower("maintenance good");
      break;
    case 12:
      newObj.subCategory = _.toLower("maintenance service");
      break;
    case 13:
      newObj.subCategory = _.toLower("clothing");
      break;
    case 14:
      newObj.subCategory = _.toLower("book");
      break;
    case 15:
      newObj.subCategory = _.toLower("electronic");
      break;
    case 16:
      newObj.subCategory = _.toLower("hobby");
      break;
    case 17:
      newObj.subCategory = _.toLower("sporting good");
      break;
    case 18:
      newObj.subCategory = _.toLower("laundry");
      break;
    case 19:
      newObj.subCategory = _.toLower("hair");
      break;
    case 20:
      newObj.subCategory = _.toLower("message");
      break;
    case 21:
      newObj.subCategory = _.toLower("dentist");
      break;
    case 22:
      newObj.subCategory = _.toLower("doctor");
      break;
    case 23:
      newObj.subCategory = _.toLower("eye");
      break;
    case 24:
      newObj.subCategory = _.toLower("pharmacy");
      break;
    case 25:
      newObj.subCategory = _.toLower("health insurance");
      break;
    case 26:
      newObj.subCategory = _.toLower("gym");
      break;
    case 27:
      newObj.subCategory = _.toLower("sports");
      break;
    case 28:
      newObj.subCategory = _.toLower("service fee");
      break;
    case 29:
      newObj.subCategory = _.toLower("late");
      break;
    case 30:
      newObj.subCategory = _.toLower("finance");
      break;
    case 31:
      newObj.subCategory = _.toLower("atm");
      break;
    case 32:
      newObj.subCategory = _.toLower("bank");
      break;
    case 33:
      newObj.subCategory = _.toLower("commission");
      break;
    case 34:
      newObj.subCategory = _.toLower("television");
      break;
    case 35:
      newObj.subCategory = _.toLower("phone");
      break;
    case 36:
      newObj.subCategory = _.toLower("internet");
      break;
    case 37:
      newObj.subCategory = _.toLower("gas");
      break;
    case 38:
      newObj.subCategory = _.toLower("electricity");
      break;
    case 39:
      newObj.subCategory = _.toLower("other");
      break;
    case 40:
      newObj.subCategory = _.toLower("deposit");
      break;
    case 41:
      newObj.subCategory = _.toLower("withdrawal");
      break;
    case 42:
      newObj.subCategory = _.toLower("dividend");
      break;
    case 43:
      newObj.subCategory = _.toLower("cap");
      break;
    case 44:
      newObj.subCategory = _.toLower("buy");
      break;
    case 45:
      newObj.subCategory = _.toLower("sell");
      break;
    case 46:
      newObj.subCategory = _.toLower("art");
      break;
    case 47:
      newObj.subCategory = _.toLower("music");
      break;
    case 48:
      newObj.subCategory = _.toLower("movie");
      break;
    case 49:
      newObj.subCategory = _.toLower("newspaper");
      break;
    case 50:
      newObj.subCategory = _.toLower("air");
      break;
    case 51:
      newObj.subCategory = _.toLower("hotel");
      break;
    case 52:
      newObj.subCategory = _.toLower("rental");
      break;
    case 53:
      newObj.subCategory = _.toLower("vacation");
      break;
    case 54:
      newObj.subCategory = _.toLower("gasoline");
      break;
    case 55:
      newObj.subCategory = _.toLower("parking");
      break;
    case 56:
      newObj.subCategory = _.toLower("service");
      break;
    case 57:
      newObj.subCategory = _.toLower("parts");
      break;
    case 58:
      newObj.subCategory = _.toLower("payment");
      break;
    case 59:
      newObj.subCategory = _.toLower("auto insurance");
      break;
    case 60:
      newObj.subCategory = _.toLower("transit");
      break;
    case 61:
      newObj.subCategory = _.toLower("taxi");
      break;
    case 62:
      newObj.subCategory = _.toLower("gift");
      break;
    case 63:
      newObj.subCategory = _.toLower("charity");
      break;
    case 64:
      newObj.subCategory = _.toLower("advertising");
      break;
    case 65:
      newObj.subCategory = _.toLower("office supply");
      break;
    case 66:
      newObj.subCategory = _.toLower("printing");
      break;
    case 67:
      newObj.subCategory = _.toLower("shipping");
      break;
    case 68:
      newObj.subCategory = _.toLower("legal");
      break;
    case 69:
      newObj.subCategory = _.toLower("federal");
      break;
    case 70:
      newObj.subCategory = _.toLower("state");
      break;
    case 71:
      newObj.subCategory = _.toLower("local");
      break;
    case 72:
      newObj.subCategory = _.toLower("sales");
      break;
    case 73:
      newObj.subCategory = _.toLower("property");
      break;

    default:
  }
};
