var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Qualiteacher' });
});

/* GET - Página registro. */
router.get('/registro', function(req, res, next) {
	res.render('registro', {title : 'Qualiteacher | Registro'});
});

/* GET - Página registro Correcto. */
router.get('/registro-completado', function(req, res, next) {
	res.render('registroCompletado', {title : 'Qualiteacher | Registro completado'});
});

module.exports = router;
