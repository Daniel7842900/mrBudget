"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const result = await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.removeConstraint(
          "sub_categories",
          "sub_categories_ibfk_1",
          { transaction: t }
        );

        await queryInterface.addConstraint("sub_categories", {
          fields: ["categoryId"],
          type: "foreign key",
          name: "sub_categories_ibfk_1",
          references: {
            table: "categories",
            field: "catId",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          transaction: t,
        });
      });
    } catch (error) {
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      const result = await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.removeConstraint(
          "sub_categories",
          "sub_categories_ibfk_1",
          { transaction: t }
        );

        await queryInterface.addConstraint("sub_categories", {
          fields: ["categoryId"],
          type: "foreign key",
          name: "sub_categories_ibfk_1",
          references: {
            table: "categories",
            field: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          transaction: t,
        });
      });
    } catch (error) {
      throw error;
    }
  },
};
