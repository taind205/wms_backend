'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Export extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Export.belongsToMany(models.ImportProduct, { through: models.ExportProduct });
      Export.belongsTo(models.Status);
      Export.belongsTo(models.Warehouse);
      Export.belongsTo(models.Store);
      Export.belongsTo(models.User,{ as: 'createdUser', foreignKey: 'createdBy' });
      Export.belongsTo(models.User,{ as: 'approvedUser', foreignKey: 'approvedBy' });
    }
  }
  Export.init({
    exportDate: DataTypes.DATE,
    note: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Export',
  });
  return Export;
};