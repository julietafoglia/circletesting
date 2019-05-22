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
const emptyString = '';
const char = 'w';
const oopsRequired = 'Oops! This is a required field.';
const oopsValidDomain = 'Please enter a valid domain, eg. domain.com.';

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

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE-PROD> {{MAVERICK}} /accounts-form {UI} @MANAGER >>> ' +
    '(-) verify account media-group create form ui elements >>>', function() {

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

    it('should disable save button and show oops message on required fields',
        function(done) {
            accountsLibrary.clickCreateAccountButton();
            mediaGroupForm.selectMediaGroupType();
            mediaGroupForm.completeName(account.name);
            mediaGroupForm.completeSalesforceId(account.salesforceId);
            mediaGroupForm.enterCName(account.cnameProtocol,
                account.cname);
            mediaGroupForm.clickAccountActivation();
            mediaGroupForm.selectPublisherTier(account.tier);
            mediaGroupForm.completeMonthlyMinimum(
                account.monthlyMinimum);
            mediaGroupForm.completeLIExchangeFee(account.sspFee);
            mediaGroupForm.completePlatformAdFee(account.dspFee);
            mediaGroupForm.waitUntilSaveButtonEnabled();

            mediaGroupForm.deleteName(char);
            mediaGroupForm.waitUntilSaveButtonDisabled();
            expect(mediaGroupForm.getOopsRequiredFieldMessage()).to.exist;
            mediaGroupForm.getOopsRequiredFieldMessage().getText().
                then(function(getText) {
                    expect(getText).to.include(oopsRequired);
                });
            mediaGroupForm.completeName(account.name);
            mediaGroupForm.waitUntilSaveButtonEnabled();

            mediaGroupForm.deleteSalesforceId(char);
            mediaGroupForm.waitUntilSaveButtonDisabled();
            expect(mediaGroupForm.getOopsRequiredFieldMessage()).to.exist;
            mediaGroupForm.getOopsRequiredFieldMessage().getText().
                then(function(getText) {
                    expect(getText).to.include(oopsRequired);
                });
            mediaGroupForm.completeSalesforceId(account.salesforceId);
            mediaGroupForm.waitUntilSaveButtonEnabled();

            mediaGroupForm.enterCName(account.cnameProtocol,
                char);
            mediaGroupForm.waitUntilSaveButtonDisabled();
            expect(mediaGroupForm.getOopsRequiredFieldMessage()).to.exist;
            mediaGroupForm.getOopsRequiredFieldMessage().getText().
                then(function(getText) {
                    expect(getText).to.include(oopsValidDomain);
                });
            mediaGroupForm.enterCName(account.cnameProtocol,
                account.cname);
            mediaGroupForm.waitUntilSaveButtonEnabled();


            mediaGroupForm.completeMonthlyMinimum(emptyString);
            mediaGroupForm.waitUntilSaveButtonDisabled();
            expect(mediaGroupForm.getOopsRequiredFieldMessage()).to.exist;
            mediaGroupForm.getOopsRequiredFieldMessage().getText().
                then(function(getText) {
                    expect(getText).to.include(oopsRequired);
                });
            mediaGroupForm.completeMonthlyMinimum(
                account.monthlyMinimum);
            mediaGroupForm.waitUntilSaveButtonEnabled();

            mediaGroupForm.completeLIExchangeFee(emptyString);
            mediaGroupForm.waitUntilSaveButtonDisabled();
            expect(mediaGroupForm.getOopsRequiredFieldMessage()).to.exist;
            mediaGroupForm.getOopsRequiredFieldMessage().getText().
                then(function(getText) {
                    expect(getText).to.include(oopsRequired);
                });
            mediaGroupForm.completeLIExchangeFee(account.sspFee);
            mediaGroupForm.waitUntilSaveButtonEnabled();

            mediaGroupForm.completePlatformAdFee(emptyString);
            mediaGroupForm.waitUntilSaveButtonDisabled();
            expect(mediaGroupForm.getOopsRequiredFieldMessage()).to.exist;
            mediaGroupForm.getOopsRequiredFieldMessage().getText().
                then(function(getText) {
                    expect(getText).to.include(oopsRequired);
                });
            mediaGroupForm.completePlatformAdFee(account.dspFee);
            mediaGroupForm.waitUntilSaveButtonEnabled();

            mediaGroupForm.selectMonetizationContract();

            mediaGroupForm.completeLIExchangeFee(emptyString);
            mediaGroupForm.waitUntilSaveButtonDisabled();
            expect(mediaGroupForm.getOopsRequiredFieldMessage()).to.exist;
            mediaGroupForm.getOopsRequiredFieldMessage().getText().
                then(function(getText) {
                    expect(getText).to.include(oopsRequired);
                });
            mediaGroupForm.completeLIExchangeFee(account.sspFee);
            mediaGroupForm.waitUntilSaveButtonEnabled();

            mediaGroupForm.completePlatformAdFee(emptyString);
            mediaGroupForm.waitUntilSaveButtonDisabled();
            expect(mediaGroupForm.getOopsRequiredFieldMessage()).to.exist;
            mediaGroupForm.getOopsRequiredFieldMessage().getText().
                then(function(getText) {
                    expect(getText).to.include(oopsRequired);
                });
            mediaGroupForm.completePlatformAdFee(account.dspFee);
            mediaGroupForm.waitUntilSaveButtonEnabled();

            expect(mediaGroupForm.getSaveButton()).to.exist;
            mediaGroupForm.clickClose();
            driver.sleep(driverTimeOut).then(() => done());
        });
});
