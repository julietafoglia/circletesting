'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;
const util = require('util');

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const mochaTimeOut = 0;

// helpers
const driverBuilder = require(rootPath + '/helpers/driver-builder');
const excelHelper = require(rootPath + '/helpers/spreadsheet.js');

//  Page object(s)
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NewsletterDetailsPage =
    require(rootPath + '/pages/maverick/inventory-manager/newsletter-details');
let PublisherDetailsPage =
    require(rootPath + '/pages/maverick/inventory-manager/publisher-details');
let NewsletterFormPage =
    require(rootPath + '/pages/maverick/inventory-manager/newsletter-form');

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const targetEndpoint =
    require(rootPath + '/config/maverick/endpoints');
const targetEnvironmentUsers =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = targetEnvironmentUsers.admin;


describe('<SMOKE> {{MAVERICK}} - newsletter {create} @ADMIN >>> ' +
    '(+) bulk upload tool - single newsletter - ad-slot pair >>>', function() {

    // shared test variable(s)
    const TEMPLATE_COUNT = 1;
    let driver;
    let entitiesObject;
    let publisher;
    let templateNames;

    // page objects
    let newsletterDetailsPage;
    let publisherDetailsPage;

    // disable mocha time outs
    this.timeout(mochaTimeOut);

    // fixture(s)
    let templateLocation =
        `${rootPath}/fixtures/common/newsletter-templates/template001.xlsx`;
    let newsletterFixture =
        require(rootPath + '/fixtures/common/publisher/upload-verify001');


    before('get publisher from entities object', () => {
        entitiesObject = require(rootPath + '/bootstrap/entities-ssp.json');
        publisher = entitiesObject.manager.mediaGroup001.publisher001;
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

    it('should navigate to newsletter create page', (done) => {
        publisherDetailsPage = new PublisherDetailsPage(driver);
        let url = targetServer + util.format(
            targetEndpoint.publisherDetails, publisher.refId
        );
        publisherDetailsPage
            .goto(url)
            .clickCreateNewsletterBtn()
            .then(() => {
                done();
            }, (err) => {
                done(err);
            });
    });

    it('should upload a newsletter', (done) => {
        let newsletterFormPage = new NewsletterFormPage(driver);
        let templatePath = excelHelper.fillTemplate(
            templateLocation, TEMPLATE_COUNT, publisher.refId, publisher.name
        );
        newsletterFormPage
            .selectTab('Upload')
            .uploadFile(templatePath)
            .waitUntilOverlayNotVisible()
            .then(() => {
                excelHelper.cleanUp(templatePath);
                done();
            }, (err) => {
                done(err);
            });
    });

    it('should navigate to created newsletter', (done) => {
        templateNames = Object.keys(newsletterFixture);
        publisherDetailsPage
            .openNewsletter(templateNames[0])
            .then(() => {
                done();
            }, (err) => {
                done(err);
            });
    });

    it('should verify ad-slot(s) was created', (done) => {
        newsletterDetailsPage = new NewsletterDetailsPage(driver);
        newsletterDetailsPage
            .getAdSlotNames()
            .then((names) => {
                let adSlotNames =
                    Object.keys(newsletterFixture[templateNames[0]].adSlots);
                expect(names).to.have.members(adSlotNames);
                done();
            }, (err) => {
                done(err);
            });
    });

});
