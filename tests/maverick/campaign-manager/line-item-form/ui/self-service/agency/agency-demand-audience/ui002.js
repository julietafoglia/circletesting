'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment = require(rootPath +
    '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002.children.agencyUser001;
const driverTimeOut = 0;

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdvertiser = entitiesObj.agency002.children.advertiser001;
const targetIo = targetAdvertiser.children.insertionOrder001;
const targetCampaign = targetIo.children.campaign001;
const targetLineItem = targetCampaign.children.lineItem001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let CampaignDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/campaign-details');
let LineItemDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-details');
let LineItemPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-form');
let loginPage;
let campaignDetailsPage;
let lineItemDetailsPage;
let lineItemPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /line-item {UI} @SS-AGENCY >>> ' +
    '(+) verify ui elements - edit >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        campaignDetailsPage = new CampaignDetailsPage(driver);
        lineItemDetailsPage = new LineItemDetailsPage(driver);
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

    it('line item edit page should have all the elements', function(done) {
        campaignDetailsPage.navigate(targetServer, 'advertisers',
            targetAdvertiser.refId);
        campaignDetailsPage.waitUntilLoaderNotVisible();
        campaignDetailsPage.clickCampaign(targetCampaign.name);
        campaignDetailsPage.waitUntilLoaderNotVisible();
        campaignDetailsPage.clickLineItem(targetLineItem.name);
        lineItemDetailsPage.clickLinkEdit();
        lineItemPage.waitOverlayUntilStale();

        lineItemPage.getTextParentCampaign().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getTextParentCampaign().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .contain(targetCampaign.name);
            });
        lineItemPage.getInputName().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getButtonStatus().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getLinkLabel().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getInputBudget().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getLinkUseAllBudget().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getInputStartDate().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getInputEndDate().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getInputLiveAudienceTarget().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getDropdownLiveAudienceTarget().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getInputLiveAudienceExclude().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getLinkLiveRampTargeting().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getDropdownAgeTarget().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getDropdownAge().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getDropdownGenderTarget().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getDropdownGender().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getDropdownDeviceTarget().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getDropdownDevice().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getLinkAdvancedTargeting().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getTextAdBuilderEmpty().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('There are currently no ads in this line item');
            });
        lineItemPage.getButtonStartBuildingAds().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getButtonReview().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display label input on click', function(done) {
        lineItemPage.clickLinkLabel();
        lineItemPage.getInputLabel().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getButtonDeleteLabel().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should not display label input ' +
        'on delete button click', function(done) {
        lineItemPage.getButtonDeleteLabel().click();
        lineItemPage.getLinkLabel().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display advanced targeting button on click', function(done) {
        lineItemPage.getLinkAdvancedTargeting().click();
        lineItemPage.getDropdownAdvancedTargeting().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should not display advanced ' +
        'targeting on delete click', function(done) {
        lineItemPage.getButtonDeleteAdvancedTargeting().click();
        lineItemPage.getLinkAdvancedTargeting().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display advanced targeting inputs on selection', function(done) {
        lineItemPage.getLinkAdvancedTargeting().click();
        lineItemPage.selectAdvancedTargeting('Browser');
        lineItemPage.selectAdvancedTargeting('Bundle');
        lineItemPage.selectAdvancedTargeting('Category');
        lineItemPage.selectAdvancedTargeting('Day & Time');
        lineItemPage.selectAdvancedTargeting('Device Maker');
        lineItemPage.selectAdvancedTargeting('Domains Whitelist/Blacklist');
        lineItemPage.selectAdvancedTargeting('ISP');
        lineItemPage.selectAdvancedTargeting('OS');
        lineItemPage.getInputBrowsers().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getInputBundles().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getInputCategories().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getDropdownDay().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getDropdownTime().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getInputDeviceMakers().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getInputIsp().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getInputOs().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display ad builder modal on click', function(done) {
        lineItemPage.clickButtonStartBuildingAds();
        lineItemPage.getAdBuilder().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should not display ad builder modal on close click', function(done) {
        lineItemPage.clickCancelAdBuilder();
        lineItemPage.getButtonStartBuildingAds().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should go back to Advertiser page on Cancel click', function(done) {
        lineItemPage.clickClose();
        driver.sleep(driverTimeOut).then(() => done());
    });

});
