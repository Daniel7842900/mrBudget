module.exports = (sequelize, Sequelize) => {
  const Finance = sequelize.define("finance", {
    startDate: {
      type: Sequelize.DATEONLY,
    },
    endDate: {
      type: Sequelize.DATEONLY,
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
