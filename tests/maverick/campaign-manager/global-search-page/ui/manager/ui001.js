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

// bootstrap variables
const entitiesFile =
    require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv = entitiesObj.agency001.children.advertiser001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath +
    '/pages/maverick/platform/login');
let GlobalSearchPage = require(rootPath +
    '/pages/maverick/campaign-manager/global-search-page');
let loginPage;
let globalSearchPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /campaign-manager/' +
    'global-search-page {ui} @MANAGER >>> ' +
    '(+) verify ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        globalSearchPage = new GlobalSearchPage(driver);
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

    it('global search field should be displayed', function(done) {
        expect(globalSearchPage.getInputSearch()).to.exist;
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should show message if no results after search', function(done) {
        globalSearchPage.setInputSearch('XOXOXOXO');
        expect(globalSearchPage.getTextDdnNoResults()).to.exist;
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should perform non-agency adv search by name', function(done) {
        globalSearchPage.setInputSearch(targetAdv.name);
        expect(globalSearchPage.getAdvertiserLink(targetAdv.name)).to.exist;
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should navigate to non-agency adv details page', function(done) {
        globalSearchPage.clickAdvertiser(targetAdv.name);
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should perform agency adv search by ID', function(done) {
        globalSearchPage.setInputSearch(targetAdv.refId);
        expect(globalSearchPage.getAdvertiserLink(targetAdv.name)).to.exist;
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should perform agency adv search by name', function(done) {
        globalSearchPage.setInputSearch(targetAdv.name);
        expect(globalSearchPage.getAdvertiserLink(targetAdv.name)).to.exist;
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should navigate to agency adv details page', function(done) {
        globalSearchPage.clickAdvertiser(targetAdv.name);
        expect(globalSearchPage.getEditAdv()).to.exist;
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
