'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment = require(rootPath +
    '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002
    .children.advertiser001
    .children.advertiserUser001;
const driverTimeOut = 0;
const timeStamp = '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');
const timeToday = moment().format('M/D/YY');

// bootstrap variables
const entitiesFile =
    require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdvertiser = entitiesObj.agency002.children.advertiser001;
const targetIo = targetAdvertiser.children.insertionOrder001;
const targetCampaign = targetIo.children.campaign001;
const targetCreative1 = targetAdvertiser.children.creative001;
const targetCreative2 = targetAdvertiser.children.creative002;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let IoDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/insertion-order-details');
let CampaignDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/campaign-details');
let LineItemPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-form');
let LineItemReviewPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-review-form');
let loginPage;
let ioDetailsPage;
let campaignDetailsPage;
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
testData001.name = testData001.name + timeStamp;
testData001.status = 'paused';
testData001.startDate = timeToday;
testData001.endDate = moment().add(30, 'days').format('M/D/YY');
testData001.budget = 100;
const budgetCurrency = (testData001.budget).
    toLocaleString('en-US', {style: 'currency', currency: 'USD'});

describe('{{MAVERICK}} /line-item {UI} @SS-AGENCY-ADVERTISER >>> ' +
    '(+) verify review page ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        ioDetailsPage = new IoDetailsPage(driver);
        campaignDetailsPage = new CampaignDetailsPage(driver);
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
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should fill all data', function(done) {
        lineItemPage.setName(testData001.name);
        lineItemPage.setBudget(testData001.budget);
        lineItemPage.clickLinkLabel();
        lineItemPage.setLabel(testData001.name);
        lineItemPage.setEndDate(testData001.endDate);
        lineItemPage.setStartDate(testData001.startDate);
        lineItemPage.getInputName().click();
        lineItemPage.setInputSearchLocations('United');
        lineItemPage.clickSpan('country');
        lineItemPage.selectAgeTargeting('18-20');
        lineItemPage.selectGenderTargeting('Female');
        lineItemPage.selectDeviceTargeting('PC');
        lineItemPage.setInputBrowsers('Chrome');
        lineItemPage.setInputBundles('Hispanic Readers');
        lineItemPage.setInputCategories('IAB2:');
        lineItemPage.getInputName().click();
        lineItemPage.selectDayTargeting('Sunday');
        lineItemPage.selectTimeTargeting('12AM');
        lineItemPage.setInputDeviceMakers('Motorola');
        lineItemPage.setInputIsp('Covad');
        lineItemPage.setInputOs('Windows');
        lineItemPage.clickButtonStartBuildingAds();
        lineItemPage.clickSpanUseExistingAds();
        lineItemPage.getExistingAdCheckbox(targetCreative1.name).click();
        lineItemPage.clickButtonAddToLineItem();
        driver.sleep(driverTimeOut).then(() => done());
    });


    it('should show correct data in review page basic details', function(done) {
        lineItemPage.clickReview();
        lineItemReviewPage.getTextParentCampaign().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal(targetCampaign.name);
            });
        lineItemReviewPage.getTextName().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal(testData001.name);
            });
        lineItemReviewPage.getTextStatus().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal(testData001.status);
            });
        lineItemReviewPage.getTextLabel().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal(testData001.name);
            });
        lineItemReviewPage.getTextBudget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal(budgetCurrency);
            });
        lineItemReviewPage.getTextStartDate(testData001.startDate)
            .then(function(element) {
                expect(element).to.exist;
            });
        lineItemReviewPage.getTextEndDate(testData001.endDate)
            .then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show correct data in review page targeting', function(done) {
        lineItemReviewPage.getTextLocationTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Targeted');
            });
        lineItemReviewPage.getTextLocationCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextLocationSelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .contain('United States');
            });
        lineItemReviewPage.getTextGenderTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Targeted');
            });
        lineItemReviewPage.getTextGenderCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextGenderSelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Female');
            });
        lineItemReviewPage.getTextDeviceTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Targeted');
            });
        lineItemReviewPage.getTextDeviceCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextDeviceSelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('PC');
            });
        lineItemReviewPage.getTextAgeTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Targeted');
            });
        lineItemReviewPage.getTextAgeCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextAgeSelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('18-20');
            });
        lineItemReviewPage.getTextOsTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Targeted');
            });
        lineItemReviewPage.getTextOsCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextOsSelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Windows');
            });
        lineItemReviewPage.getTextBrowserTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Targeted');
            });
        lineItemReviewPage.getTextBrowserCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextBrowserSelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Chrome');
            });
        lineItemReviewPage.getTextDeviceMakerTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Targeted');
            });
        lineItemReviewPage.getTextDeviceMakerCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextDeviceMakerSelection()
            .getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Motorola');
            });
        lineItemReviewPage.getTextDayTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Targeted');
            });
        lineItemReviewPage.getTextDayCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextDaySelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Sunday');
            });
        lineItemReviewPage.getTextTimeTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Targeted');
            });
        lineItemReviewPage.getTextTimeCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextTimeSelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('12AM');
            });
        lineItemReviewPage.getTextIspTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Targeted');
            });
        lineItemReviewPage.getTextIspCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextIspSelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Covad Communications');
            });
        lineItemReviewPage.getTextBundleTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Targeted');
            });
        lineItemReviewPage.getTextBundleCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextBundleSelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Hispanic Readers');
            });
        lineItemReviewPage.getTextCategoryTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Targeted');
            });
        lineItemReviewPage.getTextCategoryCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextCategorySelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('IAB2: Automotive');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show correct data in review page ads', function(done) {
        lineItemReviewPage.getTextReviewAdName().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal(targetCreative1.name);
            });
        lineItemReviewPage.getTextReviewAdId().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('' + targetCreative1.refId + '');
            });
        lineItemReviewPage.getTextReviewAdClickUrl().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal(targetCreative1.clickUrl);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should edit data', function(done) {
        lineItemReviewPage.getButtonReturnToLineItem().click();
        lineItemPage.setName(testData001.name + ' Edit');
        lineItemPage.setBudget(testData001.budget);
        lineItemPage.setLabel(testData001.name + ' Edit');
        lineItemPage.getInputName().click();
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
        lineItemPage.getLinkAd().click();
        lineItemPage.getLinkDeleteAd().click();

        lineItemPage.clickButtonStartBuildingAds();
        lineItemPage.clickSpanUseExistingAds();
        lineItemPage.getExistingAdCheckbox(targetCreative2.name).click();
        lineItemPage.clickButtonAddToLineItem();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show correct data in review page basic' +
        ' details after editing', function(done) {
        lineItemPage.clickReview();
        lineItemReviewPage.getTextParentCampaign().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal(targetCampaign.name);
            });
        lineItemReviewPage.getTextName().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal(testData001.name + ' Edit');
            });
        lineItemReviewPage.getTextStatus().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal(testData001.status);
            });
        lineItemReviewPage.getTextLabel().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal(testData001.name + ' Edit');
            });
        lineItemReviewPage.getTextBudget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal(budgetCurrency);
            });
        lineItemReviewPage.getTextStartDate(testData001.startDate)
            .then(function(element) {
                expect(element).to.exist;
            });
        lineItemReviewPage.getTextEndDate(testData001.endDate)
            .then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show correct data in review page targeting' +
        ' after editing', function(done) {
        lineItemReviewPage.getTextLocationTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Excluded');
            });
        lineItemReviewPage.getTextLocationCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextLocationSelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .contain('United States');
            });
        lineItemReviewPage.getTextGenderTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Excluded');
            });
        lineItemReviewPage.getTextGenderCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextGenderSelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Female');
            });
        lineItemReviewPage.getTextDeviceTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Excluded');
            });
        lineItemReviewPage.getTextDeviceCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextDeviceSelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('PC');
            });
        lineItemReviewPage.getTextAgeTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Excluded');
            });
        lineItemReviewPage.getTextAgeCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextAgeSelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('18-20');
            });
        lineItemReviewPage.getTextOsTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Excluded');
            });
        lineItemReviewPage.getTextOsCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextOsSelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Windows');
            });
        lineItemReviewPage.getTextBrowserTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Excluded');
            });
        lineItemReviewPage.getTextBrowserCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextBrowserSelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Chrome');
            });
        lineItemReviewPage.getTextDeviceMakerTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Excluded');
            });
        lineItemReviewPage.getTextDeviceMakerCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextDeviceMakerSelection()
            .getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Motorola');
            });
        lineItemReviewPage.getTextDayTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Excluded');
            });
        lineItemReviewPage.getTextDayCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextDaySelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Sunday');
            });
        lineItemReviewPage.getTextTimeTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Excluded');
            });
        lineItemReviewPage.getTextTimeCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextTimeSelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('12AM');
            });
        lineItemReviewPage.getTextIspTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Excluded');
            });
        lineItemReviewPage.getTextIspCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextIspSelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Covad Communications');
            });
        lineItemReviewPage.getTextBundleTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Targeted');
            });
        lineItemReviewPage.getTextBundleCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextBundleSelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Hispanic Readers');
            });
        lineItemReviewPage.getTextCategoryTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Excluded');
            });
        lineItemReviewPage.getTextCategoryCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1');
            });
        lineItemReviewPage.getTextCategorySelection().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('IAB2: Automotive');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show correct data in review page ads' +
        ' after editing', function(done) {
        lineItemReviewPage.getTextReviewAdName().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal(targetCreative1.name);
            });
        lineItemReviewPage.getTextReviewAdId().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('' + targetCreative1.refId + '');
            });
        lineItemReviewPage.getTextReviewAdClickUrl().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal(targetCreative1.clickUrl);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

});
