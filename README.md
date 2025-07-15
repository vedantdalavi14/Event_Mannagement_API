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

## Project Structure
```
.
├── config
│   └── database.js
├── controllers
│   ├── eventController.js
│   └── userController.js
├── middlewares
│   └── validation.js
├── models
│   ├── event.js
│   ├── index.js
│   ├── registration.js
│   └── user.js
├── routes
│   ├── eventRoutes.js
│   └── userRoutes.js
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```

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

## API Endpoints

### Users

#### `POST /users`
Create a new user.

-   **Request Body:**
    ```json
    {
      "name": "Priya Sharma",
      "email": "priya.sharma@example.com"
    }
    ```
-   **Response (`201 Created`):** Returns the created user object.

### Events

#### `POST /events`
Create a new event.

-   **Request Body:**
    ```json
    {
      "title": "Bangalore Tech Summit",
      "datetime": "2025-12-01T10:00:00Z",
      "location": "Bangalore, KA",
      "capacity": 500
    }
    ```
-   **Response (`201 Created`):** Returns the `eventId`.

#### `GET /events/:id`
Get details for a specific event, including a list of registered users.

-   **Response (`200 OK`):** Returns the event object.

#### `POST /events/:id/register`
Register a user for an event.

-   **Request Body:**
    ```json
    {
      "userId": "user-uuid-string"
    }
    ```
-   **Response (`201 Created`):** On successful registration.

#### `DELETE /events/:id/register`
Cancel a user's registration for an event.

-   **Request Body:**
    ```json
    {
      "userId": "user-uuid-string"
    }
    ```
-   **Response (`200 OK`):** On successful cancellation.

#### `GET /events/upcoming`
Get a list of all upcoming events.

-   **Sorting:**
    1.  By date, ascending.
    2.  By location, alphabetically.
-   **Response (`200 OK`):** Returns an array of event objects.

#### `GET /events/:id/stats`
Get statistics for a specific event.

-   **Response (`200 OK`):** Returns an object with `totalRegistrations`, `remainingCapacity`, and `percentageUsed`.

---

## Sample `curl` Requests

**Note for Windows PowerShell Users:** PowerShell uses `Invoke-WebRequest` which has a different syntax. The `curl` alias in PowerShell does not work the same way. The examples below are for `bash` or a similar shell.

**Create a user:**
```bash
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name":"Rohan Verma","email":"rohan.verma@example.com"}'
```

**Create an event:**
```bash
curl -X POST http://localhost:3000/events -H "Content-Type: application/json" -d '{"title":"Mumbai Startup Meetup","datetime":"2025-11-15T18:00:00Z","location":"Mumbai","capacity":150}'
```

**Register for an event (replace `:id` and `userId`):**
```bash
curl -X POST http://localhost:3000/events/EVENT_ID_HERE/register -H "Content-Type: application/json" -d '{"userId":"USER_ID_HERE"}'
``` 