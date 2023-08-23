'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WarehouseKeepers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      WarehouseId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      isActive: {
        allowNull: false,
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('WarehouseKeepers');
  }
};