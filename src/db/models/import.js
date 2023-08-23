'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Import extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Import.belongsToMany(models.Product, { through: models.ImportProduct });
      Import.belongsTo(models.Status);
      Import.belongsTo(models.Warehouse);
      Import.belongsTo(models.User,{ as: 'createdUser', foreignKey: 'createdBy' });
      Import.belongsTo(models.User,{ as: 'approvedUser', foreignKey: 'approvedBy' });
    }
  }
  Import.init({
    importDate: DataTypes.DATE,
    note: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Import',
  });
  return Import;
};