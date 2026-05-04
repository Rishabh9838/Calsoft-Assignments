const { Sequelize } = require('sequelize');
const { Inventory, InventoryDetails } = require('../models');

class InventoryService {
  /**
   * Fetches inventory joined with details between two dates (inclusive).
   * Simulates: SELECT i.*, d.inventory_details
   *            FROM Inventory i
   *            JOIN InventoryDetails d ON i.id = d.inventory_id
   *            WHERE i.purchase_dt BETWEEN startDate AND endDate
   */
  async getInventoryDetails(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);

    const results = await Inventory.findAll({
      where: {
        purchase_dt: {
          [Sequelize.Op.between]: [
            start.toISOString().split('T')[0],
            end.toISOString().split('T')[0]
          ],
        },
      },
      include: [{
        model: InventoryDetails,
        required: true,
      }],
    });

    return results.map(item => ({
      id: item.id,
      purchase_dt: item.purchase_dt,
      cost: parseFloat(item.cost),
      inventory_details: item.InventoryDetail ? item.InventoryDetail.inventory_details : 'N/A',
    }));
  }
}

module.exports = InventoryService;
