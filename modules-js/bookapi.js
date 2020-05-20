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
  this.img = obj.volumeInfo.imageLinks.smallThumbnail || 'https://i.imgur.com/J5LVHEL.jpg';
  this.synopsis = obj.volumeInfo.description || 'Description unavailable at this time.';
};

Book.Query = function (req){ // whatever we pass as terms will be determined by the post from the form. 
  // constructs a query object for superagent to use query= '?q=search+terms'
  // this.key = process.env.GOOGLE_API_KEY;
  this.q = `intitle:${req.body.search} ` /*'Stephen King';*/
  
};

function renderResults(result_list){ 
  
  res.render('pages/searches/show', {'result_list' : result_list});
}

// passes query through query constructor sends to api returns array of objects to 
//display results. 
function displayResults(req, res){
  const url = 'https://www.googleapis.com/books/v1/volumes';
  const query = new Book.Query(req);

  superagent.get(url)
    .query(query)
    .then(result => makeItSo(result, res))
    .then(result_list => renderResults(result_list))
    .catch(error => {
      console.log(`error from .catch: ${error}`)
      // res.redirect(error, '..veiws/pages/error.ejs')
    })
};

function makeItSo(result){ 
  // console.log('result.body[0].items[0]:', result.body.items[0])//;[x] this gets what we need. 
  const list = result.body.items.map(curr => new Book(curr)); 
  // res.render('pages/searches/show', {result_list : list})
  console.log(`result_list : list ${list[0]}`)
  return  list;
}









module.exports = displayResults;