'use strict';
const express = require('express');
const cors = require('cors');
require('dotenv').config();


//Global Variables / App Setup
const app = express();
const superagent = require('superagent');


app.use(cors());

//====== constructor for Book result ===//

// === we may need to restructure to use the following in order to access the volume info property. obj.body[0].items[0].volumeInfo.authors. 

//re-constitutes api information as an object
function Book(obj){
  this.title = obj.volumeInfo.title;
  this.author = obj.volumeInfo.authors || 'Unknown/Anonymous';
  this.img = obj.volumeInfo.imageLinks.medium || 'https://i.imgur.com/J5LVHEL.jpg';
  this.synopsis = obj.volumeInfo.description || 'Description unavailable at this time.';
};

Book.Query = function (q, terms){
  // constructs a query object for superagent to use query= '?q=search+terms'
  this.key = process.env.GOOGLE_API_KEY;
  this.url = 'https://www.googleapis.com/books/v1/volumes';
  this.terms = 'inauthor';  /*intitle || inauthor;*/
  this.q = 'Stephen King';/*req.query;*/
};

function displayResults(req, res){ 
  res.send(superQuery(req, res));
}

// passes query through query constructor sends to api returns array of objects to 
//display results. 
function superQuery(req, res){
  console.log(`request.body[0].item: ${request.body[0].item}`);
  const bookListQuery = new Book.Query(req.query, req.query.terms)
  superagent.get(bookListQuery.url)
    .query(bookListQuery)
    .then(result => makeItSo(result)).status(200)
    .catch(error => res.redirect('error', error).status(500))
}

function makeItSo(result){ 
  return result.body[0].item.map(curr => new Book(curr)); 
}








module.exports = displayResults;