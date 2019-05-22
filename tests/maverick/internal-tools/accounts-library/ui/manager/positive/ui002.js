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
const title = 'Accounts';
const mediaGroupTitle = 'MEDIA GROUP NAME';

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavBar = require(rootPath + '/pages/maverick/platform/nav-bar');
let AccountsLibraryPage = require(rootPath + '/pages/maverick/' +
    'internal-tools/accounts-library');
let UsersLibrary = require(rootPath + '/pages/maverick/internal-tools/' +
    'users-library');
let usersLibrary;
let accountsLibrary;
let navBar;
let loginPage;
let account;

// fixture
const accountTestFixture =
    require(rootPath + '/fixtures/common/media-group/create001');

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE-PROD> {{MAVERICK}} /accounts-library {UI} @MANAGER >>> ' +
    '(+) verify MG accounts library ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(driverTimeOut);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBar(driver);
        usersLibrary = new UsersLibrary(driver);
        accountsLibrary = new AccountsLibraryPage(driver);
        account = Object.assign({}, accountTestFixture);
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
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display media group library page elements', function(done) {
        accountsLibrary.clickAgenciesView();
        accountsLibrary.clickMediaGroupView();
        accountsLibrary.getTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(title);
            });
        expect(accountsLibrary.getCreateAccountButton()).to.exist;
        expect(accountsLibrary.getSearchField()).to.exist;
        expect(accountsLibrary.getColumnAccountNameTitle()).to.exist;
        accountsLibrary.getColumnAccountNameTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(mediaGroupTitle);
            });
        expect(accountsLibrary.getColumnCreatedByTitle()).to.exist;
        expect(accountsLibrary.getColumnCreatedTitle()).to.exist;
        expect(accountsLibrary.getColumnUpdatedTitle()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show expected element after filtering table', function(done) {
        accountsLibrary.setSearchField(account.name);
        expect(accountsLibrary.getFirstTableName()).to.exist;
        accountsLibrary.getFirstTableName().getText().
            then(function(getText) {
                expect(getText).to.include(account.name);
            });
        expect(accountsLibrary.getFirstTableRow()).to.exist;
        expect(accountsLibrary.getLinkEdit()).to.exist;
        expect(accountsLibrary.getLinkAddAdvertiserList()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show table after removing filter added', function(done) {
        accountsLibrary.removeFilterOption(account.name);
        accountsLibrary.noRemoveFilterOptionDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        expect(accountsLibrary.getFirstTableRow()).to.exist;
        expect(accountsLibrary.getColumnAccountNameTitle()).to.exist;
        expect(accountsLibrary.getColumnCreatedByTitle()).to.exist;
        expect(accountsLibrary.getColumnCreatedTitle()).to.exist;
        expect(accountsLibrary.getColumnUpdatedTitle()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough Next table pages', function(done) {
        accountsLibrary.waitUntilNextControlButtonEnabled();
        accountsLibrary.clickNextPageTableControl();
        accountsLibrary.waitUntilFirstControlButtonEnabled();
        accountsLibrary.waitUntilPreviousControlButtonEnabled();
        expect(accountsLibrary.getSearchField()).to.exist;
        expect(accountsLibrary.getFirstTableRow()).to.exist;
        expect(accountsLibrary.getColumnAccountNameTitle()).to.exist;
        expect(accountsLibrary.getColumnCreatedByTitle()).to.exist;
        expect(accountsLibrary.getColumnCreatedTitle()).to.exist;
        expect(accountsLibrary.getColumnUpdatedTitle()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough Previous table pages', function(done) {
        accountsLibrary.clickPreviousPageTableControl();
        accountsLibrary.waitUntilFirstControlButtonDisabled();
        accountsLibrary.waitUntilPreviousControlButtonDisabled();
        expect(accountsLibrary.getSearchField()).to.exist;
        expect(accountsLibrary.getFirstTableRow()).to.exist;
        expect(accountsLibrary.getColumnAccountNameTitle()).to.exist;
        expect(accountsLibrary.getColumnCreatedByTitle()).to.exist;
        expect(accountsLibrary.getColumnCreatedTitle()).to.exist;
        expect(accountsLibrary.getColumnUpdatedTitle()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough Last table pages', function(done) {
        accountsLibrary.waitUntilLastControlButtonEnabled();
        accountsLibrary.clickLastPageTableControl();
        accountsLibrary.waitUntilLastControlButtonDisabled();
        accountsLibrary.waitUntilNextControlButtonDisabled();
        expect(accountsLibrary.getSearchField()).to.exist;
        expect(accountsLibrary.getFirstTableRow()).to.exist;
        expect(accountsLibrary.getColumnAccountNameTitle()).to.exist;
        expect(accountsLibrary.getColumnCreatedByTitle()).to.exist;
        expect(accountsLibrary.getColumnCreatedTitle()).to.exist;
        expect(accountsLibrary.getColumnUpdatedTitle()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough First table pages', function(done) {
        accountsLibrary.waitUntilFirstControlButtonEnabled();
        accountsLibrary.clickFirstPageTableControl();
        accountsLibrary.waitUntilFirstControlButtonDisabled();
        accountsLibrary.waitUntilPreviousControlButtonDisabled();
        expect(accountsLibrary.getSearchField()).to.exist;
        expect(accountsLibrary.getFirstTableRow()).to.exist;
        expect(accountsLibrary.getColumnAccountNameTitle()).to.exist;
        expect(accountsLibrary.getColumnCreatedByTitle()).to.exist;
        expect(accountsLibrary.getColumnCreatedTitle()).to.exist;
        expect(accountsLibrary.getColumnUpdatedTitle()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });
});
