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


describe('[MAVERICK] inventory manager - newsletter {tags} @ADMIN >>> ' +
    '(+) copy code - newsletter details >>>', function() {

    // shared test variable(s)
    const timeStamp = `@${moment().format('YYYY-MM-DDTHH:mm')}`;
    let driver;
    let entitiesObject;
    let publisher;

    // page objects
    let newsletterDetailsPage;
    let publisherDetailsPage;

    // fixture(s)
    let newsletterFixture = Object.assign({}, require(rootPath +
        '/fixtures/maverick/newsletter/template-create002'));

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
        publisherDetailsPage
            .goto(url)
            .clickCreateNewsletterBtn()
            .then(() => {
                done();
            }, (err) => {
                done(err);
            });
    });

    it('should create a newsletter', (done) => {
        let newsletterFormPage = new NewsletterFormPage(driver);
        newsletterFixture.name += timeStamp + 9;
        newsletterFormPage
            .selectTab('Enter Details')
            .enterNewsletterName(newsletterFixture.name)
            .pickIabCategory(newsletterFixture.iabCategory)
            .clickCreateBtn()
            .then(() => {
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

    it('should be able to copy tags of created newsletter', (done) => {
        newsletterDetailsPage = new NewsletterDetailsPage(driver);
        newsletterDetailsPage
            .clickViewTagsBtn();
        newsletterDetailsPage
            .copyCode();
        newsletterDetailsPage
            .codeCopied()
            .then((res) => {
                expect(res).to.be.true;
                done();
            }, (err) => {
                done(err);
            });
    });

});
