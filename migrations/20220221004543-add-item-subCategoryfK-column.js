"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn(
        "items",
        "subCategoryId",
        Sequelize.INTEGER,
        {
          after: "categoryId",
        }
      );

      await queryInterface.addConstraint("items", {
        fields: ["subCategoryId"],
        type: "foreign key",
        name: "subCategoryId",
        references: {
          table: "sub_categories",
          field: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        after: "categoryId",
        transaction,
      });

      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeConstraint("items", "subCategoryId", {
        transaction,
      });

      await queryInterface.removeColumn("items", "subCategoryId");

      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
