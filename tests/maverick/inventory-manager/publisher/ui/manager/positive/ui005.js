'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const driverBuilder = require(rootPath + '/helpers/driver-builder');
const driverTimeOut = 0;

//  Page object(s)
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let DashboardPage =
    require(rootPath + '/pages/maverick/inventory-manager/dashboard');
let AdSlotDetailsPage =
    require(rootPath + '/pages/maverick/inventory-manager/ad-slot-details');

// Bootstrap
const entitiesFile =
    require(rootPath + '/bootstrap/entities-ssp.json');
const entitiesObj = entitiesFile;
const targetMediaGroup = entitiesObj.manager.mediaGroup001;
const targetPublisher = targetMediaGroup.publisher001;
const targetNewsletter = targetPublisher.newsletter001;
const targetAdSlot = targetNewsletter.adSlot1;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const targetEndpoint =
    require(rootPath + '/config/maverick/endpoints');
const targetEnvironmentUsers =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = targetEnvironmentUsers.admin;

// shared test variable(s)
let driver;
let adSlotName = 'Product Listing OCC';
let adSlotId = 'ID: 273813';
let publisherTitle = 'PUBLISHER';
let newsletterTitle = 'NEWSLETTER';
let adslotTitle = 'AD SLOT';
let statusTitle = 'STATUS';
let sizeTitle = 'SIZE';
let adTypeTitle = 'AD TYPE';
let createdTitle = 'CREATED';
let lastUpdTitle = 'LAST UPDATED';

// page objects
let dashboardPage, loginPage, adSlotDetailsPage;

describe('<SMOKE-PROD> {{MAVERICK}} inventory manager - Ad Slots ' +
    'inventory library >>> (+) basic ui validation >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        adSlotDetailsPage = new AdSlotDetailsPage(driver);
        dashboardPage = new DashboardPage(driver);
        driver.manage().deleteAllCookies().then( () => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should login to maverick', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('should navigate to inventory library page', (done) => {
        let url = targetServer + targetEndpoint.inventoryDashboard;
        dashboardPage.goto(url);
        dashboardPage.waitUntilSpinnerNotVisible();
        expect(dashboardPage.getCreatePublisherButton()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show Ad Slot table', (done) => {
        dashboardPage.selectFromSelectedAccounts();
        dashboardPage.selectAdSlotsView();
        expect(dashboardPage.getFirstColumnTitle()).to.exist;
        dashboardPage.getFirstColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(adslotTitle);
            });
        expect(dashboardPage.getSecondColumnTitle()).to.exist;
        dashboardPage.getSecondColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(newsletterTitle);
            });
        expect(dashboardPage.getThirdColumnTitle()).to.exist;
        dashboardPage.getThirdColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(publisherTitle);
            });
        expect(dashboardPage.getFourthColumnTitle()).to.exist;
        dashboardPage.getFourthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(statusTitle);
            });
        expect(dashboardPage.getFifthColumnTitle()).to.exist;
        dashboardPage.getFifthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(sizeTitle);
            });
        expect(dashboardPage.getSixthColumnTitle()).to.exist;
        dashboardPage.getSixthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(adTypeTitle);
            });
        expect(dashboardPage.getSeventhColumnTitle()).to.exist;
        dashboardPage.getSeventhColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(createdTitle);
            });
        expect(dashboardPage.getEighthColumnTitle()).to.exist;
        dashboardPage.getEighthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(lastUpdTitle);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show expected element after filtering table', function(done) {
        dashboardPage.setSearchField(adSlotName);
        dashboardPage.waitUntilFilterNotVisible();
        expect(dashboardPage.getFirstTableName()).to.exist;
        dashboardPage.getFirstTableName().getText().
            then(function(getText) {
                expect(getText).to.include(adSlotName);
            });
        expect(dashboardPage.getFirstTableRow()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show table after removing filter added', function(done) {
        dashboardPage.removeFilterOption();
        dashboardPage.noRemoveFilterOptionDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        expect(dashboardPage.getFirstTableRow()).to.exist;
        expect(dashboardPage.getFirstColumnTitle()).to.exist;
        dashboardPage.getFirstColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(adslotTitle);
            });
        expect(dashboardPage.getSecondColumnTitle()).to.exist;
        dashboardPage.getSecondColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(newsletterTitle);
            });
        expect(dashboardPage.getThirdColumnTitle()).to.exist;
        dashboardPage.getThirdColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(publisherTitle);
            });
        expect(dashboardPage.getFourthColumnTitle()).to.exist;
        dashboardPage.getFourthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(statusTitle);
            });
        expect(dashboardPage.getFifthColumnTitle()).to.exist;
        dashboardPage.getFifthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(sizeTitle);
            });
        expect(dashboardPage.getSixthColumnTitle()).to.exist;
        dashboardPage.getSixthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(adTypeTitle);
            });
        expect(dashboardPage.getSeventhColumnTitle()).to.exist;
        dashboardPage.getSeventhColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(createdTitle);
            });
        expect(dashboardPage.getEighthColumnTitle()).to.exist;
        dashboardPage.getEighthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(lastUpdTitle);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough Next table pages', function(done) {
        dashboardPage.waitUntilNextControlButtonEnabled();
        dashboardPage.clickNextPageTableControl();
        dashboardPage.waitUntilFirstControlButtonEnabled();
        dashboardPage.waitUntilPreviousControlButtonEnabled();
        expect(dashboardPage.getSearchField()).to.exist;
        expect(dashboardPage.getFirstTableRow()).to.exist;
        expect(dashboardPage.getFirstColumnTitle()).to.exist;
        dashboardPage.getFirstColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(adslotTitle);
            });
        expect(dashboardPage.getSecondColumnTitle()).to.exist;
        dashboardPage.getSecondColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(newsletterTitle);
            });
        expect(dashboardPage.getThirdColumnTitle()).to.exist;
        dashboardPage.getThirdColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(publisherTitle);
            });
        expect(dashboardPage.getFourthColumnTitle()).to.exist;
        dashboardPage.getFourthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(statusTitle);
            });
        expect(dashboardPage.getFifthColumnTitle()).to.exist;
        dashboardPage.getFifthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(sizeTitle);
            });
        expect(dashboardPage.getSixthColumnTitle()).to.exist;
        dashboardPage.getSixthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(adTypeTitle);
            });
        expect(dashboardPage.getSeventhColumnTitle()).to.exist;
        dashboardPage.getSeventhColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(createdTitle);
            });
        expect(dashboardPage.getEighthColumnTitle()).to.exist;
        dashboardPage.getEighthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(lastUpdTitle);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough Previous table pages', function(done) {
        dashboardPage.clickPreviousPageTableControl();
        dashboardPage.waitUntilFirstControlButtonDisabled();
        dashboardPage.waitUntilPreviousControlButtonDisabled();
        expect(dashboardPage.getSearchField()).to.exist;
        expect(dashboardPage.getFirstTableRow()).to.exist;
        expect(dashboardPage.getFirstColumnTitle()).to.exist;
        dashboardPage.getFirstColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(adslotTitle);
            });
        expect(dashboardPage.getSecondColumnTitle()).to.exist;
        dashboardPage.getSecondColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(newsletterTitle);
            });
        expect(dashboardPage.getThirdColumnTitle()).to.exist;
        dashboardPage.getThirdColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(publisherTitle);
            });
        expect(dashboardPage.getFourthColumnTitle()).to.exist;
        dashboardPage.getFourthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(statusTitle);
            });
        expect(dashboardPage.getFifthColumnTitle()).to.exist;
        dashboardPage.getFifthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(sizeTitle);
            });
        expect(dashboardPage.getSixthColumnTitle()).to.exist;
        dashboardPage.getSixthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(adTypeTitle);
            });
        expect(dashboardPage.getSeventhColumnTitle()).to.exist;
        dashboardPage.getSeventhColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(createdTitle);
            });
        expect(dashboardPage.getEighthColumnTitle()).to.exist;
        dashboardPage.getEighthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(lastUpdTitle);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough Last table pages', function(done) {
        dashboardPage.waitUntilLastControlButtonEnabled();
        dashboardPage.clickLastPageTableControl();
        dashboardPage.waitUntilLastControlButtonDisabled();
        dashboardPage.waitUntilNextControlButtonDisabled();
        expect(dashboardPage.getSearchField()).to.exist;
        expect(dashboardPage.getFirstTableRow()).to.exist;
        expect(dashboardPage.getFirstColumnTitle()).to.exist;
        dashboardPage.getFirstColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(adslotTitle);
            });
        expect(dashboardPage.getSecondColumnTitle()).to.exist;
        dashboardPage.getSecondColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(newsletterTitle);
            });
        expect(dashboardPage.getThirdColumnTitle()).to.exist;
        dashboardPage.getThirdColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(publisherTitle);
            });
        expect(dashboardPage.getFourthColumnTitle()).to.exist;
        dashboardPage.getFourthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(statusTitle);
            });
        expect(dashboardPage.getFifthColumnTitle()).to.exist;
        dashboardPage.getFifthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(sizeTitle);
            });
        expect(dashboardPage.getSixthColumnTitle()).to.exist;
        dashboardPage.getSixthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(adTypeTitle);
            });
        expect(dashboardPage.getSeventhColumnTitle()).to.exist;
        dashboardPage.getSeventhColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(createdTitle);
            });
        expect(dashboardPage.getEighthColumnTitle()).to.exist;
        dashboardPage.getEighthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(lastUpdTitle);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough First table pages', function(done) {
        dashboardPage.waitUntilFirstControlButtonEnabled();
        dashboardPage.clickFirstPageTableControl();
        dashboardPage.waitUntilFirstControlButtonDisabled();
        dashboardPage.waitUntilPreviousControlButtonDisabled();
        expect(dashboardPage.getSearchField()).to.exist;
        expect(dashboardPage.getFirstTableRow()).to.exist;
        expect(dashboardPage.getFirstColumnTitle()).to.exist;
        dashboardPage.getFirstColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(adslotTitle);
            });
        expect(dashboardPage.getSecondColumnTitle()).to.exist;
        dashboardPage.getSecondColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(newsletterTitle);
            });
        expect(dashboardPage.getThirdColumnTitle()).to.exist;
        dashboardPage.getThirdColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(publisherTitle);
            });
        expect(dashboardPage.getFourthColumnTitle()).to.exist;
        dashboardPage.getFourthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(statusTitle);
            });
        expect(dashboardPage.getFifthColumnTitle()).to.exist;
        dashboardPage.getFifthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(sizeTitle);
            });
        expect(dashboardPage.getSixthColumnTitle()).to.exist;
        dashboardPage.getSixthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(adTypeTitle);
            });
        expect(dashboardPage.getSeventhColumnTitle()).to.exist;
        dashboardPage.getSeventhColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(createdTitle);
            });
        expect(dashboardPage.getEighthColumnTitle()).to.exist;
        dashboardPage.getEighthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(lastUpdTitle);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should access Newsletter detail page', function(done) {
        dashboardPage.setSearchField(adSlotName);
        dashboardPage.waitUntilFilterNotVisible();
        expect(dashboardPage.getFirstTableName()).to.exist;
        expect(dashboardPage.getFirstTableRow()).to.exist;
        dashboardPage.openFirstEntity(adSlotName);
        adSlotDetailsPage.getAdSlotName().then((name) => {
            expect(name).to.equal(adSlotName);
        });
        adSlotDetailsPage.getAdSlotId().then((name) => {
            expect(name).to.equal(adSlotId);
        });
        expect(adSlotDetailsPage.getBreadcrumbLink()).to.exist;
        expect(adSlotDetailsPage.getEditAdSlotLink()).to.exist;
        expect(adSlotDetailsPage.getDeleteAdSlotLink()).to.exist;
        expect(adSlotDetailsPage.getActivateAdSlotLink()).to.exist;
        // expect(adSlotDetailsPage.getViewHistoryAdSlotLink()).to.exist;
        expect(adSlotDetailsPage.getEmptyLITable()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });
});
