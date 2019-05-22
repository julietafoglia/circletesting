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

// bootstrap variables
const entitiesFile =
    require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv = entitiesObj.mediaGroup001.children.advertiser001;
const targetIo = targetAdv.children.insertionOrder002;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath +
    '/pages/maverick/platform/login');
let AdvDetsPage = require(rootPath +
    '/pages/maverick/campaign-manager/advertiser-details');
let CampaignDetailsPage = require(rootPath +
    '/pages/maverick/campaign-manager/campaign-details');
let CampaignCardsPage = require(rootPath +
    '/pages/maverick/campaign-manager/campaign-cards');
let CampaignFormPage = require(rootPath +
    '/pages/maverick/campaign-manager/campaign-form');
let loginPage;
let advDetsPage;
let campaignDetailsPage;
let campaignCardsPage;
let campaignFormPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/campaign/create001');
let testData001 = Object.assign({}, testFixture);
testData001.name = testData001.name + timeStamp +
    ' (ssp - ds - branding - impressions)';

describe('<SMOKE> {{MAVERICK}} /campaign {create} @MANAGER >>> ' +
    'SSP (+) direct sold - branding - impressions -' +
        ' minimum required >>>', function() {

    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        advDetsPage = new AdvDetsPage(driver);
        campaignDetailsPage = new CampaignDetailsPage(driver);
        campaignCardsPage = new CampaignCardsPage(driver);
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

    it('maverick - navigate to campaign form - ' +
        'branding - impressions', function(done) {

        advDetsPage.navigate(targetServer, 'advertisers', targetAdv.refId);
        advDetsPage.waitUntilLoaderNotVisible();
        advDetsPage.clickIo(targetIo.name);
        campaignDetailsPage.waitUntilLoaderNotVisible();
        campaignDetailsPage.clickNewCampaign();
        campaignCardsPage.clickDirectSold();
        campaignCardsPage.clickBranding();
        campaignCardsPage.clickBrandingImp();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('campaign should be created - ssp - direct sold - branding impressions',
        function(done) {
            campaignFormPage.setInputName(testData001.name);
            campaignFormPage.setInputBudget(testData001.budget);
            campaignFormPage.setBidAmount(testData001.bidAmount);
            campaignFormPage.clickLinkUseDates();
            campaignFormPage.getInputName().click();
            campaignFormPage.clickSaveAndExit();
            driver.sleep(driverTimeOut)
                .then(() => done());
        });

    it('campaign should exist in campaign details page', function(done) {
        expect(campaignDetailsPage.getSpan(testData001.name)).to.exist;
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
