const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

//hello string
app.get("/", (req, res) => {
  res.send("Hello World");
});

//hello json
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

//expenses test
app.get("/api/expenses", (req, res) => {
  const expenses = [
    {
      id: 1,
      title: "Lunch",
      amount: 4.5,
      category: "Food",
      date: "2026-01-15",
    },
    {
      id: 2,
      title: "Bus ticket",
      amount: 1.2,
      category: "Transport",
      date: "2026-01-15",
    },
    {
      id: 3,
      title: "Cinema",
      amount: 8.0,
      category: "Entertainment",
      date: "2026-01-20",
    },
  ];
  res.json(expenses);
});
//listening
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//task3

//get data from DB
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});
app.get("/api/students", async (req, res) => {
  const result = await pool.query("SELECT * FROM students ORDER BY id");
  res.json(result.rows);
});

//route with parameter
app.get("/api/students/:id", async (req, res) => {
  const id = req.params.id;

  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const result = await pool.query("SELECT * FROM students WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(result.rows[0]);
});
