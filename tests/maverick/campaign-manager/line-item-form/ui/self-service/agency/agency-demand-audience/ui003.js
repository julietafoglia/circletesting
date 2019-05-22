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
const targetCreative1 = targetAdvertiser.children.creative001;
const targetCreative2 = targetAdvertiser.children.creative002;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let IoDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/insertion-order-details');
let CampaignDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/campaign-details');
let LineItemPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-form');
let loginPage;
let ioDetailsPage;
let campaignDetailsPage;
let lineItemPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

// fixture(s)
const testFile = rootPath + '/fixtures/common/creative/bulk-tag-upload.xlsx';
const fileName = testFile.split('/')[4];

describe('{{MAVERICK}} /line-item {UI} @SS-AGENCY >>> ' +
    '(+) verify ui elements - ad builder >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        ioDetailsPage = new IoDetailsPage(driver);
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

    it('navigate to line item create page', function(done) {
        ioDetailsPage.navigate(targetServer, 'advertisers',
            targetAdvertiser.refId);
        ioDetailsPage.waitUntilLoaderNotVisible();
        ioDetailsPage.clickCampaign(targetCampaign.name);
        campaignDetailsPage.waitUntilLoaderNotVisible();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('ad builder page should have all the elements', function(done) {
        campaignDetailsPage.clickNewLineItem();
        lineItemPage.waitOverlayUntilStale();

        lineItemPage.getButtonStartBuildingAds().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.clickButtonStartBuildingAds();
        lineItemPage.getAdBuilder().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getButtonAddToLineItem().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getButtonCancelAdBuilder().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('upload images tab should have all the elements', function(done) {
        lineItemPage.getSpanUploadImages().click();
        lineItemPage.getLinkClickToUpload().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('third party tab should have all the elements', function(done) {
        lineItemPage.getSpanAddThirdPartyTags().click();
        lineItemPage.getInputAdName().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getInputSourceUrl().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getLinkTestSourceUrl().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getInputClickUrl().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getLinkTestClickUrl().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getInputThirdPartyTracker().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getLinkSecondaryThirdParty().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getLinkSecondaryThirdParty().click();
        lineItemPage.getInputSecondaryTracker().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getButtonAddThirdPartyAd().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('use existing ads tab should have all the elements', function(done) {
        lineItemPage.getSpanUseExistingAds().click();
        lineItemPage.getInputSearchExistingAds().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getButtonSearchExistingAd().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getExistingAdCheckbox(targetCreative1.name)
            .then(function(element) {
                expect(element).to.exist;
            });
        lineItemPage.getExistingAdName(targetCreative1.name)
            .then(function(element) {
                expect(element).to.exist;
            });
        lineItemPage.getExistingAdId(targetCreative1.refId)
            .then(function(element) {
                expect(element).to.exist;
            });
        lineItemPage.getExistingAdSize('600 x 400').then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getExistingAdSourceUrl(targetCreative1.mediaUrl)
            .then(function(element) {
                expect(element).to.exist;
            });
        lineItemPage.getExistingAdClickUrl(targetCreative1.clickUrl)
            .then(function(element) {
                expect(element).to.exist;
            });
        lineItemPage.getExistingAdCreatedDate(targetCreative1.name)
            .then(function(element) {
                expect(element).to.exist;
            });
        lineItemPage.getExistingAdCreatedHour(targetCreative1.name)
            .then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should search existing ad', function(done) {
        lineItemPage.getInputSearchExistingAds().sendKeys(targetCreative1.name);
        lineItemPage.getButtonSearchExistingAd().click();
        lineItemPage.getTextTagExistingAd().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getLinkDeleteTag().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getExistingAdName(targetCreative1.name)
            .then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should delete searched existing ad', function(done) {
        lineItemPage.getLinkDeleteTag().click();
        lineItemPage.getExistingAdName(targetCreative1.name)
            .then(function(element) {
                expect(element).to.exist;
            });
        lineItemPage.getExistingAdName(targetCreative2.name)
            .then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display selected ads text', function(done) {
        lineItemPage.getExistingAdCheckbox(targetCreative1.name).click();
        lineItemPage.getTextSelectedAd().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('1 Ad Selected');
            });
        lineItemPage.clickCheckSelectAll();
        lineItemPage.getTextSelectedAd().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('3 Ads Selected');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('bulk tag uploader tab should have all the elements', function(done) {
        lineItemPage.clickSpanBulkTagUploader();
        lineItemPage.getLinkClickToUpload().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getLinkDownloadTemplate().then(function(element) {
            expect(element).to.exist;
        });

        lineItemPage.setInputFile(testFile);
        lineItemPage.getButtonUploadNewTag().then(function(element) {
            expect(element).to.exist;
        });
        lineItemPage.getTitle(fileName).then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should not display ad builder modal on close click', function(done) {
        lineItemPage.getButtonCancelAdBuilder().click();
        lineItemPage.getButtonStartBuildingAds()
            .then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

});
