var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Qualiteacher' });
});

/* GET - Página registro. */
router.get('/registro', function(req, res, next) {

	var universidades_select;
	universidades.find(function(err, universidades){
		if (err) console.log(err)

		universidades_select = universidades;
	});

	res.render('registro', {title : 'Qualiteacher | Registro', universidades : universidades_select});
});

module.exports = router;
