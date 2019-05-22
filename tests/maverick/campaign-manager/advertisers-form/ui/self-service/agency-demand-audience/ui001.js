'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;


// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment = require(rootPath +
    '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002.children.agencyUser001;
const driverTimeOut = 0;

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdvertiser = entitiesObj.agency002.children.advertiser001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let basePage;
let loginPage;
let advertiserPage;
let advDetsPage;
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let BasePage = require(rootPath + '/pages/maverick/index');
let AdvertiserPage = require(rootPath +
     '/pages/maverick/campaign-manager/advertiser-form');
let AdvDetsPage = require(rootPath +
     '/pages/maverick/campaign-manager/advertiser-details');

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /advertisers {ui} @SS-AGENCY >>> ' +
    '(+) verify edit page ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        basePage = new BasePage(driver);
        advertiserPage = new AdvertiserPage(driver);
        advDetsPage = new AdvDetsPage(driver);
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

    it('should navigate to advertiser page', function(done) {
        basePage.navigate(targetServer, 'advertisers', targetAdvertiser.refId);
        advDetsPage.clickEditAdv();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should check ui elements', function(done) {
        advertiserPage.getInputName().then(function(element) {
            expect(element).to.exist;
        });
        advertiserPage.getInputCateg().then(function(element) {
            expect(element).to.exist;
        });
        advertiserPage.getInputSecCateg().then(function(element) {
            expect(element).to.exist;
        });
        advertiserPage.getInputPrimaryDomain().then(function(element) {
            expect(element).to.exist;
        });
        advertiserPage.getLinkLiveRamp().then(function(element) {
            expect(element).to.exist;
        });
        advertiserPage.getLinkDomainBlock().then(function(element) {
            expect(element).to.exist;
        });
        advertiserPage.getLinkLabel().then(function(element) {
            expect(element).to.exist;
        });
        advertiserPage.getCheckSupressAds().then(function(element) {
            expect(element).to.exist;
        });
        advertiserPage.getButtonSaveAndExit().then(function(element) {
            expect(element).to.exist;
        });
        advertiserPage.getTextAgency().getAttribute('class').
            then(function(element) {
                expect(element).to
                    .contain('readonly-text');
            });
        advertiserPage.getTextAccountManagerExternal().getAttribute('class').
            then(function(element) {
                expect(element).to
                    .contain('readonly-text');
            });
        advertiserPage.clickClose();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });


    it('should go back to adv details page', function(done) {
        advDetsPage.getAdvTitle(targetAdvertiser.name)
            .then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
