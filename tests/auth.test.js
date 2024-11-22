const request = require("supertest");
const app = require("../src/index");

describe("http://localhost:5000", () => {
  //   it("should register a new user", async () => {
  //     const response = await request(app).post("/user/register").send({
  //       username: "testuser",
  //       email: "test@example.com",
  //       password: "password123",
  //     });

  //     expect(response.status).toBe(201);
  //     expect(response.body).toHaveProperty("message", "User registered");
  //   });

  it("should login the user", async () => {
    const response = await request(app).post("/user/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Login Succesfull");
  });

  it("should fail to login with invalid credentials", async () => {
    const response = await request(app).post("/user/login").send({
      email: "invalid@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Invalid Credentials");
  });

  it("should logout the user", async () => {
    const response = await request(app)
      .post("/user/logout")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzNmNzM3OWQzMzI2NGQ2NTc5MWQxNjIiLCJpYXQiOjE3MzIyMzIyMDIsImV4cCI6MTczMjMxODYwMn0.bLDEw6cTcWwC4NaIBExkuOROpWMDPUy-OpgmAix-F2s; Path=/; Expires=Fri, 22 Nov 2024 23:36:42 GMT"
      );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Logged Out Successfully");
  });
});
