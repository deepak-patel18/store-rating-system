# StoreRate — Store Rating System

StoreRate is a role-based web application for discovering stores, submitting ratings, and managing store feedback. It provides dedicated experiences for customers, store owners, and administrators.

Built with **React**, **Express**, and **MySQL**.

## Features

- Secure signup and login with hashed passwords and JWT authentication.
- Role-based access for **Users**, **Store Owners**, and **Admins**.
- Customers can browse stores, search by name or address, view average ratings, and submit or update a 1–5 star rating.
- Store owners can view their stores, average rating, total ratings, and the customers who submitted feedback.
- Administrators can view platform statistics; create users and stores; assign a store owner; and search, filter, sort, and inspect users and stores.
- Client-side protected routes and automatic JWT attachment to API requests.
- Input validation for names, emails, addresses, and passwords.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Axios |
| Backend | Node.js, Express 5 |
| Database | MySQL with `mysql2` |
| Authentication | JSON Web Tokens, bcrypt |

## Project Structure


store-rating-system/
├── frontend/                 # React + Vite application
│   └── src/
│       ├── components/       # Protected route component
│       ├── context/          # Authentication state
│       ├── pages/            # Home, auth, and dashboard pages
│       └── services/         # Axios API client
└── backend/                  # Express REST API
    └── src/
        ├── config/           # MySQL connection pool
        ├── controllers/      # Application logic
        ├── middleware/       # JWT and role authorization
        ├── routes/           # API endpoints
        └── utils/            # Validation helpers


## Prerequisites

- Node.js 18 or newer
- npm
- MySQL 8 or newer

## Getting Started

### 1. Create the database

Run the following SQL in MySQL to create the required database and tables:

```sql
CREATE DATABASE store_rating_system;
USE store_rating_system;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400) NOT NULL,
  role ENUM('USER', 'STORE_OWNER', 'ADMIN') NOT NULL DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  address VARCHAR(400) NOT NULL,
  owner_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_store_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  store_id INT NOT NULL,
  rating TINYINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_rating_range CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT uq_user_store_rating UNIQUE (user_id, store_id),
  CONSTRAINT fk_rating_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_rating_store FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);
```

### 2. Configure the backend

Create `backend/.env` (or update the included local file) with your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating_system
DB_PORT=3306
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
```

Do not commit real passwords or production JWT secrets.

### 3. Install dependencies

cd backend
npm install

cd ../frontend
npm install


### 4. Start the application

Open two terminals from the project root.

```bash
# Terminal 1 — API (http://localhost:5000)
cd backend
npm run dev
```

```bash
# Terminal 2 — React app (normally http://localhost:5173)
cd frontend
npm run dev
```

## Roles and Capabilities

| Role | Capabilities |
| --- | --- |
| User | Register, sign in, browse/search/sort stores, and add or change one rating per store. |
| Store Owner | Sign in and view assigned stores, rating averages, totals, and customer rating details. |
| Admin | View dashboard counts; create users and stores; assign owners; search, filter, sort, and view user/store information. |

> Public signup creates a `USER` account. Create `ADMIN` and `STORE_OWNER` accounts through the admin area or directly in the database during initial setup.

## Validation Rules

- Name: 20–60 characters
- Address: required, maximum 400 characters
- Password: 8–16 characters, including at least one uppercase letter and one special character
- Rating: whole number from 1 to 5

## Available Scripts

| Directory | Command | Purpose |
| --- | --- | --- |
| `backend` | `npm run dev` | Start the Express server with Nodemon. |
| `backend` | `npm start` | Start the Express server. |
| `frontend` | `npm run dev` | Start the Vite development server. |
| `frontend` | `npm run build` | Create a production frontend build. |
| `frontend` | `npm run lint` | Run ESLint. |

## Security Notes

- Passwords are hashed with bcrypt before storage.
- Authentication uses signed JWTs.
- API authorization checks the user's role for protected routes.
- Keep `.env` files out of version control and use a strong, unique `JWT_SECRET` in production.

