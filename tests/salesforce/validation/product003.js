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
let AccountsDetailPage =
    require(rootPath + '/pages/salesforce/accounts-detail');
let OpportunitiesLandingPage =
    require(rootPath + '/pages/salesforce/opportunities-landing');
let OpportunitiesEditPage =
    require(rootPath + '/pages/salesforce/opportunities-edit');
let OpportunitiesDetailPage =
    require(rootPath + '/pages/salesforce/opportunities-detail');
let ProductEditPage =
    require(rootPath + '/pages/salesforce/product-edit');

// salesforce runtime variables
const targetEnvironment =
    require(rootPath + '/config/salesforce/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const targetUser = targetEnvironment.user;

describe('{{SALESFORCE}} client direct - direct adv - product {validation} >>>'
    + ' (+) missing required fields >>>', function() {

    // shared test variable(s)
    const timeStamp = '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SSS');

    // salesforce shared test variable(s)
    let driver;

    // disable mocha time outs
    this.timeout(0);

    // fixture(s)
    let accountFixture = Object.assign(
        {}, require(rootPath + '/fixtures/salesforce/account-create001')
    );
    let opportunityFixture = Object.assign(
        {}, require(rootPath + '/fixtures/salesforce/opportunity-create001')
    );
    let productFixture = Object.assign(
        {}, require(rootPath + '/fixtures/salesforce/product-create001')
    );

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        driver.manage().deleteAllCookies().then(_ => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should login in to salesforce successfully', function(done) {
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

    it('should create a new account', function(done) {
        let accountsEditPage = new AccountsEditPage(driver);
        // populate fixture fields
        accountFixture.name += timeStamp;

        accountsEditPage
            .enterAccountName(accountFixture.name)
            .saveAccount()
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

    it('should create a new opportunity', function(done) {
        let opportunitiesEditPage = new OpportunitiesEditPage(driver);
        // populate fixture fields
        opportunityFixture.name += timeStamp;
        opportunityFixture.liveDate = moment().format('MM/DD/YYYY');
        opportunityFixture.endDate =
            moment().endOf('month').format('MM/DD/YYYY');

        opportunitiesEditPage
            .enterAccountName(accountFixture.name)
            .enterOppName(opportunityFixture.name)
            .selectStage(opportunityFixture.stage)
            .enterLiveDate(opportunityFixture.liveDate)
            .enterEndDate(opportunityFixture.endDate)
            .selectAdServer(opportunityFixture.adServer)
            .useLiveIntentNumbers(opportunityFixture.liNumbers)
            .enterTotalBudget(opportunityFixture.totalBudget)
            .enterDomain(opportunityFixture.domain)
            .selectIABCategory(opportunityFixture.iabCategory)
            .saveOpp()
            .then((res) => {
                done();
            }, (err) => {

                done(err);
            });
    });

    it('should initiate new product creation', function(done) {
        let opportunitiesDetailPage = new OpportunitiesDetailPage(driver);
        opportunitiesDetailPage
            .clickAddProdButton()
            .then((res) => {
                done();
            }, (err) => {

                done(err);
            });
    });

    it('should display error(s) on product save', function(done) {
        let productEditPage = new ProductEditPage(driver);
        productEditPage
            .selectCampaignType(productFixture.type)
            .selectCampaignGoal(productFixture.campaignGoal.index)
            .enterBidAmount(productFixture.cpmBidAmount)
            .selectPrimaryIABCat(productFixture.primaryIabCategory)
            .selectSecondaryIABCats(productFixture.secondaryIabCategories)
            .clickSaveBtn()
            .getErrors()
            .then((res) => {
                expect(res).to.eql([
                    errors.missingCampaignNameError,
                    errors.missingFlightStartError,
                    errors.missingEndDateError
                ]);
                done();
            }, (err) => {

                done(err);
            });
    });

});
