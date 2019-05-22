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
let ForecastingDetailsPage = require(rootPath +
     '/pages/maverick/reporting/forecasting-details');
let ForecastingFormPage = require(rootPath +
     '/pages/maverick/reporting/forecasting-form');
let loginPage;
let sideBarPage;
let navBarPage;
let forecastingDetailsPage;
let forecastingFormPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE-PROD> {{MAVERICK}} /forecasting {UI} @MANAGER >>> ' +
    '(+) verify ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        sideBarPage = new SideBarPage(driver);
        navBarPage = new NavBarPage(driver);
        forecastingDetailsPage = new ForecastingDetailsPage(driver);
        forecastingFormPage = new ForecastingFormPage(driver);
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

    it('should check forecasting details elements', function(done) {
        navBarPage.clickInventoryManager();
        navBarPage.closeLastOuterDiv();
        navBarPage.closeOuterDiv();
        sideBarPage.clickForecastingLink();

        forecastingDetailsPage.getButtonCheckInventory()
            .then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should check forecasting modal elements', function(done) {
        forecastingDetailsPage.clickCheckInventory();

        forecastingFormPage.getButtonCheckAvailability()
            .then(function(element) {
                expect(element).to.exist;
            });
        forecastingFormPage.getTitleForecastInventory().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
