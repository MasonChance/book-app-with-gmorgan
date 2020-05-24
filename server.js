'use strict'


//Packages
const express = require('express');
const cors = require('cors');
require('dotenv').config();


//Global Variables / App Setup
const app = express();
const PORT = process.env.PORT;
const displayResults = require('./modules-js/bookapi.js')
const pg = require('pg');
const errorHandler = require('./modules-js/error.js');

//Middleware -public files are front end facing
app.use(express.static('./public/styles'));
app.use(express.urlencoded({extended: true}));
app.use(cors());

//CONFIGS
app.set('view engine', 'ejs');


//Server set-up
const client = new pg.Client(process.env.DATABASE_URL)
client.on('error', console.error);
client.connect();


app.get('/', (req, res) => res.redirect('/pages/index.ejs'));
app.get('/pages/index.ejs', showLibrary);


app.get('/pages/searches/new', (req, res) => res.render('pages/searches/new'));


app.post('/pages/searches/show', displayResults);

app.get('/book/:id', showSavedBook)
app.post('/book', sqlSave);

app.get('/pages/error', errorHandler);

// Saves book to Database.called in app.post(/book) 
function sqlSave(req, res)  {
  const sqlSaveToDatabase = 'INSERT INTO books (author, title, image_url, description) VALUES ($1,$2,$3,$4) RETURNING id';
  //FIXME:  add isbn to constructor, add to sqlSaveArr below, add to sqlSaveToDatabase above in parenthesis, add $5 to sqlSaveToDataBase above. 
  const sqlSaveArr = [req.body.author, req.body.title, req.body.img, req.body.synopsis]  
  client.query(sqlSaveToDatabase, sqlSaveArr)
  .then(id => res.redirect('book/' + id.rows[0].id))
  .catch(error => errorHandler(req, res, error))
}

//sends object literals to the appropriate route for rendering and acces via ejs. !!! must be updated for IBN inclusion. 
function showSavedBook(req, res){
  const sqlSelect = 'SELECT * FROM books WHERE id=$1';
  const sqlValue = [req.params.id];
  client.query(sqlSelect, sqlValue)
    .then(sqlres => res.render('pages/detail', {'sqlres' : sqlres.rows[0], 'displaybutton' : true}))
    .catch(error => errorHandler(req, res, error))
}


function showLibrary(req, res){
  client.query('SELECT id, image_url, author, title FROM books')
  .then(result => res.render('pages/index.ejs', {result_list: result.rows}))
}






app.listen(PORT, console.log(`we runnin cool runnins @ ${PORT}`));