module.exports = (sequelize, Sequelize) => {
  const FinanceType = sequelize.define("finance_type", {
    type: {
      type: Sequelize.STRING,
    },
  });

  FinanceType.associate = function (models) {
    FinanceType.hasMany(models.finance);
  };

  return FinanceType;
};
