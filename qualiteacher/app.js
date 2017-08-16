var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


mongoose.connect('mongodb://qualiteacher:qualiteacher@ds145183.mlab.com:45183/qualiteacher');
require('./models/Universidades');
require('./models/Usuarios');
require('./models/Profesores');
require('./models/Asignaturas');
require('./models/Carreras');
require('./models/Tops');

//Lanzamos el proceso periódico para calcular las notas
var cronCalculaNotas = require('./cron-jobs/cronCalculaNotas')
cronCalculaNotas.lanzaScheduler();

var index = require('./routes/index');
var usuarios = require('./routes/usuarios');
var universidades = require('./routes/universidades');
var carreras = require('./routes/carreras');
var asignaturas = require('./routes/asignaturas');
var profesores = require('./routes/profesores');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/usuarios', usuarios);
app.use('/universidades', universidades);
app.use('/carreras', carreras);
app.use('/profesores', profesores);
app.use('/asignaturas', asignaturas);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('modular/error');
});

module.exports = app;
