const category = {
  food: "Food & Dining",
  housing: "Housing",
  shopping: "Shopping",
  "personal care": "Personal Care",
  health: "Health & Fitness",
  fee: "Fees & Charges",
  utility: "Bills & Utility",
  investment: "Investment",
  entertainment: "Entertainment",
  travel: "Travel",
  transportation: "Transportation",
  gift: "Gifts & Donations",
  "business service": "Business Services",
  tax: "Taxes",
  etc: "Etc",
};

const subCategory = {
  food: {
    grocery: "Groceries",
    coffee: "Coffee Shops",
    fast: "Fast Food",
    restaurant: "Restaurants",
    "take out": "Take Out",
    delivery: "Delivery",
    alcohol: "Alcohol",
  },
  housing: {
    rent: "Rent",
    mortgage: "Mortgage",
    "property insurance": "Property Insurance",
    "maintenance good": "Maintenance Goods",
    "maintenance service": "Maintenance Service",
  },
  shopping: {
    clothing: "Clothing",
    book: "Books",
    electronic: "Electronics & Software",
    hobby: "Hobbies",
    "sporting good": "Sporting Goods",
  },
  "personal care": {
    laundry: "Laundry",
    hair: "Hair",
    massage: "Spa & Massage",
  },
  health: {
    dentist: "Dentist",
    doctor: "Doctor",
    eye: "Eye Care",
    pharmacy: "Pharmacy",
    "health insurance": "Health insurance",
    gym: "Gym",
    sports: "Sports",
  },
  fee: {
    "service fee": "Service Fee",
    late: "Late Fee",
    finance: "Finance Fee",
    atm: "ATM Fee",
    bank: "Bank Fee",
    commission: "Commissions",
  },
  utility: {
    television: "Television",
    phone: "Phone bill",
    internet: "Internet",
    gas: "Gas",
    electricity: "Electricity",
    other: "Others",
  },
  investment: {
    deposit: "Deposit",
    withdrawal: "Withdrawal",
    dividend: "Dividends",
    cap: "Capital Gains",
    buy: "Buy",
    sell: "Sell",
  },
  entertainment: {
    art: "Arts",
    music: "Music",
    movie: "Movies & DVDs",
    newspaper: "Newspaper & Magazines",
  },
  travel: {
    air: "Air Travel",
    hotel: "Hotel",
    rental: "Rental Car & Taxi",
    vacation: "Vacation",
  },
  transportation: {
    gasoline: "Gas & Fuel",
    parking: "Parking",
    service: "Service",
    parts: "Auto Parts",
    payment: "Auto Payment",
    "auto insurance": "Auto insurance",
    transit: "Transit",
    taxi: "Uber & Taxi",
  },
  gift: {
    gift: "Gift",
    charity: "Charity",
  },
  "business service": {
    advertising: "Advertising",
    "office supply": "Office Supplies",
    printing: "Printing",
    shipping: "Shipping",
    legal: "Legal",
  },
  tax: {
    federal: "Federal Tax",
    state: "State Tax",
    local: "Local Tax",
    sales: "Sales Tax",
    property: "Property Tax",
  },
  etc: null,
};

const getCatDisplay = (objCat) => {
  return category[objCat];
};

const getSubCatDisplay = (objCat, objSubCat) => {
  if (subCategory[objCat] != null) {
    return subCategory[objCat][objSubCat];
  }
  return null;
};
