'use strict'


//Packages
const express = require('express');
const cors = require('cors');
require('dotenv').config();


//Global Variables / App Setup
const app = express();
const PORT = process.env.PORT;
const displayResults = require('./modules-js/bookapi.js')


//Middleware -public files are front end facing
app.use(express.static('./public/styles'));
app.use(express.urlencoded({extended: true}));
app.use(cors());

//CONFIGS
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  console.log(req.body);
  res.redirect('/pages/searches/new');
});

app.get('/pages/searches/new', (req, res) => res.render('pages/searches/new'));

app.post('/pages/searches/show', displayResults);
console.log(`displayResults: ${displayResults}`);

app.listen(PORT, console.log(`we runnin cool runnins @ ${PORT}`));