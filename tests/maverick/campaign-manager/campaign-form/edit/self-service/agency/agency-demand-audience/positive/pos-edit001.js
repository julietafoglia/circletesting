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

// bootstrap variables
const entitiesFile =
    require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv = entitiesObj.agency002.children.advertiser001;
const targetIo = targetAdv.children.insertionOrder001;
const targetCam = targetIo.children.campaign001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath +
    '/pages/maverick/platform/login');
let AdvDetsPage = require(rootPath +
    '/pages/maverick/campaign-manager/advertiser-details');
let CampaignDetailsPage = require(rootPath +
    '/pages/maverick/campaign-manager/campaign-details');
let CampaignFormPage = require(rootPath +
    '/pages/maverick/campaign-manager/campaign-form');
let loginPage;
let advDetsPage;
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
const startDate = moment().format('MM/DD/YYYY hh:mm AM');
const endDate = moment().add(30, 'days').format('MM/DD/YYYY hh:mm PM');

describe('{{MAVERICK}} /campaign-manager/campaign-form {edit} @SS-AGENCY >>> ' +
    '(+) basic verification - edit name >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        advDetsPage = new AdvDetsPage(driver);
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
        advDetsPage.searchForCampaign(targetCam.name);
        advDetsPage.clickCam(targetCam.name);
        campaignDetailsPage.clickLinkEditCampaign();

        campaignFormPage.setInputName(testData001.name);
        campaignFormPage.setInputBudget(testData001.budget);
        campaignFormPage.setBidAmount(testData001.maxCpm);
        campaignFormPage.setInputStartDate(startDate);
        campaignFormPage.setInputEndDate(endDate);
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
