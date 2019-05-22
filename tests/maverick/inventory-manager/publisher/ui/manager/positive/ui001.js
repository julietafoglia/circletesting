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
let PublisherDetailsPage =
    require(rootPath + '/pages/maverick/inventory-manager/publisher-details');
let PublisherFormPage =
    require(rootPath + '/pages/maverick/inventory-manager/publisher-form');

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
let title = 'Inventory Manager';
let mediaGroupTitle = 'MEDIA GROUP';
let pubTitle = 'PUBLISHER';
let publisherName = 'initest NATIVE PUB';
let publisherId = 'ID: 35489';
let tierNumber = '3';
let mediaGroupRefId = '860';
let sspFee = '5';
let allowOption = 'Block';
let newsletterTitle = '# OF NEWSLETTERS';
let adslotsTitle = '# OF AD SLOTS';
let createdTitle = 'CREATED';
let lastUpdTitle = 'LAST UPDATED';

// page objects
let dashboardPage, loginPage, publisherFormPage, publisherDetailsPage;

// fixture(s)
let publisherFixture = Object.assign(
    {}, require(rootPath + '/fixtures/maverick/publisher/create003')
);
publisherFixture['managerName'] = 'QA-All user';
publisherFixture['executiveName'] = 'QA-All user';

describe('<SMOKE-PROD> {{MAVERICK}} inventory manager - inventory library' +
    ' Publisher Create Detail Page >>> (+) basic ui validation >>>',
function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        publisherFormPage = new PublisherFormPage(driver);
        publisherDetailsPage = new PublisherDetailsPage(driver);
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
        dashboardPage.closeLastOuterDiv();
        dashboardPage.closeOuterDiv();
        expect(dashboardPage.getCreatePublisherButton()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display all inventory library page elements', function(done) {
        dashboardPage.getInventoryTitle(title).getText().
            then(function(getText) {
                expect(getText).to.equal(title);
            });
        expect(dashboardPage.getSearchField()).to.exist;
        expect(dashboardPage.getViewAllButton()).to.exist;
        expect(dashboardPage.getFromButton()).to.exist;
        expect(dashboardPage.getFirstColumnTitle()).to.exist;
        dashboardPage.getFirstColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(pubTitle);
            });
        expect(dashboardPage.getSecondColumnTitle()).to.exist;
        dashboardPage.getSecondColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(mediaGroupTitle);
            });
        expect(dashboardPage.getThirdColumnTitle()).to.exist;
        dashboardPage.getThirdColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(newsletterTitle);
            });
        expect(dashboardPage.getFourthColumnTitle()).to.exist;
        dashboardPage.getFourthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(adslotsTitle);
            });
        expect(dashboardPage.getFifthColumnTitle()).to.exist;
        dashboardPage.getFifthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(createdTitle);
            });
        expect(dashboardPage.getSixthColumnTitle()).to.exist;
        dashboardPage.getSixthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(lastUpdTitle);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate to publisher create form', (done) => {
        dashboardPage.clickPubCreateBtn();
        dashboardPage.waitUntilSpinnerNotVisible();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display all Create Publisher form elements', function(done) {
        publisherFormPage.getPublisherTierDropDown();
        expect(publisherFormPage.getPublisherForm()).to.exist;
        expect(publisherFormPage.getPublisherTierDropDown()).to.exist;
        expect(publisherFormPage.getPoweredByDropDown()).to.exist;
        expect(publisherFormPage.getAdChoicesDropDown()).to.exist;
        expect(publisherFormPage.getAllowUserMatch()).to.exist;
        expect(publisherFormPage.getEmailContacts()).to.exist;
        expect(publisherFormPage.getRTBDemandButton()).to.exist;
        expect(publisherFormPage.getTransparencyButton()).to.exist;
        expect(publisherFormPage.getInheritCheckBox()).to.exist;
        expect(publisherFormPage.getDemandTitle()).to.exist;
        expect(publisherFormPage.getTransparencyTitle()).to.exist;
        publisherFormPage.setAdChoicesAs(allowOption);
        publisherFormPage.setPoweredByAs(allowOption);
        publisherFormPage.clickAllowUserMatch();
        publisherFormPage.selectPublisherTier(tierNumber);
        publisherFormPage.enterPubName(publisherFixture.name);
        publisherFormPage.enterPrimaryDomain(publisherFixture.domain);
        publisherFormPage.enterCName(publisherFixture.cnameProtocol,
            publisherFixture.cname);
        publisherFormPage.addKeyValuePairs(publisherFixture.kvps);
        publisherFormPage.enterPublisherLabel(publisherFixture.label);
        publisherFormPage.blockCategories(publisherFixture.iabBlacklist);
        publisherFormPage.pickIabCategory(publisherFixture.category);
        publisherFormPage.selectESP(publisherFixture.esp);
        publisherFormPage.chooseMediaGroup(mediaGroupRefId);

        publisherFormPage.waitUntilSaveButtonEnabled();
        publisherFormPage.clickClose();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should access Publisher detail page', function(done) {
        dashboardPage.setSearchField(publisherName);
        dashboardPage.waitUntilFilterNotVisible();
        expect(dashboardPage.getFirstTableName()).to.exist;
        expect(dashboardPage.getFirstTableRow()).to.exist;
        dashboardPage.openFirstEntity(publisherName);
        publisherDetailsPage.getPublisherName().then((name) => {
            expect(name).to.equal(publisherName);
        });
        publisherDetailsPage.getPublisherId().then((name) => {
            expect(name).to.equal(publisherId);
        });
        expect(publisherDetailsPage.getPrimaryIabCategory()).to.exist;
        expect(publisherDetailsPage.getCName()).to.exist;
        expect(publisherDetailsPage.getPrimaryDomain()).to.exist;
        expect(publisherDetailsPage.getLabel()).to.exist;
        expect(publisherDetailsPage.getIabBlacklist()).to.exist;
        expect(publisherDetailsPage.getBreadcrumbLink()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });
});
