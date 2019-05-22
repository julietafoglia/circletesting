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
const mochaTimeOut = 0;

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const agency = entitiesObj.agency001;
const targetAdvertiser = entitiesObj.agency001.children.advertiser001;

// selenium runtime variables
let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let usersLibrary, accountsLibrary;
let navBar, loginPage, advertiserPage, advDetsPage;
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let AdvertiserPage = require(rootPath +
     '/pages/maverick/campaign-manager/advertiser-form');
let AdvDetsPage = require(rootPath +
    '/pages/maverick/campaign-manager/advertiser-details');
let NavBar = require(rootPath + '/pages/maverick/platform/nav-bar');
let AccountsLibraryPage = require(rootPath + '/pages/maverick/' +
    'internal-tools/accounts-library');
let UsersLibrary = require(rootPath + '/pages/maverick/internal-tools/' +
    'users-library');

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');
// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/advertiser/create001');
let testData001 = Object.assign({}, testFixture);
testData001.name = targetAdvertiser.name + ' underAgc';
testData001.admin = 'QA-All user';
testData001.executive = 'QA-All user';
testData001.categoryName = 'Personal Finance';

describe('{{MAVERICK}} /advertisers {CREATE} @MANAGER >>> ' +
    '(+) create advertiser under agency account >>>', function() {
    // disable mocha time outs
    this.timeout(mochaTimeOut);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBar(driver);
        usersLibrary = new UsersLibrary(driver);
        accountsLibrary = new AccountsLibraryPage(driver);
        advertiserPage = new AdvertiserPage(driver);
        advDetsPage = new AdvDetsPage(driver);
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

    it('should create Advertiser under Agency account', function(done) {
        accountsLibrary.setSearchField(agency.refId);
        expect(accountsLibrary.getFirstTableName()).to.exist;
        accountsLibrary.getFirstTableName().getText().
            then(function(getText) {
                expect(getText).to.include(agency.name);
            });
        expect(accountsLibrary.getFirstTableRow()).to.exist;
        expect(accountsLibrary.getLinkEdit()).to.exist;
        accountsLibrary.clickAddAdvertiser();
        advertiserPage.setAdvertiserName(testData001.name);
        advertiserPage.setAdvertiserPrimaryDomain(testData001.domain);
        advertiserPage.setAdvertiserCategory(testData001.category);
        advertiserPage.setAdvertiserExecutive(testData001.executive);
        advertiserPage.setAdvertiserManager(testData001.admin);
        advertiserPage.clickAdvertiserSaveAndExit();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('advertiser should be created in adv details', function(done) {
        expect(advDetsPage.getSpanContainsText(testData001.name)).to.exist;
        expect(advDetsPage.getSpanContainsText(agency.name)).to.exist;
        expect(advDetsPage.getSpanContainsText(testData001.executive)).to.exist;
        expect(advDetsPage.getSpanContainsText(testData001.admin)).to.exist;
        expect(advDetsPage.getSpanContainsText(testData001.categoryName))
            .to.exist;
        expect(advDetsPage.getSpanContainsText(testData001.domain)).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

});
