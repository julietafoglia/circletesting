'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.admin;
const driverTimeOut = 5000;

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdvertiser = entitiesObj.agency001.children.advertiser001;
const targetAudience = targetAdvertiser.children.audience001;

// selenium runtime variables
let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let SideBar = require(rootPath + '/pages/maverick/platform/side-bar');
let AudLibrary = require(rootPath + '/pages/maverick/campaign-manager/' +
    'audience-library');
let AudPage = require(rootPath + '/pages/maverick/campaign-manager/' +
    'audience-form');
let AudCards = require(rootPath + '/pages/maverick/campaign-manager/' +
    'audience-cards');
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

describe('{{MAVERICK}} /audience-form {UI} @MANAGER >>> ' +
    '(+) verify add to segment ui elements >>>', function() {

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

    it('it should navigate to audiences page', function(done) {
        sideBar.clickAudiencesLink();
        audLibrary.clickNewAudience();
        audCards.clickAddToSegment();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should check add to segment modal', function(done) {
        // basic info
        expect(audPage.getInputAudienceName()).to.exist;
        audPage.getAdvertiserNotDisplayed();
        expect(audPage.getInputChooseAudience()).to.exist;
        audPage.setInputChooseAudience(targetAudience.refId);
        audPage.getInputAudienceName().getAttribute('ng-reflect-model').
            then(function(ngreflectname) {
                expect(ngreflectname).to.contain(targetAudience.name);
            });

        // sharing
        expect(audPage.getInputDoNotShare()).to.exist;
        expect(audPage.getInputShareSpecific()).to.exist;
        expect(audPage.getInputShareAcross()).to.exist;

        // upload file
        expect(audPage.getUploadContainer()).to.exist;
        expect(audPage.getButtonUpdate()).to.exist;
        expect(audPage.getButtonDataType()).to.exist;
        expect(audPage.clickDataType()).to.exist;
        expect(audPage.getSpan('MD5')).to.exist;
        expect(audPage.getSpan('SHA1')).to.exist;
        expect(audPage.getSpan('SHA2')).to.exist;
        audPage.clickDataType();

        expect(audPage.getButtonAction()).to.exist;
        expect(audPage.getSpan('Add Hashes to Audience')).to.exist;
        audPage.clickAction();
        expect(audPage.getSpan('Add Hashes to Audience')).to.exist;
        expect(audPage.getSpan('Remove Hashes from Audience')).to.exist;
        expect(audPage.getSpan('None')).to.exist;
        audPage.clickAction();

        audPage.getCheckMerkle();
        audPage.getCheckMerkle().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to.contain('disabled');
            });

        expect(audPage.getCheckEmail()).to.exist;
        expect(audPage.getTextCheckMerkle()).to.exist;
        expect(audPage.getTextCheckShare()).to.exist;
        expect(audPage.getTextCheckEmail()).to.exist;
        audPage.clickCheckEmail();
        expect(audPage.getInputEmail()).to.exist;
        audPage.setInputEmail('invalid');
        audPage.clickInputEmail();
        expect(audPage.getTextError()).to.exist;
        audPage.getTextError().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to.equal('Please enter a valid' +
                    ' email address.');
            });
        audPage.clickCheckEmail();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should check required fields in edit modal', function(done) {
        audPage.setInputFile(testData001);
        audPage.getInputAudienceName();
        audPage.getButtonUpdate().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to.not.contain('disabled');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

});
