'use strict';
// vendor dependencies
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.admin;
const driverTimeOut = 0;
const mochaTimeOut = 0;
const timeStamp = `@${moment().format('YYYY-MM-DDTHH:mm')}`;

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
let MediaGroupDetailsPage =
    require(rootPath + '/pages/maverick/inventory-manager/media-group-details');
let usersLibrary, accountsLibrary, mediaGroupForm, navBar;
let loginPage, mediaGroupDetailsPage, account;
const pubTitle = 'Publishers';
const newslettersTitle = 'Newsletters';
const adslotsTitle = 'Ad Slots';

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

// fixture
let accountTestFixture =
    require(rootPath + '/fixtures/common/media-group/create005');
account = Object.assign({}, accountTestFixture);
account.name += timeStamp + 'pos';
account.salesforceId = timeStamp + '3';
account.dspFee = 5;
account.directSoldFee = 1;
account.monthlyMinimum = 3;

describe('<SMOKE> {{MAVERICK}} /accounts-form {CREATE} @MANAGER >>> ' +
    '(+) verify account media-group creation >>>', function() {
    // disable mocha time outs
    this.timeout(mochaTimeOut);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBar(driver);
        usersLibrary = new UsersLibrary(driver);
        accountsLibrary = new AccountsLibraryPage(driver);
        mediaGroupForm = new MediaGroupForm(driver);
        mediaGroupDetailsPage = new MediaGroupDetailsPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should navigate to Accounts at Internal Tools section', function(done) {
        loginPage.login(targetServer, targetUser);
        navBar.closeLastOuterDiv();
        navBar.closeOuterDiv();
        navBar.clickInternalTools();
        usersLibrary.clickAccountsSideBar();
        accountsLibrary.waitSpinnerUntilStale();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should create Media Group account', function(done) {
        accountsLibrary.clickCreateAccountButton();
        mediaGroupForm.selectMediaGroupType();
        mediaGroupForm.fillRequiredFields(account);
        expect(mediaGroupForm.getRTBDemandDropdown()).to.exist;
        mediaGroupForm.waitUntilSaveButtonEnabled();
        mediaGroupForm.clickSaveButton();
        mediaGroupForm.waitSpinnerUntilStale();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display created Media Group', function(done) {
        accountsLibrary.waitUntilFilterNotVisible();
        accountsLibrary.clickAgenciesView();
        accountsLibrary.clickMediaGroupView();
        accountsLibrary.setSearchField(account.name);
        expect(accountsLibrary.getFirstTableName()).to.exist;
        accountsLibrary.getFirstTableName().getText().
            then(function(getText) {
                expect(getText).to.include(account.name);
            });
        expect(accountsLibrary.getFirstTableRow()).to.exist;
        expect(accountsLibrary.getLinkEdit()).to.exist;
        expect(accountsLibrary.getLinkAddAdvertiserList()).to.exist;
        accountsLibrary.clickFirstTableName();
        expect(mediaGroupDetailsPage.getSpanContainsText(account.name))
            .to.exist;
        expect(mediaGroupDetailsPage.getSpanContainsText(account.cname))
            .to.exist;
        mediaGroupDetailsPage.getTitle(pubTitle).getText().
            then(function(getText) {
                expect(getText).to.include(pubTitle);
            });
        mediaGroupDetailsPage.getTitle(newslettersTitle).getText().
            then(function(getText) {
                expect(getText).to.include(newslettersTitle);
            });
        mediaGroupDetailsPage.getTitle(adslotsTitle).getText().
            then(function(getText) {
                expect(getText).to.include(adslotsTitle);
            });
        expect(mediaGroupDetailsPage.getCreatePublisherBtn()).to.exist;
        expect(mediaGroupDetailsPage.getPublisherTab()).to.exist;
        expect(mediaGroupDetailsPage.getAdvertiserTab()).to.exist;
        expect(mediaGroupDetailsPage.getPublisherTable()).to.exist;
        expect(mediaGroupDetailsPage.getNewsletterTable()).to.exist;
        expect(mediaGroupDetailsPage.getAdSlotsTable()).to.exist;
        account = Object.assign({}, accountTestFixture);
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate to Accounts at Internal Tools section', function(done) {
        navBar.clickInternalTools();
        usersLibrary.clickAccountsSideBar();
        accountsLibrary.waitSpinnerUntilStale();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should create Monetization contract Media Group account',
        function(done) {
            account.name += timeStamp + '7';
            account.salesforceId = timeStamp + '7';
            accountsLibrary.clickCreateAccountButton();
            mediaGroupForm.selectMediaGroupType();
            mediaGroupForm.fillMonetizationsRequiredFields(account);
            mediaGroupForm.waitUntilSaveButtonEnabled();
            mediaGroupForm.clickSaveButton();
            mediaGroupForm.waitSpinnerUntilStale();
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should display created Media Group',
        function(done) {
            accountsLibrary.clickAgenciesView();
            accountsLibrary.clickMediaGroupView();
            accountsLibrary.setSearchField(account.name);
            expect(accountsLibrary.getFirstTableName()).to.exist;
            accountsLibrary.getFirstTableName().getText().
                then(function(getText) {
                    expect(getText).to.include(account.name);
                });
            expect(accountsLibrary.getFirstTableRow()).to.exist;
            expect(accountsLibrary.getLinkEdit()).to.exist;
            expect(accountsLibrary.getLinkAddAdvertiserList()).to.exist;
            accountsLibrary.clickFirstTableName();
            expect(mediaGroupDetailsPage.getSpanContainsText(account.name))
                .to.exist;
            expect(mediaGroupDetailsPage.getSpanContainsText(account.cname))
                .to.exist;
            mediaGroupDetailsPage.getTitle(pubTitle).getText().
                then(function(getText) {
                    expect(getText).to.include(pubTitle);
                });
            mediaGroupDetailsPage.getTitle(newslettersTitle).getText().
                then(function(getText) {
                    expect(getText).to.include(newslettersTitle);
                });
            mediaGroupDetailsPage.getTitle(adslotsTitle).getText().
                then(function(getText) {
                    expect(getText).to.include(adslotsTitle);
                });
            expect(mediaGroupDetailsPage.getCreatePublisherBtn()).to.exist;
            expect(mediaGroupDetailsPage.getPublisherTab()).to.exist;
            expect(mediaGroupDetailsPage.getAdvertiserTab()).to.exist;
            expect(mediaGroupDetailsPage.getPublisherTable()).to.exist;
            expect(mediaGroupDetailsPage.getNewsletterTable()).to.exist;
            expect(mediaGroupDetailsPage.getAdSlotsTable()).to.exist;
            driver.sleep(driverTimeOut).then(() => done());
        });
});
