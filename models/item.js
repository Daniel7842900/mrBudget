module.exports = (sequelize, Sequelize) => {
  const Item = sequelize.define("item", {
    amount: {
      type: Sequelize.FLOAT,
    },
  });

  Item.associate = function (models) {
    Item.belongsTo(models.category);
    Item.belongsTo(models.finance);
  };

  return Item;
};
