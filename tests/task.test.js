const request = require("supertest");
const mockingoose = require("mockingoose");
const jwt = require("jsonwebtoken");
const app = require("../src/index"); // Your Express app
const Task = require("../src/models/taskSchema");
const User = require("../src/models/userSchema");

require("dotenv").config({ path: "../.env" });

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

describe("Task API Tests with JWT Authorization", () => {
  let adminToken;
  let userToken;

  // Mock user data
  const admin = {
    _id: "adminId",
    username: "admin",
    role: "admin",
  };

  const user = {
    _id: "userId",
    username: "user",
    role: "user",
  };

  beforeAll(() => {
    // Generate tokens
    adminToken = generateToken(admin._id, admin.role);
    console.log(adminToken);

    userToken = generateToken(user._id, user.role);
  });

  it("should return tasks for admin user with valid token", async () => {
    const response = await request(app)
      .get("/task/gettask")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "All tasks");
    expect(response.body.tasks).toBeInstanceOf(Array);
  });

  it("should return 401 for non-admin user trying to access admin route", async () => {
    const response = await request(app)
      .get("/task/gettask")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Not authorized");
  });

  it("should return 401 for invalid token", async () => {
    const response = await request(app)
      .get("/task/gettask")
      .set("Authorization", "Bearer invalidToken");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Not authorized");
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/task/gettask");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Not authorized");
  });
});
describe("Task Controller Tests", () => {
  let token;
  let mockUser;

  beforeAll(async () => {
    // Mock User
    mockUser = { _id: "mockUserId", username: "testuser", role: "user" };

    // Generate Token for Mock User
    token = generateTokenAndSetCookie(mockUser._id, { cookie: jest.fn() });
  });

  afterEach(() => {
    mockingoose.resetAll();
  });

  // Test getTask controller
  describe("http://localhost:5000", () => {
    it("should return 200 with tasks if user is valid", async () => {
      const mockTasks = [
        {
          title: "Task 1",
          description: "Test task",
          createdBy: mockUser.username,
        },
      ];

      mockingoose(Task).toReturn(mockTasks, "find");

      const res = await request(app)
        .get("/task/gettask")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("All tasks");
      expect(res.body.task).toEqual(mockTasks);
    });

    it("should return 404 if no tasks are found", async () => {
      mockingoose(Task).toReturn([], "find");

      const res = await request(app)
        .get("/task/gettask")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(404);
      expect(res.text).toBe("Task not found");
    });

    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get("/task/gettask");

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Not authorized");
    });
  });

  // Test getTaskById controller
  describe("GET /task/gettask/:id", () => {
    const taskId = "mockTaskId";

    it("should return 200 with task details if user is authorized", async () => {
      const mockTask = {
        title: "Task 1",
        description: "Test task",
        createdBy: mockUser.username,
      };

      mockingoose(Task).toReturn(mockTask, "findById");

      const res = await request(app)
        .get(`/task/gettask/${taskId}`)
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.task).toEqual(mockTask);
    });

    it("should return 404 if task not found", async () => {
      mockingoose(Task).toReturn(null, "findById");

      const res = await request(app)
        .get(`/task/gettask/${taskId}`)
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Task not found");
    });

    it("should return 403 if user is not authorized to access task", async () => {
      const mockTask = { createdBy: "anotherUser" };

      mockingoose(Task).toReturn(mockTask, "findById");

      const res = await request(app)
        .get(`/task/gettask/${taskId}`)
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Not authorized to view this task");
    });
  });

  // Test createTask controller
  describe("POST /task/create", () => {
    it("should return 201 and create a task successfully", async () => {
      const taskData = {
        title: "New Task",
        description: "Test description",
        dueDate: "2024-12-31T01:25:59Z",
      };

      mockingoose(Task).toReturn(taskData, "save");

      const res = await request(app)
        .post("/task/create")
        .set("Cookie", `token=${token}`)
        .send(taskData);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Task created successfully!");
      expect(res.body.task.title).toBe(taskData.title);
    });

    it("should return 403 if task limit is exceeded", async () => {
      const mockPendingTasks = Array(11).fill({
        status: "pending",
        createdBy: mockUser.username,
      });

      mockingoose(Task).toReturn(mockPendingTasks, "find");

      const res = await request(app)
        .post("/task/create")
        .set("Cookie", `token=${token}`)
        .send({
          title: "New Task",
          description: "Test description",
          dueDate: "2024-12-31T01:25:59Z",
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe(
        "Task limit exceeded (10 tasks).Please Clear Pending Tasks!!!"
      );
    });
  });

  // Test updateTask controller
  describe("PUT /task/:id", () => {
    const taskId = "mockTaskId";
    it("should return 200 and update task if authorized", async () => {
      const updatedTask = {
        title: "Updated Task",
        description: "Updated Description",
      };

      mockingoose(Task).toReturn(updatedTask, "findByIdAndUpdate");

      const res = await request(app)
        .put(`/task/${taskId}`)
        .set("Cookie", `token=${token}`)
        .send(updatedTask);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Task updated successfully!");
    });

    it("should return 403 if user is not authorized to update the task", async () => {
      const mockTask = { createdBy: "anotherUser" };

      mockingoose(Task).toReturn(mockTask, "findById");

      const res = await request(app)
        .put(`/task/${taskId}`)
        .set("Cookie", `token=${token}`)
        .send({ title: "Updated Task" });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Not authorized to update this task");
    });
  });

  // Test deleteTask controller
  describe("DELETE /task/:id", () => {
    const taskId = "mockTaskId";
    it("should return 200 and delete task if authorized", async () => {
      mockingoose(Task).toReturn({ id: taskId }, "findByIdAndDelete");

      const res = await request(app)
        .delete(`/task/${taskId}`)
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Task deleted successfully!");
    });

    it("should return 403 if user is not authorized to delete task", async () => {
      const mockTask = { createdBy: "anotherUser" };

      mockingoose(Task).toReturn(mockTask, "findById");

      const res = await request(app)
        .delete(`/task/${taskId}`)
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Not authorized to delete this task");
    });
  });

  // Test sorting tasks
  describe("GET /task/sort", () => {
    it("should return sorted tasks", async () => {
      const sortedTasks = [
        {
          title: "Task 1",
          description: "Test task",
          dueDate: "2024-12-31T01:25:59Z",
        },
      ];

      mockingoose(Task).toReturn(sortedTasks, "find");

      const res = await request(app)
        .get("/task/sort?sortBy=dueDate&order=asc")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.tasks).toEqual(sortedTasks);
    });
  });
});
