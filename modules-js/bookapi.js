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

Book.Query = function (req){ // whatever we pass as terms will be determined by the post from the form. 
  // constructs a query object for superagent to use query= '?q=search+terms'
  this.key = process.env.GOOGLE_API_KEY;
  
  // this.terms = terms ? inauthor : intitle;  /*intitle || inauthor; passed as result of form submit.*/
  this.q = req.query;/*'Stephen King';*/
};

function displayResults(req, res){ 
  console.log(`req.query.search@ displayResults:bookapi  ${req.body.search}`);
  res.send(superQuery(req, res));
}

// passes query through query constructor sends to api returns array of objects to 
//display results. 
function superQuery(req, res){
  // console.log(`request.body[0].item: ${req.body[0].item}`);
  // console.log(`req.query.key: ${req.query.key}`);
  // const bookListQuery = new Book.Query(req.query, req.query.terms)
  const url = 'https://www.googleapis.com/books/v1/volumes';
  superagent.get(url)
    .query({'q': req.body.search, 'key' : process.env.GOOGLE_API_KEY})
    .then(result => {
      console.log(`result:fn:superagent:Object.keys: result.body ${Object.entries(result.body.items[0])}`)
      makeItSo(result)
    })
    .catch(error => {
      console.log(`error from .catch: ${error}`)
      // res.redirect(error, '..veiws/pages/error.ejs')
    })
};

function makeItSo(result){ 
  // console.log('result.body[0].items[0]:', result.body.items[0]);[x] this gets what we need. 
  return result.body.items.map(curr => new Book(curr)); 
}









module.exports = displayResults;