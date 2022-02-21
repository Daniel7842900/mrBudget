"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "firstName", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("users", "lastName", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("users", "email", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("users", "password", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "firstName", {
      type: Sequelize.STRING,
    });

    await queryInterface.changeColumn("users", "lastName", {
      type: Sequelize.STRING,
    });

    await queryInterface.changeColumn("users", "email", {
      type: Sequelize.STRING,
      validate: {
        isEmail: true,
      },
    });

    await queryInterface.changeColumn("users", "password", {
      type: Sequelize.STRING,
    });
  },
};
