'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

//  Page object(s)
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let DashboardPage =
    require(rootPath + '/pages/maverick/inventory-manager/dashboard');
let PublisherDetailsPage =
    require(rootPath + '/pages/maverick/inventory-manager/publisher-details');
let PublisherFormPage =
    require(rootPath + '/pages/maverick/inventory-manager/publisher-form');
let MediaGroupDetailsPage =
    require(rootPath + '/pages/maverick/inventory-manager/media-group-details');
let loginPage;
let dashboardPage;
let publisherFormPage;
let publisherDetailsPage;
let mediaGroupDetailsPage;

// shared test variable(s)
const timeStamp = `@${moment().format('YYYY-MM-DDTHH:mm')}`;
let driver;
let entitiesObject;
let mediaGroup;

// fixture(s)
let publisherFixture = Object.assign(
    {}, require(rootPath + '/fixtures/maverick/publisher/create001')
);

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const targetEndpoint =
    require(rootPath + '/config/maverick/endpoints');
const targetEnvironmentUsers =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = targetEnvironmentUsers.admin;

let url = targetServer + targetEndpoint.inventoryDashboard;


describe('[MAVERICK] inventory manager - publisher {delete} @ADMIN >>> ' +
    '(+) publisher details page >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get media group from entities object', () => {
        entitiesObject = require(rootPath + '/bootstrap/entities-ssp.json');
        mediaGroup = entitiesObject.manager.mediaGroup001;
    });

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        dashboardPage = new DashboardPage(driver);
        publisherFormPage = new PublisherFormPage(driver);
        publisherDetailsPage = new PublisherDetailsPage(driver);
        mediaGroupDetailsPage = new MediaGroupDetailsPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should login into maverick successfully', (done) => {
        loginPage
            .goto(targetServer + targetEndpoint.login)
            .enterUsername(targetUser.username)
            .enterPassword(targetUser.password)
            .clickLoginBtn()
            .then(() => {
                done();
            }, (err) => {
                done(err);
            });
    });

    it('should navigate to publisher create form', (done) => {
        dashboardPage
            .goto(url)
            .clickPubCreateBtn()
            .then(() => {
                done();
            }, (err) => {
                done(err);
            });
    });

    it('should create a publisher', (done) => {
        publisherFixture.name += timeStamp;
        publisherFormPage
            .chooseMediaGroup(mediaGroup.refId)
            .enterPubName(publisherFixture.name)
            .pickIabCategory(publisherFixture.category)
            .enterPrimaryDomain(publisherFixture.domain)
            .enterCName(publisherFixture.cnameProtocol, publisherFixture.cname)
            .selectESP(publisherFixture.esp)
            .saveAndExit()
            .then(() => {
                done();
            }, (err) => {
                done(err);
            });
    });

    it('should navigate to created publisher', (done) => {
        dashboardPage.setSearchField(publisherFixture.name);
        dashboardPage.waitUntilFilterNotVisible();
        dashboardPage.clickLinkText(publisherFixture.name)
            .then(() => {
                done();
            }, (err) => {
                done(err);
            });
    });

    it('should delete created publisher', (done) => {
        publisherDetailsPage
            .deletePublisher()
            .then(() => {
                done();
            }, (err) => {
                done(err);
            });
    });

    it('should confirm publisher was deleted', (done) => {
        mediaGroupDetailsPage
            .publisherExists()
            .then((res) => {
                expect(res).to.be.false;
                done();
            }, (err) => {
                done(err);
            });
    });

});
