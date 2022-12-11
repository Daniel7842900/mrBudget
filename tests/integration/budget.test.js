const request = require("supertest");
let app = require("../../index.js");
const db = require("../../models/index.js");

describe("/budget", () => {
  beforeEach(async () => {
    await db.sequelize.sync({ force: false });
  });

  afterEach(async () => {
    await db.sequelize.close();
  });

  describe("GET /", () => {
    it("should return one budget", async () => {
      const res = await request(app).get("/budget");
      expect(res.status).toBe(200);
    });
  });
});
