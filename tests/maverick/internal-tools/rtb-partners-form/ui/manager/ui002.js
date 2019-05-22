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

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavBar = require(rootPath + '/pages/maverick/platform/nav-bar');
let SideBar = require(rootPath + '/pages/maverick/platform/side-bar');
let RtbPartnersFormPage = require(rootPath + '/pages/maverick/' +
    'internal-tools/rtb-partners-form');
let RtbPartnerLibraryPage = require(rootPath + '/pages/maverick/' +
    'internal-tools/rtb-partners-library');
let rtbPartnersFormPage;
let rtbPartnerLibraryPage;
let navBar;
let loginPage;
let sideBar;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE-PROD> {{MAVERICK}} /rtb-partners-form {UI} @MANAGER >>> (+) ' +
    'verify rtb-partners-form technical specs ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBar(driver);
        sideBar = new SideBar(driver);
        rtbPartnersFormPage = new RtbPartnersFormPage(driver);
        rtbPartnerLibraryPage = new RtbPartnerLibraryPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should navigate to RTB Partners section', function(done) {
        loginPage.login(targetServer, targetUser);
        navBar.closeOuterDiv();
        navBar.clickInternalTools();
        sideBar.clickRTBPartnerLink();
        rtbPartnerLibraryPage.waitUntilSpinnerDissapear();
        rtbPartnerLibraryPage.clickAddRtbPartner();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display RTB Partners create Button disabled', function(done) {
        rtbPartnersFormPage.getCreateRtbPartnerButton().getAttribute('disabled')
            .then(function(disabled) {
                expect(disabled).to.equal('true');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display all RTB Partners page elements', function(done) {
        expect(rtbPartnersFormPage.getSendSensitiveCheckboxInput()).to.exist;
        expect(rtbPartnersFormPage.getSendSensitiveCheckboxText()).to.exist;
        // expect(rtbPartnersFormPage.getSendHttpRequestLabel()).to.exist;
        expect(rtbPartnersFormPage.getSendHttpRequestInput()).to.exist;
        expect(rtbPartnersFormPage.getTrackingExtSspLabel()).to.exist;
        expect(rtbPartnersFormPage.getTrackingExtSspInput()).to.exist;
        expect(rtbPartnersFormPage.getAuctionTypeLabel()).to.exist;
        expect(rtbPartnersFormPage.getDeviceDropdownButton()).to.exist;
        expect(rtbPartnersFormPage.getAuctionTypeDropbox()).to.exist;
        rtbPartnersFormPage.clickAuctionTypeButton();
        expect(rtbPartnersFormPage.getAuctionType1()).to.exist;
        expect(rtbPartnersFormPage.getAuctionType2()).to.exist;
        rtbPartnersFormPage.clickAuctionTypeButton();
        expect(rtbPartnersFormPage.getAuctionLostNotifLabel()).to.exist;
        expect(rtbPartnersFormPage.getAuctionLostNotifInput()).to.exist;
        expect(rtbPartnersFormPage.getIfaasUrlOneLabel()).to.exist;
        expect(rtbPartnersFormPage.getIfaasUrlOneInput()).to.exist;
        expect(rtbPartnersFormPage.getIfaasTwoLabel()).to.exist;
        expect(rtbPartnersFormPage.getIfaasTwoInput()).to.exist;

        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should set the match url checkboxs in true', function(done) {
        rtbPartnersFormPage.clickSensitiveCheckboxButton();
        expect(rtbPartnersFormPage.getSendSensitiveCheckboxCheck()).to.exist;

        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display the selected option in Account Type ' +
        'dropdown button', function(done){
        rtbPartnersFormPage.clickAuctionTypeButton();
        rtbPartnersFormPage.clickAuctionTypeDefault();
        rtbPartnersFormPage.getAuctionTypeDropbox().getText()
            .then(function(text) {
                expect(text).to.equal('Default');
            });

        rtbPartnersFormPage.clickAuctionTypeButton();
        rtbPartnersFormPage.clickAuctionTypeOne();
        rtbPartnersFormPage.getAuctionTypeDropbox().getText()
            .then(function(text) {
                expect(text).to.equal('1st Price');
            });

        rtbPartnersFormPage.clickAuctionTypeButton();
        rtbPartnersFormPage.clickAuctionTypeTwo();
        rtbPartnersFormPage.getAuctionTypeDropbox().getText()
            .then(function(text) {
                expect(text).to.equal('2nd Price');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });
});
