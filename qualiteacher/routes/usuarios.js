var mongoose = require('mongoose');
var express = require('express');
var UsuariosRouter = express.Router();

var UsuariosController = require('../controllers/UsuariosController.js');

/* GET users listing */
/* TODO - comentar para que no nos roben los usuarios antes de entregar */
UsuariosRouter.get('/', UsuariosController.findUsers);

/* POST nuevo usuario */
UsuariosRouter.post('/', UsuariosController.anyadirUsuario);

module.exports = UsuariosRouter;