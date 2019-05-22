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
let AgencyForm = require(rootPath + '/pages/maverick/internal-tools/' +
    'agency-form');
let AgencyDetailsPage =
    require(rootPath + '/pages/maverick/inventory-manager/agency-details');
let usersLibrary, accountsLibrary, navBar, loginPage, agencyForm;
let agencyDetailsPage, account;
const advTitle = 'Advertisers';

// fixture
let accountTestFixture =
    require(rootPath + '/fixtures/common/agency/create004');
account = Object.assign({}, accountTestFixture);
account.name += timeStamp + '11';
account.salesforceId = timeStamp + '11';
// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE> {{MAVERICK}} /accounts-form {CREATE} @MANAGER >>> ' +
    '(+) verify account agency creation >>>', function() {

    // disable mocha time outs
    this.timeout(mochaTimeOut);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBar(driver);
        usersLibrary = new UsersLibrary(driver);
        accountsLibrary = new AccountsLibraryPage(driver);
        agencyForm = new AgencyForm(driver);
        agencyDetailsPage = new AgencyDetailsPage(driver);
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

    it('should create no active Agency account', function(done) {
        accountsLibrary.clickCreateAccountButton();
        agencyForm.fillRequiredFields(account);
        agencyForm.noRTBDemandDropdown()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        agencyForm.waitUntilSaveButtonEnabled();
        agencyForm.clickSaveButton();
        agencyForm.waitSpinnerUntilStale();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display created Agency', function(done) {
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
        expect(agencyDetailsPage.getSpanContainsText(account.name))
            .to.exist;
        agencyDetailsPage.getTitle(advTitle).getText().
            then(function(getText) {
                expect(getText).to.include(advTitle);
            });
        expect(agencyDetailsPage.getCreateAdvertiserBtn()).to.exist;
        expect(agencyDetailsPage.getAdvertisersTable()).to.exist;
        account = Object.assign({}, accountTestFixture);
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate to Accounts at Internal Tools section', function(done) {
        navBar.clickInternalTools();
        usersLibrary.clickAccountsSideBar();
        accountsLibrary.waitUntilSpinnerDissapear();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should create active Agency account',
        function(done) {
            account.name += timeStamp + '13';
            account.salesforceId = timeStamp + '13';
            accountsLibrary.clickCreateAccountButton();
            agencyForm.clickAccountActivation();
            agencyForm.fillRequiredFields(account);
            agencyForm.waitUntilSaveButtonEnabled();
            agencyForm.clickSaveButton();
            agencyForm.waitUntilSpinnerDissapear();
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should display created Agency account',
        function(done) {
            accountsLibrary.setSearchField(account.name);
            expect(accountsLibrary.getFirstTableName()).to.exist;
            // accountsLibrary.getFirstTableName().getText().
            //     then(function(getText) {
            //         expect(getText).to.include(account.name);
            //     });
            expect(accountsLibrary.getFirstTableRow()).to.exist;
            expect(accountsLibrary.getLinkEdit()).to.exist;
            expect(accountsLibrary.getLinkAddAdvertiserList()).to.exist;
            accountsLibrary.clickFirstTableName();
            expect(agencyDetailsPage.getSpanContainsText(account.name))
                .to.exist;
            agencyDetailsPage.getTitle(advTitle).getText().
                then(function(getText) {
                    expect(getText).to.include(advTitle);
                });
            expect(agencyDetailsPage.getCreateAdvertiserBtn()).to.exist;
            expect(agencyDetailsPage.getAdvertisersTable()).to.exist;
            driver.sleep(driverTimeOut).then(() => done());
        });
});
