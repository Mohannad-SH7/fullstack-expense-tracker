# Expense Tracker

Expense Tracker is a full-stack web application for recording and managing personal
expenses. The frontend provides a responsive dashboard connected to an Express and
PostgreSQL backend.

## How to run

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

1. Make sure the backend is running at `http://localhost:3000`.
2. Open the `frontend` folder in VS Code.
3. Open `frontend/index.html` with the VS Code Live Server extension, or open the
   file directly in a browser.
4. The dashboard loads the expenses from the API and displays the total number of
   expenses, total amount, and highest expense.
5. Use **+ Add Expense** to open the form. Enter a title, positive amount, category,
   and date, then submit the form. The frontend sends the data to the API and
   refreshes the table with the saved expense.
6. Use the **Edit** button to update an expense or **Delete** to remove one. The
   table refreshes after each successful request so it always matches the database.
7. Use the category filter to display all expenses or only expenses in a selected
   category. If a request fails, the page displays an error alert.

The frontend is built with HTML, CSS, Bootstrap, and vanilla JavaScript. Expense
rows, category badges, summary values, loading states, and empty states are created
and updated with the DOM. Bootstrap is loaded from a CDN, so an internet connection
is needed when opening the page.

## Features

- [x] Add an expense (with validation)
- [x] Delete an expense
- [x] Edit an expense
- [x] Filter by category
- [x] Summary cards (total, count, highest)
- [x] Data is saved in a PostgreSQL database

## What was the hardest part?

There was no particularly hard part because everything worked well overall. However,
manually building the DOM with `createElement` was tedious and made the work slower.

## Screenshots

### Dashboard overview

![Expense Tracker dashboard overview](frontend/Frontend%20Images/overview.png)

### Add expenses

![Add expense form](frontend/Frontend%20Images/add-expenses.png)

### Filter expenses

![Filtered expenses](frontend/Frontend%20Images/filter-expenses.png)
