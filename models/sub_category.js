module.exports = (sequelize, Sequelize) => {
  const SubCategory = sequelize.define("sub_category", {
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  SubCategory.associate = function (models) {
    SubCategory.hasMany(models.item);
    SubCategory.belongsTo(models.category);
  };

  return SubCategory;
};
