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

let driver; // initialized during test runtime

let DashboardPage = require(rootPath + '/pages/maverick/' +
    'campaign-manager/campaign-dashboard');
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavItems = require(rootPath + '/pages/maverick/platform/nav-bar');
let loginPage;
let navItems;
let dashboardPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /campaign-dashboard {UI} @SS-AGENCY >>> ' +
    '(+) verify dashboard ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navItems = new NavItems(driver);
        dashboardPage = new DashboardPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should login to maverick', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('should assert nav items', function(done) {
        expect(navItems.getHomeButton()).to.exist;
        expect(navItems.getSearchBox()).to.exist;
        expect(navItems.getProfileDropdown()).to.exist;
        driver.sleep(0).then(() => done());
    });

    it('should assert dashboard elements', function(done) {
        expect(dashboardPage.getCampaignsTable()).to.exist;
        expect(dashboardPage.getNeedsAttentionLink()).to.exist;
        expect(dashboardPage.getEndingSoonLink()).to.exist;
        expect(dashboardPage.getViewAllDropdown()).to.exist;
        expect(dashboardPage.getInputSearch()).to.exist;
        driver.sleep(0).then(() => done());
    });

    it('should assert Advertiser table elements', function(done) {
        expect(dashboardPage.getAdvertiserHeader()).to.exist;
        expect(dashboardPage.getAgencyHeader()).to.exist;
        expect(dashboardPage.getAccManagerHeader()).to.exist;
        expect(dashboardPage.getAccExecHeader()).to.exist;
        expect(dashboardPage.getCreated()).to.exist;
        driver.sleep(0).then(() => done());
    });

    it('should search Advertiser by id', function(done) {
        dashboardPage.setInputSearch(targetAdv.refId);
        dashboardPage.getLinkText(targetAdv.name);
        dashboardPage.getSpan('Showing 1 - 1 (1)');
        driver.sleep(0).then(() => done());
    });

});
