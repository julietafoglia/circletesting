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
const targetLineItem = targetCampaign.children.lineItem001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let BasePage = require(rootPath + '/pages/maverick/index');
let AdvDetsPage = require(rootPath +
     '/pages/maverick/campaign-manager/advertiser-details');
let IoDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/insertion-order-details');
let CampaignDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/campaign-details');
let LineItemDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-details');
let basePage;
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

describe('{{MAVERICK}} /line-item-details {UI} @MANAGER >>> ' +
    '(+) verify watch ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        basePage = new BasePage(driver);
        loginPage = new LoginPage(driver);
        advDetsPage = new AdvDetsPage(driver);
        ioDetailsPage = new IoDetailsPage(driver);
        campaignDetailsPage = new CampaignDetailsPage(driver);
        lineItemDetailsPage = new LineItemDetailsPage(driver);
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

    it('should check watch link displayed', function(done) {
        basePage.navigate(targetServer, 'advertisers', targetAdvertiser.refId);
        advDetsPage.clickIo(targetIo.name);
        ioDetailsPage.clickCampaign(targetCampaign.name);
        campaignDetailsPage.clickLineItem(targetLineItem.name);

        expect(lineItemDetailsPage.getLinkWatch()).to.exist;
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should check watch link functionality', function(done) {
        lineItemDetailsPage.clickLinkWatch();
        expect(lineItemDetailsPage.getLinkUnwatch()).to.exist;
        lineItemDetailsPage.clickLinkUnwatch();
        expect(lineItemDetailsPage.getLinkWatch()).to.exist;
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
