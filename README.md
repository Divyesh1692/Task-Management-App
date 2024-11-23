Here's a comprehensive **README.md** file for your Task Management App:

---

# **Task Management App**

A Role-Based Task Management application with features like user authentication, task management, and role-based access control. This project is built using Node.js, Express, MongoDB, and other modern technologies.

## **Key Features**

- **User Roles**: Admin and Regular User roles.
  - Admin: Manage all tasks and users.
  - User: Manage personal tasks only.
- **Task Management**:
  - Create, Update, Delete, and View tasks.
  - Set task due dates and automatic overdue status for past-due tasks.
  - Advanced sorting and filtering of tasks.
- **Authentication**:
  - Secure login and registration with JWT-based authentication.
  - Password reset and change functionality using NodeMailer.
- **Rate Limiting**:
  - Prevent brute-force attacks with login attempt rate limiting.
- **Security**:
  - Helmet.js for enhanced security headers.
- **Advanced Querying**:
  - Query tasks by status, due dates, and more.
- **Testing**:
  - Comprehensive testing using Jest for API endpoints.

---

## **Technologies Used**

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JSON Web Tokens (JWT), bcrypt
- **Security**: Helmet.js, Express Rate Limit
- **Email Notifications**: NodeMailer
- **Testing**: Jest
- **Environment Variables**: dotenv

---

## **Project Structure**

```
├── src/
│   ├── controllers/        # Logic for routes
│   ├── middleware/         # Middleware for authentication and role management
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route handlers
│   ├── utils/              # Utility functions (email handling, etc.)
│   ├── index.js            # Entry point of the app
├── tests/                  # Jest test cases
├── .env                    # Environment variables (not shared publicly)
├── .gitignore              # Ignored files for Git
├── Procfile                # Heroku deployment instructions
├── package.json            # Project metadata and dependencies
└── README.md               # Project documentation
```

---

## **Installation**

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/task-management-app.git
   cd task-management-app
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the following variables:

   ```
   PORT=5000
   MONGO_URI=<Your MongoDB Connection String>
   JWT_SECRET=<Your JWT Secret>
   NODEMAILER_EMAIL=<Your Email>
   NODEMAILER_PASSWORD=<Your Email Password>
   ```

4. **Run the Application**:

   ```bash
   npm start
   ```

5. **Run Tests**:
   ```bash
   npm test
   ```

---

## **API Endpoints**

### **User Routes**

| Endpoint                   | Method | Description               |
| -------------------------- | ------ | ------------------------- |
| `/api/user/register`       | POST   | Register a new user       |
| `/api/user/login`          | POST   | Login and get JWT token   |
| `/api/user/logout`         | POST   | Logout user               |
| `/api/user/resetpassword`  | POST   | Send password reset email |
| `/api/user/changepassword` | POST   | Change user password      |

### **Task Routes**

| Endpoint                | Method | Description                            |
| ----------------------- | ------ | -------------------------------------- |
| `/api/task/gettask`     | GET    | Get all tasks for the logged-in user   |
| `/api/task/gettask/:id` | GET    | Get a task by ID                       |
| `/api/task/create`      | POST   | Create a new task                      |
| `/api/task/update/:id`  | PATCH  | Update a task by ID                    |
| `/api/task/delete/:id`  | DELETE | Delete a task by ID                    |
| `/api/task/sort`        | GET    | Sort tasks by parameters like due date |

---

## **Features in Detail**

### **1. User Authentication**

- Registration and login with JWT tokens.
- Password hashing using bcrypt.
- Password reset via email using NodeMailer.

### **2. Role-Based Authorization**

- Admins can manage all tasks and users.
- Regular users can only manage their own tasks.

### **3. Task Management**

- Create tasks with fields like `title`, `description`, `dueDate`, and `status`.
- Automatically mark tasks as "Overdue" if past their due date.

### **4. Advanced Querying**

- Filter and sort tasks by status, due date, and more.

### **5. Security**

- Rate limiting for login attempts.
- Helmet.js for security headers.

### **6. Testing**

- Comprehensive unit and integration tests using Jest.

---

## **Deployment**

### **Local Deployment**

1. Start the server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

### **Vercel Deployment Steps**

Follow these steps to deploy your **Task Management App** on Vercel:

---

#### **1. Prepare Your Project for Deployment**

- Ensure your entry file (`src/index.js`) exports the `app` instance:
  ```javascript
  module.exports = app;
  ```
- Create a `vercel.json` file in the root directory with the following content:
  ```json
  {
    "version": 2,
    "builds": [
      {
        "src": "src/index.js",
        "use": "@vercel/node"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "src/index.js"
      }
    ]
  }
  ```

---

#### **2. Push to a Git Repository**

- Push your project code to a GitHub, GitLab, or Bitbucket repository.

---

#### **3. Deploy on Vercel**

1. Go to [Vercel](https://vercel.com/) and log in (or sign up if you don’t have an account).
2. Click on **"Add New Project"** and import your repository.
3. During the setup process:

   - Select the **Root Directory** (if it's not at the project root).
   - Configure your environment variables under **Settings > Environment Variables**:
     ```env
     PORT=5000
     MONGO_URI=your-mongodb-connection-string
     JWT_SECRET=your-jwt-secret
     NODEMAILER_EMAIL=your-email@example.com
     NODEMAILER_PASSWORD=your-email-password
     ```
   - No additional build steps are required for a Node.js app.

4. Click **Deploy** to start the deployment process.

---

#### **4. Access Your App**

- Once deployed, Vercel will provide a URL for your live app (e.g., `https://your-app-name.vercel.app/`).
- Use this URL as the base for your API requests.

---

#### **5. Test Your App**

- Open the Vercel URL in a browser or test endpoints using tools like **Postman** or **ThunderClient**.
- my vercel url - https://task-management-app-ev39-2j15d5v5w-divyeshs-projects-75ac8dfe.vercel.app/

---

## **Testing**

- Jest is used for API testing.
- Test cases are located in the `tests` folder.
- To run the tests:
  ```bash
  npm test
  ```
