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
const titleUsers = 'Users';
const userToSearch = 'qa-all';
const expectedUserResult = 'QA-All';

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavBar = require(rootPath + '/pages/maverick/platform/nav-bar');
let UsersLibrary = require(rootPath + '/pages/maverick/' +
    'internal-tools/users-library');
let usersLibrary;
let navBar;
let loginPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE-PROD> {{MAVERICK}} /users-library {UI} @MANAGER >>> ' +
    '(+) verify users library ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBar(driver);
        usersLibrary = new UsersLibrary(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should navigate to Internal Tools section', function(done) {
        loginPage.login(targetServer, targetUser);
        navBar.clickInternalTools();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display all users page elements', function(done) {
        usersLibrary.getTitleUsers().getText().
            then(function(getText) {
                expect(getText).to.equal(titleUsers);
            });
        expect(usersLibrary.getCreateNewUserButton()).to.exist;
        expect(usersLibrary.getInputSearch()).to.exist;
        expect(usersLibrary.getTable()).to.exist;
        expect(usersLibrary.getColumnFirstNameTitle()).to.exist;
        expect(usersLibrary.getColumnLastNameTitle()).to.exist;
        expect(usersLibrary.getColumnEmailTitle()).to.exist;
        expect(usersLibrary.getColumnCreatedTitle()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show expected element after filtering table', function(done) {
        usersLibrary.setInputSearch(userToSearch);
        usersLibrary.waitUntilFilterNotVisible();
        expect(usersLibrary.getFirstNameOnTable()).to.exist;
        usersLibrary.getFirstNameOnTable().getText().
            then(function(getText) {
                expect(getText).to.equal(expectedUserResult);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show table after removing filter added', function(done) {
        usersLibrary.removeFilterOption(userToSearch);
        usersLibrary.noRemoveFilterOptionDisplayed(userToSearch)
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        expect(usersLibrary.getTable()).to.exist;
        expect(usersLibrary.getColumnFirstNameTitle()).to.exist;
        expect(usersLibrary.getColumnLastNameTitle()).to.exist;
        expect(usersLibrary.getColumnEmailTitle()).to.exist;
        expect(usersLibrary.getColumnCreatedTitle()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough Next table pages', function(done) {
        usersLibrary.waitUntilNextControlButtonEnabled();
        usersLibrary.clickNextPageTableControl();
        usersLibrary.waitUntilFirstControlButtonEnabled();
        usersLibrary.waitUntilPreviousControlButtonEnabled();
        expect(usersLibrary.getInputSearch()).to.exist;
        expect(usersLibrary.getTable()).to.exist;
        expect(usersLibrary.getColumnFirstNameTitle()).to.exist;
        expect(usersLibrary.getColumnLastNameTitle()).to.exist;
        expect(usersLibrary.getColumnEmailTitle()).to.exist;
        expect(usersLibrary.getColumnCreatedTitle()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough Previous table pages', function(done) {
        usersLibrary.clickPreviousPageTableControl();
        usersLibrary.waitUntilFirstControlButtonDisabled();
        usersLibrary.waitUntilPreviousControlButtonDisabled();
        expect(usersLibrary.getInputSearch()).to.exist;
        expect(usersLibrary.getTable()).to.exist;
        expect(usersLibrary.getColumnFirstNameTitle()).to.exist;
        expect(usersLibrary.getColumnLastNameTitle()).to.exist;
        expect(usersLibrary.getColumnEmailTitle()).to.exist;
        expect(usersLibrary.getColumnCreatedTitle()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough Last table pages', function(done) {
        usersLibrary.waitUntilLastControlButtonEnabled();
        usersLibrary.clickLastPageTableControl();
        usersLibrary.waitUntilLastControlButtonDisabled();
        usersLibrary.waitUntilNextControlButtonDisabled();
        expect(usersLibrary.getInputSearch()).to.exist;
        expect(usersLibrary.getTable()).to.exist;
        expect(usersLibrary.getColumnFirstNameTitle()).to.exist;
        expect(usersLibrary.getColumnLastNameTitle()).to.exist;
        expect(usersLibrary.getColumnEmailTitle()).to.exist;
        expect(usersLibrary.getColumnCreatedTitle()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough First table pages', function(done) {
        usersLibrary.waitUntilFirstControlButtonEnabled();
        usersLibrary.clickFirstPageTableControl();
        usersLibrary.waitUntilFirstControlButtonDisabled();
        usersLibrary.waitUntilPreviousControlButtonDisabled();
        expect(usersLibrary.getInputSearch()).to.exist;
        expect(usersLibrary.getTable()).to.exist;
        expect(usersLibrary.getColumnFirstNameTitle()).to.exist;
        expect(usersLibrary.getColumnLastNameTitle()).to.exist;
        expect(usersLibrary.getColumnEmailTitle()).to.exist;
        expect(usersLibrary.getColumnCreatedTitle()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });
});
