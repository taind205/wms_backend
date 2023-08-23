'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Account);
      User.hasMany(models.WarehouseKeeper);
      // User.hasMany(models.Import,{foreignKey: 'createdBy'},{ as: 'createdBy' });
      // User.hasMany(models.Import,{foreignKey: 'approvedBy'},{ as: 'approvedBy' });
    }
  }
  User.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    dateOfBirth: DataTypes.DATEONLY,
    phoneNumber: DataTypes.STRING,
    citizenID: DataTypes.STRING,
    address: DataTypes.STRING,
    profileImage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};