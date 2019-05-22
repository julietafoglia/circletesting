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
let LiveInticketPage =
    require(rootPath + '/pages/salesforce/liveinticket');

// salesforce runtime variables
const targetEnvironment =
    require(rootPath + '/config/salesforce/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const targetUser = targetEnvironment.user;
const endpoints = require(rootPath + '/config/salesforce/endpoints');

describe('{{SALESFORCE}} liveinticket case {validation} >>> ' +
    '(+) error(s) on case save >>>', function() {

    // shared test variable(s)
    const timeStamp = '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SSS');

    // salesforce shared test variable(s)
    let driver;
    let liveInticketPage;

    // disable mocha time outs
    this.timeout(0);

    // fixture(s)
    let accountFixture = Object.assign(
        {}, require(rootPath + '/fixtures/salesforce/account-create001')
    );
    let opportunityFixture = Object.assign(
        {}, require(rootPath + '/fixtures/salesforce/opportunity-create002')
    );
    let productFixture = Object.assign(
        {}, require(rootPath + '/fixtures/salesforce/product-update001')
    );
    let caseFixture = Object.assign(
        {}, require(rootPath + '/fixtures/salesforce/case001')
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

    it('should create a new opportunity - missing fields', function(done) {
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
            .enterBrand(opportunityFixture.brand)
            .enterTotalBudget(opportunityFixture.totalBudget)
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

    it('should create a new product - missing bid amount', function(done) {
        let productEditPage = new ProductEditPage(driver);
        // populate fixture fields
        productFixture.name += timeStamp;
        productFixture.liveDate = moment().format('MM/DD/YYYY');
        productFixture.endDate =
            moment().endOf('week').format('MM/DD/YYYY');
        productEditPage
            .selectCampaignType(productFixture.type)
            .enterCampaignName(productFixture.name)
            .enterFlightStart(productFixture.liveDate)
            .enterEndDate(productFixture.endDate)
            .enterBudget(productFixture.budget)
            .selectCampaignGoal(productFixture.campaignGoal.index)
            .selectPrimaryIABCat(productFixture.primaryIabCategory)
            .selectSecondaryIABCats(productFixture.secondaryIabCategories)
            .saveProduct()
            .then((res) => {
                done();
            }, (err) => {

                done(err);
            });
    });

    it('liveinticket case should display error(s) on save', function(done) {
        liveInticketPage = new LiveInticketPage(driver);
        caseFixture.subject += timeStamp;
        caseFixture.account = accountFixture.name;
        caseFixture.opportunity = sfHelper.constructIOName(
            accountFixture.name, opportunityFixture, productFixture.budget
        );
        liveInticketPage
            .switchToLiveInticket(
                util.format(targetServer, endpoints.liveInticketHome)
            )
            .clickNewCaseBtn()
            .selectCaseRecordType(caseFixture.caseRecordType)
            .selectCategory(caseFixture.category)
            .enterSubject(caseFixture.subject)
            .enterDescription(caseFixture.description)
            .isPixelNeeded(caseFixture.pixelNeeded)
            .hasNewCreativeAssets(caseFixture.newCreativeAssets)
            .enterAdvertiserId(caseFixture.advertiserId)
            .enterAccountName(caseFixture.account)
            .enterOpportunityName(caseFixture.opportunity)
            .enterAgreementName(caseFixture.agreement)
            .clickSaveBtn()
            .getErrors()
            .then((res) => {
                expect(res).to.eql([
                    errors.liTktMissingAccManager,
                    errors.liTktMissingAdServerError,
                    errors.liTktMissingBidAmntError,
                    errors.liTktMissingDomainError,
                    errors.liTktMissingIabCatError,
                    errors.liTktMissingLINumbersError
                ]);
                done();
            }, (err) => {

                done(err);
            });

    });

    it('should switch back to sales view', function(done) {
        liveInticketPage
            .switchToSales(
                util.format(targetServer, endpoints.salesHome)
            )
            .then((res) => {
                done();
            }, (err) => {

                done(err);
            });

    });

});
