var express = require('express');
var router = express.Router();

var decorateErrors = require('../viewmodels/timesheet');

// Munkalista oldal
router.get('/list', function (req, res) {
    req.app.models.timesheet.find().then(function (timesheets) {
        res.render('timesheets/list', {
            timesheets: decorateErrors(timesheets),
            messages: req.flash('info')
        });
    });
});

// Munka felvitele
router.get('/new', function(req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();
    
    res.render('timesheets/new', {
        validationErrors: validationErrors,
        data: data,
    });
})

// Munka felvitele POST
router.post('/new', function(req, res) {
   // adatok ellenőrzése
    req.checkBody('helyszin', 'Hibás helyszín').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('leiras').escape();
    req.checkBody('leiras', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);
    
    if (validationErrors) {
        // űrlap megjelenítése a hibákkal és a felküldött adatokkal
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/timesheets/new');
    }
    else {
        req.app.models.timesheet.create({
            status: 'new',
            location: req.body.helyszin,
            description: req.body.leiras
        })
        .then(function (timesheets) {
            //siker
            req.flash('info', 'Munka sikeresen felvéve!');
            res.redirect('/timesheets/list');
        })
        .catch(function (err) {
            //hiba
            console.log(err)
        });
    }
})

module.exports = router;

