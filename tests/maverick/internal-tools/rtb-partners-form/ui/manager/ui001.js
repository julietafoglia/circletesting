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
    'verify rtb-partners-form basic details ui elements >>>', function() {

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
        expect(rtbPartnersFormPage.getCreateTitle()).to.exist;
        expect(rtbPartnersFormPage.getBasicDetailsTitle()).to.exist;
        expect(rtbPartnersFormPage.getNameLabel()).to.exist;
        expect(rtbPartnersFormPage.getNameInput()).to.exist;
        expect(rtbPartnersFormPage.getStatusLabel()).to.exist;
        expect(rtbPartnersFormPage.getStatusButtonDropdown()).to.exist;
        rtbPartnersFormPage.clickStatusDropdownButton();
        expect(rtbPartnersFormPage.getStatusDropdownActive()).to.exist;
        expect(rtbPartnersFormPage.getStatusDropdownInactive()).to.exist;
        rtbPartnersFormPage.clickStatusDropdownButton();
        expect(rtbPartnersFormPage.getParentDspLabel()).to.exist;
        expect(rtbPartnersFormPage.getParentDspInput()).to.exist;
        expect(rtbPartnersFormPage.getMatchUrlLabel()).to.exist;
        expect(rtbPartnersFormPage.getMatchUrlInput()).to.exist;
        expect(rtbPartnersFormPage.getMd5CheckboxInput()).to.exist;
        expect(rtbPartnersFormPage.getMd5CheckboxText()).to.exist;
        expect(rtbPartnersFormPage.getMatchedUsersCheckboxInput()).to.exist;
        expect(rtbPartnersFormPage.getMatchedUsersCheckboxText()).to.exist;
        expect(rtbPartnersFormPage.getSupportRedirectsCheckboxText()).to.exist;
        expect(rtbPartnersFormPage.getSupportRedirectsCheckboxCheck()).to.exist;
        expect(rtbPartnersFormPage.getCreativeSizeLabel()).to.exist;
        expect(rtbPartnersFormPage.getCreativeSizeInput()).to.exist;
        expect(rtbPartnersFormPage.getProtocolLabel()).to.exist;
        expect(rtbPartnersFormPage.getProtocolDropdownButton()).to.exist;
        rtbPartnersFormPage.clickProtocolDropdownButton();
        expect(rtbPartnersFormPage
            .getProtocolDropdownOpenRtbDisplay()).to.exist;
        expect(rtbPartnersFormPage.getProtocolDropdownCriteo()).to.exist;
        expect(rtbPartnersFormPage
            .getProtocolDropdownOpenRtbNativeEnc()).to.exist;
        expect(rtbPartnersFormPage
            .getProtocolDropdownOpenRtbNativeEnc2()).to.exist;
        expect(rtbPartnersFormPage.getProtocolDropdownOpenRtbNative()).to.exist;
        rtbPartnersFormPage.clickProtocolDropdownButton();
        expect(rtbPartnersFormPage.getExtraOfferLabel()).to.exist;
        expect(rtbPartnersFormPage.getExtraDropDownButton()).to.exist;
        rtbPartnersFormPage.clickExtraOfferDropdownButton();
        expect(rtbPartnersFormPage.getSpan('1')).to.exist;
        expect(rtbPartnersFormPage.getSpan('2')).to.exist;
        expect(rtbPartnersFormPage.getSpan('3')).to.exist;
        expect(rtbPartnersFormPage.getSpan('4')).to.exist;
        expect(rtbPartnersFormPage.getSpan('5')).to.exist;
        expect(rtbPartnersFormPage.getSpan('6')).to.exist;
        expect(rtbPartnersFormPage.getSpan('7')).to.exist;
        expect(rtbPartnersFormPage.getSpan('8')).to.exist;
        expect(rtbPartnersFormPage.getSpan('9')).to.exist;
        expect(rtbPartnersFormPage.getSpan('10')).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display active in status dropdown button', function(done){
        rtbPartnersFormPage.clickStatusDropdownButton();
        rtbPartnersFormPage.clickStatusActive();
        rtbPartnersFormPage.getStatusButtonDropdown().getText()
            .then(function(text) {
                expect(text).to.equal(rtbPartnersFormPage.getStatusActive());
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display inactive in status dropdown button', function(done){
        rtbPartnersFormPage.clickStatusDropdownButton();
        rtbPartnersFormPage.clickStatusInactive();
        rtbPartnersFormPage.getStatusButtonDropdown().getText()
            .then(function(text) {
                expect(text).to.equal(rtbPartnersFormPage.getStatusInactive());
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should check match url checkboxes', function(done) {
        rtbPartnersFormPage.clickMd5CheckboxInput();
        expect(rtbPartnersFormPage.getMd5CheckboxCheck()).to.exist;

        rtbPartnersFormPage.clickMatchedUsersInput();
        expect(rtbPartnersFormPage.getMatchedUsersCheckboxInputCheck())
            .to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it ('should display at least 1 row in the dropdowns', function(done) {
        rtbPartnersFormPage.clickCreativeSizes();
        rtbPartnersFormPage.getRowsNumber().then(function(rows){
            expect(rows.length).to.be.at.least(1);
        });
        rtbPartnersFormPage.clickMatchedUsersInput();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display the selected option in protocol dropdown ' +
        'button', function(done){
        rtbPartnersFormPage.clickProtocolDropdownButton();
        rtbPartnersFormPage.clickProtocolOpenRtbDisplay();
        rtbPartnersFormPage.getProtocolDropdownButton().getText()
            .then(function(text) {
                expect(text).to.equal(rtbPartnersFormPage
                    .getProtocolRtbDisplay());
            });

        rtbPartnersFormPage.clickProtocolDropdownButton();
        rtbPartnersFormPage.clickProtocolCriteo();
        rtbPartnersFormPage.getProtocolDropdownButton().getText()
            .then(function(text) {
                expect(text).to.equal(rtbPartnersFormPage.getProtocolCriteo());
            });

        rtbPartnersFormPage.clickProtocolDropdownButton();
        rtbPartnersFormPage.clickProtocolOpenRtbNativeEnc();
        rtbPartnersFormPage.getProtocolDropdownButton().getText()
            .then(function(text) {
                expect(text).to.equal(rtbPartnersFormPage
                    .getProtocolRtbNativeEnc());
            });

        rtbPartnersFormPage.clickProtocolDropdownButton();
        rtbPartnersFormPage.clickProtocolOpenRtbNative();
        rtbPartnersFormPage.getProtocolDropdownButton().getText()
            .then(function(text) {
                expect(text).to.equal(rtbPartnersFormPage
                    .getProtocolRtbNative());
            });

        rtbPartnersFormPage.clickProtocolDropdownButton();
        rtbPartnersFormPage.clickProtocolOpenRtbNativeEnc2();
        rtbPartnersFormPage.getProtocolDropdownButton().getText()
            .then(function(text) {
                expect(text).to.equal(rtbPartnersFormPage
                    .getProtocolRtbNativeEnc2());
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show OpenRTB Header Version input and label', function(done){
        rtbPartnersFormPage.clickProtocolDropdownButton();
        rtbPartnersFormPage.clickProtocolOpenRtbDisplay();
        expect(rtbPartnersFormPage.getOpenRtbHeaderVersionLabel()).to.exist;
        expect(rtbPartnersFormPage
            .getRtbHeaderVersionDropdownButton()).to.exist;

        rtbPartnersFormPage.clickProtocolDropdownButton();
        rtbPartnersFormPage.clickProtocolOpenRtbNativeEnc();
        expect(rtbPartnersFormPage.getOpenRtbHeaderVersionLabel()).to.exist;
        expect(rtbPartnersFormPage
            .getRtbHeaderVersionDropdownButton()).to.exist;

        rtbPartnersFormPage.clickProtocolDropdownButton();
        rtbPartnersFormPage.clickProtocolOpenRtbNative();
        expect(rtbPartnersFormPage.getOpenRtbHeaderVersionLabel()).to.exist;
        expect(rtbPartnersFormPage
            .getRtbHeaderVersionDropdownButton()).to.exist;

        rtbPartnersFormPage.clickProtocolDropdownButton();
        rtbPartnersFormPage.clickProtocolCriteo();

        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display the selected option in Extra Offer Max ' +
        'dropdown button', function(done){
        rtbPartnersFormPage.clickExtraOfferDropdownButton();
        rtbPartnersFormPage.getSpan('1').click();
        rtbPartnersFormPage.getExtraDropDownButton().getText()
            .then(function(text) {
                expect(text).to.equal('1');
            });

        rtbPartnersFormPage.clickExtraOfferDropdownButton();
        rtbPartnersFormPage.getSpan('2').click();
        rtbPartnersFormPage.getExtraDropDownButton().getText()
            .then(function(text) {
                expect(text).to.equal('2');
            });

        rtbPartnersFormPage.clickExtraOfferDropdownButton();
        rtbPartnersFormPage.getSpan('3').click();
        rtbPartnersFormPage.getExtraDropDownButton().getText()
            .then(function(text) {
                expect(text).to.equal('3');
            });

        rtbPartnersFormPage.clickExtraOfferDropdownButton();
        rtbPartnersFormPage.getSpan('4').click();
        rtbPartnersFormPage.getExtraDropDownButton().getText()
            .then(function(text) {
                expect(text).to.equal('4');
            });

        rtbPartnersFormPage.clickExtraOfferDropdownButton();
        rtbPartnersFormPage.getSpan('5').click();
        rtbPartnersFormPage.getExtraDropDownButton().getText()
            .then(function(text) {
                expect(text).to.equal('5');
            });

        rtbPartnersFormPage.clickExtraOfferDropdownButton();
        rtbPartnersFormPage.getSpan('6').click();
        rtbPartnersFormPage.getExtraDropDownButton().getText()
            .then(function(text) {
                expect(text).to.equal('6');
            });

        rtbPartnersFormPage.clickExtraOfferDropdownButton();
        rtbPartnersFormPage.getSpan('7').click();
        rtbPartnersFormPage.getExtraDropDownButton().getText()
            .then(function(text) {
                expect(text).to.equal('7');
            });

        rtbPartnersFormPage.clickExtraOfferDropdownButton();
        rtbPartnersFormPage.getSpan('8').click();
        rtbPartnersFormPage.getExtraDropDownButton().getText()
            .then(function(text) {
                expect(text).to.equal('8');
            });

        rtbPartnersFormPage.clickExtraOfferDropdownButton();
        rtbPartnersFormPage.getSpan('9').click();
        rtbPartnersFormPage.getExtraDropDownButton().getText()
            .then(function(text) {
                expect(text).to.equal('9');
            });

        rtbPartnersFormPage.clickExtraOfferDropdownButton();
        rtbPartnersFormPage.getSpan('10').click();
        rtbPartnersFormPage.getExtraDropDownButton().getText()
            .then(function(text) {
                expect(text).to.equal('10');
            });

        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show expected element after filtering ' +
    'Parent DSP', function(done) {
        rtbPartnersFormPage.findParentDsp('initest');
        rtbPartnersFormPage.getParentDspOptions().getText()
            .then(function(text){
                rtbPartnersFormPage.setInputParentDspSearch(text);

                rtbPartnersFormPage.getParentDspSelected().getText()
                    .then(function(filter){
                        expect(filter).to.equal(text);
                    });

            });
        driver.sleep(driverTimeOut).then(() => done());
    });
});
