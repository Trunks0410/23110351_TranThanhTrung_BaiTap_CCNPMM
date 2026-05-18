"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("products", "views", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("products", "views");
  },
};
