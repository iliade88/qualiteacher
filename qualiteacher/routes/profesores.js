var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

var ProfesoresController = require('../controllers/ProfesoresController.js');

/* GET - lista profesores */
router.get('/', ProfesoresController.findAll);

/* GET - buscar profesor */
router.get('/:nombre', ProfesoresController.findByName);

/* GET - Vista detalle profesor */
router.get('/:profesor', ProfesoresController.detalleProfesor);

/* GET - Vista calificar profesor */
router.get('/:profesor/calificar', ProfesoresController.vistaCalificar);

/* POST - Calificar un profesor */
router.post('/:profesor/:asignatura/calificar', ProfesoresController.calificarProfesor);

module.exports = router;