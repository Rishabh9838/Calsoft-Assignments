const sequelize = require('../config/database');
const InventoryModel = require('./inventory');
const InventoryDetailsModel = require('./inventoryDetails');

const Inventory = InventoryModel(sequelize);
const InventoryDetails = InventoryDetailsModel(sequelize);

// Define associations
Inventory.hasOne(InventoryDetails, { foreignKey: 'inventory_id' });
InventoryDetails.belongsTo(Inventory, { foreignKey: 'inventory_id' });

module.exports = {
  sequelize,
  Inventory,
  InventoryDetails,
};
