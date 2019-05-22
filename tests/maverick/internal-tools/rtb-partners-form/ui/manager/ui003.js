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
const firstCountry = 'Argentina';
const secondCountry = 'Venezuela';

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
    'verify rtb-partners-form device browser ui elements >>>', function() {

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
        expect(rtbPartnersFormPage.getDeviceLabel()).to.exist;
        expect(rtbPartnersFormPage.getDeviceDropdownButton()).to.exist;
        rtbPartnersFormPage.clickDeviceDropdownButton();
        expect(rtbPartnersFormPage.getDeviceDropdownPcInput()).to.exist;
        expect(rtbPartnersFormPage.getDeviceDropdownPcText()).to.exist;
        expect(rtbPartnersFormPage.getDeviceDropdownPhoneInput()).to.exist;
        expect(rtbPartnersFormPage.getDeviceDropdownPhoneText()).to.exist;
        expect(rtbPartnersFormPage.getDeviceDropdownPhoneInput()).to.exist;
        expect(rtbPartnersFormPage.getDeviceDropdownTabletInput()).to.exist;
        expect(rtbPartnersFormPage.getDeviceDropdownTabletText()).to.exist;
        rtbPartnersFormPage.clickDeviceDropdownButton();
        expect(rtbPartnersFormPage.getDeviceMarkerLabel()).to.exist;
        expect(rtbPartnersFormPage.getTrackingExtSspLabel()).to.exist;
        expect(rtbPartnersFormPage.getTrackingExtSspInput()).to.exist;
        expect(rtbPartnersFormPage.getAuctionTypeLabel()).to.exist;
        expect(rtbPartnersFormPage.getDeviceMarkerButtonDropdown()).to.exist;
        expect(rtbPartnersFormPage.getDeviceBrowserButtonDropdown()).to.exist;
        expect(rtbPartnersFormPage.getOsLabel()).to.exist;
        expect(rtbPartnersFormPage.getOsButtonDropdown()).to.exist;
        expect(rtbPartnersFormPage.getGeoTargetingLabel()).to.exist;
        expect(rtbPartnersFormPage.getGeoTargetingContainer()).to.exist;
        expect(rtbPartnersFormPage.getGeoTargetingSearch()).to.exist;
        expect(rtbPartnersFormPage.getGeoTargetingDropbox()).to.exist;

        driver.sleep(driverTimeOut).then(() => done());
    });

    it ('should display at least 1 row in the dropdowns', function(done) {
        rtbPartnersFormPage.clickDeviceMarkerDropdownButton();
        rtbPartnersFormPage.getRowsNumber().then(function(rows){
            expect(rows.length).to.be.at.least(1);
        });
        rtbPartnersFormPage.clickDeviceMarkerDropdownButton();

        rtbPartnersFormPage.clickBrowserDropdownButton();
        rtbPartnersFormPage.getRowsNumber().then(function(rows){
            expect(rows.length).to.be.at.least(1);
        });
        rtbPartnersFormPage.clickBrowserDropdownButton();

        rtbPartnersFormPage.clickOsDropdownButton();
        rtbPartnersFormPage.getRowsNumber().then(function(rows){
            expect(rows.length).to.be.at.least(1);
        });
        rtbPartnersFormPage.clickOsDropdownButton();

        driver.sleep(driverTimeOut).then(() => done());
    });

    it ('should display the selected option in Device Maker dropdown ' +
        'button', function(done) {
        let dropboxSelectedOption;
        rtbPartnersFormPage.clickDeviceMarkerDropdownButton();
        rtbPartnersFormPage.getDropboxFirstRow().getText().then(function(row1){
            rtbPartnersFormPage.clickDropboxFirstRow();
            rtbPartnersFormPage.getDeviceMarkerButtonDropdown().getText()
                .then(function(selectedOption){
                    dropboxSelectedOption = selectedOption;
                    expect(row1).to.be.equal(dropboxSelectedOption);
                });
        });
        rtbPartnersFormPage.clickDeviceMarkerDropdownButton();
        rtbPartnersFormPage.clickDeviceMarkerDropdownButton();
        rtbPartnersFormPage.getDropboxFirstRow().getText().then(function(row1){
            rtbPartnersFormPage.getDropboxSecondRow().getText()
                .then(function(row2){
                    rtbPartnersFormPage.clickDropboxSecondRow();
                    rtbPartnersFormPage.getDeviceMarkerButtonDropdown()
                        .getText().then(function(selectedOption){
                            dropboxSelectedOption = selectedOption;
                            expect(row1 + ', ' + row2).to.be
                                .equal(dropboxSelectedOption);
                        });
                });
        });

        rtbPartnersFormPage.clickDeviceMarkerDropdownButton();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it ('should display the selected option in Browser dropdown ' +
        'button', function(done) {
        let dropboxSelectedOption;
        rtbPartnersFormPage.clickBrowserDropdownButton();
        rtbPartnersFormPage.getDropboxFirstRow().getText().then(function(row1){
            rtbPartnersFormPage.clickDropboxFirstRow();
            rtbPartnersFormPage.getDeviceBrowserButtonDropdown().getText()
                .then(function(selectedOption){
                    dropboxSelectedOption = selectedOption;
                    expect(row1).to.be.equal(dropboxSelectedOption);
                });
        });
        rtbPartnersFormPage.clickBrowserDropdownButton();
        rtbPartnersFormPage.clickBrowserDropdownButton();
        rtbPartnersFormPage.getDropboxFirstRow().getText().then(function(row1){
            rtbPartnersFormPage.getDropboxSecondRow().getText()
                .then(function(row2){
                    rtbPartnersFormPage.clickDropboxSecondRow();
                    rtbPartnersFormPage.getDeviceBrowserButtonDropdown()
                        .getText().then(function(selectedOption){
                            dropboxSelectedOption = selectedOption;
                            expect(row1 + ', ' + row2).to.be
                                .equal(dropboxSelectedOption);
                        });
                });
        });

        rtbPartnersFormPage.clickBrowserDropdownButton();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it ('should display the selected option in OS dropdown ' +
        'button', function(done) {
        let dropboxSelectedOption;
        rtbPartnersFormPage.clickOsDropdownButton();
        rtbPartnersFormPage.getDropboxFirstRow().getText().then(function(row1){
            rtbPartnersFormPage.clickDropboxFirstRow();
            rtbPartnersFormPage.getOsButtonDropdown().getText()
                .then(function(selectedOption){
                    dropboxSelectedOption = selectedOption;
                    expect(row1).to.be.equal(dropboxSelectedOption);
                });
        });
        rtbPartnersFormPage.clickOsDropdownButton();
        rtbPartnersFormPage.clickOsDropdownButton();
        rtbPartnersFormPage.getDropboxFirstRow().getText().then(function(row1){
            rtbPartnersFormPage.getDropboxSecondRow().getText()
                .then(function(row2){
                    rtbPartnersFormPage.clickDropboxSecondRow();
                    rtbPartnersFormPage.getOsButtonDropdown()
                        .getText().then(function(selectedOption){
                            dropboxSelectedOption = selectedOption;
                            expect(row1 + ', ' + row2).to.be
                                .equal(dropboxSelectedOption);
                        });
                });
        });
        rtbPartnersFormPage.clickOsDropdownButton();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it ('should display geotargeting searched countries', function(done) {
        rtbPartnersFormPage.setGeoTarCountries(firstCountry);
        rtbPartnersFormPage.getGeoTargetingFirstCountry().getAttribute('title')
            .then(function(title){
                let country = title.split(' ')[1];
                expect(country).to.be.equal(firstCountry);
            });

        rtbPartnersFormPage.setGeoTarCountries(secondCountry);
        rtbPartnersFormPage.getGeoTargetingSecondCountry().getAttribute('title')
            .then(function(title){
                let secondCountry = title.split(' ')[1];
                expect(secondCountry).to.be.equal(secondCountry);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it ('should show two selected items in geotargeting', function(done) {
        rtbPartnersFormPage.getGeoTargetingDropboxSelectedItems()
            .getText().then(function(text){
                let selectedCountries = text.split(' ')[0];
                expect(parseInt(selectedCountries)).to.be.equal(2);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

});
