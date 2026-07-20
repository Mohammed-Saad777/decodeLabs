# Student Management REST API

A complete, production-quality **Student Management REST API** built with **Node.js**, **Express.js**, and clean **MVC** architecture. Data is stored in-memory (no database required), which makes the project perfect for learning REST fundamentals, writing tests, or wiring up a frontend.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Environment Variables](#environment-variables)
7. [Running the Server](#running-the-server)
8. [API Endpoints](#api-endpoints)
9. [Validation Rules](#validation-rules)
10. [Sample Requests & Responses](#sample-requests--responses)
11. [Bonus Query Parameters](#bonus-query-parameters)
12. [Error Format](#error-format)
13. [Postman Collection](#postman-collection)
14. [Scripts](#scripts)
15. [License](#license)

---

## Features

- Full **CRUD** for a `Student` resource
- **MVC** architecture: `controllers`, `routes`, `middleware`, `models`, `utils`
- Reusable **validation middleware** (create & update)
- **Global error handling** middleware with proper HTTP status codes
- **Request logging** middleware
- **CORS** enabled and configurable via env
- Environment configuration via **dotenv**
- **Bonus**: search by name, filter by course, pagination, sorting
- **Bonus**: `createdAt` and `updatedAt` timestamps
- **Postman collection** included

---

## Tech Stack

- Node.js (>= 14)
- Express.js
- dotenv, cors, uuid, validator
- nodemon (dev)

---

## Folder Structure

```
backend-node/
├── controllers/
│   └── studentController.js
├── middleware/
│   ├── errorHandler.js
│   ├── logger.js
│   ├── notFound.js
│   └── validateStudent.js
├── models/
│   └── studentModel.js
├── routes/
│   └── studentRoutes.js
├── utils/
│   ├── ApiError.js
│   └── asyncHandler.js
├── app.js
├── server.js
├── package.json
├── .env
├── .env.example
├── .gitignore
├── postman_collection.json
└── README.md
```

---

## Prerequisites

- **Node.js** v14 or newer
- **npm** or **yarn**

---

## Installation

```bash
# Clone or copy the project, then:
cd backend-node

# Install dependencies
npm install
# or
yarn install
```

---

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable       | Description                                    | Default       |
| -------------- | ---------------------------------------------- | ------------- |
| `PORT`         | Port the server will listen on                 | `5000`        |
| `NODE_ENV`     | `development` or `production`                  | `development` |
| `CORS_ORIGIN`  | Comma-separated allowed origins, or `*`        | `*`           |

---

## Running the Server

```bash
# Production mode
npm start

# Development mode (auto-reload with nodemon)
npm run dev
```

Once running, visit:

- Root:      `http://localhost:5000/`
- Health:    `http://localhost:5000/health`
- Students:  `http://localhost:5000/api/students`

The server pre-seeds **3 sample students** on startup so you can start testing immediately.

---

## API Endpoints

Base URL: `http://localhost:5000/api/students`

| Method   | Endpoint          | Description                              | Success Status |
| -------- | ----------------- | ---------------------------------------- | -------------- |
| `GET`    | `/students`       | List all students (with filters/paging)  | `200`          |
| `GET`    | `/students/:id`   | Get a single student by id               | `200`          |
| `POST`   | `/students`       | Create a new student                     | `201`          |
| `PUT`    | `/students/:id`   | Update an existing student               | `200`          |
| `DELETE` | `/students/:id`   | Delete a student                         | `200`          |

Other:
| Method | Endpoint  | Description       |
| ------ | --------- | ----------------- |
| `GET`  | `/`       | API welcome info  |
| `GET`  | `/health` | Health check      |

### HTTP Status Codes Used

- `200` – OK
- `201` – Created
- `400` – Bad Request / Validation failed
- `404` – Not Found
- `500` – Internal Server Error

---

## Validation Rules

A student has the following shape:

```json
{
  "id":        "uuid (auto-generated)",
  "name":      "string (required, 1–100 chars)",
  "email":     "string (required, valid email, unique)",
  "age":       "integer (required, 16 – 60)",
  "course":    "string (required, 1–100 chars)",
  "createdAt": "ISO date (auto)",
  "updatedAt": "ISO date (auto)"
}
```

- On `POST /students` all fields are **required**.
- On `PUT /students/:id` at least **one** valid field must be supplied.
- Email uniqueness is enforced (case-insensitive).

---

## Sample Requests & Responses

### 1) Create a Student — `POST /api/students`

**Request Body**
```json
{
  "name": "Priya Kapoor",
  "email": "priya@example.com",
  "age": 22,
  "course": "Computer Science"
}
```

**Response — `201 Created`**
```json
{
  "success": true,
  "status": 201,
  "message": "Student created successfully",
  "data": {
    "id": "6e2c8e1d-4b8b-4b2a-9e63-72d5db5f7f7c",
    "name": "Priya Kapoor",
    "email": "priya@example.com",
    "age": 22,
    "course": "Computer Science",
    "createdAt": "2026-01-15T10:32:00.000Z",
    "updatedAt": "2026-01-15T10:32:00.000Z"
  }
}
```

### 2) Get All Students — `GET /api/students`

**Response — `200 OK`**
```json
{
  "success": true,
  "status": 200,
  "message": "Students retrieved successfully",
  "pagination": { "total": 3, "page": 1, "limit": 10, "totalPages": 1 },
  "count": 3,
  "data": [ /* array of students */ ]
}
```

### 3) Get One Student — `GET /api/students/:id`

**Response — `200 OK`**
```json
{
  "success": true,
  "status": 200,
  "message": "Student retrieved successfully",
  "data": {
    "id": "6e2c8e1d-4b8b-4b2a-9e63-72d5db5f7f7c",
    "name": "Priya Kapoor",
    "email": "priya@example.com",
    "age": 22,
    "course": "Computer Science",
    "createdAt": "2026-01-15T10:32:00.000Z",
    "updatedAt": "2026-01-15T10:32:00.000Z"
  }
}
```

### 4) Update a Student — `PUT /api/students/:id`

**Request Body**
```json
{ "age": 23, "course": "Data Science" }
```

**Response — `200 OK`**
```json
{
  "success": true,
  "status": 200,
  "message": "Student updated successfully",
  "data": {
    "id": "6e2c8e1d-4b8b-4b2a-9e63-72d5db5f7f7c",
    "name": "Priya Kapoor",
    "email": "priya@example.com",
    "age": 23,
    "course": "Data Science",
    "createdAt": "2026-01-15T10:32:00.000Z",
    "updatedAt": "2026-01-15T10:45:12.204Z"
  }
}
```

### 5) Delete a Student — `DELETE /api/students/:id`

**Response — `200 OK`**
```json
{
  "success": true,
  "status": 200,
  "message": "Student deleted successfully",
  "data": { /* the removed student */ }
}
```

---

## Bonus Query Parameters

Available on `GET /api/students`:

| Query    | Description                                       | Example                              |
| -------- | ------------------------------------------------- | ------------------------------------ |
| `search` | Case-insensitive substring match on `name`        | `?search=aar`                        |
| `course` | Case-insensitive **exact** match on `course`      | `?course=Physics`                    |
| `sortBy` | One of: `name`, `age`, `createdAt`                | `?sortBy=age`                        |
| `order`  | `asc` (default) or `desc`                         | `?sortBy=age&order=desc`             |
| `page`   | Page number (>= 1, default 1)                     | `?page=2`                            |
| `limit`  | Items per page (>= 1, max 100, default 10)        | `?limit=5`                           |

Example:
```
GET /api/students?search=is&sortBy=name&order=asc&page=1&limit=5
```

---

## Error Format

Every error response follows the same structure:

```json
{
  "success": false,
  "status": 400,
  "message": "Validation failed",
  "errors": [
    "name is required",
    "age must be between 16 and 60"
  ]
}
```

Common cases:
- `400` – validation failure, duplicate email, malformed JSON
- `404` – resource / route not found
- `500` – unexpected server error

---

## Postman Collection

Import the file [`postman_collection.json`](./postman_collection.json) into Postman:

1. Open Postman → **File → Import** → drop the JSON file.
2. The collection uses a `{{baseUrl}}` variable that defaults to `http://localhost:5000`.
3. Run the requests in order (Create → Get All → Get by Id → Update → Delete).

---

## Scripts

| Command         | Purpose                     |
| --------------- | --------------------------- |
| `npm start`     | Start server (production)   |
| `npm run dev`   | Start server with nodemon   |

---

## License

MIT – free to use and modify.
