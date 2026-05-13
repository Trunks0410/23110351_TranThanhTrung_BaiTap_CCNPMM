"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("products", "is_promotion", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      after: "is_active",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("products", "is_promotion");
  },
};
