/**
 * QUESTION 2 - Calsoft Assignment
 * API: deviceConfigNotification
 * Triggers JSON notifications when config_changed = true for any device.
 * Simulates a batch job that checks devices and fires notifications.
 *
 * Table: Devices (id, device_ip, device_details, config_changed)
 *
 * Endpoints:
 *   GET  /api/devices                  - List all devices
 *   PUT  /api/devices/:id/config       - Batch job sets config_changed flag
 *   POST /api/deviceConfigNotification - Check & trigger notifications
 */

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────
//  IN-MEMORY DATABASE
// ─────────────────────────────────────────────

// Table: Devices (id, device_ip, device_details, config_changed)
let devicesTable = [
  { id: 1, device_ip: "192.168.1.10", device_details: "Router - Cisco 4321", config_changed: false },
  { id: 2, device_ip: "192.168.1.20", device_details: "Switch - Cisco Catalyst 9200", config_changed: true },
  { id: 3, device_ip: "192.168.1.30", device_details: "Firewall - Palo Alto PA-220", config_changed: false },
  { id: 4, device_ip: "192.168.1.40", device_details: "Access Point - Aruba AP-515", config_changed: true },
  { id: 5, device_ip: "192.168.1.50", device_details: "Load Balancer - F5 BIG-IP", config_changed: false },
];

// Notification log (simulates message queue / notification store)
const notificationLog = [];

// ─────────────────────────────────────────────
//  SERVICE LAYER
// ─────────────────────────────────────────────

class NotificationService {
  /**
   * Builds a structured JSON notification message for a device.
   */
  buildNotification(device) {
    return {
      notificationId: `NOTIF-${Date.now()}-${device.id}`,
      timestamp: new Date().toISOString(),
      alertType: "CONFIG_CHANGE_DETECTED",
      severity: "HIGH",
      device: {
        id: device.id,
        ip: device.device_ip,
        details: device.device_details,
      },
      message: `Configuration changed detected on device [${device.device_ip}] - ${device.device_details}`,
      action: "REVIEW_AND_APPROVE_CONFIG",
    };
  }

  /**
   * Main logic: scans all devices, fires notification for each
   * where config_changed = true, then resets the flag.
   */
  triggerConfigNotifications() {
    const changedDevices = devicesTable.filter((d) => d.config_changed === true);

    if (changedDevices.length === 0) {
      return {
        triggered: 0,
        message: "No config changes detected. No notifications sent.",
        notifications: [],
      };
    }

    const notifications = changedDevices.map((device) => {
      const notification = this.buildNotification(device);
      notificationLog.push(notification);

      // Reset the flag after notification (simulate processed)
      device.config_changed = false;

      return notification;
    });

    return {
      triggered: notifications.length,
      message: `${notifications.length} notification(s) triggered for config changes.`,
      notifications,
    };
  }
}

// ─────────────────────────────────────────────
//  CONTROLLER LAYER
// ─────────────────────────────────────────────

class DeviceController {
  constructor(notificationService) {
    this.notificationService = notificationService;
  }

  // GET /api/devices - list all devices
  getAllDevices(req, res) {
    return res.status(200).json({
      success: true,
      totalDevices: devicesTable.length,
      devices: devicesTable,
    });
  }

  // PUT /api/devices/:id/config - simulate batch job flipping config_changed flag
  updateConfigFlag(req, res) {
    const id = parseInt(req.params.id);
    const { config_changed } = req.body;

    const device = devicesTable.find((d) => d.id === id);
    if (!device) {
      return res.status(404).json({ success: false, message: `Device with id ${id} not found.` });
    }

    if (typeof config_changed !== "boolean") {
      return res.status(400).json({ success: false, message: "config_changed must be a boolean (true/false)." });
    }

    device.config_changed = config_changed;
    return res.status(200).json({
      success: true,
      message: `Device ${id} config_changed set to ${config_changed}`,
      device,
    });
  }

  // POST /api/deviceConfigNotification - trigger notifications for changed devices
  deviceConfigNotification(req, res) {
    const result = this.notificationService.triggerConfigNotifications();
    return res.status(200).json({ success: true, ...result });
  }

  // GET /api/notifications/log - view all sent notifications
  getNotificationLog(req, res) {
    return res.status(200).json({
      success: true,
      totalNotifications: notificationLog.length,
      log: notificationLog,
    });
  }
}

// ─────────────────────────────────────────────
//  ROUTES
// ─────────────────────────────────────────────

const notificationService = new NotificationService();
const deviceController = new DeviceController(notificationService);

app.get("/api/devices", (req, res) => deviceController.getAllDevices(req, res));
app.put("/api/devices/:id/config", (req, res) => deviceController.updateConfigFlag(req, res));
app.post("/api/deviceConfigNotification", (req, res) => deviceController.deviceConfigNotification(req, res));
app.get("/api/notifications/log", (req, res) => deviceController.getNotificationLog(req, res));

app.get("/", (req, res) => {
  res.json({
    assignment: "Calsoft Assignment - Question 2",
    api: "deviceConfigNotification",
    description: "Triggers JSON notifications when config_changed = true on any device",
    techStack: "Node.js + Express.js",
    table: { Devices: ["id", "device_ip", "device_details", "config_changed"] },
    endpoints: {
      "GET /api/devices": "List all devices",
      "PUT /api/devices/:id/config": "Batch job - set config_changed flag",
      "POST /api/deviceConfigNotification": "Trigger notifications for changed devices",
      "GET /api/notifications/log": "View all sent notifications",
    },
  });
});

// ─────────────────────────────────────────────
//  START SERVER
// ─────────────────────────────────────────────

const PORT = 3002;
app.listen(PORT, () => {
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║    CALSOFT ASSIGNMENT - QUESTION 2               ║");
  console.log("║    Device Config Notification API                ║");
  console.log(`║    Server running on http://localhost:${PORT}       ║`);
  console.log("╚══════════════════════════════════════════════════╝");
  console.log("\n📌 Test Endpoints:");
  console.log(`   GET  http://localhost:${PORT}/api/devices`);
  console.log(`   POST http://localhost:${PORT}/api/deviceConfigNotification\n`);

  // Simulate batch job: Check for config changes every 30 seconds
  setInterval(() => {
    console.log("🔄 Batch job: Checking for device config changes...");
    const result = notificationService.triggerConfigNotifications();
    if (result.triggered > 0) {
      console.log(`📢 ${result.triggered} notification(s) sent.`);
    } else {
      console.log("✅ No config changes detected.");
    }
  }, 30000); // 30 seconds
});
