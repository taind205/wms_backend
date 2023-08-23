'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductStorageLocation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductStorageLocation.belongsTo(models.StorageLocation);
      ProductStorageLocation.belongsTo(models.ImportProduct);//,{foreignKey: 'ImportProductId'});
      // ImportProduct.belongsTo(models.Import);
    }
  }
  ProductStorageLocation.init({
    ImportProductId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      references: {
        model: 'ImportProducts', // 'Movies' would also work
        key: 'id'
      }
    },
    StorageLocationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      references: {
        model: 'StorageLocations', // 'Movies' would also work
        key: 'id'
      }
    },
    inventoryNumber: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProductStorageLocation',
    timestamps: true,
    updatedAt: false//'updateTimestamp'
  });
  return ProductStorageLocation;
};