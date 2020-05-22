'use strict'

function errorHandler(req, res, error){
  res.render('pages/error.ejs', {'error': error});
}

module.exports = errorHandler;