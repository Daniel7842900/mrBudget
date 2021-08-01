module.exports = (sequelize, Sequelize) => {
  const Finance = sequelize.define("finance", {
    startDate: {
      type: Sequelize.DATE,
    },
    endDate: {
      type: Sequelize.DATE,
    },
  });

  return Finance;
};
