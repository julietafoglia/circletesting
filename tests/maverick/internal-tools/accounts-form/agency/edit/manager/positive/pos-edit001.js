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
let usersLibrary, accountsLibrary, navBar, loginPage;
let agencyForm, agencyDetailsPage;
let newAccount;
let editTitle = 'Edit Account';
let newUiManager = 'Ingrid Becker';

// bootstrap variables
const entitiesObject = require(rootPath + '/bootstrap/entities-dsp.json');
let agency = entitiesObject.agency001;
// fixture
let accountTestFixture =
    require(rootPath + '/fixtures/common/agency/create002');
newAccount = Object.assign({}, accountTestFixture);
newAccount.name += timeStamp + '1';
newAccount.managerName = newUiManager;
newAccount.salesforceId += timeStamp;
newAccount.dspFee = 2;
agency.dspFee = 3;
// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE> {{MAVERICK}} /accounts-form {EDIT} @MANAGER >>> ' +
    '(+) verify account agency edition >>>', function() {

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

    it('should edit Agency account', function(done) {
        accountsLibrary.setSearchField(agency.refId);
        accountsLibrary.waitUntilFilterNotVisible();
        expect(accountsLibrary.getFirstTableName()).to.exist;
        accountsLibrary.clickEditAccount();
        agencyForm.waitOverlayUntilStale();
        agencyForm.getEditTitle().getText()
            .then(function(getText) {
                expect(getText).to.include(editTitle);
            });
        agencyForm.getSalesforceIdContent()
            .then(function(text) {
                agency['salesforceId'] = text;
            });
        agencyForm.getPlatformAdFeeContent()
            .then(function(text) {
                agency['contract'] = {'dspFee' : text};
            });
        agencyForm.noRTBDemandDropdown()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        agencyForm.editRequiredFields(newAccount);
        agencyForm.waitUntilSaveButtonEnabled();
        agencyForm.clickSaveButton();
        agencyForm.waitSpinnerUntilStale();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should access detail edited Agency account', function(done) {
        driver.navigate().refresh();
        accountsLibrary.waitSpinnerUntilStale();
        accountsLibrary.setSearchField(newAccount.name);
        expect(accountsLibrary.getFirstTableName()).to.exist;
        accountsLibrary.getFirstTableName().getText().
            then(function(getText) {
                expect(getText).to.include(newAccount.name);
            });
        expect(accountsLibrary.getFirstTableRow()).to.exist;
        expect(accountsLibrary.getLinkEdit()).to.exist;
        expect(accountsLibrary.getLinkAddAdvertiserList()).to.exist;
        accountsLibrary.clickFirstTableName();
        expect(agencyDetailsPage.getSpanContainsText(newAccount.name))
            .to.exist;
        expect(agencyDetailsPage.getSpanContainsText(
            agency.refId)).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate to Accounts at Internal Tools section', function(done) {
        navBar.clickInternalTools();
        usersLibrary.clickAccountsSideBar();
        accountsLibrary.waitSpinnerUntilStale();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should edit back Agency account', function(done) {
        accountsLibrary.setSearchField(newAccount.name);
        expect(accountsLibrary.getFirstTableName()).to.exist;
        accountsLibrary.getFirstTableName().getText().
            then(function(getText) {
                expect(getText).to.include(newAccount.name);
            });
        accountsLibrary.clickEditAccount();
        agencyForm.waitUntilSaveButtonEnabled();
        agencyForm.getEditTitle().getText().
            then(function(getText) {
                expect(getText).to.include(editTitle);
            });
        agencyForm.editRequiredFields(agency);
        agencyForm.waitUntilSaveButtonEnabled();
        agencyForm.clickSaveButton();
        driver.sleep(driverTimeOut).then(() => done());
    });
});
