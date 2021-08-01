module.exports = (sequelize, Sequelize) => {
  const Item = sequelize.define("item", {
    amount: {
      type: Sequelize.FLOAT,
    },
  });

  // one category can have many item
  // one finance can have many item

  return Item;
};
