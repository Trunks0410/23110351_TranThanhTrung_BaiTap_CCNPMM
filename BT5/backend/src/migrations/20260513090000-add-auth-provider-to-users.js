"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "auth_provider", {
      type: Sequelize.STRING(50),
      allowNull: true,
      defaultValue: "local",
      after: "password",
    });
    await queryInterface.addColumn("users", "auth_provider_id", {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: "auth_provider",
    });

    // Cập nhật phone và password thành allowNull: true (vì Google login không cần cái này)
    await queryInterface.changeColumn("users", "phone", {
      type: Sequelize.STRING(20),
      allowNull: true,
      unique: true,
    });
    await queryInterface.changeColumn("users", "password", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "auth_provider_id");
    await queryInterface.removeColumn("users", "auth_provider");
    
    await queryInterface.changeColumn("users", "phone", {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn("users", "password", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },
};
