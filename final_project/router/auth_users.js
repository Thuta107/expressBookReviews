const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const JWT_SECRET = 'jwtSecretKey'

let users = [];

const isValid = (username)=> { 
    //returns boolean
    //write code to check is the username is valid
    const sameUsers = users.map(user => user.username)
        .filter(name => name == username)
    return sameUsers.length > 0 ? false : true;
}

const authenticatedUser = (username,password) => { 
    //returns boolean
    //write code to check if username and password match the one we have in records.
    const user = users.filter(user => user.username == username)
    return (user.length > 0 && user[0].password == password) ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(authenticatedUser(username, password)) {
    return res.json({
        token: jwt.sign({ username: username }, JWT_SECRET) 
    })
  }
  return res.status(401).json({message: "Invalid username or password."});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbnBook = books[req.params.isbn];
  if(!isbnBook) return res.status(404).json({message: `Error: Book not found for ISBN ${req.params.isbn}`})
  if(!req.body.review) return res.status(401).json({message: "Review is missing."});
  isbnBook['reviews'].username = req.body.review
  return res.status(200).json(isbnBook);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbnBook = books[req.params.isbn];
  if(!isbnBook) return res.status(404).json({message: `Error: Book not found for ISBN ${req.params.isbn}`})
  delete isbnBook['reviews'].username
  return res.status(200).json(isbnBook);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
