// Expense Tracker - frontend logic

// PHASE 2
// Your backend from Phase 1 is already running, with real expenses in the
// database (from schema.sql). Build this page directly against it with
// fetch and async/await - there is no in-memory or localStorage stage
// this time, and no sample data file.
//
// A possible structure (change it if you have a better idea):
//   - async function getExpenses()          fetch(API_URL), return the JSON
//   - async function addExpense(data)       fetch(API_URL, { method: "POST", ... })
//   - async function updateExpense(id,data) fetch(API_URL + "/" + id, { method: "PUT", ... })
//   - async function deleteExpense(id)      fetch(API_URL + "/" + id, { method: "DELETE" })
//   - async function refresh()              get the list, then call renderTable and renderSummary
//   - renderTable(list)                     build the table rows from the array the API returned
//   - renderSummary(list)                   update the summary cards
//   - applyFilter()                         re-render with the list filtered by category
//
// Don't forget:
//   - Show a Bootstrap spinner while a request is in flight.
//   - Wrap every fetch call in try/catch, and show a Bootstrap alert on failure.
//   - After add, edit, or delete, call refresh() so the page always shows
//     what the server actually saved - never update the table by hand.
//   - The API is at http://localhost:3000/api/expenses (see the Roadmap).

const API_URL = "http://localhost:3000/api/expenses";
const CATEGORY_COLORS = {
  Food: "bg-success-subtle",
  Transport: "bg-warning-subtle",
  Entertainment: "bg-danger-subtle",
  Bills: "bg-info-subtle",
  Other: "bg-secondary-subtle",
};
async function getExpenses() {
  const request = new Request(API_URL);
  const response = await fetch(request);
  const expensesData = await response.json();
  return expensesData;
}

//DOM Creation functions
function createCell(text, className = "") {
  const td = document.createElement("td");
  td.textContent = text;
  if (className) td.className = className;
  return td;
}

function createExpenseRow(expense, index) {
  const row = document.createElement("tr");
  row.dataset.id = expense.id;

  row.appendChild(createCell(index + 1));
  row.appendChild(createCell(expense.title));
  row.appendChild(createCell(`$${expense.amount.toFixed(2)}`));

  // category badge
  const categoryCell = document.createElement("td");
  const badge = document.createElement("span");
  const color = CATEGORY_COLORS[expense.category];
  badge.className = `badge text-black ${color}`;
  badge.textContent = expense.category;
  categoryCell.appendChild(badge);
  row.appendChild(categoryCell);

  row.appendChild(createCell(expense.date));

  // actions
  const actionsCell = document.createElement("td");
  actionsCell.className = "text-end";

  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-sm text-light bg-primary me-1 ";
  editBtn.style.setProperty("--bs-bg-opacity", ".8");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => openEditModal(expense));

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-sm text-light bg-danger";
  deleteBtn.style.setProperty("--bs-bg-opacity", ".8");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteExpense(expense.id));

  actionsCell.appendChild(editBtn);
  actionsCell.appendChild(deleteBtn);
  row.appendChild(actionsCell);

  return row;
}
function createMessageRow(className, text) {
  const row = document.createElement("tr");
  const td = document.createElement("td");
  td.colSpan = 6;

  const box = document.createElement("div");
  box.className = className;
  box.textContent = text;

  td.appendChild(box);
  row.appendChild(td);
  return row;
}

function createSpinnerRow() {
  const row = document.createElement("tr");
  const td = document.createElement("td");
  td.colSpan = 6;
  td.className = "text-center py-4";

  const spinner = document.createElement("div");
  spinner.className = "spinner-border text-secondary";
  spinner.setAttribute("role", "status");

  td.appendChild(spinner);
  row.appendChild(td);
  return row;
}

function renderEmptyState(isEmpty) {
  const emptyState = document.getElementById("emptyState");
  emptyState.innerHTML = "";

  if (!isEmpty) return;

  const h5 = document.createElement("h5");
  h5.className = "text-muted";
  h5.textContent = "No expenses found";

  const para = document.createElement("p");
  para.className = "text-muted";
  para.textContent = "Add your first expense to get started.";

  emptyState.appendChild(h5);
  emptyState.appendChild(para);
}

function renderSummary(expenses) {
  const count = expenses.length;
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const highest = count > 0 ? Math.max(...expenses.map((e) => e.amount)) : 0;

  document.getElementById("totalExpenses").textContent = count;
  document.getElementById("totalAmount").textContent = `$${total.toFixed(2)}`;
  document.getElementById("highestExpenses").textContent =
    `$${highest.toFixed(2)}`;
}
//alert
function showAlert(message, type = "danger") {
  const alertContainer = document.getElementById("alertContainer");

  alertContainer.innerHTML = "";

  const alert = document.createElement("div");
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.setAttribute("role", "alert");

  alert.textContent = message;

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "btn-close";
  closeButton.setAttribute("data-bs-dismiss", "alert");
  closeButton.setAttribute("aria-label", "Close");

  alert.appendChild(closeButton);
  alertContainer.appendChild(alert);
}
//filter
function filterExpenses(expenses) {
  const filter = document.getElementById("categoryFilter").value;

  if (filter === "all") {
    return expenses;
  }
  return expenses.filter((expense) => expense.category === filter);
}

//rows content
async function populateTableBody() {
  const container = document.getElementById("expensesTableBody");

  container.innerHTML = "";
  container.appendChild(createSpinnerRow());

  try {
    const expenses = await getExpenses();
    const filteredExpenses = filterExpenses(expenses);
    container.innerHTML = "";
    filteredExpenses.forEach((expense, index) => {
      container.appendChild(createExpenseRow(expense, index));
    });

    renderEmptyState(filteredExpenses.length === 0);
    renderSummary(expenses);
  } catch (error) {
    container.innerHTML = "";
    container.appendChild(
      createMessageRow("alert alert-danger mb-0", error.message),
    );
  }
}
document
  .getElementById("categoryFilter")
  .addEventListener("change", populateTableBody);

//addExpense

async function addExpense() {
  const title = document.getElementById("title").value.trim();
  const amount = Number(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  const newExpense = { title, amount, category, date };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExpense),
    });

    if (!response.ok) {
      const errorData = await response.json();
      showAlert(errorData.message);
      return;
    }

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addExpenseModal"),
    );
    modal.hide();

    document.getElementById("expenseForm").reset();

    await populateTableBody();
  } catch (error) {
    showAlert("Failed to add expense: " + error.message);
  }
}
document.getElementById("expenseForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  await addExpense();
});
//delete expense
async function deleteExpense(expenseId) {
  try {
    const response = await fetch(`${API_URL}/${expenseId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json();
      showAlert(errorData.message);
      return;
    }
    await populateTableBody();
  } catch (error) {
    showAlert("Failed to delete expense: " + error.message);
  }
}
//edit expense
function openEditModal(expense) {
  document.getElementById("editId").value = expense.id;
  document.getElementById("editTitle").value = expense.title;
  document.getElementById("editAmount").value = expense.amount;
  document.getElementById("editCategory").value = expense.category;
  document.getElementById("editDate").value = expense.date;

  const modal = new bootstrap.Modal(
    document.getElementById("editExpenseModal"),
  );

  modal.show();
}

async function editExpense() {
  const id = document.getElementById("editId").value;

  const updatedExpense = {
    title: document.getElementById("editTitle").value.trim(),
    amount: Number(document.getElementById("editAmount").value),
    category: document.getElementById("editCategory").value,
    date: document.getElementById("editDate").value,
  };
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedExpense),
    });

    if (!response.ok) {
      const errorData = await response.json();
      showAlert(errorData.message);
      return;
    }

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("editExpenseModal"),
    );
    modal.hide();

    await populateTableBody();
  } catch (error) {
    showAlert("Failed to edit expense: " + error.message);
  }
}
document
  .getElementById("editExpenseForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    await editExpense();
  });
populateTableBody();
