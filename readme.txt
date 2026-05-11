# TASK MANAGEMENT SYSTEM – FULL STACK MERN APPLICATION

## Live Demo

Frontend Live Link:
https://taskm-amangairola.vercel.app

⚠️ Important Note

The backend server is deployed on Render (Free Tier).

Since Render free instances automatically spin down after inactivity, the first API request may take around 30–50 seconds to respond while the server wakes up.

Please wait a few moments during the initial load/login request if the application appears slow at first.

---

# Project Overview

Task Management System is a full-stack MERN application designed for collaborative project and task management. The platform supports role-based authentication where admins can create projects, assign tasks to team members, manage workflows, and monitor project activity through a dashboard.

Members can log in to view assigned projects and tasks, update task statuses, and track deadlines.

The application is fully responsive and built with a modern SaaS-inspired UI using React and Tailwind CSS.

---

# Features

## Authentication & Authorization

* JWT-based authentication
* Secure HTTP-only cookie handling
* Role-based access control
* Protected frontend and backend routes

## Admin Features

* Create projects
* Create and assign tasks
* Search tasks inside projects
* Delete tasks
* View dashboard analytics
* View all registered users

## Member Features

* View assigned projects
* View assigned tasks
* Update task status
* Track deadlines and overdue tasks

## Dashboard Features

* Total tasks
* Completed tasks
* Overdue tasks
* Recent projects
* Recent tasks

## Task Features

* Task assignment
* Due dates
* Status updates
* Search tasks
* Task filtering

## Frontend Features

*Frontend Features
*Responsive design
*Modern dark SaaS UI
*Toast notifications
*Skeleton loaders
*Lazy loading with React Suspense
*Debounced search optimization
*Client-side caching using TanStack Query (React Query)
*Automatic background refetching
*Optimized API state management
*Reduced redundant API calls for projects & tasks

---

# Tech Stack

## Frontend

* React.js
* React Router DOM
* Tailwind CSS
* Axios
* React Toastify
*TanStack Query (React Query)

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Authentication

* JWT
* HTTP-only Cookies

---

# Folder Structure

## Client

* pages/
* components/
* context/
* api/
* routes/

## Server

* models/
* controllers/
* routes/
* middleware/
* utils/

---

# API Endpoints

## Authentication

POST /api/register
POST /api/login
POST /api/logout
GET /api/current-user

## Projects

GET /api/projects
GET /api/projects/:id

## Tasks

GET /api/tasks
PUT /api/tasks/:id

## Admin Routes

POST /api/admin/projects
POST /api/admin/tasks
DELETE /api/admin/tasks/:id
GET /api/admin/dashboard
GET /api/admin/getAllusers
GET /api/admin/tasks/search

---

# Admin Credentials

## Admin Login

Email: [amangairola@gmail.com],(mailto:amangairola@gmail.com)
Password: 123456 

---

# Test User Credentials

## Member Login

Email: [user1@gmail.com]
Password: 123456 

OR- create new member
---

# Installation & Setup

## Clone Repository

git clone <repository-url>

---

## Backend Setup

cd server

npm install

Create .env file:

PORT=3000

CLIENT_URL=http://localhost:5173

MONGODB_URI=your_mongodb_uri

ACCESS_TOKEN_SECRET=your_secret

REFRESH_TOKEN_SECRET=your_secret

ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_EXPIRY=7d

Run Backend:
npm start

---

## Frontend Setup

cd client

npm install

Create .env file:

VITE_BASE_URL=http://localhost:3000/api

Run Frontend:
npm run dev

---

# Optimization Techniques Used

* Lazy loading using React.lazy()
* React Suspense fallback
* Skeleton loading UI
* Debounced API search
* Route protection
* Reusable API instance
* Role-based middleware
* Efficient MongoDB querying
* Task filtering on backend
* Client-side caching using TanStack Query
* Automatic query invalidation & refetching
* Optimized server-state management
* Reduced unnecessary API requests
* Cached project & task data for faster navigation
---

# Future Improvements

* Drag & drop Kanban board
* Real-time collaboration
* Notifications
* Activity logs
* File attachments
* Team management
* Pagination & advanced filters

---

# Assignment Highlights

This project demonstrates:

* Full-stack MERN development
* Authentication & authorization
* REST API design
* Role-based workflow
* Dashboard analytics
* Responsive UI/UX
* State management
* Backend validation
* Secure session handling
* Modern frontend optimization techniques
* Client-side caching & performance optimization
* Scalable server-state management using TanStack Query
---

# Developed By

Aman Gairola

Frontend & Full Stack Developer

Portfolio:
https://amangairola.vercel.app

GitHub:
https://github.com/amngairola

LinkedIn:
https://linkedin.com/in/amngairola
