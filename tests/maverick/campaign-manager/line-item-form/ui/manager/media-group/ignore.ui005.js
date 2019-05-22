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
const entitiesFileSSP = require(rootPath + '/bootstrap/entities-ssp.json');
const entitiesObjSSP = entitiesFileSSP;
const targetAdvertiser = entitiesObjSSP.manager.mediaGroup001.publisher001;
const targetAdSlot = targetAdvertiser.newsletter001.adSlot0;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let AdvDetsPage = require(rootPath +
     '/pages/maverick/campaign-manager/advertiser-details');
let IoDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/insertion-order-details');
let LineItemPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-form');
let CampaignDetailsPage = require(rootPath +
        '/pages/maverick/campaign-manager/campaign-details');
let LinkedAdSlotsPage = require(rootPath +
        '/pages/maverick/campaign-manager/linked-ad-slots');
let loginPage;
let ioDetailsPage;
let lineItemPage;
let advDetsPage;
let campaignDetailsPage;
let linkedAdSlots;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE> {{MAVERICK}} /line-item {UI} @MANAGER >>> ' +
    '(+) verify linked adslots functionality >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        advDetsPage = new AdvDetsPage(driver);
        ioDetailsPage = new IoDetailsPage(driver);
        campaignDetailsPage = new CampaignDetailsPage(driver);
        linkedAdSlots = new LinkedAdSlotsPage(driver);
        lineItemPage = new LineItemPage(driver);
        driver.manage().window().maximize;
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

    before('set up of entities', function(done) {
        advDetsPage.navigate(targetServer, 'advertisers',
            targetAdvertiser.refId);
        advDetsPage.waitUntilSpinnerNotVisible();
        ioDetailsPage.clickLinkContainsText('io001');
        ioDetailsPage.waitUntilLoaderNotVisible();
        campaignDetailsPage.waitUntilFilterNotVisible();
        campaignDetailsPage.clickLinkContainsText('cam001');
        campaignDetailsPage.waitUntilLoaderNotVisible();
        campaignDetailsPage.clickNewLineItem();
        lineItemPage.waitUntilOverlayNotVisible();
        driver.sleep(driverTimeOut).then(() => done());

    });

    // it('should check linked ad slots modal elements', function(done) {
    //     lineItemPage.clickSelectAdSlots();
    //     linkedAdSlots.getTitleSelectAdSlots().then(function(element) {
    //         expect(element).to.exist;
    //     });
    //     linkedAdSlots.getButtonAdd().then(function(element) {
    //         expect(element).to.exist;
    //     });
    //     linkedAdSlots.getInputSearch().then(function(element) {
    //         expect(element).to.exist;
    //     });
    //     linkedAdSlots.getTextSelectedAds().then(function(element) {
    //         expect(element).to.exist;
    //     });
    //     linkedAdSlots.getTextSelectedAds().getAttribute('innerHTML').
    //         then(function(innerHTML) {
    //             expect(innerHTML).to
    //                 .equal('0');
    //         });
    //     driver.sleep(driverTimeOut).then(() => done());
    // });

    // it('should check linked ad slots modal functionality', function(done) {
    //     linkedAdSlots.setInputSearch(targetAdSlot.name);
    //     linkedAdSlots.getSpan(targetAdSlot.name).then(function(element) {
    //         expect(element).to.exist;
    //     });
    //     linkedAdSlots.clickSpan(targetAdSlot.name);
    //     linkedAdSlots.getTextSelectedAds().getAttribute('innerHTML').
    //         then(function(innerHTML) {
    //             expect(innerHTML).to
    //                 .equal('1');
    //         });
    //     linkedAdSlots.getLinkClearAll().then(function(element) {
    //         expect(element).to.exist;
    //     });
    //     linkedAdSlots.getAddedAdSlot(targetAdSlot.name).then(function(element) {
    //         expect(element).to.exist;
    //     });
    //     linkedAdSlots.getDeleteAddedAdSlot(targetAdSlot.name);
    //     linkedAdSlots.getTextSelectedAds().getAttribute('innerHTML').
    //         then(function(innerHTML) {
    //             expect(innerHTML).to
    //                 .equal('0');
    //         });
    //     linkedAdSlots.setInputSearch(targetAdSlot.name);
    //     linkedAdSlots.getSpan(targetAdSlot.name).then(function(element) {
    //         expect(element).to.exist;
    //     });
    //     linkedAdSlots.clickSpan(targetAdSlot.name);
    //     linkedAdSlots.getTextSelectedAds().getAttribute('innerHTML').
    //         then(function(innerHTML) {
    //             expect(innerHTML).to
    //                 .equal('1');
    //         });
    //     linkedAdSlots.clickLinkClearAll();
    //     linkedAdSlots.getTextSelectedAds().getAttribute('innerHTML').
    //         then(function(innerHTML) {
    //             expect(innerHTML).to
    //                 .equal('0');
    //         });
    //     driver.sleep(driverTimeOut).then(() => done());
    // });

    // it('should check added ad slots elements', function(done) {
    //     linkedAdSlots.setInputSearch(targetAdSlot.name);
    //     linkedAdSlots.getSpan(targetAdSlot.name).then(function(element) {
    //         expect(element).to.exist;
    //     });
    //     linkedAdSlots.clickSpan(targetAdSlot.name);
    //     linkedAdSlots.clickAdd();
    //     linkedAdSlots.getWarningMessage(' You need to link at least one ' +
    //     'ad slot and matching creative size in order for this line item' +
    //         ' to deliver.')
    //         .then(function(element) {
    //             expect(element).to.exist;
    //         });
    //     linkedAdSlots.getLinkText('Select Ad Slots');
    //     linkedAdSlots.getAddedAdSlot(targetAdSlot.name).then(function(element) {
    //         expect(element).to.exist;
    //     });
    //     linkedAdSlots.getLinkClearAll().then(function(element) {
    //         expect(element).to.exist;
    //     });
    //     linkedAdSlots.getTextSelectedAds().getAttribute('innerHTML').
    //         then(function(innerHTML) {
    //             expect(innerHTML).to
    //                 .equal('1');
    //         });
    //     driver.sleep(driverTimeOut).then(() => done());
    // });

});
