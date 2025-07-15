# Event Management API

This is a RESTful API for managing events, built with Node.js, Express, and PostgreSQL. It allows users to create events, register for them, and view upcoming events and statistics.

## Features

- Create and manage events with capacity limits.
- Allow users to register and cancel their registration for events.
- View a list of upcoming events, sorted by date and location.
- Get real-time statistics for any event.
- Prevent double registration and registration for past or full events.

## Tech Stack

- **Backend:** Node.js with Express
- **Database:** PostgreSQL
- **ORM:** Sequelize

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your PostgreSQL Database:**
    - This project is configured to work with PostgreSQL. You can run an instance locally or use a Docker container as described below.

4.  **Set up Environment Variables:**
    - Create a `.env` file in the root of the project and add your database connection details.
    ```
    DB_NAME=your_db_name
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_HOST=localhost
    PORT=3000
    ```

5.  **Running with Docker (Recommended for Local Setup):**
    - If you have Docker installed, you can easily run a PostgreSQL instance with the following command:
      ```bash
      docker run --name event-postgres -e POSTGRES_PASSWORD=your_password -p 5432:5432 -d postgres
      ```
    - You will then need to create the database inside the container:
      ```bash
      docker exec -it event-postgres psql -U postgres -c "CREATE DATABASE your_db_name;"
      ```

6.  **Start the server:**
    ```bash
    # For production
    npm start

    # For development with auto-reloading
    npm run dev
    ```

## API Endpoints & Examples

**Note for Windows PowerShell Users:** PowerShell uses `Invoke-WebRequest` which has a different syntax. The `curl` alias in PowerShell does not work the same way. The examples below are for `bash` or a similar shell.

---

### Users

#### `POST /users`
Create a new user.

- **`curl` Command:**
  ```bash
  curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name":"Priya Sharma","email":"priya.sharma@example.com"}'
  ```

- **Success Response (`201 Created`):**
  ```json
  {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "name": "Priya Sharma",
      "email": "priya.sharma@example.com",
      "updatedAt": "2025-07-16T10:00:00.000Z",
      "createdAt": "2025-07-16T10:00:00.000Z"
  }
  ```

---

### Events

#### `POST /events`
Create a new event.

- **`curl` Command:**
  ```bash
  curl -X POST http://localhost:3000/events -H "Content-Type: application/json" -d '{"title":"Bangalore Tech Summit","datetime":"2025-12-01T10:00:00Z","location":"Bangalore, KA","capacity":500}'
  ```

- **Success Response (`201 Created`):**
  ```json
  {
      "eventId": "f1e2d3c4-b5a6-7890-1234-567890abcdef"
  }
  ```

#### `GET /events/upcoming`
Get a list of all upcoming events.

- **`curl` Command:**
  ```bash
  curl http://localhost:3000/events/upcoming
  ```

- **Success Response (`200 OK`):**
  ```json
  [
      {
          "id": "f1e2d3c4-b5a6-7890-1234-567890abcdef",
          "title": "Bangalore Tech Summit",
          "datetime": "2025-12-01T10:00:00.000Z",
          "location": "Bangalore, KA",
          "capacity": 500,
          "createdAt": "2025-07-16T10:05:00.000Z",
          "updatedAt": "2025-07-16T10:05:00.000Z"
      }
  ]
  ```

#### `GET /events/:id`
Get details for a specific event, including registered users.

- **`curl` Command:**
  ```bash
  curl http://localhost:3000/events/EVENT_ID_HERE
  ```

- **Success Response (`200 OK`):**
  ```json
  {
      "id": "f1e2d3c4-b5a6-7890-1234-567890abcdef",
      "title": "Bangalore Tech Summit",
      "datetime": "2025-12-01T10:00:00.000Z",
      "location": "Bangalore, KA",
      "capacity": 500,
      "Users": [
          {
              "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
              "name": "Priya Sharma",
              "email": "priya.sharma@example.com"
          }
      ]
  }
  ```

#### `GET /events/:id/stats`
Get statistics for a specific event.

- **`curl` Command:**
  ```bash
  curl http://localhost:3000/events/EVENT_ID_HERE/stats
  ```

- **Success Response (`200 OK`):**
  ```json
  {
    "totalRegistrations": 1,
    "remainingCapacity": 499,
    "percentageUsed": "0.20%"
  }
  ```

#### `POST /events/:id/register`
Register a user for an event.

- **`curl` Command:**
  ```bash
  curl -X POST http://localhost:3000/events/EVENT_ID_HERE/register -H "Content-Type: application/json" -d '{"userId":"USER_ID_HERE"}'
  ```

- **Success Response (`201 Created`):**
  ```json
  {
      "message": "Successfully registered for the event."
  }
  ```

#### `DELETE /events/:id/register`
Cancel a user's registration for an event.

- **`curl` Command:**
  ```bash
  curl -X DELETE http://localhost:3000/events/EVENT_ID_HERE/register -H "Content-Type: application/json" -d '{"userId":"USER_ID_HERE"}'
  ```

- **Success Response (`200 OK`):**
  ```json
  {
      "message": "Successfully cancelled registration for the event."
  }
  ``` 