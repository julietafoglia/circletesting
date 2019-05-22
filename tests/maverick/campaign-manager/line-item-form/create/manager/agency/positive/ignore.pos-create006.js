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
const targetAdvertiser = entitiesObj.mediaGroup001.children.advertiser001;
const targetIo = targetAdvertiser.children.insertionOrder001;
const targetCampaign = targetIo.children.campaign002;

// selenium runtime variables
let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let AdvDetsPage = require(rootPath +
     '/pages/maverick/campaign-manager/advertiser-details');
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
testData001.name = testData001.name + ' (direct sold targets positive)';
testData001.status = 'paused';

describe('{{MAVERICK}} /line-item {create} @MANAGER >>> ' +
    '(+) create - direct sold - targets positive >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        advDetsPage = new AdvDetsPage(driver);
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
        advDetsPage.navigate(targetServer, 'advertisers',
            targetAdvertiser.refId);
        advDetsPage.waitUntilLoaderNotVisible();
        advDetsPage.clickIo(targetIo.name);
        campaignDetailsPage.waitUntilLoaderNotVisible();
        campaignDetailsPage.clickCampaign(targetCampaign.name);
        campaignDetailsPage.waitUntilLoaderNotVisible();
        campaignDetailsPage.clickNewLineItem();
        campaignDetailsPage.waitUntilOverlayNotVisible();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('expand all targets', function(done) {
        lineItemPage.clickLinkAdvancedTargeting();
        lineItemPage.selectAdvancedTargeting('Placement Id');
        lineItemPage.selectAdvancedTargeting('List Id');
        lineItemPage.selectAdvancedTargeting('Key Value Pairs');
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('line item should be created - all targets required', function(done) {
        lineItemPage.setName(testData001.name);
        lineItemPage.setBudget(testData001.budget);
        lineItemPage.clickLinkUseCampaignDates();
        lineItemPage.getInputName().click();
        lineItemPage.setInputPlacementId('123');
        lineItemPage.setInputListId('123');
        lineItemPage.setInputKeyValuePairs('key=value');
        lineItemPage.clickInputKeyValuePairs();
        lineItemPage.clickButtonAddParameters();
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
        lineItemDetailsPage.getLineItemTitleName(testData001.name)
            .then(function(element) {
                expect(element).to.exist;
                done();
            });
    });

    it('line item should display correct targets', function(done) {
        lineItemDetailsPage.clickLinkEdit();
        lineItemDetailsPage.waitUntilLoaderNotVisible();
        lineItemPage.waitUntilOverlayNotVisible();
        lineItemPage.getTextSelectedListId().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .contain('123');
            });
        lineItemPage.getSpan('key=value');
        lineItemPage.getSpan('1 Key Value Pair');
        driver.sleep(driverTimeOut).then(() => done());
    });
    // SUP-444 bug reported
});
