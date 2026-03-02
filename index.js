const express = require("express");
const app = express();

app.use(express.json());

// ===============================
// In-Memory Data (Array)
// ===============================
let users = [
  {
    id: "1",
    firstName: "Anshika",
    lastName: "Agarwal",
    hobby: "Teaching"
  }
];

// ===============================
// Logging Middleware
// ===============================
app.use((req, res, next) => {
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Time:", new Date().toISOString());
  console.log("-----------------------------");
  next();
});

// ===============================
// Validation Middleware
// ===============================
function validateUser(req, res, next) {
  const { id, firstName, lastName, hobby } = req.body;

  if (!id || !firstName || !lastName || !hobby) {
    return res.status(400).json({
      message: "All fields (id, firstName, lastName, hobby) are required"
    });
  }

  next();
}

// ===============================
// ROUTES
// ===============================

// GET all users
app.get("/users", (req, res) => {
  res.status(200).json(users);
});

// GET user by ID
app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

// POST new user
app.post("/user", validateUser, (req, res) => {
  users.push(req.body);
  res.status(201).json({
    message: "User added successfully",
    user: req.body
  });
});

// PUT update user
app.put("/user/:id", validateUser, (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[index] = req.body;

  res.status(200).json({
    message: "User updated successfully",
    user: req.body
  });
});

// DELETE user
app.delete("/user/:id", (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users.splice(index, 1);

  res.status(200).json({ message: "User deleted successfully" });
});

// ===============================
// Start Server
// ===============================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});