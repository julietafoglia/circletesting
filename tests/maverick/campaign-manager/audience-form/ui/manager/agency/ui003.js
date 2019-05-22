'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.admin;
const driverTimeOut = 0;

// bootstrap variables
const entitiesFile =
    require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv = entitiesObj.agency001.children.advertiser001;

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
let AudDynPage = require(rootPath + '/pages/maverick/campaign-manager/' +
    'audience-dynamic-form');
let audLibrary;
let audPage;
let audDynPage;
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
    '(+) verify URL based audience ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        audPage = new AudPage(driver);
        audDynPage = new AudDynPage(driver);
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

    it('it should navigate to URL based audience page', function(done) {
        sideBar.clickAudiencesLink();
        audLibrary.clickNewAudience();
        audCards.clickUrlAudience();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('URL based audience modal should have all the elements', function(done) {
        // basic info
        expect(audPage.getInputAudienceName()).to.exist;
        expect(audPage.getInputAdvertiser()).to.exist;
        audPage.setInputAdvertiser(targetAdv.name);

        // segmentation
        expect(audDynPage.getButtonAudienceMembers()).to.exist;
        expect(audDynPage.getTextAudienceMembers()).to.exist;
        expect(audDynPage.getButtonVisitedPage()).to.exist;
        expect(audDynPage.getButtonRule()).to.exist;
        expect(audDynPage.getInputRule()).to.exist;
        expect(audDynPage.getInputMemberLifetime()).to.exist;
        expect(audDynPage.getTextMemberLifetime()).to.exist;
        expect(audDynPage.getButtonAnd()).to.exist;
        expect(audDynPage.getButtonOr()).to.exist;

        audDynPage.clickButtonAudienceMembers();
        expect(audDynPage.getSpan('Visitors of a page with a' +
            ' specific event tag')).to.exist;
        expect(audDynPage.getSpan('Visitors of a webpage' +
            ' URL')).to.exist;
        audDynPage.clickButtonAudienceMembers();

        audDynPage.clickButtonVisitedPage();
        expect(audDynPage.getSpan('Match any rule group')).to.exist;
        expect(audDynPage.getSpan('Match every rule groups')).to.exist;
        audDynPage.clickButtonVisitedPage();

        audDynPage.clickButtonRule();
        expect(audDynPage.getSpan('Contains')).to.exist;
        expect(audDynPage.getSpan('Does Not Contain')).to.exist;
        audDynPage.clickButtonRule();

        // conversion tracker
        expect(audDynPage.getButtonPixel()).to.exist;

        // sharing
        expect(audPage.getInputDoNotShare()).to.exist;
        expect(audPage.getInputShareSpecific()).to.exist;
        expect(audPage.getInputShareAcross()).to.exist;

        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should check required fields in modal', function(done) {
        audPage.setInputAudienceName('testing');
        audPage.getButtonUpload().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to.contain('disabled');
            });
        audDynPage.setInputRule('test rule');
        audPage.getButtonUpload().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to.not.contain('disabled');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

});
