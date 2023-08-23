'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Warehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Warehouse.belongsTo(models.User,{foreignKey: 'modifiedBy'});
      // Warehouse.belongsToMany(models.User, { through: models.WarehouseKeeper });
    }
  }
  Warehouse.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.STRING(2000)
  }, {
    sequelize,
    modelName: 'Warehouse',
  });
  return Warehouse;
};