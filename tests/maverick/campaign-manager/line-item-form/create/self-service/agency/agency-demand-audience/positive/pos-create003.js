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
const timeToday = moment().format('MM-DD-YYYY');

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdvertiser = entitiesObj.agency002.children.advertiser001;
const targetIo = targetAdvertiser.children.insertionOrder001;
const targetCampaign = targetIo.children.campaign001;

// selenium runtime variables
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
const testFixture =
    require(rootPath + '/fixtures/common/strategy/create001');
let testData001 = Object.assign({}, testFixture);
testData001.name = testData001.name + ' (targets negative)';
testData001.status = 'Paused';
testData001.startDate = timeToday;
testData001.endDate = moment().add(30, 'days').format('MM-DD-YYYY');

describe('{{MAVERICK}} /line-item {create} @SS-AGENCY >>> ' +
    '(+) create - targets negative >>>', function() {

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
        lineItemPage.waitOverlayUntilStale();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('expand all targets', function(done) {
        lineItemPage.clickLinkAdvancedTargeting();
        lineItemPage.selectAdvancedTargeting('Browser');
        lineItemPage.selectAdvancedTargeting('Bundle');
        lineItemPage.selectAdvancedTargeting('Category');
        lineItemPage.selectAdvancedTargeting('Day & Time');
        lineItemPage.selectAdvancedTargeting('Device Maker');
        lineItemPage.selectAdvancedTargeting('ISP');
        lineItemPage.selectAdvancedTargeting('OS');
        // lineItemPage.selectAdvancedTargeting
        // ('Publisher Whitelist/Blacklist');
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should set all targets in Exclude', function(done) {
        lineItemPage.setLocationTargetExclude();
        lineItemPage.setAgeTargetExclude();
        lineItemPage.setGenderTargetExclude();
        lineItemPage.setDeviceTargetExclude();
        lineItemPage.setBrowserTargetExclude();
        lineItemPage.setCategoryTargetExclude();
        lineItemPage.setDayTimeTargetExclude();
        lineItemPage.setDeviceMakerTargetExclude();
        lineItemPage.setIspTargetExclude();
        lineItemPage.setOsTargetExclude();
        // lineItemPage.setWhitelistTargetExclude();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('line item should be created - all targets ' +
        'negative required', function(done) {
        lineItemPage.setName(testData001.name);
        lineItemPage.setBudget(testData001.budget);
        lineItemPage.setStartDate(testData001.startDate);
        lineItemPage.setEndDate(testData001.endDate);
        lineItemPage.getInputName().click();
        lineItemPage.setInputSearchLocations('United');
        lineItemPage.clickSpan('country');
        lineItemPage.selectAgeTargeting('18-20');
        lineItemPage.selectGenderTargeting('Female');
        lineItemPage.selectDeviceTargeting('PC');
        lineItemPage.setInputBrowsers('Chrome');
        lineItemPage.setInputBundles('Hispanic');
        lineItemPage.setInputCategories('IAB2:');
        lineItemPage.getInputName().click();
        lineItemPage.selectDayTargeting('Sunday');
        lineItemPage.selectTimeTargeting('12AM');
        lineItemPage.setInputDeviceMakers('Motorola');
        lineItemPage.setInputIsp('Covad');
        lineItemPage.setInputOs('Windows');
        // lineItemPage.setInputSearchWhitelist('Publisher ' + targetPublisher);
        lineItemPage.clickReview();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should save line item' , function(done) {
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

    it('line item should display correct target options', function(done) {
        lineItemDetailsPage.clickLinkEdit();
        lineItemPage.waitOverlayUntilStale();
        lineItemPage.getSpanLocationTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Exclude');
            });
        lineItemPage.getSpanAgeTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Exclude');
            });
        lineItemPage.getSpanGenderTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Exclude');
            });
        lineItemPage.getSpanDeviceTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Exclude');
            });
        lineItemPage.getSpanBrowserTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Exclude');
            });
        lineItemPage.getSpanBundleTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Target');
            });
        lineItemPage.getSpanCategoryTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Exclude');
            });
        lineItemPage.getSpanDayTimeTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Exclude');
            });
        lineItemPage.getSpanDeviceMakerTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Exclude');
            });
        lineItemPage.getSpanIspTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Exclude');
            });
        lineItemPage.getSpanOsTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Exclude');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('line item should display correct targets', function(done) {
        lineItemPage.getTextSelectedLocation().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .contain('United');
            });
        lineItemPage.getSpanAgeOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('18-20');
            });
        lineItemPage.getSpanGenderOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Female');
            });
        lineItemPage.getSpanDeviceOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('PC');
            });
        lineItemPage.getSpanBrowserOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Chrome');
            });
        lineItemPage.getSpanBundleOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Hispanic Readers');
            });
        lineItemPage.getSpanCategoryOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('IAB2: Automotive');
            });
        lineItemPage.getSpanDayOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Sunday');
            });
        lineItemPage.getSpanTimeOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('12AM-1AM');
            });
        lineItemPage.getSpanDeviceMakerOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Motorola');
            });
        lineItemPage.getSpanIspOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Covad Communications');
            });
        lineItemPage.getSpanOsOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Windows');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

});
