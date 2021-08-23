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
    Finance.hasMany(models.item);

    Finance.belongsTo(models.finance_type);
  };

  return Finance;
};
