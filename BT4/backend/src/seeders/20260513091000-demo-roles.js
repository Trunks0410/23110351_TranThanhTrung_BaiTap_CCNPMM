"use strict";

export default {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert("roles", [
      { id: 1, role_name: "ADMIN" },
      { id: 2, role_name: "MEMBER" },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
