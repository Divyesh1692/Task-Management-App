const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../src/index");
const authMiddleware = require("../src/middlewares/auth");

jest.mock("jsonwebtoken");

app.use(authMiddleware);

const validJwtToken = jwt.sign("673fcafe3cd0f5a35a58966f", `top secret`, {
  expiresIn: "1d",
});

describe("http://localhost:5000", () => {
  it("should create a new task", async () => {
    const response = await request(app)
      .post("/task/create")
      .set("Authorization", `Bearer ${validJwtToken}`)
      .send({
        title: "demo 4",
        description: "Demo 4 description",
        dueDate: "2024-11-22T01:25:59Z",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Task created successfully!"
    );
    expect(response.body.task).toHaveProperty("title", "New Task");
  });

  it("should get all tasks", async () => {
    const response = await request(app)
      .get("/task/gettask")
      .set("Authorization", `Bearer ${validJwtToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.tasks)).toBe(true);
  });

  it("should update a task", async () => {
    const response = await request(app)
      .patch("/task/update/1")
      .set("Authorization", `Bearer ${validJwtToken}`)
      .send({
        title: "Updated Task Title",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Task updated successfully!"
    );
  });

  it("should delete a task", async () => {
    const response = await request(app)
      .delete("/task/delete/1")
      .set("Authorization", `Bearer ${validJwtToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Task deleted successfully!"
    );
  });

  it("should sort tasks by due date", async () => {
    const response = await request(app)
      .get("/task/sort?sortBy=dueDate")
      .set("Authorization", `Bearer ${validJwtToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.tasks)).toBe(true);
  });
});
