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
| Endpoint                     | Method | Description                |
|------------------------------|--------|----------------------------|
| `/api/user/register`         | POST   | Register a new user        |
| `/api/user/login`            | POST   | Login and get JWT token    |
| `/api/user/logout`           | POST   | Logout user                |
| `/api/user/resetpassword`    | POST   | Send password reset email  |
| `/api/user/changepassword`   | POST   | Change user password       |

### **Task Routes**
| Endpoint                     | Method | Description                                |
|------------------------------|--------|--------------------------------------------|
| `/api/task/gettask`          | GET    | Get all tasks for the logged-in user       |
| `/api/task/gettask/:id`      | GET    | Get a task by ID                           |
| `/api/task/create`           | POST   | Create a new task                          |
| `/api/task/update/:id`       | PATCH  | Update a task by ID                        |
| `/api/task/delete/:id`       | DELETE | Delete a task by ID                        |
| `/api/task/sort`             | GET    | Sort tasks by parameters like due date     |

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

### **Heroku Deployment**
1. Login to Heroku:
   ```bash
   heroku login
   ```
2. Create a Heroku app:
   ```bash
   heroku create
   ```
3. Push the code to Heroku:
   ```bash
   git push heroku main
   ```
4. Set environment variables on Heroku:
   ```bash
   heroku config:set MONGO_URI=<Your MongoDB URI>
   heroku config:set JWT_SECRET=<Your JWT Secret>
   heroku config:set NODEMAILER_EMAIL=<Your Email>
   heroku config:set NODEMAILER_PASSWORD=<Your Email Password>
   ```

---

## **Testing**
- Jest is used for API testing.
- Test cases are located in the `tests` folder.
- To run the tests:
  ```bash
  npm test
  ```
