'use strict'


//Packages
const express = require('express');


//Global Variables / App Setup
const app = express();
const PORT = process.env.PORT || 3000;


//Middleware -public files are front end facing
app.use(express.static('./public/styles'));
app.use(express.urlencoded({extended: true}));


//CONFIGS
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  console.log(req.body);
  res.redirect('/pages/searches/new');
});

app.get('/pages/searches/new', (req, res) => res.render('pages/searches/new'));


app.listen(PORT, console.log(`we runnin cool runnins @ ${PORT}`));