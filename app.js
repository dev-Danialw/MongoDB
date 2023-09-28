const express = require("express");
const { connectToDB, getDB } = require("./database");
const { ObjectId } = require("mongodb");

const app = express();
app.use(express.json());

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
  // current page
  const page = req.query.p || 0;
  const booksPerPage = 3;

  let books = [];

  db.collection("books")
    .find()
    .sort({ author: 1 })
    .skip(page * booksPerPage)
    .limit(booksPerPage)
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

// Inserting a Document

app.post("/books", (req, res) => {
  const book = req.body;

  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(200).json({ message: "Book inserted" });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Deleting a Document

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;

  if (ObjectId.isValid(bookId)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(bookId) })
      .then((result) => {
        res.status(200).json({ message: "Book deleted" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// Updating a Document

app.patch("/books/:id", (req, res) => {
  const updates = req.body;
  const bookId = req.params.id;

  if (ObjectId.isValid(bookId)) {
    db.collection("books")
      .updateOne({ _id: new ObjectId(bookId) }, { $set: updates })
      .then((result) => {
        res.status(200).json({ message: "Book updated" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else {
    res.status(400).json({ error: "Invalid ID" });
  }
});
