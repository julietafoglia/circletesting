'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const driverBuilder = require(rootPath + '/helpers/driver-builder');
const mochaTimeOut = 0;

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

describe('[MAVERICK] inventory manager - publisher {create} @ADMIN >>> ' +
    '(+) advanced settings - demand blocking >>>', function() {

    // shared test variable(s)
    const timeStamp = `@${moment().format('YYYY-MM-DDTHH:mm')}`;
    let driver;
    let entitiesObject;
    let mediaGroup;

    // page objects
    let dashboardPage;
    let publisherDetailsPage;

    // fixture(s)
    let publisherFixture = Object.assign(
        {}, require(rootPath + '/fixtures/maverick/publisher/create003')
    );
    publisherFixture['managerName'] = 'QA-All user';
    publisherFixture['executiveName'] = 'QA-All user';

    // disable mocha time outs
    this.timeout(mochaTimeOut);

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
        let publisherFormPage = new PublisherFormPage(driver);
        publisherFixture.name += timeStamp + '3';
        publisherFixture.creative.location =
            rootPath + '/fixtures/maverick/creatives/728x90.png';
        publisherFormPage.waitUntilSpinnerDissapear();
        publisherFormPage
            .enterPubName(publisherFixture.name)
            .enterPrimaryDomain(publisherFixture.domain)
            .enterCName(publisherFixture.cnameProtocol, publisherFixture.cname)
            .selectESP(publisherFixture.esp)
            .addKeyValuePairs(publisherFixture.kvps)
            .enterPublisherLabel(publisherFixture.label)
            .blockCategories(publisherFixture.iabBlacklist)
            .pickIabCategory(publisherFixture.category)
            .chooseMediaGroup(mediaGroup.refId)
            .saveAndExit()
            .then(() => {
                done();
            }, (err) => {
                done(err);
            });
    });

    it('should navigate to created publisher', (done) => {
        dashboardPage
            .setSearchField(publisherFixture.name);
        dashboardPage.waitUntilFilterNotVisible();
        dashboardPage
            .openFirstEntity(publisherFixture.name)
            .then(() => {
                done();
            }, (err) => {
                done(err);
            });
    });

    it('publisher name should match test object\'s', (done) => {
        publisherDetailsPage = new PublisherDetailsPage(driver);
        publisherDetailsPage.getPublisherName().then((name) => {
            expect(name).to.equal(publisherFixture.name);
            done();
        }, (err) => {
            done(err);
        });
    });

    it('publisher iab category should match test object\'s', (done) => {
        publisherDetailsPage.getPrimaryIabCategory().then((category) => {
            expect(category)
                .to.equal(publisherFixture.category.replace(/IAB.+:\s/, ''));
            done();
        }, (err) => {
            done(err);
        });
    });

    it('publisher cname should match test object\'s', (done) => {
        publisherDetailsPage.getCName().then((cname) => {
            expect(cname).to.equal(publisherFixture.cname);
            done();
        }, (err) => {
            done(err);
        });
    });

    it('publisher domain should match test object\'s', (done) => {
        publisherDetailsPage.getPrimaryDomain().then((domain) => {
            expect(domain).to.equal(publisherFixture.domain);
            done();
        }, (err) => {
            done(err);
        });
    });

    it('publisher label should match test object\'s', (done) => {
        publisherDetailsPage.getLabel().then((label) => {
            expect(label).to.equal(publisherFixture.label);
            done();
        }, (err) => {
            done(err);
        });
    });

    it('publisher iab blacklist should match test object\'s', (done) => {
        publisherDetailsPage.getIabBlacklist().then((categories) => {
            categories = categories.split(',').map((value) => value.trim());
            expect(categories).to.have.members(publisherFixture.iabBlacklist);
            done();
        }, (err) => {
            done(err);
        });
    });

});
