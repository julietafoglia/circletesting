'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.platform;
const driverTimeOut = 0;
const twoSecTO = 2000;

// selenium runtime variables
let driver; // initialized during test runtime

//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let SetupPage = require(rootPath + '/pages/maverick/' +
    'platform/accounts-setup');
let DashboardPage = require(rootPath + '/pages/maverick/' +
    'campaign-manager/campaign-dashboard');
let loginPage;
let setupPage;
let dashboardPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE-PROD> {{MAVERICK}} /accounts {ui} @MANAGER >>> ' +
    '(+) verify ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        setupPage = new SetupPage(driver);
        dashboardPage = new DashboardPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should navigate to Maverick Login page', function(done){
        loginPage.navigate(targetServer);
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should assert login elements', function(done) {
        loginPage.getUsernameField();
        loginPage.getPasswordField();
        loginPage.getLoginButton();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should login to maverick', function(done) {
        loginPage
            .enterUsername(targetUser.username)
            .enterPassword(targetUser.password)
            .clickLoginBtn()
            .then(() => {
                done();
            }, (err) => {
                done(err);
            });
    });

    it('should show zero state page', function(done) {
        dashboardPage.clickSelectedAdvertisers();
        setupPage.getNoAccountsText();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should open the Choose Advertiser modal', function(done) {
        setupPage.navigateToSetup()
            .then(() => done());
    });

    it('should show Choose Advertiser modal elements', function(done) {
        setupPage.clickSelectAccounts();
        setupPage.getChooseAdvertiserInput();
        setupPage.getAddAdvertisers();
        setupPage.getCancelAdvertiserModal();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('verify exact match of Advertiser Name', function(done) {
        setupPage.setAdvInput('LiveIntent (Placeholder)');
        driver.sleep(twoSecTO); // waiting for the table to refresh 
        setupPage.getDivText('LiveIntent (Placeholder)').then(function(text) {
            expect(text).to.exist;
        })
            .then(() => done());
    });

    it('verify exact match of Acc Manager First Name', function(done) {
        setupPage.setAdvInput('Helen');
        driver.sleep(twoSecTO); // waiting for the table to refresh
        setupPage.getFirstAccMngr().getText()
            .then(function(text) {
                text = text.split(' ')[0];
                expect(text).to.equal('Helen');
            })
            .then(() => done());
    });

    it('verify exact match of Acc Manager Last Name', function(done) {
        setupPage.setAdvInput('Chung');
        driver.sleep(twoSecTO); // waiting for the table to refresh
        setupPage.getFirstAccMngr().getText()
            .then(function(text) {
                text = text.split(' ')[1];
                expect(text).to.equal('Chung');
            })
            .then(() => done());
    });

    it('verify exact match of Acc Exec First Name', function(done) {
        setupPage.setAdvInput('Boardman');
        driver.sleep(twoSecTO); // waiting for the table to refresh
        setupPage.getFirstAccExec().getText()
            .then(function(text) {
                text = text.split(' ')[0];
                expect(text).to.equal('Adam');
            })
            .then(() => done());
    });

    it('verify exact match of Acc Exec Last Name', function(done) {
        setupPage.setAdvInput('Boardman');
        driver.sleep(twoSecTO); // waiting for the table to refresh
        setupPage.getFirstAccExec().getText()
            .then(function(text) {
                text = text.split(' ')[1];
                expect(text).to.equal('Boardman');
            })
            .then(() => done());
    });
});
