const express = require("express");
const { connectToDB, getDB } = require("./database");

const app = express();

// db connection
let db;

connectToDB((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  }
  db = getDB();
});

// routes
app.get("/books", (req, res) => {
  res.json({
    message: "Welcome to my API",
  });
});
