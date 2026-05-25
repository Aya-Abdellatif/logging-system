# LogFlow

**LogFlow** is a centralized logging platform that helps developers collect, manage, and analyze application logs in real time through a web dashboard and a lightweight Node.js SDK.

<img width="450" height="250" alt="demo" src="https://github.com/user-attachments/assets/4fe3ccc7-4c4c-4f4c-ab83-929e55171938" />

It provides a complete logging system consisting of:

* Backend API (Express + MongoDB)
* Developer Dashboard (React)
* Official SDK (NPM package) for easy integration

---

## Key Features

* Centralized log management for multiple applications
* Real-time log collection via API
* Developer authentication with JWT
* Secure API key system for external applications
* Filtering logs by level, search, pagination, and sorting
* Duplicate log aggregation (log count incrementing)
* Clean and responsive dashboard UI
* Official Node.js SDK for easy integration

---

## LogFlow SDK (NPM Package)
https://www.npmjs.com/package/logflow-sdk-aya

The easiest way to send logs from your Node.js applications.

### Installation

```bash
npm install logflow-sdk-aya<img width="400" height="225" alt="demo" src="https://github.com/user-attachments/assets/3fcbffd7-1612-4a2b-bf9f-f6f71ffa4e4e" />

```

### Usage

```js
import { LogFlow } from "logflow-sdk";

const logger = new LogFlow({
  apiKey: "your_api_key",
  appName: "my-app",
  baseUrl: "http://localhost:5000/api"
});

logger.info("Server started successfully");
logger.warn("Memory usage is high");
logger.error("Database connection failed");
```

### Features

* Simple API for sending logs
* Supports INFO / WARN / ERROR levels
* Secure API key authentication
* Designed for backend and server apps

---

## System Architecture

```
Client Application
      ↓
LogFlow SDK
      ↓
Express API Server
      ↓
MongoDB Database
      ↓
React Dashboard
```

---

## What is LogFlow?

LogFlow is built to solve the problem of scattered and unstructured logs in modern applications.

Instead of relying on `console.log`, developers can:

* Send logs from multiple services
* Store them centrally
* Monitor and filter them through a dashboard
* Debug issues faster and more efficiently

---

## Authentication & API Keys

LogFlow uses a hybrid authentication system:

* **JWT Authentication** → for dashboard access
* **API Key Authentication** → for external logging via SDK

Each developer gets a unique API key used to securely send logs from applications.

---

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* REST APIs

### Frontend

* React (Vite)

### SDK

* Node.js package (logflow-sdk)
* Fetch/HTTP requests

---

## Project Structure

```
logging-system/
├── backend/         # Express API + MongoDB models + auth + routes
├── frontend/        # React dashboard
└── logflow-sdk/     # NPM SDK package
```

---

## Environment Variables

Create a `.env` file inside the backend:

```env
PORT_NUMBER=5000
DATABASE_CONNECTION_STRING=mongodb://localhost:27017/logflow
JWT_SECRET_KEY=your_secret_key
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/logflow.git
cd logflow
```

### 2. Run Backend

```bash
cd backend
npm install
npm start
```

### 3. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

Backend runs on:

```
http://localhost:5000/api
```

---

## API Overview

### Authentication

* `POST /developers/register`
* `POST /developers/login`
* `POST /developers/logout`
* `GET /developers/me`

---

### Applications

* `GET /applications`
* `POST /applications`
* `DELETE /applications/:name`

---

### Logs

* `GET /applications/:name/logs`
* `POST /applications/:name/logs`
* `GET /applications/:name/logs/stats`

---

### Send Log (via API Key)

```http
POST /applications/:name/logs
x-api-key: your_api_key
```

---

## Log Query Features

* Pagination (`page`, `limit`)
* Filter by level (`INFO`, `WARN`, `ERROR`)
* Search by message
* Sorting (`recent`, `count`)

---

## Data Models

### Developer

* username
* email
* password (hashed)
* apiKey

### Application

* name
* developer reference
* timestamps

### Log

* message
* level
* count
* application reference
* timestamps

---

## Future Improvements

* Real-time WebSocket log streaming
* Docker support
* Rate limiting for API keys
* Multi-environment support (dev/staging/prod)
* Hosted SaaS version

---

## Author

Built by **Aya Abdellatif**
