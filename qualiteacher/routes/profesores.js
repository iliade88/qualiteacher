var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

var Profesores = mongoose.model('Profesores');

/* GET - lista profesores */
router.get('/', function(req, res, next) {
    Profesores.find(function(err, profesores){

        if (err) {return next(err)}

        res.json(profesores)
    })
});

/* GET - calificar un profesor */
router.get('/:id/calificar', function(req, res, next) {
    var prof = new Profesores({
            nombre: 'Domingo Gallardo'
    });
    res.render('calificar', {title: 'Qualiteacher | Calificar', profesor: prof})
});

module.exports = router;
