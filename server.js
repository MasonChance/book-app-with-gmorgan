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


app.get('/', (req, res) => {
  console.log(req.body);
  res.redirect('/pages/index.ejs');
});

app.get('/pages/index.ejs', (req, res) => 
  res.render('pages/index.ejs')
);


app.get('/pages/searches/new', (req, res) => res.render('pages/searches/new'));

// app.get('/pages/searches/show,', )
app.post('/pages/searches/show', displayResults);

app.get('/book/:id')
//Display the single book

app.post('/book', (req, res) => {
  res.redirect('detail');
  // Save Book
  // Retrieve the ID
  // Redirect to the detail page of that book



})

app.get('/pages/searches/error', (req, res) => {
  res.render('wrong turn')
})










app.listen(PORT, console.log(`we runnin cool runnins @ ${PORT}`));