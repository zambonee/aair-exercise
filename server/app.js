const express = require("express");

const app = express();

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from api!" });
});

module.exports = app;