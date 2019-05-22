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
const targetAdvertiser2 = entitiesObj.mediaGroup001.children.advertiser001;
const targetIo = targetAdvertiser.children.insertionOrder001;
const targetIo2 = targetAdvertiser.children.insertionOrder002;
const targetIo3 = targetAdvertiser2.children.insertionOrder001;
const targetCampaign2 = targetIo.children.campaign004;
const targetCampaign3 = targetIo.children.campaign005;
const targetCampaign4 = targetIo2.children.campaign001;
const targetCampaign5 = targetIo2.children.campaign002;
const targetCampaign6 = targetIo2.children.campaign003;
const targetCampaign7 = targetIo2.children.campaign004;
const targetCampaign8 = targetIo3.children.campaign002; // ASAP

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let CampaignDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/campaign-details');
let LineItemPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-form');
let loginPage;
let campaignDetailsPage;
let lineItemPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /line-item {UI} @MANAGER >>> ' +
    '(+) verify pacing options >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        campaignDetailsPage = new CampaignDetailsPage(driver);
        lineItemPage = new LineItemPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    before('maverick - login', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('should check pacing for branding clicks line item',
        function(done) {
            lineItemPage.navigate(targetServer, 'campaigns',
                targetCampaign2.refId);
            campaignDetailsPage.waitUntilLoaderNotVisible();
            campaignDetailsPage.clickNewLineItem();
            lineItemPage.waitOverlayUntilStale();
            lineItemPage.getButtonPacing();
            lineItemPage.getSpan('Even Pacing');
            lineItemPage.getButtonPacing().getAttribute('outerHTML').
                then(function(outerHTML) {
                    expect(outerHTML).to.contain('disabled');
                });
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should check pacing for perf - pay per click line item',
        function(done) {
            lineItemPage.navigate(targetServer, 'campaigns',
                targetCampaign3.refId);
            campaignDetailsPage.waitUntilLoaderNotVisible();
            campaignDetailsPage.clickNewLineItem();
            lineItemPage.waitOverlayUntilStale();
            lineItemPage.setPacingEven();
            lineItemPage.getInformationText('This line item will spend its' +
                        ' budget evenly over the course of the flight dates.');
            lineItemPage.setPacingASAP();
            lineItemPage.getInformationText('This line item will spend its' +
                        ' budget as soon as possible within the flight dates.');
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should check pacing for direct sold - branding imp line item',
        function(done) {
            lineItemPage.navigate(targetServer, 'campaigns',
                targetCampaign8.refId);
            campaignDetailsPage.waitUntilLoaderNotVisible();
            campaignDetailsPage.clickNewLineItem();
            lineItemPage.waitOverlayUntilStale();
            lineItemPage.setPacingEven();
            lineItemPage.getInformationText('This line item will spend its' +
                        ' budget evenly over the course of the flight dates.');
            lineItemPage.setPacingASAP();
            lineItemPage.getInformationText('This line item will spend its' +
                        ' budget as soon as possible within the flight dates.');
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should check pacing for perf - max conv line item',
        function(done) {
            lineItemPage.navigate(targetServer, 'campaigns',
                targetCampaign2.refId);
            campaignDetailsPage.waitUntilLoaderNotVisible();
            campaignDetailsPage.clickNewLineItem();
            lineItemPage.waitOverlayUntilStale();
            lineItemPage.getButtonPacing();
            lineItemPage.getSpan('Even Pacing');
            lineItemPage.getButtonPacing().getAttribute('outerHTML').
                then(function(outerHTML) {
                    expect(outerHTML).to.contain('disabled');
                });
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should check pacing for branding clicks line item',
        function(done) {
            lineItemPage.navigate(targetServer, 'campaigns',
                targetCampaign4.refId);
            campaignDetailsPage.waitUntilLoaderNotVisible();
            campaignDetailsPage.clickNewLineItem();
            lineItemPage.waitOverlayUntilStale();
            lineItemPage.getButtonPacing();
            lineItemPage.getSpan('Even Pacing');
            lineItemPage.getButtonPacing().getAttribute('outerHTML').
                then(function(outerHTML) {
                    expect(outerHTML).to.contain('disabled');
                });
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should check pacing for branding conv line item',
        function(done) {
            lineItemPage.navigate(targetServer, 'campaigns',
                targetCampaign5.refId);
            campaignDetailsPage.waitUntilLoaderNotVisible();
            campaignDetailsPage.clickNewLineItem();
            lineItemPage.waitOverlayUntilStale();
            lineItemPage.getButtonPacing();
            lineItemPage.getSpan('Even Pacing');
            lineItemPage.getButtonPacing().getAttribute('outerHTML').
                then(function(outerHTML) {
                    expect(outerHTML).to.contain('disabled');
                });
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should check pacing for perf pay per conv line item',
        function(done) {
            lineItemPage.navigate(targetServer, 'campaigns',
                targetCampaign7.refId);
            campaignDetailsPage.waitUntilLoaderNotVisible();
            campaignDetailsPage.clickNewLineItem();
            lineItemPage.waitOverlayUntilStale();
            lineItemPage.setPacingEven();
            lineItemPage.getInformationText('This line item will spend' +
                    ' its budget evenly over the course of the flight dates.');
            lineItemPage.setPacingASAP();
            lineItemPage.getInformationText('This line item will spend its' +
                    ' budget as soon as possible within the flight dates.');
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should check pacing for perf - max clicks line item',
        function(done) {
            lineItemPage.navigate(targetServer, 'campaigns',
                targetCampaign6.refId);
            campaignDetailsPage.waitUntilLoaderNotVisible();
            campaignDetailsPage.clickNewLineItem();
            lineItemPage.waitOverlayUntilStale();
            lineItemPage.getButtonPacing();
            lineItemPage.getSpan('Even Pacing');
            lineItemPage.getButtonPacing().getAttribute('outerHTML').
                then(function(outerHTML) {
                    expect(outerHTML).to.contain('disabled');
                });
            driver.sleep(driverTimeOut).then(() => done());
        });


});
