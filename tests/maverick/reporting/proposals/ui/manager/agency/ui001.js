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
let ProposalsDetailsPage = require(rootPath +
     '/pages/maverick/reporting/proposals-details');
let ProposalsFormPage = require(rootPath +
     '/pages/maverick/reporting/proposals-form');
let loginPage;
let navBar, sideBar;
let proposalsDetailsPage;
let proposalsFormPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE-PROD> {{MAVERICK}} /proposals {UI} @MANAGER >>> ' +
    '(+) verify ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBarPage(driver);
        sideBar = new SideBarPage(driver);
        proposalsDetailsPage = new ProposalsDetailsPage(driver);
        proposalsFormPage = new ProposalsFormPage(driver);
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

    it('should check proposals details elements', function(done) {
        navBar.clickReportingTab();
        sideBar.clickProposalsLink();
        proposalsDetailsPage.getButtonNewProposal().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should check proposals modal elements', function(done) {
        proposalsDetailsPage.clickNewProposal();

        proposalsFormPage.getButtonReviewProposal().then(function(element) {
            expect(element).to.exist;
        });
        proposalsFormPage.getSectionCard().then(function(element) {
            expect(element).to.exist;
        });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
