"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // await queryInterface.removeConstraint("sub_categories", "categoryId", {
      //   transaction,
      // });

      await queryInterface.addConstraint("sub_categories", {
        fields: ["categoryId"],
        type: "foreign key",
        name: "sub_categories_ibfk_1",
        references: {
          table: "categories",
          field: "id",
        },
        onDelete: "CASCADE",
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
      await queryInterface.removeConstraint(
        "sub_categories",
        "sub_categories_ibfk_1",
        {
          transaction,
        }
      );

      // await queryInterface.addConstraint("sub_categories", {
      //   fields: ["category_id"],
      //   type: "foreign key",
      //   name: "sub_categories_ibfk_1",
      //   references: {
      //     table: "categories",
      //     field: "id",
      //   },
      //   transaction,
      // });
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
