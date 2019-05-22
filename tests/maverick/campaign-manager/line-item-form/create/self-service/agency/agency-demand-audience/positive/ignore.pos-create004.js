'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment = require(rootPath +
    '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002.children.agencyUser001;
const driverTimeOut = 0;
const timeStamp = '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');
const timeToday = moment().format('MM-DD-YYYY');

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdvertiser = entitiesObj.agency002.children.advertiser001;
const targetIo = targetAdvertiser.children.insertionOrder001;
const targetCampaign = targetIo.children.campaign001;
const targetCreative1 = targetAdvertiser.children.creative001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let IoDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/insertion-order-details');
let CampaignDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/campaign-details');
let LineItemDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-details');
let LineItemPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-form');
let LineItemReviewPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-review-form');
let loginPage;
let ioDetailsPage;
let campaignDetailsPage;
let lineItemDetailsPage;
let lineItemPage;
let lineItemReviewPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

// fixture(s)
const testFixture1 =
    require(rootPath + '/fixtures/common/strategy/create001');
let testData001 = Object.assign({}, testFixture1);
testData001.name = testData001.name + timeStamp + ' (ads)';
testData001.status = 'Paused';
testData001.startDate = timeToday;
testData001.endDate = moment().add(30, 'days').format('MM-DD-YYYY');
const testFixture2 =
    require(rootPath + '/fixtures/common/creative/create001');
let testData002 = Object.assign({}, testFixture2);
testData002.name = testData002.name + timeStamp;
const testFixture3 =
    rootPath + '/fixtures/common/creative/create010.jpg';


describe('{{MAVERICK}} /line-item {create} @SS-AGENCY >>> ' +
    '(+) create - ads >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        ioDetailsPage = new IoDetailsPage(driver);
        campaignDetailsPage = new CampaignDetailsPage(driver);
        lineItemDetailsPage = new LineItemDetailsPage(driver);
        lineItemPage = new LineItemPage(driver);
        lineItemReviewPage = new LineItemReviewPage(driver);
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

    it('navigate to line item create page', function(done) {
        ioDetailsPage.navigate(targetServer, 'advertisers',
            targetAdvertiser.refId);
        ioDetailsPage.waitUntilLoaderNotVisible();
        ioDetailsPage.clickCampaign(targetCampaign.name);
        campaignDetailsPage.waitUntilLoaderNotVisible();
        campaignDetailsPage.clickNewLineItem();
        lineItemPage.waitUntilOverlayNotVisible();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should fill required data', function(done) {
        lineItemPage.setName(testData001.name);
        lineItemPage.setBudget(testData001.budget);
        lineItemPage.setStartDate(testData001.startDate);
        lineItemPage.setEndDate(testData001.endDate);
        lineItemPage.getInputName().click();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should add image ad', function(done) {
        lineItemPage.clickButtonStartBuildingAds();
        lineItemPage.setInputFile(testFixture3);
        lineItemPage.setInputAddedAdName(testData002.name + ' (image)');
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should assert and fill image ad data', function(done) {
        lineItemPage.getInputAddedAdName().getAttribute('ng-reflect-model').
            then(function(ngreflectmodel) {
                expect(ngreflectmodel).to
                    .not.be.empty;
            });
        expect(lineItemPage.getValidMacrosLink()).to.exist;
        lineItemPage.setTextAddedAdClick(testData002.clickUrl);
        lineItemPage.setTextAddedAdTracking(testData002.urlTracking1);
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should add third party tag ad', function(done) {
        lineItemPage.clickButtonAddAd();
        lineItemPage.clickSpanAddThirdPartyTags();
        lineItemPage.setInputAdName(testData002.name + ' (third party)');
        lineItemPage.setInputSourceUrl(testData002.file);
        lineItemPage.setInputClickUrl(testData002.clickUrl);
        lineItemPage.setInputThirdPartyTracker(testData002.urlTracking1);
        lineItemPage.getButtonAddToLineItem().click();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should show correct party tag ad data', function(done) {
        lineItemPage.clickLinkSecondAd();
        lineItemPage.getInputAddedAdName().getAttribute('ng-reflect-model').
            then(function(ngreflectmodel) {
                expect(ngreflectmodel).to
                    .not.be.empty;
            });
        lineItemPage.getTextAddedAdSource().getAttribute('ng-reflect-model').
            then(function(ngreflectmodel) {
                expect(ngreflectmodel).to
                    .not.be.empty;
            });
        lineItemPage.getTextAddedAdClick().getAttribute('ng-reflect-model').
            then(function(ngreflectmodel) {
                expect(ngreflectmodel).to
                    .not.be.empty;
            });
        lineItemPage.getTextAddedAdTracking().getAttribute('ng-reflect-model').
            then(function(ngreflectmodel) {
                expect(ngreflectmodel).to
                    .not.be.empty;
            });
        expect(lineItemPage.getValidMacrosLink()).to.exist;
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should add existing ad', function(done) {
        lineItemPage.clickButtonAddAd();
        lineItemPage.getSpanUseExistingAds().click();
        lineItemPage.getExistingAdCheckbox(targetCreative1.name).click();
        lineItemPage.getButtonAddToLineItem().click();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should show correct existing ad data', function(done) {
        lineItemPage.clickLinkThirdAd();
        lineItemPage.getInputAddedAdName().getAttribute('ng-reflect-model').
            then(function(ngreflectmodel) {
                expect(ngreflectmodel).to
                    .equal(targetCreative1.name);
            });
        lineItemPage.getTextAddedAdClick().getAttribute('ng-reflect-model').
            then(function(ngreflectmodel) {
                expect(ngreflectmodel).to
                    .equal(testData002.clickUrl);
            });
        lineItemPage.getTextAddedAdTracking().getAttribute('ng-reflect-model').
            then(function(ngreflectmodel) {
                expect(ngreflectmodel).to
                    .not.be.empty;
            });
        expect(lineItemPage.getValidMacrosLink()).to.exist;
        lineItemPage.clickReview();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should save line item with ads', function(done) {
        lineItemReviewPage.clickSave();
        lineItemReviewPage.waitUntilOverlayNotVisible();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('line item should exist in adv details list', function(done) {
        // campaignDetailsPage.clickLineItem(testData001.name);
        lineItemDetailsPage.getLineItemTitleName(testData001.name)
            .then(function(element) {
                expect(element).to.exist;
                done();
            });
    });

});
