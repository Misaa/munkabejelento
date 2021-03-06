var expect = require("chai").expect;
var bcrypt = require('bcryptjs');

var Waterline = require('waterline');
var waterlineConfig = require('../config/waterline');
var userCollection = require('./user');
var errorCollection = require('./timesheet');

var User;

before(function (done) {
    // ORM indítása
    var orm = new Waterline();

    orm.loadCollection(Waterline.Collection.extend(userCollection));
    orm.loadCollection(Waterline.Collection.extend(errorCollection));
    waterlineConfig.connections.default.adapter = 'memory';

    orm.initialize(waterlineConfig, function(err, models) {
        if(err) throw err;
        User = models.collections.user;
        done();
    });
});

describe('UserModel', function () {

    beforeEach(function (done) {
        User.destroy({}, function (err) {
            done();
        });
    });
    
    it('should work', function () {
        expect(true).to.be.true;
    });

});

//Felhasználó létrehozása
it('should be able to create a user', function () {
    return User.create({
            email: 'abcdef',
            password: 'jelszo',
            surname: 'Gipsz',
            forename: 'Jakab',
    })
    .then(function (user) {
        expect(user.email).to.equal('abcdef');
        expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
        expect(user.surname).to.equal('Gipsz');
        expect(user.forename).to.equal('Jakab');
    });
});

function getUserData() {
    return {
        email: 'abc',
        password: 'jelszo',
        surname: 'Gipsz',
        forename: 'Jakab',
    };
}

function getUserData2() {
    return {
        email: 'aaa',
        password: 'jelszo',
        surname: 'Gipsz',
        forename: 'Jakab',
    };
}

it('should be able to find a user', function() {
    return User.create(getUserData())
    .then(function(user) {
        return User.findOneByEmail(user.email);
    })
    .then(function (user) {
        expect(user.email).to.equal('abc');
        expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
        expect(user.surname).to.equal('Gipsz');
        expect(user.forename).to.equal('Jakab');
    });
});

[
    {name: 'surname', value: ''},
    {name: 'forename', value: ''},
    {name: 'email', value: ''},
    {name: 'password', value: ''},
].forEach(function (attr) {
    it('should throw error for invalid data: ' + attr.name, function () {
        var userData = getUserData();

        userData[attr.name] = attr.value;
        
        expect(User.create(userData)).to.throw;
    });    
});

describe('#validPassword', function() {
    it('should return true with right password', function() {
         return User.create(getUserData()).then(function(user) {
             expect(user.validPassword('jelszo')).to.be.true;
         })
    });
    it('should return false with wrong password', function() {
         return User.create(getUserData2()).then(function(user) {
             expect(user.validPassword('titkos')).to.be.false;
         })
    });
});