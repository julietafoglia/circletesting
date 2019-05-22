'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect; // use bdd chai

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.admin;

// selenium runtime variables
let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let loginPage;


// Login texts:
const WRONG_EMAIL_2 = 'fa-all@liveintent.com';
const WRONG_PASSWORD_1 = 'qa';
const WRONG_PASSWORD_2 = 'P@SSW0RD';
const RIGHT_EMAIL_UPPERCASE = 'QA-ALL@LIVEINTENT.COM';

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;

const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE-PROD> {{MAVERICK}} login checks {ui} @ADMIN >>> ' +
    '(+) all ui >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        driver.manage().deleteAllCookies().then( () => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should navigate to login page', function(done) {
        loginPage.navigate(targetServer);
        driver.sleep(0).then(() => done());
    });

    it('should display email and password field', function(done) {
        expect(loginPage.getUsernameField()).to.exist;
        expect(loginPage.getPasswordField()).to.exist;
        driver.sleep(0).then(() => done());
    });

    it('should display Log In button', function(done) {
        expect(loginPage.getLoginButton()).to.exist;
        driver.sleep(0).then(() => done());
    });

    it('should navigate to login page', function(done) {
        loginPage.navigate(targetServer);
        driver.sleep(0).then(() => done());
    });

    it('should display an error after inexistent email and valid ' +
        'password', function(done) {
        loginPage.enterUsername(WRONG_EMAIL_2);
        loginPage.enterPassword(targetUser.password);
        loginPage.clickLoginButton();
        expect(loginPage.getLoginError()).to.exist;
        driver.sleep(0).then(() => done());
    });

    it('should navigate to login page', function(done) {
        loginPage.navigate(targetServer);
        driver.sleep(0).then(() => done());
    });

    it('should display error after valid email and wrong ' +
        'password', function(done) {
        loginPage.navigate(targetServer);
        loginPage.enterUsername(targetUser.username);
        loginPage.enterPassword(WRONG_PASSWORD_1);
        loginPage.clickLoginButton();
        expect(loginPage.getLoginError()).to.exist;
        driver.sleep(0).then(() => done());
    });

    it('should navigate to login page', function(done) {
        loginPage.navigate(targetServer);
        driver.sleep(0).then(() => done());
    });

    it('should display an error after valid email and UPPERCASE ' +
        'password', function(done) {
        loginPage.navigate(targetServer);
        loginPage.enterUsername(targetUser.username);
        loginPage.enterPassword(WRONG_PASSWORD_2);
        loginPage.clickLoginButton();
        expect(loginPage.getLoginError()).to.exist;
        driver.sleep(0).then(() => done());
    });

    it('should navigate to login page', function(done) {
        loginPage.navigate(targetServer);
        driver.sleep(0).then(() => done());
    });

    it('should correct log in after valid UPPERCASE email and valid ' +
        'password', function(done) {
        loginPage.navigate(targetServer);
        loginPage.enterUsername(RIGHT_EMAIL_UPPERCASE);
        loginPage.enterPassword(targetUser.password);
        loginPage.clickLoginBtn();
        driver.sleep(0).then(() => done());
    });

});
