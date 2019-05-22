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

describe('{{SALESFORCE}} old existing opportunity and product {update} >>> ' +
    '(+) attempt to update >>>', function() {

    // shared test variable(s)
    const timeStamp = '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SSS');

    // salesforce share variable(s)
    let driver;

    // fixture(s)
    let opportunityUpdateFixture;
    let productUpdateFixture;

    // disable mocha time outs
    this.timeout(0);

    opportunityUpdateFixture = Object.assign(
        {}, require(rootPath + '/fixtures/salesforce/opportunity-update003')
    );

    productUpdateFixture = Object.assign(
        {}, require(rootPath + '/fixtures/salesforce/product-update005')
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

    it('should navigate to an existing opportunity', function(done) {
        let opportunitiesDetailPage = new OpportunitiesDetailPage(driver);
        opportunitiesDetailPage
            .navigate(util.format(
                targetServer, opportunityUpdateFixture.opportunityUrl
            )
            )
            .clickOppEditButton()
            .then((res) => {
                done();
            }, (err) => {

                done(err);
            });

    });

    it('should attempt to edit an opportunity', function(done) {
        let opportunitiesEditPage = new OpportunitiesEditPage(driver);
        // populate fixture fields
        opportunityUpdateFixture.liveDate = moment().format('MM/DD/YYYY');
        opportunityUpdateFixture.endDate =
            moment().endOf('month').format('MM/DD/YYYY');

        opportunitiesEditPage
            .enterAccountName(opportunityUpdateFixture.accountName)
            .enterOppName(opportunityUpdateFixture.name)
            .enterBrand(opportunityUpdateFixture.brand)
            .enterIoName(opportunityUpdateFixture.ioName)
            .selectType(opportunityUpdateFixture.type)
            .selectStage(opportunityUpdateFixture.stage)
            .enterLiveDate(opportunityUpdateFixture.liveDate)
            .enterEndDate(opportunityUpdateFixture.endDate)
            .selectAdServer(opportunityUpdateFixture.adServer)
            .useLiveIntentNumbers(opportunityUpdateFixture.liNumbers)
            .enterLfmAdvId(opportunityUpdateFixture.lfmAdvId)
            .enterDomain(opportunityUpdateFixture.domain)
            .selectIABCategory(opportunityUpdateFixture.iabCategory)
            .enterLfmIoId(opportunityUpdateFixture.lfmIoId)
            .cancelOppEdit()
            .then((res) => {
                done();
            }, (err) => {

                done(err);
            });
    });

    it('should open product edit page', function(done) {
        let opportunitiesDetailPage = new OpportunitiesDetailPage(driver);
        opportunitiesDetailPage
            .clickAddProdButton()
            .then((res) => {
                done();
            }, (err) => {

                done(err);
            });
    });

    it('should attempt edit existing product', function(done) {
        let productEditPage = new ProductEditPage(driver);
        // populate fixture fields
        productUpdateFixture.name += timeStamp;
        productUpdateFixture.pixelName += timeStamp;
        productUpdateFixture.liveDate = moment().format('MM/DD/YYYY');
        productUpdateFixture.endDate =
            moment().endOf('week').format('MM/DD/YYYY');
        productEditPage
            .enterCampaignName(productUpdateFixture.name)
            .enterFlightStart(productUpdateFixture.liveDate)
            .enterEndDate(productUpdateFixture.endDate)
            .enterBudget(productUpdateFixture.budget)
            .selectCampaignGoal(productUpdateFixture.campaignGoal.index)
            .enterBidAmount(productUpdateFixture.cpmBidAmount)
            .enterFrequencyCap(productUpdateFixture.frequencyCap)
            .selectTimesPer(productUpdateFixture.timesPer)
            .selectPacing(productUpdateFixture.pacing)
            .enterTargetingDescription(productUpdateFixture.targeting)
            .enterMaxCPMBid(productUpdateFixture.maxCpmBid)
            .selectPrimaryIABCat(productUpdateFixture.primaryIabCategory)
            .selectSecondaryIABCats(
                productUpdateFixture.secondaryIabCategories
            )
            .checkPixelRadioBtn()
            .enterPixelName(productUpdateFixture.pixelName)
            .cancelProdEdit()
            .then((res) => {
                done();
            }, (err) => {

                done(err);
            });
    });

});
