const express = require('express');
const InventoryController = require('../controllers/inventoryController');
const InventoryService = require('../services/inventoryService');

const router = express.Router();
const inventoryService = new InventoryService();
const inventoryController = new InventoryController(inventoryService);

/**
 * GET /api/getInventoryDetails?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * Fetch inventory between two dates
 */
router.get('/getInventoryDetails', (req, res) =>
  inventoryController.getInventoryDetails(req, res)
);

module.exports = router;
