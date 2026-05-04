# Calsoft Assignment — JavaScript Solutions


## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 5.x
- **Language**: JavaScript (ES6+)
- **Database**: SQLite with Sequelize ORM (Question 1), In-memory (Questions 2 & 3)
- **Testing**: Postman / cURL / Browser

## Project Structure

```
calsoft-assignment/
├── q1-inventory-api/                   # Question 1: Inventory API
│   ├── src/
│   │   ├── config/                     # Database config
│   │   ├── models/                     # Data models (Inventory, InventoryDetails)
│   │   ├── services/                   # Business logic (InventoryService)
│   │   ├── controllers/                # Request handlers (InventoryController)
│   │   ├── routes/                     # Route definitions
│   │   └── app.js                      # Express app setup
│   ├── server.js                       # Entry point with DB initialization
│   └── package.json
├── q2-device-notification-api/         # Question 2: Device Notifications
│   ├── server.js                       # All-in-one server (with batch job scheduler)
│   └── package.json
├── q3-posts-pagination-api/            # Question 3: Posts Pagination
│   ├── server.js                       # All-in-one server
│   └── package.json
├── assignment.js                       # Standalone implementations
└── README.md                           # This file
```

## Assignment Requirements & Implementation

## Assignment Requirements & Implementation

### Question 1 — Inventory Report API 

**Assignment**: Fetch annual inventory report between two dates

**Your Implementation**:
- **API**: `getInventoryDetails()`
- **Endpoint**: `GET /api/getInventoryDetails?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- **Models**: 
  - `Inventory` (id, purchase_dt, cost)
  - `InventoryDetails` (id, inventory_id FK, inventory_details)
- **Architecture**:
  - `InventoryService`: Business logic for date-range filtering & JOIN
  - `InventoryController`: Request validation & response formatting
  - Proper ORM associations using Sequelize
- **Database**: SQLite with Sequelize ORM
- **Features**:
  - Date validation (YYYY-MM-DD format)
  - Total records count
  - Total cost sum
  - Proper error handling




### Question 2 — Device Config Notification API 

**Assignment**: Trigger notifications when device configuration changes

**Your Implementation**:
- **API**: `deviceConfigNotification`
- **Endpoints**:
  - `GET /api/devices` - List all devices
  - `POST /api/deviceConfigNotification` - Trigger notifications
  - `PUT /api/devices/:id/config` - Update config_changed flag
- **Models**: `Device` (id, device_ip, device_details, config_changed)
- **Architecture**:
  - `NotificationService`: Creates structured JSON notifications
  - `DeviceController`: Handles requests & responses
- **Features**:
  - Batch job automation: `setInterval()` checks for changes every 30 seconds
  - Flag reset after notification (simulates processed state)
  - Structured JSON alert messages
  - Notification ID, severity, timestamp
  - Notification log/history



### Question 3 — Huge Dataset Pagination API 

**Assignment**: Handle API timeout for massive dataset with efficient strategy

**Your Implementation**:
- **API**: `getPostsUploaded()`
- **Endpoint**: `GET /localhost:8080/getPostsUploaded`
- **Table**: `Posts` (id, post_by, post_dt, post_details)
- **Architecture**:
  - `PostsService`: Pagination + filtering logic
  - `PostsController`: Request handling
- **Efficient Strategy**:
  - **Pagination**: Offset-based with limit/page
  - **Cursor-based**: Cursor pagination for deep paging
  - **Field Filtering**: Return only requested columns
  - **Date Filtering**: Narrow query scope by date range
  - **Metadata**: totalCount, hasMore, nextCursor
- **Features**:
  - 500 mock posts with random dates
  - Sorting by ID for consistent ordering
  - Configurable limit (default: 10, max: 100)
  - Support for filtering by author (post_by)



---

## Class Design (Spring Boot-equivalent)

### Question 1 (Structured Architecture)
```
src/
├── models/
│   ├── inventory.js          # Inventory model definition
│   ├── inventoryDetails.js   # InventoryDetails model definition
│   └── index.js              # Model exports & associations
├── services/
│   └── inventoryService.js   # InventoryService (business logic)
├── controllers/
│   └── inventoryController.js # InventoryController (request handling)
├── routes/
│   └── inventoryRoutes.js    # Route definitions
├── config/
│   └── database.js           # Database connection setup
└── app.js                    # Express app initialization
```

**Class Breakdown**:
- **Inventory Model**: Defines table schema with Sequelize
- **InventoryDetails Model**: Defines related table with FK relationship
- **InventoryService**: `getInventoryDetails(startDate, endDate)` - filters & joins data
- **InventoryController**: `getInventoryDetails(req, res)` - validates input, calls service, formats response

### Question 2 (In-Memory Architecture)
```
server.js
├── Devices Table (in-memory array)
├── NotificationService
│   └── buildNotification()
│   └── triggerConfigNotifications()
├── DeviceController
│   ├── getAllDevices()
│   ├── updateConfigFlag()
│   └── deviceConfigNotification()
└── Batch Job (setInterval every 30s)
```

**Key Classes**:
- **NotificationService**: Builds JSON alerts, processes config changes
- **DeviceController**: Handles API routes

### Question 3 (In-Memory Architecture)
```
server.js
├── Posts Table (mock 500 records)
├── PostsService
│   └── getPostsUploaded(page, limit, cursor, filters)
├── PostsController
│   └── getPostsUploaded(req, res)
└── Pagination Strategy
    ├── Offset-based
    ├── Cursor-based
    ├── Field filtering
    └── Metadata response
```

**Key Classes**:
- **PostsService**: Implements efficient pagination & filtering
- **PostsController**: Handles API routes & parameter validation

---

## API Testing Guide

### Prerequisites
- Node.js v18+
- npm installed
- Postman (optional, or use cURL/browser)

### Running Each API

#### Question 1 (Port 3001)
```bash
cd calsoft-assignment/q1-inventory-api
npm install
node server.js
```

**Test Endpoint** (in Postman/cURL/Browser):
```
GET http://localhost:3001/api/getInventoryDetails?startDate=2024-01-01&endDate=2024-12-31
```

**Expected Response**:
```json
{
  "success": true,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "totalRecords": 4,
  "totalCost": "7601.25",
  "inventoryDetails": [
    {
      "id": 1,
      "purchase_dt": "2024-01-10",
      "cost": 1500,
      "inventory_details": "Laptop - Dell XPS 15"
    }
    ...
  ]
}
```

#### Question 2 (Port 3002)
```bash
cd calsoft-assignment/q2-device-notification-api
npm install
node server.js
```

**Test Endpoints**:
```
GET http://localhost:3002/api/devices
POST http://localhost:3002/api/deviceConfigNotification
PUT http://localhost:3002/api/devices/2/config (Body: {"config_changed": true})
```

**Expected Response** (after config change):
```json
{
  "success": true,
  "triggered": 1,
  "message": "1 notification(s) triggered for config changes.",
  "notifications": [
    {
      "notificationId": "NOTIF-xxx",
      "timestamp": "2026-05-04T...",
      "alertType": "CONFIG_CHANGE_DETECTED",
      "severity": "HIGH",
      "device": { ... },
      "message": "Configuration changed detected on device [192.168.1.20]",
      "action": "REVIEW_AND_APPROVE_CONFIG"
    }
  ]
}
```

#### Question 3 (Port 8080)
```bash
cd calsoft-assignment/q3-posts-pagination-api
npm install
node server.js
```

**Test Endpoints**:
```
# Offset pagination
GET http://localhost:8080/getPostsUploaded?page=1&limit=10

# Cursor-based pagination
GET http://localhost:8080/getPostsUploaded?cursor=10&limit=10

# Field filtering
GET http://localhost:8080/getPostsUploaded?fields=id,post_by,post_dt&limit=5

# Date filtering
GET http://localhost:8080/getPostsUploaded?startDate=2025-01-01&endDate=2025-12-31&limit=10
```

**Expected Response**:
```json
{
  "success": true,
  "strategy": "Pagination + Cursor-based + Field Projection + Date Filtering",
  "totalCount": 500,
  "totalPages": 100,
  "currentPage": 1,
  "limit": 10,
  "hasMore": true,
  "nextCursor": 10,
  "posts": [ ... ]
}
```

### Postman Collection (cURL Examples)

**Q1 - Inventory API**:
```bash
curl -X GET "http://localhost:3001/api/getInventoryDetails?startDate=2024-01-01&endDate=2024-12-31"
```

**Q2 - Device Notification**:
```bash
# Get all devices
curl -X GET "http://localhost:3002/api/devices"

# Trigger notifications
curl -X POST "http://localhost:3002/api/deviceConfigNotification"

# Update device config
curl -X PUT "http://localhost:3002/api/devices/2/config" \
  -H "Content-Type: application/json" \
  -d '{"config_changed": true}'
```

**Q3 - Posts API**:
```bash
curl -X GET "http://localhost:8080/getPostsUploaded?page=1&limit=10"
```

---





