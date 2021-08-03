module.exports = (sequelize, Sequelize) => {
  const Item = sequelize.define("item", {
    amount: {
      type: Sequelize.FLOAT,
    },
  });

  return Item;
};
