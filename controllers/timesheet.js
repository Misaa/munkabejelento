var express = require('express');
var router = express.Router();

var decorateErrors = require('../viewmodels/timesheet');

// Munkalista oldal
router.get('/list', function (req, res) {
    var user = req.user.id;
    req.app.models.timesheet.find({user: user }).then(function (timesheets) {
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
            description: req.body.leiras,
            user: req.user
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

router.post('/modify', function(req, res) {
   var id = req.body.id;
   
    req.app.models.timesheet.findOne({id: id}).then(function(timesheet){
    res.render('timesheets/modify', {
        data: timesheet,
        }); 
    });
   
})

// Hiba felvitele
router.get('/modify', function(req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();
    
    res.render('timesheets/modify', {
        validationErrors: validationErrors,
        data: data,
    });
})


router.post('/modify/apply', function(req, res){
        var mess;
        var userid = req.user.id;
        var id = req.body.id;
       
        var helyszin = req.body.helyszin;
        var leiras = req.body.leiras;
        
     // adatok ellenőrzése
        req.checkBody('helyszin', 'Hibás helyszín').notEmpty().withMessage('Kötelező megadni!');
    
        var validationErrors = req.validationErrors(true);
        console.log(validationErrors);
    
        if (validationErrors) {
            // űrlap megjelenítése a hibákkal és a felküldött adatokkal

            /*req.flash('validationErrors', validationErrors);
            req.flash('data', req.body);
            res.redirect('/errors/modify');*/
   
            req.app.models.timesheet.findOne({id: id}).then(function(timesheet){
            res.render('timesheets/modify', {
                validationErrors: validationErrors,
                data: timesheet,
                }); 
            });

        }else{
            req.app.models.timesheet.update({user: userid , id: id},{location:helyszin,description:leiras,date_out: new Date(), status: 'success'}).exec(function(err){
            if(err != null) console.log(err);
            
            });
            mess = 'Munka módosítása megtörtént';
            req.flash('info', mess);
            res.redirect('/timesheets/list');

            
        }
        

})

router.post('/delete', function(req, res){
        var mess;
        var userid = req.user.id;
        var id = req.body.id;
        req.app.models.timesheet.destroy({user: userid,id: id}).exec(function(err){
            if(err != null){
                console.log(err); 
            } 
            
                //mess = 'Munka sikeresen törölve!';
            
           // console.log('The record has been deleted');
        });
        mess = 'Munka sikeresen törölve!';
    req.flash('info', mess);
     res.redirect('/timesheets/list');

})
module.exports = router;
