PROJECT NAME: Task Manager Application

DESCRIPTION:
This is a full-stack Task Manager web application built using the MERN stack (MongoDB, Express.js, React, Node.js). The application allows users to manage projects and tasks efficiently with role-based access control.

FEATURES:

* User Authentication (Login / Register)
* Role-based Access (Admin / Member)
* Admin can:

  * Create projects
  * Assign tasks
  * Delete tasks
* Members can:

  * View assigned projects
  * Update task status
* Dashboard with:

  * Total tasks
  * Completed tasks
  * Overdue tasks
* Task status management (Todo, In Progress, Done)

TECH STACK:
Frontend:

* React.js
* Tailwind CSS
* Axios

Backend:

* Node.js
* Express.js
* MongoDB (Mongoose)

Authentication:

* JWT (Access Token + Refresh Token)
* HTTP-only cookies for secure session handling

PROJECT STRUCTURE:

* client/ → React frontend
* server/ → Node.js backend
* models/ → Database schemas
* controllers/ → Business logic
* routes/ → API routes
* middleware/ → Authentication & authorization

API ENDPOINTS:

AUTH:
POST /api/register
POST /api/login
GET  /api/current-user

PROJECTS:
POST   /api/projects        (Admin only)
GET    /api/projects        (All users)
GET    /api/projects/:id

TASKS:
POST   /api/tasks           (Admin only)
GET    /api/tasks?projectId=
PUT    /api/tasks/:id
DELETE /api/tasks/:id       (Admin only)

HOW TO RUN:

1. Clone the repository
2. Install dependencies:

Backend:
cd server
npm install

Frontend:
cd client
npm install

3. Setup environment variables (.env)

Backend (.env):
PORT=3000
MONGODB_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
CLIENT_URL=http://localhost:5173

Frontend (.env):
VITE_BASE_URL=http://localhost:3000/api

4. Run application

Backend:
npm start

Frontend:
npm run dev

5. Open in browser:
   http://localhost:5173

NOTES:

* Only admin users can create projects and tasks.
* Authentication is handled securely using JWT and cookies.
* Application follows clean architecture and modular design.

FUTURE IMPROVEMENTS:

* Drag & drop Kanban board
* Notifications for tasks
* Email alerts
* Real-time updates (WebSockets)

AUTHOR:
Aman Gairola
