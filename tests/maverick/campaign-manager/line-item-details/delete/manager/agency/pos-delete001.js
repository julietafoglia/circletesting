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
const targetLineItem = targetCampaign.children.lineItem002;
const targetLineItem2 = targetCampaign.children.lineItem001;

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
let LineItemDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-details');
let loginPage;
let advDetsPage;
let ioDetailsPage;
let campaignDetailsPage;
let lineItemDetailsPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /line-item-details {DELETE} @ADMIN >>> ' +
    '(+) verify ui elements - delete >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', function(done) {
        let capabilities = {
            'applicationCacheEnabled': true
        };
        driver = driverBuilder(capabilities);
        driver.manage().window().maximize();
        loginPage = new LoginPage(driver);
        advDetsPage = new AdvDetsPage(driver);
        ioDetailsPage = new IoDetailsPage(driver);
        campaignDetailsPage = new CampaignDetailsPage(driver);
        lineItemDetailsPage = new LineItemDetailsPage(driver);
        done();
    });

    before('maverick - login', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });


    it('line item details page should contain delete link', function(done) {
        advDetsPage.navigate(targetServer, 'advertisers',
            targetAdvertiser.refId);
        advDetsPage.clickIo(targetIo.name);
        ioDetailsPage.clickCampaign(targetCampaign.name);
        campaignDetailsPage.clickLineItem(targetLineItem.name);
        expect(lineItemDetailsPage.getLinkDelete()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('delete modal should contain all elements', function(done) {
        lineItemDetailsPage.clickLinkDelete();
        expect(lineItemDetailsPage.getTitleDelete()).to.exist;
        expect(lineItemDetailsPage.getTextDelete()).to.exist;
        expect(lineItemDetailsPage.getTextLIDelete()).to.exist;
        expect(lineItemDetailsPage.getCheckDelete()).to.exist;
        expect(lineItemDetailsPage.getTextCheckDelete()).to.exist;
        expect(lineItemDetailsPage.getButtonCancelDelete()).to.exist;
        expect(lineItemDetailsPage.getButtonConfirmDelete()).to.exist;
        lineItemDetailsPage.getTextLIDelete().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal(targetLineItem.name);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show alert', function(done) {
        lineItemDetailsPage.clickConfirmDelete();
        expect(lineItemDetailsPage.getTextAlertDelete()).to.exist;
        lineItemDetailsPage.clickCancelDelete();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should not show delete link for active line item', function(done) {
        campaignDetailsPage.clickLinkText('Campaign');
        campaignDetailsPage.clickLineItem(targetLineItem2.name);
        campaignDetailsPage.getSpanNotDisplayed('Delete');
        driver.sleep(driverTimeOut).then(() => done());
    });

});
