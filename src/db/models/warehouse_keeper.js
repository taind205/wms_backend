'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WarehouseKeeper extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WarehouseKeeper.belongsTo(models.Warehouse);
      WarehouseKeeper.belongsTo(models.User)
    }
  }
  WarehouseKeeper.init({
    // WarehouseId: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: false,
    //   references: {
    //     model: 'Warehouses', // 'Movies' would also work
    //     key: 'id'
    //   }},
    // UserId: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: false,
    //   references: {
    //     model: 'Users', // 'Movies' would also work
    //     key: 'id'
    //   }
    // },
    isActive: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'WarehouseKeeper',
    timestamps: true,
    updatedAt: false//'updateTimestamp'
  });
  return WarehouseKeeper;
};