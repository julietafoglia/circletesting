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
    '(+) verify Event based audience ui elements >>>', function() {

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

    it('it should navigate to Event based audience page', function(done) {
        sideBar.clickAudiencesLink();
        audLibrary.clickNewAudience();
        audCards.clickEventAudience();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('Event based audience modal should have all the' +
        ' elements', function(done) {
        // basic info
        expect(audPage.getInputAudienceName()).to.exist;
        expect(audPage.getInputAdvertiser()).to.exist;
        audPage.setInputAdvertiser(targetAdv.name);

        // segmentation
        expect(audDynPage.getButtonAudienceMembers()).to.exist;
        expect(audDynPage.getButtonEvent()).to.exist;
        expect(audDynPage.getTextEvent()).to.exist;
        expect(audDynPage.getSpan('Add custom name')).to.exist;
        expect(audDynPage.getInputMemberLifetime()).to.exist;
        expect(audDynPage.getTextMemberLifetime()).to.exist;

        audDynPage.clickButtonAudienceMembers();
        expect(audDynPage.getSpan('Visitors of a page with a' +
            ' specific event tag')).to.exist;
        expect(audDynPage.getSpan('Visitors of a webpage' +
            ' URL')).to.exist;
        audDynPage.clickButtonAudienceMembers();

        audDynPage.clickButtonEvent();
        expect(audDynPage.getSpan('addToCart')).to.exist;
        expect(audDynPage.getSpan('removeFromCart')).to.exist;
        expect(audDynPage.getSpan('viewCategory')).to.exist;
        expect(audDynPage.getSpan('viewContent')).to.exist;
        expect(audDynPage.getSpan('viewSearchResult')).to.exist;
        audDynPage.clickButtonEvent();

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
        audDynPage.clickButtonEvent();
        audDynPage.clickSpan('addToCart');
        audPage.getButtonUpload().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to.not.contain('disabled');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

});
