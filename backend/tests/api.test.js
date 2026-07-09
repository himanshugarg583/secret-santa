const request = require("supertest");
const path = require("path");
const fs = require("fs");
const createApp = require("../src/app");

const app = createApp();
const FIXTURES = path.join(__dirname, "fixtures");
const EMP_FILE = path.join(FIXTURES, "employees.csv");
const PREV_FILE = path.join(FIXTURES, "previous.csv");

beforeAll(() => {
  fs.mkdirSync(FIXTURES, { recursive: true });

  fs.writeFileSync(EMP_FILE,
`Employee_Name,Employee_EmailID
Alice Smith,alice@acme.com
Bob Jones,bob@acme.com
Charlie Brown,charlie@acme.com
Diana Prince,diana@acme.com
`);

  fs.writeFileSync(PREV_FILE,
`Employee_Name,Employee_EmailID,Secret_Child_Name,Secret_Child_EmailID
Alice Smith,alice@acme.com,Bob Jones,bob@acme.com
Bob Jones,bob@acme.com,Charlie Brown,charlie@acme.com
Charlie Brown,charlie@acme.com,Diana Prince,diana@acme.com
Diana Prince,diana@acme.com,Alice Smith,alice@acme.com
`);
});

afterAll(() => {
  fs.rmSync(FIXTURES, { recursive: true, force: true });
});

describe("POST /api/assign", () => {
  test("works with employee file only", async () => {
    const res = await request(app)
      .post("/api/assign")
      .attach("employees", EMP_FILE);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(4);
    expect(res.body.assignments).toHaveLength(4);
    expect(res.body.csv).toContain("Employee_Name");
  });

  test("avoids previous year pairings", async () => {
    const res = await request(app)
      .post("/api/assign")
      .attach("employees", EMP_FILE)
      .attach("previous", PREV_FILE);

    expect(res.status).toBe(200);

    const blocked = [
      "alice@acme.com->bob@acme.com",
      "bob@acme.com->charlie@acme.com",
      "charlie@acme.com->diana@acme.com",
      "diana@acme.com->alice@acme.com",
    ];
    for (const a of res.body.assignments) {
      const key = `${a.Employee_EmailID}->${a.Secret_Child_EmailID}`;
      expect(blocked).not.toContain(key);
    }
  });

  test("400 without employee file", async () => {
    const res = await request(app).post("/api/assign");
    expect(res.status).toBe(400);
  });
});

describe("GET /api/health", () => {
  test("returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
