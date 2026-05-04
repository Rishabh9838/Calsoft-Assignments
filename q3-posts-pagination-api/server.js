/**
 * QUESTION 3 - Calsoft Assignment
 * Problem: API timing out due to huge dataset
 * Solution: Pagination + Cursor-based loading + Field filtering
 *
 * Table: Posts (id, post_by, post_dt, post_details)
 * Endpoint: GET /getPostsUploaded
 *
 * Strategy Used:
 *   1. PAGINATION         - limit/offset params to fetch chunks
 *   2. CURSOR-BASED       - cursor param for efficient deep paging
 *   3. FIELD PROJECTION   - only return fields the client needs
 *   4. DATE RANGE FILTER  - narrow query scope
 *   5. RESPONSE METADATA  - totalCount, hasMore, nextCursor
 */

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────
//  SIMULATE LARGE DATASET (500 posts)
// ─────────────────────────────────────────────

const postsTable = [];
const users = ["alice", "bob", "charlie", "diana", "eve", "frank", "grace", "henry"];
const sampleContent = [
  "Excited to share my latest project update!",
  "Had a great meeting with the team today.",
  "Just published a new article on microservices.",
  "Working on improving API performance.",
  "Deployed new feature to production successfully.",
  "Code review done. Great work everyone!",
  "Attended a webinar on cloud architecture.",
  "Fixed a critical bug in production.",
  "Database migration completed successfully.",
  "New sprint planning session was productive.",
];

// Generate 500 mock posts
for (let i = 1; i <= 500; i++) {
  const randomDate = new Date(
    Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
  );
  postsTable.push({
    id: i,
    post_by: users[i % users.length],
    post_dt: randomDate.toISOString().split("T")[0],
    post_details: `[Post #${i}] ${sampleContent[i % sampleContent.length]}`,
  });
}

// ─────────────────────────────────────────────
//  SERVICE LAYER
// ─────────────────────────────────────────────

class PostsService {
  /**
   * Efficient strategy to handle huge datasets:
   *  - Pagination (limit + offset)
   *  - Cursor-based (after cursor ID for performance)
   *  - Date range filtering to reduce dataset
   *  - Field projection to reduce payload size
   */
  getPostsUploaded({ page, limit, cursor, startDate, endDate, fields, post_by }) {
    let data = [...postsTable];

    // Step 1: Filter by author if provided
    if (post_by) {
      data = data.filter((p) => p.post_by === post_by);
    }

    // Step 2: Filter by date range
    if (startDate) {
      data = data.filter((p) => new Date(p.post_dt) >= new Date(startDate));
    }
    if (endDate) {
      data = data.filter((p) => new Date(p.post_dt) <= new Date(endDate));
    }

    // Step 3: Sort by id ascending (consistent ordering)
    data.sort((a, b) => a.id - b.id);

    const totalCount = data.length;

    // Step 4: Cursor-based pagination (more efficient than offset for large data)
    if (cursor) {
      const cursorIndex = data.findIndex((p) => p.id === parseInt(cursor));
      if (cursorIndex !== -1) {
        data = data.slice(cursorIndex + 1);
      }
    } else {
      // Classic offset-based pagination fallback
      const offset = (page - 1) * limit;
      data = data.slice(offset);
    }

    // Step 5: Apply limit
    const pageData = data.slice(0, limit);

    // Step 6: Field projection - return only requested fields
    let result = pageData;
    if (fields && fields.length > 0) {
      result = pageData.map((post) => {
        const projected = {};
        fields.forEach((f) => {
          if (post[f] !== undefined) projected[f] = post[f];
        });
        return projected;
      });
    }

    // Step 7: Metadata for client
    const hasMore = data.length > limit;
    const nextCursor = hasMore && pageData.length > 0 ? pageData[pageData.length - 1].id : null;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      totalCount,
      totalPages,
      currentPage: cursor ? "cursor-based" : page,
      limit,
      hasMore,
      nextCursor,
      posts: result,
    };
  }
}

// ─────────────────────────────────────────────
//  CONTROLLER LAYER
// ─────────────────────────────────────────────

class PostsController {
  constructor(postsService) {
    this.postsService = postsService;
  }

  /**
   * GET /getPostsUploaded
   * Query params:
   *   page      - page number (default: 1)
   *   limit     - records per page (default: 10, max: 100)
   *   cursor    - last seen post id (cursor-based mode)
   *   startDate - filter from date (YYYY-MM-DD)
   *   endDate   - filter to date (YYYY-MM-DD)
   *   fields    - comma-separated field names (e.g. id,post_by,post_dt)
   *   post_by   - filter by author username
   */
  getPostsUploaded(req, res) {
    let { page, limit, cursor, startDate, endDate, fields, post_by } = req.query;

    // Parse and validate
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    if (limit > 100) limit = 100; // hard cap to prevent abuse
    if (page < 1) page = 1;

    const fieldsArray = fields ? fields.split(",").map((f) => f.trim()) : null;

    const result = this.postsService.getPostsUploaded({
      page,
      limit,
      cursor,
      startDate,
      endDate,
      fields: fieldsArray,
      post_by,
    });

    return res.status(200).json({
      success: true,
      strategy: "Pagination + Cursor-based + Field Projection + Date Filtering",
      ...result,
    });
  }
}

// ─────────────────────────────────────────────
//  ROUTES
// ─────────────────────────────────────────────

const postsService = new PostsService();
const postsController = new PostsController(postsService);

app.get("/getPostsUploaded", (req, res) => postsController.getPostsUploaded(req, res));

app.get("/", (req, res) => {
  res.json({
    assignment: "Calsoft Assignment - Question 3",
    problem: "API timing out due to huge Posts dataset",
    solution: "Pagination + Cursor-based loading + Field Projection + Date Filtering",
    techStack: "Node.js + Express.js",
    table: { Posts: ["id", "post_by", "post_dt", "post_details"] },
    endpoint: "GET /getPostsUploaded",
    queryParams: {
      page: "Page number (default: 1)",
      limit: "Records per page (default: 10, max: 100)",
      cursor: "Last seen post ID for cursor-based pagination",
      startDate: "Filter from date YYYY-MM-DD",
      endDate: "Filter to date YYYY-MM-DD",
      fields: "Comma-separated fields to return (e.g. id,post_by)",
      post_by: "Filter by author username",
    },
    examples: {
      basic: "http://localhost:3003/getPostsUploaded?page=1&limit=10",
      cursor: "http://localhost:3003/getPostsUploaded?cursor=10&limit=10",
      dateFilter: "http://localhost:3003/getPostsUploaded?startDate=2024-01-01&endDate=2024-06-30",
      fieldProjection: "http://localhost:3003/getPostsUploaded?fields=id,post_by,post_dt&limit=5",
    },
  });
});

// ─────────────────────────────────────────────
//  START SERVER
// ─────────────────────────────────────────────

const PORT = 8080;
app.listen(PORT, () => {
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║    CALSOFT ASSIGNMENT - QUESTION 3               ║");
  console.log("║    Posts API - Large Dataset Optimization         ║");
  console.log(`║    Server running on http://localhost:${PORT}       ║`);
  console.log("╚══════════════════════════════════════════════════╝");
  console.log("\n📌 Test Endpoints:");
  console.log(`   http://localhost:${PORT}/getPostsUploaded?page=1&limit=10`);
  console.log(`   http://localhost:${PORT}/getPostsUploaded?cursor=10&limit=5\n`);
});
