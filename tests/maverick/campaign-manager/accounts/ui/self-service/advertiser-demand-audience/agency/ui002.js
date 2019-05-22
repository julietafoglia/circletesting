'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment = require(rootPath +
    '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002
    .children.advertiser001
    .children.advertiserUser001;

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv = entitiesObj.agency002.children.advertiser001;

// selenium runtime variables
let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime

let BasePage = require(rootPath + '/pages/maverick/index');
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavItems = require(rootPath + '/pages/maverick/platform/nav-bar');
let DashboardPage = require(rootPath + '/pages/maverick/' +
    'campaign-manager/campaign-dashboard');
let loginPage;
let navItems;
let dashboardPage;
let basePage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /accounts {ui} @SS-AGENCY-ADVERTISER >>> ' +
    '(+) verify advertiser ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navItems = new NavItems(driver);
        dashboardPage = new DashboardPage(driver);
        basePage = new BasePage(driver);
        driver.manage().deleteAllCookies().then(()=> {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should login to maverick', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('should access accounts page', function(done) {
        navItems.accessAccountsPage()
            .then(() => done());
    });

    it('should assert selected Advertiser displayed', function(done) {
        basePage.getLinkText(targetAdv.name).then(() => done());
    });

    it('should continue to Dashboard', function(done) {
        navItems.clickCampaignManager()
            .then(() => done());
    });

    it('should assert dashboard elements', function(done) {
        dashboardPage.getCampaignsTable();
        dashboardPage.getNeedsAttentionLink();
        dashboardPage.getEndingSoonLink();
        dashboardPage.getViewAllDropdown();
        dashboardPage.getViewAllSearch();
        driver.sleep(0).then(() => done());
    });

    it('should assert first added item is displayed', function(done) {
        navItems.getAdvertiserInTable(targetAdv.name)
            .then(function(element) {
                expect(element).to.exist;
                done();
            });
    });

    it('should display total of selected accouts', function(done) {
        navItems.getAdvertiserCount().getText()
            .then(function(element) {
                expect(element).to.equal('1 ACCOUNT');
                done();
            });
    });

});
