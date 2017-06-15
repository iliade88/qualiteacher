var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

var Universidades = mongoose.model('Universidades');

/* GET - lista universidades */
router.get('/', function(req, res, next) {
	Universidades.find(function(err, universidades){

		if (err) {return next(err)}

		res.json(universidades)
	})
});

module.exports = router;
