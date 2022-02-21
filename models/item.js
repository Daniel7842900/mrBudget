module.exports = (sequelize, Sequelize) => {
  const Item = sequelize.define("item", {
    amount: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  Item.associate = function (models) {
    Item.belongsTo(models.category);
    Item.belongsTo(models.sub_category);
    Item.belongsTo(models.finance);
  };

  return Item;
};
