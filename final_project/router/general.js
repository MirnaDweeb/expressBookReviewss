const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();
const BASE_URL = "http://localhost:5000";

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password are required" });
  if (users.some((u) => u.username === username))
    return res.status(409).json({ message: "User already exists" });
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

public_users.get("/isbn/:isbn", function (req, res) {
  const book = books[req.params.isbn];
  if (book) return res.status(200).json(book);
  return res.status(404).json({ message: "Book not found" });
});

public_users.get("/author/:author", function (req, res) {
  const result = {};
  for (const [k, v] of Object.entries(books))
    if (v.author === req.params.author) result[k] = v;
  if (Object.keys(result).length > 0) return res.status(200).json(result);
  return res.status(404).json({ message: "No books found for this author" });
});

public_users.get("/title/:title", function (req, res) {
  const result = {};
  for (const [k, v] of Object.entries(books))
    if (v.title === req.params.title) result[k] = v;
  if (Object.keys(result).length > 0) return res.status(200).json(result);
  return res.status(404).json({ message: "No books found with this title" });
});

public_users.get("/review/:isbn", function (req, res) {
  const book = books[req.params.isbn];
  if (book) return res.status(200).json(book.reviews);
  return res.status(404).json({ message: "Book not found" });
});

// Task 10: Async/Await + Axios
public_users.get("/async/books", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 11: Promise + Axios
public_users.get("/promise/isbn/:isbn", (req, res) => {
  axios.get(`${BASE_URL}/isbn/${req.params.isbn}`)
    .then((response) => res.status(200).json(response.data))
    .catch((error) => res.status(500).json({ message: error.message }));
});

// Task 12: Async/Await + Axios
public_users.get("/async/author/:author", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(req.params.author)}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 13: Promise + Axios
public_users.get("/promise/title/:title", (req, res) => {
  axios.get(`${BASE_URL}/title/${encodeURIComponent(req.params.title)}`)
    .then((response) => res.status(200).json(response.data))
    .catch((error) => res.status(500).json({ message: error.message }));
});

module.exports.general = public_users;
