'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const moment = require('moment');
const util = require('util');

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

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


describe('[MAVERICK] inventory manager - newsletter {edit} @ADMIN >>> ' +
    '(+) newsletter details page >>>', function() {

    // shared test variable(s)
    const timeStamp = `@${moment().format('YYYY-MM-DDTHH:mm')}`;
    let driver;
    let entitiesObject;
    let publisher;

    // page objects
    let newsletterFormPage;
    let newsletterDetailsPage;
    let publisherDetailsPage;

    // fixture(s)
    let newsletterFixture = Object.assign({}, require(rootPath +
        '/fixtures/maverick/newsletter/template-create004'));
    let newsletterUpdateFixture = Object.assign(
        {}, require(rootPath + '/fixtures/maverick/newsletter/template-edit002')
    );

    // disable mocha time outs
    this.timeout(0);


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
        publisherDetailsPage.goto(url);
        publisherDetailsPage.waitUntilOverlayNotVisible();
        publisherDetailsPage
            .clickCreateNewsletterBtn()
            .then(() => {
                done();
            }, (err) => {
                done(err);
            });
    });

    it('should create a newsletter', (done) => {
        newsletterFormPage = new NewsletterFormPage(driver);
        newsletterFixture.name += timeStamp + 8;
        newsletterFormPage
            .selectTab('Enter Details')
            .enterNewsletterName(newsletterFixture.name)
            .pickIabCategory(newsletterFixture.iabCategory)
            .clickAdvancedSettings()
            .checkDiffAdSources(newsletterFixture.diffAdSources)
            .clickCreateBtn()
            .then(() => {
                done();
            }, (err) => {
                done(err);
            });
    });

    it('should verify newsletter was created', (done) => {
        publisherDetailsPage
            .getNewsletterCardName(newsletterFixture.name)
            .then((name) => {
                expect(name).to.equal(newsletterFixture.name);
                done();
            }, (err) => {
                done(err);
            });
    });

    it('should navigate to created newsletter', (done) => {
        publisherDetailsPage
            .openNewsletter(newsletterFixture.name)
            .then(() => {
                done();
            }, (err) => {
                done(err);
            });
    });

    it('should initiate newsletter edit', (done) => {
        newsletterDetailsPage = new NewsletterDetailsPage(driver);
        newsletterDetailsPage
            .clickEditBtn()
            .then(() => {
                done();
            }, (err) => {
                done(err);
            });
    });

    it('should edit existing newsletter', (done) => {
        newsletterFormPage.waitUntilOverlayNotVisible();
        newsletterFormPage
            .uncheckAllowExchange()
            .clickAdvancedSettings()
            .clickCreateBtn()
            .then(() => {
                done();
            }, (err) => {
                done(err);
            });
    });

    it('should verify newsletter created', (done) => {
        newsletterDetailsPage = new NewsletterDetailsPage(driver);
        expect(newsletterDetailsPage.getSpanContainsText(
            newsletterFixture.iabCategory)).to.exist;
        newsletterDetailsPage.getNewsletterName().
            then(function(getText) {
                expect(getText).to.include(newsletterFixture.name);
                done();
            }, (err) => {
                done(err);
            });
    });

});
