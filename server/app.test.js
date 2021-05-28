const request = require("supertest");
const app = require("./app");

describe("Test the root path", () => {
  test("Returns success", async () => {
    const response = await request(app).get("/api");
    expect(response.statusCode).toBe(200);
  });
});
