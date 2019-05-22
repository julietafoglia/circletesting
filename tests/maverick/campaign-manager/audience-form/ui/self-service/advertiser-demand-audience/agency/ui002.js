'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment = require(rootPath +
    '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002.children.agencyUser001;
const driverTimeOut = 0;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let SideBar = require(rootPath + '/pages/maverick/platform/side-bar');
let AudLibrary = require(rootPath + '/pages/maverick/campaign-manager/' +
    'audience-library');
let AudCards = require(rootPath + '/pages/maverick/campaign-manager/' +
    'audience-cards');
let AudPage = require(rootPath + '/pages/maverick/campaign-manager/' +
    'audience-form');
let audLibrary;
let audPage;
let audCards;
let sideBar;
let loginPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

// fixtures(s)
const testData001 = rootPath + '/fixtures/common/audience/create004.csv';

describe('{{MAVERICK}} /audience-form {UI} @SS-AGENCY >>> ' +
    '(+) verify match rate ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        audPage = new AudPage(driver);
        audLibrary = new AudLibrary(driver);
        audCards = new AudCards(driver);
        sideBar = new SideBar(driver);
        loginPage = new LoginPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('maverick - login', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('it should navigate to get match rate page', function(done) {
        sideBar.clickAudiencesLink();
        audLibrary.clickNewAudience();
        audCards.clickGetMatchRate();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('get match rate should have all the elements', function(done) {
        expect(audPage.getSpan('Filter by Publishers')).to.exist;
        expect(audPage.getInputPub()).to.exist;

        expect(audPage.getUploadMatchRate()).to.exist;
        expect(audPage.getButtonUpload()).to.exist;
        expect(audPage.getButtonDataType()).to.exist;
        audPage.clickDataType();
        expect(audPage.getSpan('MD5')).to.exist;
        expect(audPage.clickDataType()).to.exist;

        expect(audPage.getInputEmail()).to.exist;
        expect(audPage.setInputEmail('invalid')).to.exist;
        audPage.clickInputEmail();
        expect(audPage.getTextError()).to.exist;
        audPage.getTextError().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to.equal('Please enter a valid' +
                    ' email address.');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should check required fields in modal', function(done) {
        audPage.setInputEmail('test@mail.com');
        audPage.getButtonUpload().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to.contain('disabled');
            });

        audPage.setInputFileMatchRate(testData001);
        audPage.getButtonUpload().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to.not.contain('disabled');
            });

        driver.sleep(driverTimeOut).then(() => done());
    });

});
