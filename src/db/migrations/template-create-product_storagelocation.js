'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductStorageLocations', {
      ImportProductId: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      StorageLocationId: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      inventoryNumber: {
        type: Sequelize.INTEGER
      },
      // // // userID: {
      // // //   type: Sequelize.INTEGER
      // // // },
      // // roleID: {
      // //   type: Sequelize.INTEGER
      // // },
      // name: {
      //   type: Sequelize.STRING
      // },
      // description: {
      //   type: Sequelize.STRING
      // },
      // categoryId: {
      //   type: Sequelize.INTEGER
      // },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      // updatedAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE
      // }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductStorageLocations');
  }
};