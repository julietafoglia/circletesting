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
    '(+) verify location target ui elements >>>', function() {

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

    it('location target section should contain all elements', function(done) {
        lineItemPage.getSwitchLocation().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getCheckPostalCodes().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getCheckCountry().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getButtonLocationTarget().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('search section should contain all elements', function(done) {
        lineItemPage.clickSwitchLocation();
        lineItemPage.getInputSearchLocations().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('postal codes section should contain all elements', function(done) {
        lineItemPage.clickPostalCode();
        lineItemPage.getInputSearchCountry().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getTextPostalCodes().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getButtonAddPostalCodes().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show correct data if Global is selected', function(done) {
        lineItemPage.clickCountry();
        lineItemPage.setInputSearchLocations('United');
        expect(lineItemPage.getSpan('country')).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show correct data if US Only is selected', function(done) {
        lineItemPage.clickSwitchLocation();
        lineItemPage.setInputSearchLocations('Czech');
        expect(lineItemPage.getTextNoLocations()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should not show Postal codes country box if US Only is' +
        ' selected', function(done) {
        lineItemPage.clickPostalCode();
        lineItemPage.getInputSearchCountryNotDisplayed();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show correct data in Postal codes country box', function(done) {
        lineItemPage.clickSwitchLocation();
        lineItemPage.getInputSearchCountry().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.setInputSearchCountry('Russian');
        lineItemPage.getSearchedElement().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.setInputSearchCountry('United');
        lineItemPage.getSearchedElement().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.setInputSearchCountry('Czech');
        lineItemPage.getSearchedElement().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should add locations', function(done) {
        lineItemPage.clickCountry();
        lineItemPage.setInputSearchLocations('Czech');
        lineItemPage.clickCountrySelection();
        lineItemPage.getTextSelectedLocation().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Czech Republic');
            });
        lineItemPage.getTextLocationsCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1 Item selected');
            });
        lineItemPage.setInputSearchLocations('Brazil');
        lineItemPage.clickCountrySelection();
        lineItemPage.getTextLocationsCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('2 Items selected');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should delete locations', function(done) {
        lineItemPage.clickDeleteLocation('Czech Republic');
        lineItemPage.getTextSelectedLocation().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .contain('Brazil');
            });
        lineItemPage.getLinkLocationClearAll().click();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should add postal codes', function(done) {
        lineItemPage.clickPostalCode();
        lineItemPage.setInputSearchCountry('United States');
        lineItemPage.getSearchedElement().click();
        lineItemPage.setTextPostalCodes('12345');
        lineItemPage.clickAddPostalCodes();
        lineItemPage.getTextSelectedLocation().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('12345, United States');
            });
        lineItemPage.getTextLocationsCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1 Item selected');
            });
        lineItemPage.setTextPostalCodes('12346');
        lineItemPage.getButtonAddPostalCodes().click();
        lineItemPage.getTextLocationsCount().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('2 Items selected');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should delete postal codes', function(done) {
        lineItemPage.clickDeleteLocation();
        lineItemPage.getTextSelectedLocation().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('12346, United States');
            });
        lineItemPage.getLinkLocationClearAll().click();
        driver.sleep(driverTimeOut).then(() => done());
    });

});
