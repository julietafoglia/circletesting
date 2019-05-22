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
const entitiesFile =
    require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv = entitiesObj.mediaGroup001.children.advertiser001;
const targetIo = targetAdv.children.insertionOrder002;
const targetCam = targetIo.children.campaign002;

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
let CampaignFormPage = require(rootPath +
    '/pages/maverick/campaign-manager/campaign-form');
let loginPage;
let advDetsPage;
let insertionOrderDetailsPage;
let campaignDetailsPage;
let campaignFormPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/campaign/save001');
let testData001 = Object.assign({}, testFixture);
testData001.name = targetCam.name + '@v2 EDITED';

describe('<SMOKE> {{MAVERICK}} /campaign-manager/' +
    'campaign-form {edit} @MANAGER >>> ' +
    '(+) direct sold - basic verification - edit name >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        advDetsPage = new AdvDetsPage(driver);
        insertionOrderDetailsPage = new InsertionOrderDetailsPage(driver);
        campaignDetailsPage = new CampaignDetailsPage(driver);
        campaignFormPage = new CampaignFormPage(driver);
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

    it('campaign should be edited - minimum required', function(done) {
        advDetsPage.navigate(targetServer, 'advertisers', targetAdv.refId);
        advDetsPage.waitUntilLoaderNotVisible();
        advDetsPage.clickIo(targetIo.name);
        insertionOrderDetailsPage.setInputSearchCampaign(targetCam.name);
        insertionOrderDetailsPage.waitUntilFilterNotVisible();
        insertionOrderDetailsPage.clickEditCampaign(targetCam.name);

        campaignFormPage.setInputName(testData001.name);
        campaignFormPage.clickLinkUseDates();
        campaignFormPage.getInputName().click();
        campaignFormPage.clickSaveAndExit();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('campaign should exist in campaign details page', function(done) {
        campaignDetailsPage.getSpan(targetCam.name + '@v2 EDITED')
            .then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('campaign should be re edited - minimum required', function(done) {
        campaignDetailsPage.clickLinkEditCampaign();
        campaignFormPage.setInputName(targetCam.name);
        campaignFormPage.getInputName().click();
        campaignFormPage.clickSaveAndExit();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('campaign should exist in campaign details page', function(done) {
        campaignDetailsPage.getSpan(targetCam.name)
            .then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
