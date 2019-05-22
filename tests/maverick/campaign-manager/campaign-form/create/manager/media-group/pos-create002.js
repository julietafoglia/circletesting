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
const targetIo = targetAdv.children.insertionOrder001;
const targetPix = targetAdv.children.pixel001;

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
    ' (dsp - exchange - branding - conversion)';

describe('<SMOKE> {{MAVERICK}} /campaign {create} @MANAGER >>> DSP ' +
    '(+) exchange - branding - conversion - minimum required >>>', function() {

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
        'branding - imp', function(done) {

        advDetsPage.navigate(targetServer, 'advertisers', targetAdv.refId);
        advDetsPage.waitUntilLoaderNotVisible();
        advDetsPage.closeLastOuterDiv();
        advDetsPage.closeOuterDiv();
        advDetsPage.clickIo(targetIo.name);
        campaignDetailsPage.clickNewCampaign();
        campaignCardsPage.clickExchange();
        campaignCardsPage.clickBranding();
        campaignCardsPage.clickBrandingConv();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('campaign should be created - dsp - exchange - branding' +
        ' - conversion', function(done) {
        campaignFormPage.setInputName(testData001.name);
        campaignFormPage.setConvTrack(targetPix.name);
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
