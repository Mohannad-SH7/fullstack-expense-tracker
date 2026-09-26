# Expense Tracker

<!-- Write 1-2 sentences: what does your app do? -->

## How to run

<!-- Write the exact steps someone needs to run your project from scratch.
     Assume they have Node.js, PostgreSQL, and VS Code, and nothing else.
     Include: creating the database, running schema.sql, writing the .env file,
     starting the backend, and opening the frontend. -->

**Backend**

1. Create a PostgreSQL database named `expense_tracker` in pgAdmin.
2. Open the database's Query Tool, open `backend/schema.sql`, and run it to create the `expenses` table and insert sample data. Run this schema only when you are ready to reset the table, because it drops and recreates `expenses`.
3. In a terminal, go to the backend folder and install the dependencies:

   ```bash
   cd backend
   npm install express cors pg dotenv nodemon

   ```

4. While in the `backend` folder, copy `.env.example` to `.env` and enter your PostgreSQL credentials. Keep `.env` private and do not upload it.
5. Start the API from the `backend` folder:

   ```bash
   npx nodemon server.js
   ```

   The server listens at `http://localhost:3000`.

6. Start the server, open Postman, and test every endpoint before connecting the frontend:

   | Method   | URL                                    | Expected result                                                                       |
   | -------- | -------------------------------------- | ------------------------------------------------------------------------------------- |
   | `GET`    | `http://localhost:3000/api/expenses`   | `200` and the list of expenses                                                        |
   | `GET`    | `http://localhost:3000/api/expenses/1` | `200` and one expense, `400` for an invalid ID, or `404` if it does not exist         |
   | `POST`   | `http://localhost:3000/api/expenses`   | `201` and the created expense, or `400` for invalid data                              |
   | `PUT`    | `http://localhost:3000/api/expenses/1` | `200` and the updated expense, `400` for invalid input, or `404` if it does not exist |
   | `DELETE` | `http://localhost:3000/api/expenses/1` | `200` and the deleted expense, `400` for an invalid ID, or `404` if it does not exist |

7. In Postman, choose `POST` or `PUT`, select **Body → raw → JSON**, and send all expense fields:

   ```json
   {
     "title": "Lunch",
     "amount": 4.5,
     "category": "Food",
     "date": "2026-01-15"
   }
   ```

   The title must not be empty, the amount must be greater than zero, the category must be `Food`, `Transport`, `Bills`, `Entertainment`, or `Other`, and the date must be valid. Invalid or missing values return `400` with a message.

8. The API uses parameterized SQL queries, validates IDs before querying, and enables CORS for frontend requests. Confirm the data remains in PostgreSQL after restarting the server.

**Frontend**

1. ...

## Features

<!-- List what your app can do. Tick what you finished. -->

- [ ] Add an expense (with validation)
- [ ] Delete an expense
- [ ] Edit an expense
- [ ] Filter by category
- [ ] Summary cards (total, count, highest)
- [ ] Data is saved in a PostgreSQL database

## Screenshots

<!-- Add 2-3 screenshots of your app (desktop and mobile). -->

## What was the hardest part?

<!-- A short paragraph: what got you stuck, and how did you solve it? -->
