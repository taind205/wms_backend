'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExportProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ExportProduct.belongsTo(models.ImportProduct);
      // ExportProduct.belongsTo(models.Export);
      //ImportProduct.belongsTo(models.Import);
    }
  }
  ExportProduct.init({
    ImportProductId:
    {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      references: {
        model: 'ImportProducts', // 'Movies' would also work
        key: 'id'
      }
    },
    ExportId:
    {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      references: {
        model: 'Exports', // 'Movies' would also work
        key: 'id'
      }
    },
    productNumber: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ExportProduct',
    timestamps: true,
    updatedAt: false//'updateTimestamp'
  });
  return ExportProduct;
};