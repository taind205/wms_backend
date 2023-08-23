'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('Users', [{
      fullName: 'Nguyễn Văn A',
      email: 'sky@gmail.com',
      gender: 0,
      dateOfBirth:'2/2/2001',
      phoneNumber:'0932323232',
      citizenID:'900233999',
      address:"Q.7, Tp.HCM",
      profileImage:""
    },{
      fullName: 'Lê Văn B',
      email: 'apple@gmail.com',
      gender: 1,
      dateOfBirth:'5/5/1995',
      phoneNumber:'0935678567',
      citizenID:'900888777',
      address:"Q.1, Tp.HCM",
      profileImage:""
    },{
      fullName: 'Trần Văn C',
      email: 'tiger@gmail.com',
      gender: 1,
      dateOfBirth: '1995-12-30',
      phoneNumber:'0937373737',
      citizenID:'900777555',
      address:"Q.9, Tp.HCM",
      profileImage:""
    },], {});

    await queryInterface.bulkInsert('Accounts', [{
      accountID: 'nguyenvana',
      userID: 1,
      roleID: 1,
      statusID: 1,
      password:'q123',
    },{
      accountID: 'nvb',
      userID: 2,
      roleID: 2,
      statusID: 1,
      password:'qwe',
    },
    {
      accountID: 'vanc',
      userID: 3,
      roleID: 3,
      statusID: 1,
      password:'123456',
    },], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
