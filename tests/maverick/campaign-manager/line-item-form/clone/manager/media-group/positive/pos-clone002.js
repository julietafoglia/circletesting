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
const timeStamp = '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');
const timeToday = moment().format('MM-DD-YYYY');

// bootstrap variables
// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdvertiser = entitiesObj.mediaGroup001.children.advertiser001;
const targetIo = targetAdvertiser.children.insertionOrder001;
const targetCampaign = targetIo.children.dspCampaigns[1];
const targetLineItem = targetCampaign.children.lineItem000;
const targetPublisher = 'pkaiTestPub001';

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
let LineItemReviewPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-review-form');
let loginPage;
let advDetsPage;
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
testData001.name = 'SC2 ' + testData001.name + timeStamp + ' (clone)';
testData001.status = 'Paused';
testData001.startDate = targetIo.startDate.split(' ')[0];
testData001.startTime = targetIo.startDate.split(' ')[1];
testData001.endDate = targetIo.endDate.split(' ')[0];
testData001.endTime = targetIo.endDate.split(' ')[1];

describe('<SMOKE> {{MAVERICK}} /line-item {clone} @MANAGER >>> ' +
    '(+) SC2 body - media group >>>', function() {

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

    it('should navigate to copy page', function(done) {
        advDetsPage.closeLastOuterDiv();
        advDetsPage.closeOuterDiv();
        advDetsPage.navigate(targetServer, 'advertisers',
            targetAdvertiser.refId);
        advDetsPage.clickIo(targetIo.name);
        ioDetailsPage.setInputSearchCampaign(targetCampaign.name);
        ioDetailsPage.clickCampaign(targetCampaign.name);
        campaignDetailsPage.waitUntilOverlayNotVisible();
        campaignDetailsPage.setInputSearch(targetLineItem.name);
        campaignDetailsPage.waitUntilFilterStale();
        campaignDetailsPage.clickLineItem(targetLineItem.name);
        lineItemDetailsPage.clickLinkCopy();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('line item should be copied - minimum required', function(done) {
        lineItemPage.closeOuterDiv();
        lineItemPage.waitOverlayUntilStale();
        lineItemPage.setName(testData001.name);
        lineItemPage.setBudget(testData001.budget);
        lineItemPage.setStartDate(testData001.startDate);
        lineItemPage.setEndDate(testData001.endDate);
        lineItemPage.setStartTime(testData001.startTime);
        lineItemPage.setEndTime(testData001.endTime);
        lineItemPage.setStartDayTime(lineItemPage
            .getDateTimeFromData(testData001.startTime));
        lineItemPage.setEndDayTime(lineItemPage
            .getDateTimeFromData(testData001.endTime));
        lineItemPage.setStatus(testData001.status);
        lineItemPage.clickFirstLiveAudienceTarget();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should add postal codes', function(done) {
        lineItemPage.clickLinkAdvancedTargeting();
        lineItemPage.clickRemoveAdvancedTarget();
        lineItemPage.clickPostalCode();
        lineItemPage.setInputSearchCountry('United States');
        lineItemPage.getSearchedElement().click();
        lineItemPage.setTextPostalCodes('12345');
        lineItemPage.clickAddPostalCodes();
        lineItemPage.getTextSelectedLocation().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('12345, United States');
            });
        lineItemPage.getTextLocationsCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1 Item selected');
            });
        lineItemPage.setTextPostalCodes('12346');
        lineItemPage.getButtonAddPostalCodes().click();
        lineItemPage.getTextLocationsCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('2 Items selected');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display advanced targeting inputs on selection', function(done) {
        lineItemPage.clickLinkAdvancedTargeting();
        lineItemPage.selectAdvancedTargeting('Browser');
        lineItemPage.selectAdvancedTargeting('Category');
        lineItemPage.selectAdvancedTargeting('Day & Time');
        lineItemPage.selectAdvancedTargeting('Device Maker');
        lineItemPage.selectAdvancedTargeting('Domains Whitelist/Blacklist');
        lineItemPage.selectAdvancedTargeting('ISP');
        lineItemPage.selectAdvancedTargeting('OS');
        lineItemPage.selectAdvancedTargeting('Publisher Whitelist/Blacklist');
        lineItemPage.getInputBrowsers().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getInputCategories().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getDropdownDay().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getDropdownTime().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getInputDeviceMakers().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getInputIsp().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getInputOs().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display whitelist/blacklist targeting' +
         ' elements on selection', function(done) {
        lineItemPage.selectAgeTargeting('18-20');
        lineItemPage.selectGenderTargeting('Female');
        lineItemPage.selectDeviceTargeting('PC');
        lineItemPage.setInputBrowsers('Chrome');
        lineItemPage.setInputCategories('IAB2:');
        lineItemPage.getInputName().click();
        lineItemPage.selectDayTargeting('Sunday');
        lineItemPage.selectTimeTargeting('12AM');
        lineItemPage.setInputDeviceMakers('Motorola');
        lineItemPage.setInputIsp('Covad');
        lineItemPage.setInputOs('Windows');
        lineItemPage.setInputSearchWhitelist(targetPublisher);
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should review line item' , function(done) {
        lineItemPage.getInputName().click();
        lineItemPage.clickReview();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should save line item' , function(done) {
        lineItemReviewPage.clickSave();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('line item should exist in adv details list', function(done) {
        lineItemDetailsPage.getLineItemTitleName(testData001.name)
            .then(function(element) {
                expect(element).to.exist;
                done();
            });
    });
});
