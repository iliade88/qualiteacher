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

/* GET - Vista recuperar contraseña */
router.get('/recuperar', UsuariosController.vistaRecuperarContrasenya)

/* GET - Vista nueva contraseña */
router.get('/recuperar/:token', UsuariosController.vistaCambiarContrasenya);

/* GET - Vista nueva contraseña */
router.get('/contrasenya-cambiada', UsuariosController.vistaContrasenyaCambiada);

/* POST - Cambiar contraseña */
router.post('/nueva-contrasenya', UsuariosController.cambiarContrasenya);

router.post('/email-recuperar-contrasenya', UsuariosController.enviarEmailRecuperarContrasenya);

module.exports = router;