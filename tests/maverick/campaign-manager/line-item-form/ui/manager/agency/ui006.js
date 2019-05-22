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
const targetAdvertiser = entitiesObj.agency001.children.advertiser001;
const targetIo = targetAdvertiser.children.insertionOrder001;
const targetCampaign = targetIo.children.campaign001;

// selenium runtime variables
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
let LineItemPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-form');
let loginPage;
let advDetsPage;
let ioDetailsPage;
let campaignDetailsPage;
let lineItemPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');


describe('{{MAVERICK}} /line-item {UI} @MANAGER >>> ' +
    '(+) verify daily cap ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        advDetsPage = new AdvDetsPage(driver);
        ioDetailsPage = new IoDetailsPage(driver);
        campaignDetailsPage = new CampaignDetailsPage(driver);
        lineItemPage = new LineItemPage(driver);
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

    it('should navigate to line item create page', function(done) {
        advDetsPage.navigate(targetServer, 'advertisers',
            targetAdvertiser.refId);
        advDetsPage.waitUntilLoaderNotVisible();
        advDetsPage.clickIo(targetIo.name);
        ioDetailsPage.waitUntilLoaderNotVisible();
        ioDetailsPage.clickCampaign(targetCampaign.name);
        campaignDetailsPage.waitUntilLoaderNotVisible();
        campaignDetailsPage.clickNewLineItem();
        lineItemPage.waitOverlayUntilStale();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('daily cap link should be displayed', function(done) {
        lineItemPage.getLinkDailyCap().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('daily cap section should contain all elements', function(done) {
        lineItemPage.clickLinkDailyCap();
        lineItemPage.getInputDailyCap().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getInformationText('Limit the amount this line item will' +
                ' spend in a day.').then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getButtonDeleteDailyCap().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show error messages', function(done) {
        lineItemPage.setBudget('1');
        lineItemPage.setInputDailyCap('100');
        lineItemPage.getInputName().click();
        lineItemPage.getTextErrorDailyCap().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getTextErrorDailyCap().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .contain('The daily cap must be lower than the' +
                    ' total budget of line item.');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should delete daily cap', function(done) {
        lineItemPage.clickDeleteDailyCap();
        lineItemPage.getLinkDailyCap().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

});
