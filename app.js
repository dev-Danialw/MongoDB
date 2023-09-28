const express = require("express");
const { connectToDB, getDB } = require("./database");
const { ObjectId } = require("mongodb");

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
  let books = [];

  db.collection("books")
    .find()
    .sort({ author: 1 })
    .forEach((book) => {
      books.push(book);
    })
    .then(() => {
      res.status(200).json(books);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Getting a Single Document

app.get("/books/:id", (req, res) => {
  const bookId = req.params.id;

  if (ObjectId.isValid(bookId)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(bookId) })
      .then((book) => {
        res.status(200).json(book);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else {
    res.status(400).json({ error: "Invalid ID" });
  }
});
