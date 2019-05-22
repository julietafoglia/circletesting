'use strict';
// vendor dependencies
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.admin;
const driverTimeOut = 0;
const mochaTimeOut = 0;
const timeStamp = `@${moment().format('YYYY-MM-DDTHH:mm')}`;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavBar = require(rootPath + '/pages/maverick/platform/nav-bar');
let AccountsLibraryPage = require(rootPath + '/pages/maverick/' +
    'internal-tools/accounts-library');
let UsersLibrary = require(rootPath + '/pages/maverick/internal-tools/' +
    'users-library');
let PublisherFormPage =
    require(rootPath + '/pages/maverick/inventory-manager/publisher-form');
let DashboardPage =
    require(rootPath + '/pages/maverick/inventory-manager/dashboard');
let PublisherDetailsPage =
    require(rootPath + '/pages/maverick/inventory-manager/publisher-details');
let usersLibrary, accountsLibrary, dashboardPage, publisherDetailsPage;
let navBar, loginPage, publisherFormPage;
let publisher;

// bootstrap variables
const entitiesObject = require(rootPath + '/bootstrap/entities-ssp.json');
let mediaGroup = entitiesObject.manager.mediaGroup001;
// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');
// fixture
let publisherFixture =
    require(rootPath + '/fixtures/maverick/publisher/create001');
publisher = Object.assign({}, publisherFixture);
publisher.name += timeStamp + 'underMG';
publisherFixture['managerName'] = 'QA-All user';
publisherFixture['executiveName'] = 'QA-All user';

describe('{{MAVERICK}} internal tools - publisher {create} @ADMIN >>> ' +
    '(+) basic required fields under media group account >>>', function() {
    // disable mocha time outs
    this.timeout(mochaTimeOut);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBar(driver);
        usersLibrary = new UsersLibrary(driver);
        accountsLibrary = new AccountsLibraryPage(driver);
        dashboardPage = new DashboardPage(driver);
        publisherDetailsPage = new PublisherDetailsPage(driver);
        publisherFormPage = new PublisherFormPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should navigate to Accounts at Internal Tools section', function(done) {
        loginPage.login(targetServer, targetUser);
        navBar.clickInternalTools();
        usersLibrary.clickAccountsSideBar();
        accountsLibrary.waitUntilSpinnerDissapear();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should open create Publisher under Media Group account', function(done) {
        accountsLibrary.clickAgenciesView();
        accountsLibrary.clickMediaGroupView();
        accountsLibrary.setSearchField(mediaGroup.refId);
        accountsLibrary.getFirstTableName().getText().
            then(function(getText) {
                expect(getText).to.include(mediaGroup.name);
            });
        expect(accountsLibrary.getFirstTableName()).to.exist;
        accountsLibrary.clickMoreLink();
        accountsLibrary.clickAddPublisher();
        driver.sleep(driverTimeOut).then(() => done());
    });    

    it('should create Publisher under Media Group account', function(done) {
        publisherFormPage.waitUntilSpinnerDissapear();
        publisherFormPage
            .enterPubName(publisher.name)
            .enterPrimaryDomain(publisher.domain)
            .selectESP(publisher.esp)
            .completeCName(publisher.cname)
            .pickIabCategory(publisher.category)
            .clickPubName()
            .saveAndExit()
            .then(() => {
                done();
            }, (err) => {
                done(err);
            });
    });

    it('should access to created Publisher', function(done) {
        publisherFormPage.waitSpinnerUntilStale();
        navBar.clickInventoryManager();
        dashboardPage.waitUntilSpinnerNotVisible();
        dashboardPage.setSearchField(publisher.name);
        dashboardPage.waitUntilLoaderNotVisible();
        dashboardPage.openFirstEntity(publisher.name);
        expect(publisherDetailsPage.getPublisherName()).to.exist;
        publisherDetailsPage.getPublisherName().
            then(function(getText) {
                expect(getText).to.include(publisher.name);
            });
        publisherDetailsPage.getPrimaryIabCategory().
            then(function(getText) {
                expect(getText).to.include(publisher.category
                    .replace(/IAB.+:\s/, ''));
            });
        publisherDetailsPage.getCName().
            then(function(getText) {
                expect(getText).to.include(publisher.cname);
            });
        publisherDetailsPage.getPrimaryDomain().
            then(function(getText) {
                expect(getText).to.include(publisher.domain);
            });
        publisherDetailsPage.getLabel().
            then(function(getText) {
                expect(getText).to.include('\u2014');
            });
        publisherDetailsPage.getIabBlacklist().
            then(function(getText) {
                expect(getText).to.include('\u2014');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });
});
