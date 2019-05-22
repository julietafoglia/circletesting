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
const mochaTimeOut = 0;
const title = 'Accounts';
const subtitleSection = 'Fees';
const subtitleForm = 'Basic Details';

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavBar = require(rootPath + '/pages/maverick/platform/nav-bar');
let AccountsLibraryPage = require(rootPath + '/pages/maverick/' +
    'internal-tools/accounts-library');
let UsersLibrary = require(rootPath + '/pages/maverick/internal-tools/' +
    'users-library');
let MediaGroupForm = require(rootPath + '/pages/maverick/internal-tools/' +
    'media-group-form');
let usersLibrary, accountsLibrary, navBar, loginPage, account, mediaGroupForm;

// fixture
const accountTestFixture =
    require(rootPath + '/fixtures/common/media-group/create005');
account = Object.assign({}, accountTestFixture);
account.directSoldFee = 4;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE-PROD> {{MAVERICK}} /accounts-form {UI} @MANAGER >>> ' +
    '(+) verify account media-group create form ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(mochaTimeOut);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBar(driver);
        usersLibrary = new UsersLibrary(driver);
        accountsLibrary = new AccountsLibraryPage(driver);
        mediaGroupForm = new MediaGroupForm(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should navigate to Accounts at Internal Tools section', function(done){
        loginPage.login(targetServer, targetUser);
        navBar.clickInternalTools();
        usersLibrary.clickAccountsSideBar();
        accountsLibrary.waitSpinnerUntilStale();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display all Media Group create form elements', function(done) {
        accountsLibrary.getTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(title);
            });
        expect(accountsLibrary.getCreateAccountButton()).to.exist;
        expect(accountsLibrary.getSearchField()).to.exist;
        accountsLibrary.clickCreateAccountButton();
        mediaGroupForm.selectMediaGroupType();
        expect(mediaGroupForm.getAccountNameInput()).to.exist;
        mediaGroupForm.getTitle().getText().
            then(function(getText) {
                expect(getText).to.include(subtitleForm);
            });
        expect(mediaGroupForm.getSalesforceIdInput()).to.exist;
        expect(mediaGroupForm.getCnameInput()).to.exist;
        expect(mediaGroupForm.getProtocolDropDown()).to.exist;
        expect(mediaGroupForm.getPublisherTierDropDown()).to.exist;
        expect(mediaGroupForm.getPoweredBySlider()).to.exist;
        expect(mediaGroupForm.getAdChoicesSlider()).to.exist;
        expect(mediaGroupForm.getUserMatchingSlider()).to.exist;
        expect(mediaGroupForm.getAccountActivationSlider()).to.exist;
        mediaGroupForm.getTitleSection().getText().
            then(function(getText) {
                expect(getText).to.include(subtitleSection);
            });
        expect(mediaGroupForm.getContractDropDown()).to.exist;
        expect(mediaGroupForm.getMonthlyMinimumInput()).to.exist;
        expect(mediaGroupForm.getLIExchangeFeeInput()).to.exist;
        expect(mediaGroupForm.getPlatformAdFeeInput()).to.exist;
        expect(mediaGroupForm.getDirectSoldFee()).to.exist;
        expect(mediaGroupForm.getSecondFeeLink()).to.exist;
        expect(mediaGroupForm.getRTBDemandDropdown()).to.exist;
        mediaGroupForm.clickClose();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display Media Group create form elements Monetization contract',
        function(done) {
            accountsLibrary.clickCreateAccountButton();
            mediaGroupForm.selectMediaGroupType();
            mediaGroupForm.selectMonetizationContract();
            expect(mediaGroupForm.getAccountNameInput()).to.exist;
            mediaGroupForm.getTitle().getText().
                then(function(getText) {
                    expect(getText).to.include(subtitleForm);
                });
            expect(mediaGroupForm.getSalesforceIdInput()).to.exist;
            expect(mediaGroupForm.getCnameInput()).to.exist;
            expect(mediaGroupForm.getProtocolDropDown()).to.exist;
            expect(mediaGroupForm.getPublisherTierDropDown()).to.exist;
            expect(mediaGroupForm.getPoweredBySlider()).to.exist;
            expect(mediaGroupForm.getAdChoicesSlider()).to.exist;
            expect(mediaGroupForm.getUserMatchingSlider()).to.exist;
            expect(mediaGroupForm.getAccountActivationSlider()).to.exist;
            mediaGroupForm.getTitleSection().getText().
                then(function(getText) {
                    expect(getText).to.include(subtitleSection);
                });
            expect(mediaGroupForm.getContractDropDown()).to.exist;
            expect(mediaGroupForm.getLIExchangeFeeInput()).to.exist;
            expect(mediaGroupForm.getSecondFeeLink()).to.exist;
            mediaGroupForm.noMonthlyMinimumInput()
                .then(function(arr) {
                    expect(arr).to.be.empty;
                });
            mediaGroupForm.noDirectSoldFee()
                .then(function(arr) {
                    expect(arr).to.be.empty;
                });
            mediaGroupForm.clickSecondFeeLink();
            expect(mediaGroupForm.getSecondFeeInput()).to.exist;
            mediaGroupForm.clickClose();
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should enable save button Monthly contract',
        function(done) {
            accountsLibrary.clickCreateAccountButton();
            mediaGroupForm.selectMediaGroupType();
            mediaGroupForm.completeName(account.name);
            mediaGroupForm.completeSalesforceId(account.salesforceId);
            mediaGroupForm.enterCName(account.cnameProtocol,
                account.cname);
            mediaGroupForm.clickAccountActivation();
            mediaGroupForm.selectPublisherTier(account.tier);
            mediaGroupForm.clickPoweredBy();
            mediaGroupForm.clickAdChoices();
            mediaGroupForm.clickUserMatching();
            mediaGroupForm.completeMonthlyMinimum(
                account.monthlyMinimum);
            mediaGroupForm.completeLIExchangeFee(account.sspFee);
            mediaGroupForm.completePlatformAdFee(account.dspFee);
            mediaGroupForm.completeDirectSoldFee(account.directSoldFee);
            mediaGroupForm.waitUntilSaveButtonEnabled();
            expect(mediaGroupForm.getSaveButton()).to.exist;
            mediaGroupForm.clickClose();
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should enable save button Monetization contract',
        function(done) {
            accountsLibrary.clickCreateAccountButton();
            mediaGroupForm.selectMediaGroupType();
            mediaGroupForm.completeName(account.name);
            mediaGroupForm.completeSalesforceId(account.salesforceId);
            mediaGroupForm.enterCName(account.cnameProtocol,
                account.cname);
            mediaGroupForm.clickAccountActivation();
            mediaGroupForm.selectPublisherTier(account.tier);
            mediaGroupForm.clickPoweredBy();
            mediaGroupForm.clickAdChoices();
            mediaGroupForm.clickUserMatching();
            mediaGroupForm.selectMonetizationContract();
            mediaGroupForm.completeLIExchangeFee(account.sspFee);
            mediaGroupForm.completePlatformAdFee(account.dspFee);
            mediaGroupForm.waitUntilSaveButtonEnabled();
            expect(mediaGroupForm.getSaveButton()).to.exist;
            mediaGroupForm.clickClose();
            driver.sleep(driverTimeOut).then(() => done());
        });
});
