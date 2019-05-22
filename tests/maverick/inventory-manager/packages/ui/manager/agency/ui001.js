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
let SideBarPage = require(rootPath + '/pages/maverick/platform/side-bar');
let NavBarPage = require(rootPath + '/pages/maverick/platform/nav-bar');
let PackagesDetailsPage = require(rootPath +
     '/pages/maverick/inventory-manager/packages-details');
let PackagesFormPage = require(rootPath +
     '/pages/maverick/inventory-manager/packages-form');
let loginPage;
let sideBarPage;
let navBarPage;
let packagesDetailsPage;
let packagesFormPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE-PROD> {{MAVERICK}} /packages {UI} @MANAGER >>> ' +
    '(+) verify ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        sideBarPage = new SideBarPage(driver);
        navBarPage = new NavBarPage(driver);
        packagesDetailsPage = new PackagesDetailsPage(driver);
        packagesFormPage = new PackagesFormPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('maverick - login', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('should check packages details elements', function(done) {
        navBarPage.clickInventoryManager();
        sideBarPage.clickPackagesLink();

        packagesDetailsPage.getButtonCreatePackage()
            .then(function(element) {
                expect(element).to.exist;
            });
        packagesDetailsPage.getTitleAllPackages()
            .then(function(element) {
                expect(element).to.exist;
            });
        packagesDetailsPage.getPackagesTable()
            .then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should check packages modal elements', function(done) {
        packagesDetailsPage.clickCreatePackage();

        packagesFormPage.getButtonSavePackage()
            .then(function(element) {
                expect(element).to.exist;
            });
        packagesFormPage.getSectionCard().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
