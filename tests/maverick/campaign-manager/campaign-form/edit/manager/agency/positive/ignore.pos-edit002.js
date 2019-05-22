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
let CampaignCardsPage = require(rootPath +
    '/pages/maverick/campaign-manager/campaign-cards');
let loginPage;
let advDetsPage;
let insertionOrderDetailsPage;
let campaignDetailsPage;
let campaignFormPage;
let campaignCardsPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /campaign-form {edit} @MANAGER >>> ' +
    '(+) edit campaign goal >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        advDetsPage = new AdvDetsPage(driver);
        insertionOrderDetailsPage = new InsertionOrderDetailsPage(driver);
        campaignDetailsPage = new CampaignDetailsPage(driver);
        campaignFormPage = new CampaignFormPage(driver);
        campaignCardsPage = new CampaignCardsPage(driver);
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

    it('edit goal link should be displayed', function(done) {
        campaignFormPage.getLinkChangeGoal().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('goal page should be displayed', function(done) {
        campaignFormPage.clickLinkChangeGoal();

        campaignCardsPage.clickPerformance();
        campaignCardsPage.clickPayPerClick();

        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should change campaign goal', function(done) {
        campaignFormPage.getAlertText().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getTitleGoal().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Pay Per Click');
            });
        campaignFormPage.getInputName().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getInputBudget().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getInputBidAmount().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getInputCateg().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getLinkSecCateg().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getLinkFreqCap().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getButtonSaveAndExit().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getButtonCreateLineItem().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('campaign should be edited - new goal', function(done) {
        campaignFormPage.setInputName('campaign goal edit');
        campaignFormPage.clickSaveAndExit();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('campaign should exist in adv details list', function(done) {
        campaignDetailsPage.getSpan('campaign goal edit')
            .then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('campaign should be re edited - minimum required', function(done) {
        campaignDetailsPage.clickLinkEditCampaign();
        campaignFormPage.clickLinkChangeGoal();
        campaignCardsPage.clickBranding();
        campaignCardsPage.clickBrandingImp();
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
