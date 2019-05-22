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
const targetLineItem = targetCampaign.children.lineItem001;

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
testData001.name = testData001.name + timeStamp + ' (clone)';
testData001.status = 'Paused';
testData001.startDate = timeToday;
testData001.endDate = moment().add(30, 'days').format('MM-DD-YYYY');

describe('{{MAVERICK}} /line-item {clone} @SS-AGENCY >>> ' +
    '(+) body - minimum required - agency >>>', function() {

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

    it('should navigate to copy page', function(done) {
        ioDetailsPage.navigate(targetServer, 'advertisers',
            targetAdvertiser.refId);
        ioDetailsPage.waitUntilLoaderNotVisible();
        ioDetailsPage.clickCampaign(targetCampaign.name);
        campaignDetailsPage.waitUntilFilterNotVisible();
        campaignDetailsPage.setInputSearch(targetLineItem.name);
        campaignDetailsPage.waitUntilFilterStale();
        campaignDetailsPage.clickLineItem(targetLineItem.name);
        lineItemDetailsPage.clickLinkCopy();
        lineItemPage.waitOverlayUntilStale();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('line item should be copied - minimum required', function(done) {
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
