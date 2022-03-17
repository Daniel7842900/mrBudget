"use strict";

const { sequelize } = require("../models");

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await sequelize.transaction();
    try {
      await queryInterface.bulkInsert(
        "sub_categories",
        [
          {
            type: "grocery",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 5,
          },
          {
            type: "coffee",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 5,
          },
          {
            type: "fast",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 5,
          },
          {
            type: "restaurant",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 5,
          },
          {
            type: "take out",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 5,
          },
          {
            type: "delivery",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 5,
          },
          {
            type: "alcohol",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 5,
          },
          {
            type: "rent",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 21,
          },
          {
            type: "mortgage",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 21,
          },
          {
            type: "property insurance",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 21,
          },
          {
            type: "maintenance good",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 21,
          },
          {
            type: "maintenance service",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 21,
          },
          {
            type: "clothing",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 7,
          },
          {
            type: "book",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 7,
          },
          {
            type: "electronic",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 7,
          },
          {
            type: "hobby",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 7,
          },
          {
            type: "sporting good",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 7,
          },
          {
            type: "laundry",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 15,
          },
          {
            type: "hair",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 15,
          },
          {
            type: "massage",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 15,
          },
          {
            type: "dentist",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 17,
          },
          {
            type: "doctor",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 17,
          },
          {
            type: "eye",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 17,
          },
          {
            type: "pharmacy",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 17,
          },
          {
            type: "health insurance",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 17,
          },
          {
            type: "gym",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 17,
          },
          {
            type: "sports",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 17,
          },
          {
            type: "service",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 3,
          },
          {
            type: "late",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 3,
          },
          {
            type: "finance",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 3,
          },
          {
            type: "atm",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 3,
          },
          {
            type: "bank",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 3,
          },
          {
            type: "commission",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 3,
          },
          {
            type: "television",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 4,
          },
          {
            type: "phone",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 4,
          },
          {
            type: "internet",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 4,
          },
          {
            type: "gas",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 4,
          },
          {
            type: "electricity",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 4,
          },
          {
            type: "other",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 4,
          },
          {
            type: "deposit",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 6,
          },
          {
            type: "withdrawal",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 6,
          },
          {
            type: "dividend",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 6,
          },
          {
            type: "cap",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 6,
          },
          {
            type: "buy",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 6,
          },
          {
            type: "sell",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 6,
          },
          {
            type: "art",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 9,
          },
          {
            type: "music",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 9,
          },
          {
            type: "movie",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 9,
          },
          {
            type: "newspaper",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 9,
          },
          {
            type: "air",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 16,
          },
          {
            type: "hotel",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 16,
          },
          {
            type: "rental",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 16,
          },
          {
            type: "vacation",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 16,
          },
          {
            type: "gasoline",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 13,
          },
          {
            type: "parking",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 13,
          },
          {
            type: "service",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 13,
          },
          {
            type: "parts",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 13,
          },
          {
            type: "payment",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 13,
          },
          {
            type: "auto insurance",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 13,
          },
          {
            type: "transit",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 13,
          },
          {
            type: "taxi",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 13,
          },
          {
            type: "gift",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 18,
          },
          {
            type: "charity",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 18,
          },
          {
            type: "advertising",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 19,
          },
          {
            type: "office supply",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 19,
          },
          {
            type: "printing",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 19,
          },
          {
            type: "shipping",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 19,
          },
          {
            type: "legal",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 19,
          },
          {
            type: "federal",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 20,
          },
          {
            type: "state",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 20,
          },
          {
            type: "local",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 20,
          },
          {
            type: "sales",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 20,
          },
          {
            type: "property",
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 20,
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
      await queryInterface.bulkDelete("sub_categories", null, {}),
        { transaction: transaction };

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },
};
