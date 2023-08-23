'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Account.belongsTo(models.User)
      Account.belongsTo(models.Role)
      Account.belongsTo(models.Status)
    }
  }
  Account.init({
    id: { type:DataTypes.STRING, primaryKey: true,},
    // userID: DataTypes.INTEGER,
    // roleID: DataTypes.INTEGER,
    // statusID: DataTypes.INTEGER,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};