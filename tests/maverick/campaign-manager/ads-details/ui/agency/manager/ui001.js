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
const targetAdv = entitiesObj.agency001.children.advertiser001;
const targetCreative = targetAdv.children.creative001;

// selenium runtime variables
let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let AdsDetails = require(rootPath + '/pages/maverick/campaign-manager' +
    '/ad-details');
let AdLibraryPage = require(rootPath +
    '/pages/maverick/campaign-manager/ad-library');
let loginPage;
let adsDetails;
let adLibraryPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /ads {details} @MANAGER >>> ' +
    '(+) ui verification >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        adLibraryPage = new AdLibraryPage(driver);
        adsDetails = new AdsDetails(driver);
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

    it('should navigate to ad library', function(done) {
        adLibraryPage.clickAdLibrary();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should navigate to ad details page', function(done) {
        adLibraryPage.clickAdNameLink(targetCreative.name);
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('ad details page should contain all elements', function(done) {
        expect(adsDetails.getH1Title(targetCreative.name)).to.exist;
        expect(adsDetails.getTextAdId('ID: ' + targetCreative.refId)).to.exist;
        expect(adsDetails.getAdSize(targetCreative.width + 'x'
            + targetCreative.height)).to.exist;
        expect(adsDetails.getAdClickUrl(targetCreative.clickUrl)).to.exist;
        expect(adsDetails.getAdThirdPartyTracker(targetCreative.trackingUrl))
            .to.exist;
        adsDetails.getAdImage().getAttribute('src').
            then(function(src) {
                expect(src).to.equal(targetCreative.mediaUrl);
            });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('verify delete link functionality', function(done) {
        adsDetails.clickLinkDelete();
        // expect(adsDetails.getTitleDeleteAd()).to.exist;
        expect(adsDetails.getButtonRejectDelete()).to.exist;
        expect(adsDetails.getButtonConfirmDelete()).to.exist;
        expect(adsDetails.getCheckboxDelete()).to.exist;
        expect(adsDetails.getTextCheckboxDelete()).to.exist;
        expect(adsDetails.getTextCreativeNameDelete(targetCreative.name))
            .to.exist;
        adsDetails.clickButtonRejectDelete();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('verify copy link functionality', function(done) {
        driver.navigate().refresh();
        adsDetails.clickLinkCopy();
        expect(adsDetails.getTitleCreateForm()).to.exist;
        adsDetails.clickButtonCloseModal();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('verify edit link functionality', function(done) {
        loginPage.login(targetServer, targetUser);
        adLibraryPage.clickAdLibrary();
        adLibraryPage.clickAdNameLink(targetCreative.name);
        adsDetails.clickLinkEdit();
        expect(adsDetails.getTitleEditForm()).to.exist;
        adsDetails.clickButtonCloseModal();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('verify more link functionality', function(done) {
        loginPage.login(targetServer, targetUser);
        adLibraryPage.clickAdLibrary();
        adLibraryPage.clickAdNameLink(targetCreative.name);
        adsDetails.clickLinkMore();
        adsDetails.clickLinkViewHistory();
        expect(adsDetails.getModalViewHistory()).to.exist;
        adsDetails.clickButtonCancelViewHistory();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
