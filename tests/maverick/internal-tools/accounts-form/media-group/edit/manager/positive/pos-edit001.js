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
let usersLibrary;
let accountsLibrary;
let navBar;
let loginPage;
let newAccount;
let editTitle = 'Edit Account';
let mediaGroupForm;
let mediaGroupDetailsPage;
let newUiExecutive = 'Alice Chen';
let newUiManager = 'Ingrid Becker';
let newCName = 'li.1sale.com';

// bootstrap variables
const entitiesObject = require(rootPath + '/bootstrap/entities-ssp.json');
let mediaGroup = entitiesObject.manager.mediaGroup001;
// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');
// fixture
let accountTestFixture =
    require(rootPath + '/fixtures/common/media-group/create005');
newAccount = Object.assign({}, accountTestFixture);
newAccount.name += timeStamp + '4';
newAccount.executiveName = newUiExecutive;
newAccount.managerName = newUiManager;
newAccount.salesforceId = timeStamp + '15';
newAccount.cname = newCName;

describe('<SMOKE> {{MAVERICK}} /accounts-form {EDIT} @MANAGER >>> ' +
    '(+) verify account media-group edition >>>', function() {
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

    it('should edit Media Group account', function(done) {
        accountsLibrary.clickAgenciesView();
        accountsLibrary.clickMediaGroupView();
        accountsLibrary.setSearchField(mediaGroup.refId);
        accountsLibrary.getFirstTableName().getText().
            then(function(getText) {
                expect(getText).to.include(mediaGroup.name);
            });
        expect(accountsLibrary.getFirstTableName()).to.exist;
        accountsLibrary.clickEditAccount();
        mediaGroupForm.waitUntilSaveButtonEnabled();
        mediaGroupForm.getEditTitle().getText().
            then(function(getText) {
                expect(getText).to.include(editTitle);
            });
        mediaGroupForm.editRequiredFields(newAccount);
        expect(mediaGroupForm.getRTBDemandDropdown()).to.exist;
        mediaGroupForm.waitUntilSaveButtonEnabled();
        mediaGroupForm.clickSaveButton();
        mediaGroupForm.waitSpinnerUntilStale();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should access detail edited Media Group account', function(done) {
        driver.navigate().refresh();
        accountsLibrary.waitSpinnerUntilStale();
        accountsLibrary.clickAgenciesView();
        accountsLibrary.clickMediaGroupView();
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
        expect(mediaGroupDetailsPage.getSpanContainsText(newAccount.name))
            .to.exist;
        expect(mediaGroupDetailsPage.getSpanContainsText(newAccount.cname))
            .to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate to Accounts at Internal Tools section', function(done) {
        navBar.clickInternalTools();
        usersLibrary.clickAccountsSideBar();
        accountsLibrary.waitSpinnerUntilStale();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should edit back Media Group account', function(done) {
        accountsLibrary.clickAgenciesView();
        accountsLibrary.clickMediaGroupView();
        accountsLibrary.setSearchField(newAccount.name);
        expect(accountsLibrary.getFirstTableName()).to.exist;
        accountsLibrary.getFirstTableName().getText().
            then(function(getText) {
                expect(getText).to.include(newAccount.name);
            });
        accountsLibrary.clickEditAccount();
        mediaGroupForm.waitUntilSaveButtonEnabled();
        mediaGroupForm.getEditTitle().getText().
            then(function(getText) {
                expect(getText).to.include(editTitle);
            });
        mediaGroupForm.editRequiredFields(mediaGroup);
        mediaGroupForm.waitUntilSaveButtonEnabled();
        mediaGroupForm.clickSaveButton();
        mediaGroupForm.waitSpinnerUntilStale();
        driver.sleep(driverTimeOut).then(() => done());
    });
});
