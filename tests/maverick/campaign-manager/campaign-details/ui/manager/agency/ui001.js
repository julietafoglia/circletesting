'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.admin;
const driverTimeOut = 0;

// bootstrap variables
const entitiesFile =
    require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv = entitiesObj.agency001.children.advertiser001;
const targetIo = targetAdv.children.insertionOrder001;
const targetCam = targetIo.children.campaign001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath +
    '/pages/maverick/platform/login');
let AdvDetsPage = require(rootPath +
    '/pages/maverick/campaign-manager/advertiser-details');
let InsertionOrderDetailsPage = require(rootPath +
    '/pages/maverick/campaign-manager/insertion-order-details');
let CampaignDetailsPage = require(rootPath +
    '/pages/maverick/campaign-manager/campaign-details');
let loginPage;
let advDetsPage;
let campaignDetailsPage;
let insertionOrderDetailsPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer =
    targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/campaign/create001');
let testData001 = Object.assign({}, testFixture);
testData001.budget = (testData001.budget).
    toLocaleString('en-US', {style: 'currency', currency: 'USD'});
testData001.bidAmount = (testData001.bidAmount).
    toLocaleString('en-US', {style: 'currency', currency: 'USD'});
let tableSpent = '$0.00';
const campaignStartDate = moment().format('MMM D, YYYY');
const campaignEndDate = moment().add(30, 'days').format('MMM D, YYYY');

describe('{{MAVERICK}} /campaign-details {UI} @MANAGER >>> ' +
    '(+) verify campaign details ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        advDetsPage = new AdvDetsPage(driver);
        campaignDetailsPage = new CampaignDetailsPage(driver);
        insertionOrderDetailsPage = new InsertionOrderDetailsPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('maverick - login', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('campaign table should have all elements', function(done) {
        advDetsPage.navigate(targetServer, 'advertisers', targetAdv.refId);
        advDetsPage.clickIo(targetIo.name);

        campaignDetailsPage.getTableName(targetCam.name)
            .then(function(element) {
                expect(element).to.exist;
            });
        campaignDetailsPage.getTableId('ID: ' + targetCam.refId)
            .then(function(element) {
                expect(element).to.exist;
            });
        campaignDetailsPage.getTableType('Exchange')
            .then(function(element) {
                expect(element).to.exist;
            });
        campaignDetailsPage.getTableBudget(testData001.budget)
            .then(function(element) {
                expect(element).to.exist;
            });
        campaignDetailsPage.getTableSpent(tableSpent)
            .then(function(element) {
                expect(element).to.exist;
            });
        campaignDetailsPage.getTableGoal(testData001.bidAmount)
            .then(function(element) {
                expect(element).to.exist;
            });
        campaignDetailsPage.getTableDate(campaignStartDate)
            .then(function(element) {
                expect(element).to.exist;
            });
        campaignDetailsPage.getTableDate(campaignEndDate)
            .then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should search Campaign by id', function(done) {
        campaignDetailsPage.setInputSearch(targetCam.refId);
        campaignDetailsPage.getLinkText(targetCam.name);
        campaignDetailsPage.getSpan('Showing 1 - 1 (1)');
        driver.sleep(0).then(() => done());
    });


    it('PERMISSION: should display insertion order breadcrumb', function(done) {
        driver.navigate().refresh();
        campaignDetailsPage.getSpan('Insertion Order');
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('campaign details should show campaign type', function(done) {
        advDetsPage.navigate(targetServer, 'advertisers', targetAdv.refId);
        advDetsPage.clickIo(targetIo.name);
        insertionOrderDetailsPage.clickCampaign(targetCam.name);
        campaignDetailsPage.getSpan('Exchange').then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

});
