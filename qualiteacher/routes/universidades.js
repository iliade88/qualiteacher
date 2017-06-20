var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

var UniversidadesController = require('../controllers/UniversidadesController.js');

/* GET - lista universidades */
router.get('/', UniversidadesController.findAll);

module.exports = router;
