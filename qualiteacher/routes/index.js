var express = require('express');
var router = express.Router();

var QualiteacherController = require('../controllers/QualiteacherController.js');

/* GET home page. */
router.get('/', QualiteacherController.home);

/* GET - Resultados Buscador */
router.get('/buscar/:cadena', QualiteacherController.buscar);

/* GET - Página login. */
router.get('/login', QualiteacherController.login);

/* GET - Página registro. */
router.get('/registro', QualiteacherController.registro);

/* GET - Página registro Correcto. */
router.get('/registro-completado', QualiteacherController.registroFinalizado);

module.exports = router;
