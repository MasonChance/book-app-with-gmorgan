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

//====== constructor for Book result ===//
function Book(obj){
  this.title = obj.volumeInfo.title;
  this.author = obj.volumeInfo.authors || 'Unknown/Anonymous';
  this.img = obj.volumeInfo.imageLinks.smallThumbnail || 'https://i.imgur.com/J5LVHEL.jpg';
  this.synopsis = obj.volumeInfo.description || 'Description unavailable at this time.';
};

Book.Query = function (req){ 

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
    .catch(error => {
      console.log(`error from .catch: ${error}`)
      res.render('pages/error.ejs', {'error': error})
    })
};

function makeItSo(result){ 
  const list = result.body.items.map(curr => new Book(curr)); 
  sqlSave(result);
  return  list;
}

function sqlSave(result)  {
  const sqlSaveToDatabase = 'INSERT INTO books (author, title, isbn, image_url, description) VALUES ($1,$2,$3,$4,$5)';
  const sqlSaveArr = [result.body.items.authors, result.body.items.title, result.body.items.industryIdentifiers, result.body.items.imageLinks, result.body.items.description]  

  client.query(sqlSaveToDatabase, sqlSaveArr)
}


module.exports = displayResults;