'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProductTag.belongsTo(models.Product)
    }
  }
  ProductTag.init({
    ProductId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      references: {
        model: 'Products', // 'Movies' would also work
        key: 'id'
      }
    },
    TagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      references: {
        model: 'Tags', // 'Movies' would also work
        key: 'id'
      }
    },
    // new: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProductTag',
    timestamps: true,
    updatedAt: false//'updateTimestamp'
  });
  return ProductTag;
};