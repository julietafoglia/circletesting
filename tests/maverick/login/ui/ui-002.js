'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;

// selenium runtime variables
let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let loginPage;


// Login texts:
const WRONG_EMAIL_2 = 'fa-all@liveintent.com';
const CORRECT_EMAIL = 'platform-qa@liveintent.com';
const FORGOT_PASS_TEXT = 'Forgot your password? We got you covered, just' +
' enter your email address and we';
const SENT_EMAIL_TEXT = 'An email was sent to ';

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

    it('should display forgot password link', function(done) {
        expect(loginPage.getForgotPasswordLink()).to.exist;
        driver.sleep(0).then(() => done());
    });

    it('should display forgot password fields', function(done) {
        loginPage.clickForgotPasswordLink();
        loginPage.getForgotPasswordText(FORGOT_PASS_TEXT);
        expect(loginPage.getResetPasswordButton()).to.exist;
        expect(loginPage.getUsernameField()).to.exist;
        driver.sleep(0).then(() => done());
    });

    it('should check reset button disabled if no email', function(done) {
        loginPage.getResetPasswordButton().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to.contain('disabled');
            });
        driver.sleep(0).then(() => done());
    });

    it('should check wrong email error', function(done) {
        loginPage.enterUsername(WRONG_EMAIL_2);
        loginPage.getResetPasswordButton().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to.not.contain('disabled');
            });
        loginPage.clickResetPassword();
        expect(loginPage.getResetError()).to.exist;
        expect(loginPage.getSpan('The email you provided was not found' +
            ' in our system.')).to.exist;
        driver.sleep(0).then(() => done());
    });

    it('should reset password', function(done) {
        loginPage.enterUsername(CORRECT_EMAIL);
        loginPage.getResetPasswordButton().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to.not.contain('disabled');
            });
        loginPage.clickResetPassword();
        expect(loginPage.getEmailSentText(SENT_EMAIL_TEXT)).to.exist;
        expect(loginPage.getResetedPasswordEmail(CORRECT_EMAIL)).to.exist;
        expect(loginPage.getReturnToLoginButton()).to.exist;
        driver.sleep(0).then(() => done());
    });

    it('should navigate to login page after clicking Return', function(done) {
        loginPage.clickReturnToLogin();
        expect(loginPage.getUsernameField()).to.exist;
        expect(loginPage.getPasswordField()).to.exist;
        expect(loginPage.getLoginButton()).to.exist;
        expect(loginPage.getForgotPasswordLink()).to.exist;
        driver.sleep(0).then(() => done());
    });


});
