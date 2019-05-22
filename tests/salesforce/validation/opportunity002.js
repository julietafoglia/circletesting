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
let OpportunitiesLandingPage =
    require(rootPath + '/pages/salesforce/opportunities-landing');
let OpportunitiesEditPage =
    require(rootPath + '/pages/salesforce/opportunities-edit');

// salesforce runtime variables
const targetEnvironment =
    require(rootPath + '/config/salesforce/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const targetUser = targetEnvironment.user;

describe('{{SALESFORCE}} agency - opportunity {validation} >>> ' +
    '(+) missing required fields >>>', function() {

    // salesforce shared test variable(s)
    let driver;

    // disable mocha time outs
    this.timeout(0);

    // fixture(s)
    let opportunityFixture = Object.assign(
        {}, require(rootPath + '/fixtures/salesforce/opportunity-create002')
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

    it('should set a new opportunity\'s record type', function(done) {
        let opportunitiesLandingPage = new OpportunitiesLandingPage(driver);
        opportunitiesLandingPage
            .navigate()
            .clickNewOppBtn()
            .selectRecordType(opportunityFixture.type)
            .clickContinue()
            .then((res) => {
                done();
            }, (err) => {

                done(err);
            });
    });

    it('should display an error for each missing field', function(done) {
        let opportunitiesEditPage = new OpportunitiesEditPage(driver);
        opportunitiesEditPage
            .selectAdServer(opportunityFixture.adServer)
            .useLiveIntentNumbers(opportunityFixture.liNumbers)
            .enterTotalBudget(opportunityFixture.totalBudget)
            .enterDomain(opportunityFixture.domain)
            .selectIABCategory(opportunityFixture.iabCategory)
            .clickSaveBtn()
            .getErrorCount()
            .then((res) => {
                expect(res).to.equal(4);
                done();
            }, (err) => {

                done(err);
            });
    });

});
