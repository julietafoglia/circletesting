'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.admin;
const driverTimeOut = 0;

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdvertiser = entitiesObj.agency001.children.advertiser001;
const targetIo = targetAdvertiser.children.insertionOrder001;
const targetIo2 = targetAdvertiser.children.insertionOrder002;
const targetCampaign = targetIo.children.campaign001;
const targetCampaign2 = targetIo2.children.campaign001;
const targetLineItem = targetCampaign.children.lineItem001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let AdvDetsPage = require(rootPath +
     '/pages/maverick/campaign-manager/advertiser-details');
let IoDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/insertion-order-details');
let CampaignDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/campaign-details');
let LineItemDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-details');
let LineItemPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-form');
let loginPage;
let advDetsPage;
let ioDetailsPage;
let campaignDetailsPage;
let lineItemDetailsPage;
let lineItemPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

// fixtures
const testFixture = require(rootPath + '/fixtures/common/campaign/create011');
let testData001 = Object.assign({}, testFixture);
// testData001.budget = (testData001.budget).
//     toLocaleString('en-US', {style: 'currency', currency: 'USD'});
// const targetCampaign1Budget = ' ' + testData001.budget;
const testFixture2 = require(rootPath + '/fixtures/common/campaign/create019');
let testData002 = Object.assign({}, testFixture2);
testData002.budget = (testData002.budget).
    toLocaleString('en-US', {style: 'currency', currency: 'USD'});
const targetCampaign2Budget = ' ' + testData002.budget;

describe('{{MAVERICK}} /line-item {UI} @MANAGER >>> ' +
    '(+) verify budget when cloning >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        advDetsPage = new AdvDetsPage(driver);
        ioDetailsPage = new IoDetailsPage(driver);
        campaignDetailsPage = new CampaignDetailsPage(driver);
        lineItemDetailsPage = new LineItemDetailsPage(driver);
        lineItemPage = new LineItemPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    before('maverick - login', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('should navigate to copy page', function(done) {
        advDetsPage.navigate(targetServer, 'advertisers',
            targetAdvertiser.refId);
        advDetsPage.waitUntilLoaderNotVisible();
        advDetsPage.clickIo(targetIo.name);
        ioDetailsPage.waitUntilLoaderNotVisible();
        ioDetailsPage.setInputSearchCampaign(targetCampaign.name);
        ioDetailsPage.waitUntilFilterStale();
        ioDetailsPage.clickCampaign(targetCampaign.name);
        campaignDetailsPage.setInputSearch(targetLineItem.name);
        campaignDetailsPage.waitUntilFilterStale();
        campaignDetailsPage.clickLineItem(targetLineItem.name);
        lineItemDetailsPage.clickLinkCopy();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display correct budget for selected campaign', function(done) {
        lineItemPage.waitOverlayUntilStale();
        expect(lineItemPage.getInputBudget()).to.exist;
        lineItemPage.getInputBudget().getAttribute('ng-reflect-model').
            then(function(ngreflectmodel) {
                expect(ngreflectmodel).to
                    .be.below(testData001.budget);
            });

        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should delete parent campaign', function(done) {
        lineItemPage.getButtonDeleteParentCampaign().click();
        expect(lineItemPage.getInputParentCampaign()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should change parent campaign', function(done) {
        lineItemPage.setParentCampaign(targetCampaign2.name);
        lineItemPage.getTextParentCampaignOnClone().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to.
                    contain('(ID: ' + targetCampaign2.refId + ') '
                        + targetCampaign2.name);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display correct budget for selected campaign', function(done) {
        expect(lineItemPage.getInputBudget()).to.exist;
        expect(lineItemPage.getSpan(targetCampaign2Budget)).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

});
