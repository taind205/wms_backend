'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImportProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    //   // define association here
    //   Tag.belongsTo(models.Category)
    // ImportProduct.belongsToMany(models.Export, { through: models.ExportProduct });
    ImportProduct.hasMany(models.ExportProduct)
    ImportProduct.belongsTo(models.Product);
    ImportProduct.belongsTo(models.Import);
    }
  }
  ImportProduct.init({
    
    // ProductId: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: false,
    //   references: {
    //     model: 'Products', // 'Movies' would also work
    //     key: 'id'
    //   }
    // },
    // ImportId: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: false,
    //   references: {
    //     model: 'Imports', // 'Movies' would also work
    //     key: 'id'
    //   }
    // },
    
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    expiryDate: DataTypes.DATE,
    productNumber: DataTypes.INTEGER,
    inventory: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ImportProduct',
    timestamps: true,
    updatedAt: false//'updateTimestamp'
  });
  return ImportProduct;
};