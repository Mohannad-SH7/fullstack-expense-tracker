## THIS PROJECT CONTAIN

### Task 2

1. Setup
   - npm init -y
   - npm install express
2. create server.js with this routes

- get string hello

  > http://localhost:3000/

- get hello message a json

  > http://localhost:3000/api/hello

- get the array of expenses
  > http://localhost:3000/api/expenses

---

3.  I tested the requests in Postman

4.  try to fetch this requist http://localhost:3000/api/expenses in another port

    > then i get
    > (index):1 Access to fetch at 'http://localhost:3000/api/expenses' from origin 'http://localhost:5500' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
    > localhost:3000/api/expenses:1 Failed to load resource: net::ERR_FAILED
    > (index):6 Uncaught (in promise) TypeError: Failed to fetch

        at testFetch ((index):6:32)
        at (index):10:7

5.  then i solved this problem by

- execute npm install cors
- add app.use(cors()); in the server.js

---

### Task 3

1. npm install pg dotenv
2. create data base with name
   - practice_expense_tracker

> CREATE TABLE students (
> id SERIAL PRIMARY KEY,
> name VARCHAR(50)
> );
> INSERT INTO students (name)
> VALUES ('Mohannad'),
> ('SamiNami');

3. create .env file with

   > DB_USER=USER
   > DB_PASSWORD=PASS
   > DB_HOST=HOST
   > DB_PORT=PORT
   > DB_NAME=practice_expense_tracker

4. add this line
   > require("dotenv").config
5. create Pool from pg lib with .env data

6. create this route to get the data from the database + async-await

   > http://localhost:3000/api/students

7. create route with Id parameter

   > http://localhost:3000/api/students/1
   - if you try to search student not exist you will get 404 that's mean the student not found hehehe

8. i tried to search studetn with a string like "abc" then i get

   > error: invalid input syntax for type integer: "abc"
   - and in the Postmant i get
     > 500 Internal Server Error

9. i solved this problem by validate the id before that i ask the database
   hehehehe
