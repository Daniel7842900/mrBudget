module.exports = (sequelize, Sequelize) => {
  const Finance = sequelize.define("finance", {
    startDate: {
      type: Sequelize.DATE,
    },
    endDate: {
      type: Sequelize.DATE,
    },
  });

  Finance.associate = function (models) {
    Finance.hasMany(models.item, {
      foreignKey: "finance_id",
    });

    Finance.belongsTo(models.finance_type);
  };

  return Finance;
};
