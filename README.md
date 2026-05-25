# LogFlow 🪵

> An all-in-one logging system for application developers to save, manage, and analyze logs.

[![npm version](https://img.shields.io/npm/v/logflow-sdk-aya)](https://www.npmjs.com/package/logflow-sdk-aya)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [Auth Endpoints](#auth-endpoints)
  - [Application Endpoints](#application-endpoints)
  - [Log Endpoints](#log-endpoints)
- [Authentication](#authentication)
- [Data Models](#data-models)
- [Roadmap](#roadmap)

---

## Overview

LogFlow is a centralized logging platform built for application developers. Instead of dealing with scattered console outputs or third-party tools that don't fit your needs, LogFlow gives you:

- A clean API to push logs from any application.
- A unique API key per developer to authenticate log submissions.
- Full control over filtering, sorting, and paginating your logs.
- Deduplication: repeated log messages increment a counter instead of flooding your database.

---

## Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Runtime    | Node.js             |
| Framework  | Express.js          |
| Database   | MongoDB + Mongoose  |
| Auth       | JWT (JSON Web Tokens) + HTTP-only Cookies |
| Validation | express-validator   |

---

## Project Structure

```
logflow-backend/
├── src/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── application.controller.js
│   │   └── log.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT route protection
│   │   └── apiKey.middleware.js # API key validation for log posting
│   ├── models/
│   │   ├── Developer.model.js
│   │   ├── Application.model.js
│   │   └── Log.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── application.routes.js
│   │   └── log.routes.js
│   └── app.js
├── .env.example
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB instance (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/logflow-backend.git
cd logflow-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your values in .env

# Start the development server
npm run dev
```

---

## Environment Variables

Create a `.env` file in the root directory based on `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/logflow
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

---

## API Reference

### Base URL

```
http://localhost:5000/api
```

---

### Auth Endpoints

#### Register
```http
POST /users/register
```

**Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Developer registered successfully",
  "apiKey": "generated-uuid-api-key"
}
```

---

#### Login
```http
POST /users/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:** Sets an HTTP-only cookie with the JWT token.

---

#### Logout
```http
POST /users/logout
```

Clears the authentication cookie.

---

### Application Endpoints

> All application endpoints require a valid JWT (authenticated session).

#### Get All Applications
```http
GET /applications
```

Returns all applications belonging to the logged-in developer.

---

#### Create an Application
```http
POST /applications
```

**Body:**
```json
{
  "name": "my-app"
}
```

**Rules:**
- Name must be unique across the entire database.
- Whitespaces are not allowed.

---

#### Delete an Application
```http
DELETE /applications/:name
```

Deletes the application and all its associated logs.

---

### Log Endpoints

#### Get All Logs of an Application
```http
GET /applications/:name/logs
```

> Requires JWT authentication.

**Query Parameters:**

| Param    | Type     | Description                                      | Example              |
|----------|----------|--------------------------------------------------|----------------------|
| `page`   | `number` | Page number (default: 1)                         | `?page=2`            |
| `limit`  | `number` | Logs per page (default: 10)                      | `?limit=20`          |
| `level`  | `string` | Filter by level: `INFO`, `WARN`, `ERROR`         | `?level=ERROR`       |
| `search` | `string` | Search by message (case-insensitive)             | `?search=timeout`    |
| `sort`   | `string` | Sort by `recent` (default) or `count`            | `?sort=count`        |

**Example Request:**
```
GET /api/applications/my-app/logs?page=1&limit=10&level=ERROR&sort=recent
```

---

#### Post a Log to an Application
```http
POST /applications/:name/logs
```

> Requires a valid **API Key** passed in the request header.

**Headers:**
```
x-api-key: your-developer-api-key
```

**Body:**
```json
{
  "message": "Database connection failed",
  "level": "ERROR"
}
```

**Behavior:**
- If a log with the same `message` and `level` already exists in the application, its `count` is incremented and `updatedAt` is refreshed.
- Otherwise, a new log entry is created with `count: 1`.

**Validation:**
- The API key must belong to a developer who owns the target application.

---

## Authentication

LogFlow uses two layers of authentication:

| Layer        | Used For                          | How                              |
|--------------|-----------------------------------|----------------------------------|
| JWT Cookie   | Dashboard / developer routes      | HTTP-only cookie set on login    |
| API Key      | Posting logs from external apps   | `x-api-key` header               |

---

## Data Models

### Developer
| Field      | Type     | Notes                        |
|------------|----------|------------------------------|
| `username` | String   | Required, unique             |
| `email`    | String   | Required, unique             |
| `password` | String   | Hashed with bcrypt           |
| `apiKey`   | String   | Auto-generated UUID on register |

### Application
| Field       | Type     | Notes                                       |
|-------------|----------|---------------------------------------------|
| `name`      | String   | Required, unique globally, no whitespace    |
| `developer` | ObjectId | Ref to Developer                            |
| `createdAt` | Date     | Auto                                        |
| `updatedAt` | Date     | Auto                                        |

### Log
| Field       | Type     | Notes                                            |
|-------------|----------|--------------------------------------------------|
| `message`   | String   | Required                                         |
| `level`     | String   | Enum: `INFO`, `WARN`, `ERROR`                    |
| `count`     | Number   | Default: 1, increments on duplicate              |
| `application` | ObjectId | Ref to Application                             |
| `createdAt` | Date     | First occurrence                                 |
| `updatedAt` | Date     | Last occurrence                                  |

---

## SDK — `logflow-sdk-aya`

The official Node.js SDK to send logs from your application to LogFlow.

📦 **npm:** [https://www.npmjs.com/package/logflow-sdk-aya](https://www.npmjs.com/package/logflow-sdk-aya)

### Installation

```bash
npm install logflow-sdk-aya
```

### Usage

```js
const logflow = require("logflow-sdk-aya");

// Initialize with your API key and application name
logflow.init({
  apiKey: "your-api-key",
  appName: "my-app",
});

// Send a log
logflow.log({
  message: "User signed in",
  level: "INFO",
});

logflow.log({
  message: "Payment service timeout",
  level: "WARN",
});

logflow.log({
  message: "Database connection failed",
  level: "ERROR",
});
```

### Methods

| Method  | Description                                              |
|---------|----------------------------------------------------------|
| `init`  | Sets your API key and target application name            |
| `log`   | Sends a log entry (`message` + `level`) to your app     |

> **Note:** `level` must be one of `INFO`, `WARN`, or `ERROR`.

---

## Roadmap

- [x] Developer auth (register, login, logout)
- [x] API key generation
- [x] Application CRUD
- [x] Log ingestion with deduplication
- [x] Filtering, sorting, and pagination
- [x] Route protection (JWT + API key)
- [ ] Frontend dashboard (React)
- [x] npm SDK package ([logflow-sdk-aya](https://www.npmjs.com/package/logflow-sdk-aya))
- [ ] Charts: pie chart for log levels, line graph per day
- [ ] Deployment

---

## License

MIT
