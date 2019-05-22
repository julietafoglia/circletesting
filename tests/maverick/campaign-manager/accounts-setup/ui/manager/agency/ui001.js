'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.platform;
const driverTimeout = 0;

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv1 = entitiesObj.agency001.children.advertiser001;
const targetAdv2 = entitiesObj.mediaGroup001.children.advertiser001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let SetupPage = require(rootPath + '/pages/maverick/platform/accounts-setup');
let NavItems = require(rootPath + '/pages/maverick/platform/nav-bar');
let AccountsPage = require(rootPath + '/pages/maverick/platform/accounts');
let loginPage;
let setupPage;
let navItems;
let accountsPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

// test variables
let firstResultName;
let secondResultName;
let firstResultId;
let secondResultId;
const FIRST_ADVERTISER = targetAdv1.name;
const SECOND_ADVERTISER = targetAdv2.name;

describe('{{MAVERICK}} /accounts-setup {ui} @MANAGER >>> ' +
    '(+) verify ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        setupPage = new SetupPage(driver);
        navItems = new NavItems(driver);
        accountsPage = new AccountsPage(driver);
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

    it('Should open the Choose Advertiser modal', function(done) {
        navItems.accessAccountsPage();
        setupPage.clickSelectAccounts().then(() => done());
    });

    it('should fetch and add first text result name and id', function(done) {
        setupPage.setAdvInput(FIRST_ADVERTISER.substring(0, 10));
        setupPage.setAdvInputNoClear(FIRST_ADVERTISER.substring(10, 23));
        setupPage.getFirstName().getText()
            .then(function(text) {
                firstResultName = text;
            });
        setupPage.getFirstID().getText()
            .then(function(text) {
                firstResultId = text;
            });
        setupPage.clickFirstResult();
        driver.sleep(driverTimeout).then(() => done());
    });

    it('should show correct number of selections', function(done) {
        setupPage.getSelectedTotal().getText()
            .then(function(text) {
                expect(text).to.equal('1');
            });
        driver.sleep(driverTimeout).then(() => done());
    });

    it('should assert first selected Advertiser was added', function(done) {
        expect(setupPage.getSelectedName(firstResultName)).to.exist;
        expect(setupPage.getSelectedId(firstResultId)).to.exist;
        driver.sleep(driverTimeout).then(() => done());
    });

    it('should continue to Dashboard', function(done) {
        setupPage.clickAddAccounts();
        navItems.clickCampaignManager();
        driver.sleep(driverTimeout).then(() => done());
    });

    it('should display total of selected accouts', function(done) {
        navItems.getAdvertiserCount().getText()
            .then(function(element) {
                expect(element).to.equal('1 ACCOUNT');
            });
        driver.sleep(driverTimeout).then(() => done());
    });

    it('should access accounts page', function(done) {
        navItems.accessAccountsPage();
        driver.sleep(driverTimeout).then(() => done());
    });

    it('should open advertisers modal', function(done) {
        accountsPage.clickAddMoreAdvertisers();
        driver.sleep(driverTimeout).then(() => done());
    });

    it('should fetch and add second text result and id', function(done) {
        setupPage.setAdvInput(SECOND_ADVERTISER.substring(0, 10));
        setupPage.setAdvInputNoClear(SECOND_ADVERTISER.substring(10, 23));

        setupPage.getFirstName().getText()
            .then(function() {
                secondResultName = targetAdv2.name;
            });

        setupPage.getFirstID().getText()
            .then(function() {
                secondResultId = 'ID: ' + targetAdv2.refId;
            });

        setupPage.clickDivText(targetAdv2.name);
        driver.sleep(driverTimeout).then(() => done());
    });

    it('should assert second selected Advertiser was added', function(done) {
        expect(setupPage.getSelectedName(secondResultName)).to.exist;
        expect(setupPage.getSelectedId(secondResultId)).to.exist;
        driver.sleep(driverTimeout).then(() => done());
    });

    it('should continue to Dashboard', function(done) {
        setupPage.returnToAccounts();
        driver.sleep(driverTimeout).then(() => done());
    });

    it('should display total of selected accouts', function(done) {
        navItems.getAdvertiserCount().getText()
            .then(function(element) {
                expect(element).to.equal('2 ACCOUNTS');
            });
        driver.sleep(driverTimeout).then(() => done());
    });

    it('should remove first result page', function(done) {
        accountsPage.closeAlert();
        accountsPage.removeAdvertiser(firstResultId);
        driver.sleep(driverTimeout).then(() => done());
    });

    it('should remove second result page', function(done) {
        accountsPage.closeAlert();
        accountsPage.removeAdvertiser(secondResultId);
        driver.sleep(driverTimeout).then(() => done());
    });
});
