'use strict'


//Packages
const express = require('express');


//Global Variables / App Setup
const app = express();
const PORT = process.env.PORT || 3000;


//Middleware -public files are front end facing
app.use(express.static('.public/styles'));
app.use(express.urlencoded({extended: true}));


//CONFIGS
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.render('index.ejs');
});