const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");

const regd_users = express.Router();
let users = [];

const isValid = (username) => !users.some((u) => u.username === username);

const authenticatedUser = (username, password) =>
  users.some((u) => u.username === username && u.password === password);

// Task 7: Login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password are required" });
  if (!authenticatedUser(username, password))
    return res.status(401).json({ message: "Invalid credentials" });
  const accessToken = jwt.sign({ data: { username } }, "access", { expiresIn: "1h" });
  req.session.authorization = { accessToken };
  return res.status(200).json({ message: "User successfully logged in", accessToken });
});

// Task 8: Add or modify a review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const review = req.query.review;
  const username = req.user.data.username;
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
  if (!review) return res.status(400).json({ message: "Review text required" });
  books[isbn].reviews[username] = review;
  return res.status(200).json({
    message: `Review for ISBN ${isbn} added/updated successfully`,
    reviews: books[isbn].reviews,
  });
});

// Task 9: Delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.user.data.username;
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
  if (!books[isbn].reviews[username])
    return res.status(404).json({ message: "No review found for this user" });
  delete books[isbn].reviews[username];
  return res.status(200).json({
    message: `Review for ISBN ${isbn} deleted successfully`,
    reviews: books[isbn].reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
