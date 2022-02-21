module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define("category", {
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  Category.associate = function (models) {
    Category.hasMany(models.item);
    Category.hasMany(models.sub_category),
      {
        onDelete: "CASCADE",
      };
  };

  return Category;
};
