"use strict";

const { sequelize } = require("../models");

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await sequelize.transaction();
    try {
      await queryInterface.bulkInsert(
        "categories",
        [
          {
            type: "Income",
            catId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Grocery",
            catId: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Fee",
            catId: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Utility",
            catId: 4,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Food",
            catId: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Investment",
            catId: 6,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Shopping",
            catId: 7,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Alcohol",
            catId: 8,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Entertainment",
            catId: 9,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Insurance",
            catId: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Loan",
            catId: 11,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Subscription",
            catId: 12,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Transportation",
            catId: 13,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Etc",
            catId: 14,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Personal care",
            catId: 15,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Travel",
            catId: 16,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Health",
            catId: 17,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Gift",
            catId: 18,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Business service",
            catId: 19,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Tax",
            catId: 20,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            type: "Housing",
            catId: 21,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction: transaction }
      );

      await transaction.commit();
    } catch (error) {
      console.log(error);
      await transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete("categories", null, {}),
        { transaction: transaction };

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },
};
