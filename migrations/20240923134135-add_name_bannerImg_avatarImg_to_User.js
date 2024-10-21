'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("User", "name", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Name"
    });
    await queryInterface.addColumn("User", "banner_img", {
      type: Sequelize.BLOB,
      allowNull: true
    });
    await queryInterface.addColumn("User", "avatar_img", {
      type: Sequelize.BLOB,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('User', "name");
    await queryInterface.removeColumn('User', "banner_img");
    await queryInterface.removeColumn('User', "avatar_img");
  }
};
