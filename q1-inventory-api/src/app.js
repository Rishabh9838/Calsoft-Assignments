const express = require('express');
const cors = require('cors');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', inventoryRoutes);

// Root info route
app.get('/', (req, res) => {
  res.json({
    assignment: "Calsoft Assignment - Question 1",
    api: "getInventoryDetails",
    description: "Fetches annual inventory report between two dates",
    endpoint: "GET /api/getInventoryDetails?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD",
    example: "http://localhost:3001/api/getInventoryDetails?startDate=2024-01-01&endDate=2024-12-31",
    tables: {
      Inventory: ["id", "purchase_dt", "cost"],
      InventoryDetails: ["id", "inventory_id (FK)", "inventory_details"],
    },
    techStack: "Node.js + Express.js + Sequelize + SQLite",
    architecture: {
      models: ["Inventory", "InventoryDetails"],
      service: "InventoryService",
      controller: "InventoryController",
      database: "SQLite with Sequelize ORM",
    },
  });
});

module.exports = app;
