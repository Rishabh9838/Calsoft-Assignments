// Assignment implementation in JavaScript
// Question 1: Inventory between two dates

class InventoryItem {
  constructor(id, purchase_dt, cost) {
    this.id = id;
    this.purchase_dt = new Date(purchase_dt);
    this.cost = cost;
  }
}

class InventoryDetail {
  constructor(id, inventory_id, inventory_details) {
    this.id = id;
    this.inventory_id = inventory_id;
    this.inventory_details = inventory_details;
  }
}

class InventoryService {
  constructor(inventoryItems, inventoryDetails) {
    this.inventoryItems = inventoryItems;
    this.inventoryDetails = inventoryDetails;
  }

  getInventoryDetails(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const matchedInventory = this.inventoryItems.filter(
      item => item.purchase_dt >= start && item.purchase_dt <= end
    );

    return matchedInventory.map(item => {
      const details = this.inventoryDetails
        .filter(detail => detail.inventory_id === item.id)
        .map(detail => detail.inventory_details);

      return {
        inventory: {
          id: item.id,
          purchase_dt: item.purchase_dt.toISOString().split('T')[0],
          cost: item.cost,
        },
        details,
      };
    });
  }
}

// Question 2: Device config change notification

class Device {
  constructor(id, device_ip, device_details, config_changed = false) {
    this.id = id;
    this.device_ip = device_ip;
    this.device_details = device_details;
    this.config_changed = config_changed;
  }
}

class DeviceConfigNotificationService {
  constructor(devices) {
    this.devices = devices;
  }

  deviceConfigNotification() {
    const changedDevices = this.devices.filter(device => device.config_changed === true);

    return changedDevices.map(device => ({
      event: 'DEVICE_CONFIG_CHANGED',
      timestamp: new Date().toISOString(),
      payload: {
        id: device.id,
        device_ip: device.device_ip,
        device_details: device.device_details,
        config_changed: device.config_changed,
      },
    }));
  }
}

// Question 3: Efficient strategy for large dataset retrieval

class Post {
  constructor(id, post_by, post_dt, post_details) {
    this.id = id;
    this.post_by = post_by;
    this.post_dt = new Date(post_dt);
    this.post_details = post_details;
  }
}

class PostService {
  constructor(posts) {
    this.posts = posts.slice().sort((a, b) => a.post_dt - b.post_dt);
  }

  getPostsUploaded({ limit = 20, offset = 0, cursor = null } = {}) {
    if (cursor !== null && cursor !== undefined) {
      const index = this.posts.findIndex(post => post.id === cursor);
      if (index === -1) {
        return [];
      }
      return this.posts.slice(index + 1, index + 1 + limit);
    }

    return this.posts.slice(offset, offset + limit);
  }
}

function createSampleInventoryData() {
  const inventoryItems = [
    new InventoryItem(1, '2025-03-10', 1200),
    new InventoryItem(2, '2025-06-05', 900),
    new InventoryItem(3, '2025-10-18', 1500),
  ];

  const inventoryDetails = [
    new InventoryDetail(1, 1, 'Laptop battery replacement'),
    new InventoryDetail(2, 1, 'Warranty updated'),
    new InventoryDetail(3, 2, 'Printer toner installed'),
    new InventoryDetail(4, 3, 'Router firmware updated'),
  ];

  return new InventoryService(inventoryItems, inventoryDetails);
}

function createSampleDeviceData() {
  const deviceList = [
    new Device(1, '192.168.0.2', 'Switch in server room', false),
    new Device(2, '192.168.0.3', 'Firewall', true),
    new Device(3, '192.168.0.4', 'Access point', true),
  ];

  return new DeviceConfigNotificationService(deviceList);
}

function createSamplePostData() {
  const postList = [
    new Post(101, 'alice', '2025-12-01T08:15:00Z', 'Product launch update'),
    new Post(102, 'bob', '2025-12-01T08:16:00Z', 'Holiday contest announcement'),
    new Post(103, 'carol', '2025-12-01T08:17:00Z', 'New feature rollout'),
    new Post(104, 'dave', '2025-12-01T08:18:00Z', 'User community event'),
  ];

  return new PostService(postList);
}

function runQuestion1() {
  const inventoryService = createSampleInventoryData();
  const result = inventoryService.getInventoryDetails('2025-01-01', '2025-09-30');

  console.log('=== Question 1: Inventory Details Between Dates ===');
  console.log(JSON.stringify(result, null, 2));
  return result;
}

function runQuestion2() {
  const deviceNotificationService = createSampleDeviceData();
  const result = deviceNotificationService.deviceConfigNotification();

  console.log('=== Question 2: Notification Messages for Config Changes ===');
  console.log(JSON.stringify(result, null, 2));
  return result;
}

function runQuestion3() {
  const postService = createSamplePostData();
  const resultOffset = postService.getPostsUploaded({ limit: 2, offset: 0 });
  const resultCursor = postService.getPostsUploaded({ limit: 2, cursor: 102 });

  console.log('=== Question 3: Get Uploaded Posts (pagination) ===');
  console.log('Offset-based result:');
  console.log(JSON.stringify(resultOffset, null, 2));
  console.log('Cursor-based result:');
  console.log(JSON.stringify(resultCursor, null, 2));

  return { resultOffset, resultCursor };
}

function runAll() {
  const results = {
    question1: runQuestion1(),
    question2: runQuestion2(),
    question3: runQuestion3(),
  };
  return results;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const question = args[0];

  if (question === '1') {
    runQuestion1();
  } else if (question === '2') {
    runQuestion2();
  } else if (question === '3') {
    runQuestion3();
  } else {
    runAll();
  }
}

module.exports = {
  InventoryItem,
  InventoryDetail,
  InventoryService,
  Device,
  DeviceConfigNotificationService,
  Post,
  PostService,
  createSampleInventoryData,
  createSampleDeviceData,
  createSamplePostData,
  runQuestion1,
  runQuestion2,
  runQuestion3,
  runAll,
};
