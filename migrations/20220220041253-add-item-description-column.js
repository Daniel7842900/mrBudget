"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("items", "description", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "amount",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("items", "description");
  },
};
