// Kezdeti lépések
var Browser = require('zombie');
Browser.localhost(process.env.IP, process.env.PORT);
var browser = new Browser();


describe('User visits index page', function() {
    var browser = new Browser();
    
    before(function() {
        return browser.visit('/');
    });
    
    it('should be successful', function() {
        browser.assert.success();
    });
    
    it('should see welcome page', function() {
        browser.assert.text('div.page-header > h1', 'Munkabejelentő oldal');
    });
});

//Hitelesítés
describe('User visits new timesheet page', function (argument) {
    var browser = new Browser();
    before(function() {
        return browser.visit('/timesheets/new');
    });
    
    it('should go to the authentication page', function () {
        browser.assert.redirected();
        browser.assert.success();
        browser.assert.url({ pathname: '/login' });
    });
    
    it('should be able to login with correct credentials', function (done) {
        browser
            .fill('email', 'k81dnc')
            .fill('password', 'jelszo')
            .pressButton('button[type=submit]')
            .then(function () {
                browser.assert.redirected();
                browser.assert.success();
                browser.assert.url({ pathname: '/timesheets/list' });
                done();
            })
            
    });
});

it('should go the timesheet page', function () {
    return browser.visit('/timesheets/new')
    .then(function () {
        browser.assert.success();
        browser.assert.text('div.page-header > h1', 'Bejelentkezés');
    });
});

it('should show errors if the form fields are not right', function () {
    return browser
        .fill('helyszin', '')
        .fill('leiras', '')
        .pressButton('button[type=submit]')
        .then(function() {
            // browser.assert.redirected();
            browser.assert.success();
            browser.assert.element('form .form-group:nth-child(1) [name=helyszin]');
            browser.assert.hasClass('form .form-group:nth-child(1)', 'has-error');
        });
});

it('should show submit the right-filled form fields and go back to list page', function() {
    browser
        .fill('helyszin', 'cica')
        .fill('leiras', 'kutya')
        .pressButton('button[type=submit]')
        .then(function() {
            browser.assert.redirected();
            browser.assert.success();
            browser.assert.url({ pathname: '/timesheets/list' });
            
            browser.assert.element('table.table');
            browser.assert.text('table.table tbody tr:last-child td:nth-child(2) span.label', 'Új');    
            browser.assert.text('table.table tbody tr:last-child td:nth-child(3)', 'cica');    
            browser.assert.text('table.table tbody tr:last-child td:nth-child(4)', 'kutya');
        });
});