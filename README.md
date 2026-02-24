# SecretMatch

Simple Express + MySQL API for Secret Santa matching.

## Features
- User registration and login (JWT)
- Join event endpoint
- Admin-only match assignment
- View assigned match for logged-in user

## Tech Stack
- Node.js (ESM)
- Express
- MySQL (`mysql2`)
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)

## Prerequisites
- Node.js 18+
- MySQL server running on `localhost` (or custom host)

## Setup
1. Install dependencies:
```bash
npm install
```

2. Create env file:
```bash
cp .env.example .env
```
(Windows PowerShell)
```powershell
Copy-Item .env.example .env
```

3. Fill `.env` values:
```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=secret_match
JWT_SECRET=your_jwt_key
```

4. Initialize database schema:
```sql
-- run database/schema.sql in MySQL
```

## Run
```bash
npm run dev
```
Server starts on `http://localhost:8080`.

## API Endpoints
- `POST /users/register`
- `POST /users/login`
- `POST /match/join` (Bearer token required)
- `POST /match/assign` (Bearer token + admin only)
- `GET /match/view` (Bearer token required)

## Notes
- Admin check is currently hardcoded to `req.user.id === 1` in `src/middleware/adminMiddleware.js`.
- Request examples are available in `src/req.http`.
