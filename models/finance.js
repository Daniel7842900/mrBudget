module.exports = (sequelize, Sequelize) => {
  const Finance = sequelize.define("finance", {
    startDate: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
  });

  Finance.associate = function (models) {
    Finance.hasMany(models.item, {
      onDelete: "CASCADE",
    });

    Finance.belongsTo(models.finance_type);
    Finance.belongsTo(models.user);
  };

  return Finance;
};
