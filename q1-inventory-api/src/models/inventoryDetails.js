const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InventoryDetails = sequelize.define('InventoryDetails', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    inventory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    inventory_details: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'inventory_details',
    timestamps: false,
  });

  return InventoryDetails;
};
