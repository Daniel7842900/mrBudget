"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("finances", "startDate", {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
    await queryInterface.changeColumn("finances", "endDate", {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("finances", "startDate", {
      type: Sequelize.DATEONLY,
    });
    await queryInterface.changeColumn("finances", "endDate", {
      type: Sequelize.DATEONLY,
    });
  },
};
