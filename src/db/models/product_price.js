'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductPrice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductPrice.belongsTo(models.Product);
      ProductPrice.belongsTo(models.User);
    }
  }
  ProductPrice.init({
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProductPrice',
    timestamps: true,
    updatedAt: false//'updateTimestamp'
  });
  return ProductPrice;
};