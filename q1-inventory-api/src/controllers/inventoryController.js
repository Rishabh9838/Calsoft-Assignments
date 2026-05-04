class InventoryController {
  constructor(inventoryService) {
    this.inventoryService = inventoryService;
  }

  /**
   * GET /api/getInventoryDetails?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
   */
  async getInventoryDetails(req, res) {
    const { startDate, endDate } = req.query;

    // Validation
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Both startDate and endDate query parameters are required.",
        example: "/api/getInventoryDetails?startDate=2024-01-01&endDate=2024-12-31",
      });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Dates must be in YYYY-MM-DD format.",
      });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "startDate cannot be after endDate.",
      });
    }

    try {
      const data = await this.inventoryService.getInventoryDetails(startDate, endDate);

      return res.status(200).json({
        success: true,
        startDate,
        endDate,
        totalRecords: data.length,
        totalCost: data.reduce((sum, item) => sum + item.cost, 0).toFixed(2),
        inventoryDetails: data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Database error occurred.",
        error: error.message,
      });
    }
  }
}

module.exports = InventoryController;
