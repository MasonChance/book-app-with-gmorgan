'use strict';
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pg = require('pg');


//Global Variables / App Setup
const app = express();
const superagent = require('superagent');


//Server set-up
const client = new pg.Client(process.env.DATABASE_URL)
client.on('error', console.error);
client.connect();

app.use(cors());

//==== errorHandler exported from server.js ===//
const errorHandler = require('./error.js');

//====== constructor for Book result ===//
function Book(obj){
  const objectAccess = obj.volumeInfo;
  this.title = objectAccess.title;
  this.author = objectAccess.authors || 'Unknown/Anonymous';
  this.img = urlConflict(objectAccess.imageLinks.smallThumbnail) || 'https://i.imgur.com/J5LVHEL.jpg';
  this.synopsis = objectAccess.description || 'Description unavailable at this time.';
};


Book.Query = function (req){ 

  //!!! add short circuit `||` to account for "inauthor" search. since the 'inauthor' will be passed as part of the post route that instantiates the query???
  this.q = `intitle:${req.body.search} `;
};

function renderResults(req, res, result_list){ 
  res.render('pages/searches/show', {'result_list' : result_list});
}


function displayResults(req, res){
  const url = 'https://www.googleapis.com/books/v1/volumes';
  const query = new Book.Query(req);
  superagent.get(url)
    .query(query)
    .then(result => makeItSo(result))
    .then(result_list => renderResults(req, res, result_list))
    .catch(error => errorHandler(req, res, error))
};

function makeItSo(result){ 
  // console.log('result.body.items[0].volumeInfo', result.body.items[0].volumeInfo);
  const list = result.body.items.map(curr => new Book(curr)); 
  return  list;
}

function urlConflict(objectAccess){
 const urlReceived = objectAccess;
 if(urlReceived[4] !== 's'){
  let urlResolved = `https${urlReceived.slice(4)}`
  return urlResolved;
 } else {
   return urlReceived;
 }

}


module.exports = displayResults;