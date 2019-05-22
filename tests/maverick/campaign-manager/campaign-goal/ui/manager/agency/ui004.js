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
const targetAdv = entitiesObj.agency001.children.advertiser001;
const targetIo = targetAdv.children.insertionOrder001;
const targetCam = targetIo.children.campaign005;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath +
    '/pages/maverick/platform/login');
let AdvDetsPage = require(rootPath +
    '/pages/maverick/campaign-manager/advertiser-details');
let InsertionOrderDetailsPage = require(rootPath +
    '/pages/maverick/campaign-manager/insertion-order-details');
let CampaignCardsPage = require(rootPath +
    '/pages/maverick/campaign-manager/campaign-cards');
let CampaignFormPage = require(rootPath +
    '/pages/maverick/campaign-manager/campaign-form');
let loginPage;
let advDetsPage;
let insertionOrderDetailsPage;
let campaignCardsPage;
let campaignFormPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /campaign-manager/campaign-goal {ui} @MANAGER >>> ' +
    '(+) performance - pay per click - ssp - edit >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        advDetsPage = new AdvDetsPage(driver);
        insertionOrderDetailsPage = new InsertionOrderDetailsPage(driver);
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

    it('should navigate to edit page', function(done) {
        advDetsPage.navigate(targetServer, 'advertisers', targetAdv.refId);
        advDetsPage.clickIo(targetIo.name);
        insertionOrderDetailsPage.clickEditCampaign(targetCam.name);
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('platform should not be disabled', function(done) {
        campaignFormPage.getButtonPlatform().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to.not
                    .contain('disabled');
            });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    xit('edit goal link should be displayed', function(done) {
        campaignFormPage.getLinkChangeGoal().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    xit('goal page should be displayed', function(done) {
        campaignFormPage.clickLinkChangeGoal();

        campaignCardsPage.getButtonBranding().then(function(element) {
            expect(element).to.exist;
        });
        campaignCardsPage.getButtonPerformance().then(function(element) {
            expect(element).to.exist;
        });
        campaignCardsPage.clickBranding();
        campaignCardsPage.getBrandingImp().then(function(element) {
            expect(element).to.exist;
        });
        campaignCardsPage.getBrandingCli().then(function(element) {
            expect(element).to.exist;
        });
        campaignCardsPage.getBrandingCon().then(function(element) {
            expect(element).to.exist;
        });
        driver.navigate().back();
        campaignCardsPage.clickPerformance();
        campaignCardsPage.getPerfMaxReach().then(function(element) {
            expect(element).to.exist;
        });
        campaignCardsPage.getPerfMaxClick().then(function(element) {
            expect(element).to.exist;
        });
        campaignCardsPage.getPerfPayPerClick().then(function(element) {
            expect(element).to.exist;
        });
        campaignCardsPage.getPerfMaxConv().then(function(element) {
            expect(element).to.exist;
        });
        campaignCardsPage.getPerfPayPerConv().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
