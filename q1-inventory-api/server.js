/**
 * QUESTION 1 - Calsoft Assignment
 * API: getInventoryDetails()
 * Fetches annual inventory report between two dates
 *
 * Tables:
 *   Inventory:        id, purchase_dt, cost
 *   InventoryDetails: id, inventory_id (FK), inventory_details
 *
 * Endpoint: GET /api/getInventoryDetails?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */

const app = require('./src/app');
const { sequelize, Inventory, InventoryDetails } = require('./src/models');

const PORT = 3001;

// Initialize database and start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    await sequelize.sync({ force: true });

    // Seed data
    await Inventory.bulkCreate([
      { id: 1, purchase_dt: "2024-01-10", cost: 1500.0 },
      { id: 2, purchase_dt: "2024-03-22", cost: 2200.5 },
      { id: 3, purchase_dt: "2024-06-15", cost: 800.0 },
      { id: 4, purchase_dt: "2024-09-01", cost: 3100.75 },
      { id: 5, purchase_dt: "2023-11-05", cost: 950.0 },
      { id: 6, purchase_dt: "2025-02-14", cost: 4400.0 },
    ]);

    await InventoryDetails.bulkCreate([
      { id: 1, inventory_id: 1, inventory_details: "Laptop - Dell XPS 15" },
      { id: 2, inventory_id: 2, inventory_details: "Server Rack - HP ProLiant" },
      { id: 3, inventory_id: 3, inventory_details: "Keyboard - Mechanical RGB" },
      { id: 4, inventory_id: 4, inventory_details: "Network Switch - Cisco 48-port" },
      { id: 5, inventory_id: 5, inventory_details: "Monitor - LG 27 inch 4K" },
      { id: 6, inventory_id: 6, inventory_details: "Storage - NAS 32TB" },
    ]);

    console.log('✅ Database seeded with sample data.');

    app.listen(PORT, () => {
      console.log("╔══════════════════════════════════════════════════╗");
      console.log("║    CALSOFT ASSIGNMENT - QUESTION 1               ║");
      console.log("║    Inventory Details API                         ║");
      console.log(`║    Server running on http://localhost:${PORT}       ║`);
      console.log("╚══════════════════════════════════════════════════╝");
      console.log("\n📌 Test Endpoint:");
      console.log(`   http://localhost:${PORT}/api/getInventoryDetails?startDate=2024-01-01&endDate=2024-12-31\n`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
  }
}

startServer();
