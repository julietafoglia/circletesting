'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');
const util = require('util');

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

//  Page object(s)
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let DashboardPage =
    require(rootPath + '/pages/maverick/inventory-manager/dashboard');
let PublisherFormPage =
    require(rootPath + '/pages/maverick/inventory-manager/publisher-form');
let MediaGroupDetailsPage =
    require(rootPath + '/pages/maverick/inventory-manager/media-group-details');

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const targetEndpoint =
    require(rootPath + '/config/maverick/endpoints');
const targetEnvironmentUsers =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = targetEnvironmentUsers.admin;


describe('[MAVERICK] inventory manager - publisher {delete} @ADMIN >>> ' +
    '(+) media-group details page >>>', function() {

    // shared test variable(s)
    const timeStamp = `@${moment().format('YYYY-MM-DDTHH:mm')}`;
    let driver;
    let entitiesObject;
    let mediaGroup;

    // page objects
    let dashboardPage;
    let publisherFormPage;
    let mediaGroupDetailsPage;

    // fixture(s)
    let publisherFixture = Object.assign(
        {}, require(rootPath + '/fixtures/maverick/publisher/create001')
    );

    // disable mocha time outs
    this.timeout(0);

    before('get media group from entities object', () => {
        entitiesObject = require(rootPath + '/bootstrap/entities-ssp.json');
        mediaGroup = entitiesObject.manager.mediaGroup001;
    });

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should login into maverick successfully', (done) => {
        let loginPage = new LoginPage(driver);
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
        dashboardPage = new DashboardPage(driver);
        let url = targetServer + targetEndpoint.inventoryDashboard;
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
        publisherFormPage = new PublisherFormPage(driver);
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

    it('should delete created publisher', (done) => {
        mediaGroupDetailsPage = new MediaGroupDetailsPage(driver);
        let url = targetServer +
            util.format(targetEndpoint.mediaGroupDetails, mediaGroup.refId);
        mediaGroupDetailsPage.goto(url);
        mediaGroupDetailsPage.setSearchPublisher(publisherFixture.name);
        mediaGroupDetailsPage
            .deletePublisher(publisherFixture.name)
            .then(() => {
                done();
            }, (err) => {
                done(err);
            });
    });

    it('should confirm publisher was deleted', (done) => {
        mediaGroupDetailsPage.setSearchPublisher(publisherFixture.name);
        mediaGroupDetailsPage
            .publisherExists(publisherFixture.name)
            .then((res) => {
                expect(res).to.be.false;
                done();
            }, (err) => {
                done(err);
            });
    });

});
