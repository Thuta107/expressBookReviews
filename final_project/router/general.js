const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body?.username??null
  const password = req.body?.password??null
  if(!username || !password) return res.status(400).json({message: `Username or Password is missing`});
  if(!isValid(username)) return res.status(403).json({message: `Error: User with the name, ${username} already exists.`});
  const newUser = Object.assign({}, { username, password });
  users.push(newUser)
  return res.status(200).json({ message: 'User is successfully registered!' });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbnBook = books[req.params.isbn];
  if(!isbnBook) return res.status(404).json({message: `Error: Book not found for ISBN ${req.params.isbn}`});
  return res.status(200).json(isbnBook);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();
  const authorBooks = Object.keys(books)
    .map(key => books[key])
    .filter(book => book.author.toLowerCase() == author);
  return res.status(200).json(authorBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();
    const titleBooks = Object.keys(books)
      .map(key => books[key])
      .filter(book => book.title.toLowerCase() == title);
    return res.status(200).json(titleBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbnBook = books[req.params.isbn];
    if(!isbnBook) return res.status(404).json({message: `Error: Book not found for ISBN ${req.params.isbn}`});
    return res.status(200).json(isbnBook.reviews);
});

module.exports.general = public_users;
