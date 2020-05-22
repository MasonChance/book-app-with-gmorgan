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

app.get('/pages/index.ejs', (req, res) => {

  client.query('SELECT image_url, author, title FROM books').then(result => res.render('pages/index.ejs', {result_list: result.rows}))
});


app.get('/pages/searches/new', (req, res) => res.render('pages/searches/new'));

// app.get('/pages/searches/show,', )
app.post('/pages/searches/show', displayResults);

app.get('/book/:id')
//Display the single book
// callback should call

app.post('/book', (req, res) => { 
  sqlSave(req) // saves to sql
  const sqlId = getArchivedId(req.body.title); // returns ID from sql
  // Redirect to the detail page of that book based on it's ID

  res.render('/pages/book/:id', showSavedBook(req, res, sqlId));
  // !!! will this actually pass the id to showSavedBooks or would I need to chain all of these into a .then sequence within a broadscope call back function for the app.post(/book) route???
  
  //FIXME: !!! how do we pass this Id to our details page so that the details callback can use it to fetch the data from the database and render it to the details page. !!! 
});



app.get('/pages/detail', (req, res) => {
  client.query('SELECT * FROM books WHERE id $1', [req.params.id]).then(dataFromSql => {
    
  res.render('/pages/detail', dataFromSql.rows[0])
  })
});

app.get('/pages/searches/error', (req, res) => res.render('/pages/searches/error'));

// 
function sqlSave(req, res)  {
  const sqlSaveToDatabase = 'INSERT INTO books (author, title, image_url, description) VALUES ($1,$2,$3,$4)';
  //FIXME:  add isbn to constructor, add to sqlSaveArr below, add to sqlSaveToDatabase above in parenthesis, add $5 to sqlSaveToDataBase above. 
  const sqlSaveArr = [req.body.author, req.body.title, req.body.img, req.body.synopsis]  
  client.query(sqlSaveToDatabase, sqlSaveArr)
}



function getArchivedId(req, res){
  //needs, id from database.
  const sqlSearch = 'SELECT * FROM books WHERE title=$1';
  const sql =[req.body.title];
  client.query(sqlSearch, sql)
  // access ID result.rows[0].id
    .then(record => (req, res)=> res.send(record.rows[0].id))
    .catch(error => errorHandler(req, res, error))
  // returns ID from DataBase
}

//sends object literals to the appropriate route for rendering and acces via ejs. 
function showSavedBook(req, res, id){
  const sqlSelect = 'SELECT * FROM books WHERE id=$1';
  const sqlValue = [id];
  client.query(sqlSelect, sqlValue)
    .then(sqlres => res.send({'id' : id}, {'title' : sqlres.rows[0].title}, {'author' : sqlres.rows[0].author}, {'synopsis' : sqlres.rows[0].synopsis}))
    .catch(error => errorHandler(req, res, error))
}







app.listen(PORT, console.log(`we runnin cool runnins @ ${PORT}`));