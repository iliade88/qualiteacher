var express = require('express');
var router = express.Router();

var UsuariosController = require('../controllers/UsuariosController.js');

/* GET users listing */
/* TODO - comentar para que no nos roben los usuarios antes de entregar */
router.get('/', UsuariosController.findUsers);

/* POST registro usuario */
router.post('/', UsuariosController.anyadirUsuario);

/* POST nuevo usuario */
router.post('/registro', UsuariosController.anyadirUsuario);

/* POST nuevo usuario */
router.post('/login', UsuariosController.login);

/* GET - Activar usuario */
router.get('/activar/:token', UsuariosController.activarUsuario)

module.exports = router;