'use strict';

// vendor dependencies
const chance = require('chance').Chance();
const chai = require('chai');


const expect = chai.expect; // use bdd chai
const moment = require('moment');
const request = require('supertest-as-promised');
const util = require('util');
const validator = require('validator');

// common runtime variables
const rootPath = process.env.ROOT_PATH;

// helpers
const driverBuilder = require(rootPath + '/helpers/driver-builder');
const sfHelper = require(rootPath + '/helpers/salesforce');
const errors = require(rootPath + '/fixtures/salesforce/errors');

//  Page object(s)
let LoginPage =
    require(rootPath + '/pages/salesforce/login');
let AccountsLandingPage =
    require(rootPath + '/pages/salesforce/accounts-landing');
let AccountsEditPage =
    require(rootPath + '/pages/salesforce/accounts-edit');

// salesforce runtime variables
const targetEnvironment =
    require(rootPath + '/config/salesforce/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const targetUser = targetEnvironment.user;

describe('{{SALESFORCE}} agency - account {validation} >>> ' +
    '(+) save - missing required fields - name and website >>>', function() {

    // salesforce shared variable(s)
    let driver;

    // disable mocha time outs
    this.timeout(0);

    // fixture(s)
    let accountFixture = Object.assign(
        {}, require(rootPath + '/fixtures/salesforce/account-create002')
    );

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        driver.manage().deleteAllCookies().then(_ => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should login into salesforce successfully', function(done) {
        let loginPage = new LoginPage(driver);
        loginPage
            .navigate(util.format(targetServer, ''))
            .enterUsername(targetUser.username)
            .enterPassword(targetUser.password)
            .clickLoginBtn()
            .then((res) => {
                done();
            }, (err) => {

                done(err);
            });
    });

    it('should set a new account\'s record type', function(done) {
        let accountsLandingPage = new AccountsLandingPage(driver);
        accountsLandingPage
            .navigate()
            .clickNewAccountBtn()
            .selectRecordType(accountFixture.type)
            .clickContinue()
            .then((res) => {
                done();
            }, (err) => {

                done(err);
            });
    });

    it('should display an error(s) on save', function(done) {
        let accountsEditPage = new AccountsEditPage(driver);
        accountsEditPage
            .clickSaveButton()
            .getErrors()
            .then((res) => {
                expect(res).to.eql([
                    errors.missingAccNameError,
                    errors.missingWebsiteError
                ]);
                done();
            }, (err) => {

                done(err);
            });
    });

});
