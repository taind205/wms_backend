'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StorageLocation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
      StorageLocation.hasMany(models.ProductStorageLocation);
      StorageLocation.belongsTo(models.Warehouse);
      StorageLocation.belongsTo(models.Status);
      StorageLocation.belongsTo(models.User,{foreignKey: 'modifiedBy'});
    }
  }
  StorageLocation.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.STRING(2000)
  }, {
    sequelize,
    modelName: 'StorageLocation',
  });
  return StorageLocation;
};