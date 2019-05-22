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
const targetPublisher = 'pkaiTestPub001';

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
let LineItemPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-form');
let loginPage;
let advDetsPage;
let ioDetailsPage;
let campaignDetailsPage;
let lineItemDetailsPage;
let lineItemPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');


describe('{{MAVERICK}} /line-item {UI} @MANAGER >>> ' +
    '(+) verify ui elements - clone >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        advDetsPage = new AdvDetsPage(driver);
        ioDetailsPage = new IoDetailsPage(driver);
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

    it('should navigate to copy page', function(done) {
        advDetsPage.navigate(targetServer, 'advertisers',
            targetAdvertiser.refId);
        advDetsPage.waitUntilLoaderNotVisible();
        advDetsPage.clickIo(targetIo.name);
        ioDetailsPage.waitUntilLoaderNotVisible();
        ioDetailsPage.setInputSearchCampaign(targetCampaign.name);
        ioDetailsPage.waitUntilFilterStale();
        ioDetailsPage.clickCampaign(targetCampaign.name);
        campaignDetailsPage.setInputSearch(targetLineItem.name);
        campaignDetailsPage.waitUntilFilterStale();
        campaignDetailsPage.clickLineItem(targetLineItem.name);
        campaignDetailsPage.waitOverlayUntilStale();
        lineItemDetailsPage.clickLinkCopy();

        lineItemPage.getTextAlertCopy().then(function(element) {
            expect(element).to.exist;
        });

        lineItemPage.getTextAlertCopy().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to.contain('You are now editing a copy' +
                ' of <strong>' + targetLineItem.name + '</strong>.' +
                    ' Any unsaved changes will be lost.');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('line item clone page should have all the elements', function(done) {
        lineItemPage.getTextParentCampaignOnClone().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getTextParentCampaignOnClone().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to.
                    contain('(ID: ' + targetCampaign.refId + ') '
                        + targetCampaign.name);
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
        lineItemPage.getLinkUseCampaignDates().then(function(element) {
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

    it('should delete parent campaign', function(done) {
        lineItemPage.getButtonDeleteParentCampaign().click();
        lineItemPage.getInputParentCampaign().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should not show results on invalid search', function(done) {
        lineItemPage.getInputParentCampaign().click();
        lineItemPage.setParentCampaignInvalid('invalid');
        lineItemPage.getTextNoLocations().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should select parent campaign', function(done) {
        lineItemPage.setParentCampaign('(ID: ' + targetCampaign.refId + ')');
        lineItemPage.getTextParentCampaignOnClone().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to.
                    contain('(ID: ' + targetCampaign.refId + ') '
                        + targetCampaign.name);
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
        lineItemPage.selectAdvancedTargeting('Publisher Whitelist/Blacklist');
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

    it('should display whitelist/blacklist targeting' +
         ' elements on selection', function(done) {
        lineItemPage.getSpanSearch().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getSpanInputIds().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getButtonWhitelist().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getButtonWhitelist().click();
        lineItemPage.getSpanElement('Whitelist').then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getSpanElement('Blacklist').then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getButtonWhitelist().click();
        lineItemPage.getSpanInputIds().click();
        lineItemPage.getButtonIds().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getButtonAddIds().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getTextInputIds().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getButtonIds().click();
        lineItemPage.getSpanElement('Newsletter IDs').then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getSpanElement('Publisher IDs').then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getButtonIds().click();
        lineItemPage.getSpanSearch().click();
        lineItemPage.getInputSearchWhitelist().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should add whitelist/blacklist targeting', function(done) {
        lineItemPage.setInputSearchWhitelist(targetPublisher);
        lineItemPage.getSpanContainsText(targetPublisher);
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should delete whitelist/blacklist targeting', function(done) {
        lineItemPage.getButtonDeleteWhitelist().click();
        lineItemPage.getInputName().click();
        lineItemPage.getInputSearchWhitelist().
            sendKeys(targetPublisher);
        lineItemPage.getInputSearchWhitelist().click();
        lineItemPage.getSearchedElement().then(function(element) {
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
