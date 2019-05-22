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
const targetAdvertiser = entitiesObj.agency001.children.advertiser001;
const targetAudience = targetAdvertiser.children.audience001;

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
let targetAdvName = 'iniTestAdv (Linked_Ads 2)';

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

// fixtures(s)
const testData001 = rootPath + '/fixtures/common/audience/create004.csv';

describe('{{MAVERICK}} /audience-form {UI} @MANAGER >>> ' +
    '(+) verify Expansion det audience ui elements >>>', function() {

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

    it('it should navigate to det expansion audience page', function(done) {
        sideBar.clickAudiencesLink();
        audLibrary.clickNewAudience();
        audCards.clickExpansionDet();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('Expansion det audience modal should have' +
        ' all the elements', function(done) {
        expect(audPage.getInputAdvertiser()).to.exist;
        audPage.setInputAdvertiser(targetAdvName);

        expect(audPage.getInputChooseAudience()).to.exist;
        expect(audPage.getInputAudienceName()).to.exist;
        audPage.setInputChooseAudience(targetAudience.refId);

        expect(audPage.getSpan('Deterministic')).to.exist;
        expect(audPage.getSpan('Probabilistic')).to.exist;
        audPage.getInputDet().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to.contain('ng-untouched' +
                    ' ng-pristine ng-valid');
            });

        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should check required fields in modal', function(done) {
        audPage.getButtonUpload().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to.contain('disabled');
            });
        audPage.setInputAudienceName('testing');
        audPage.getButtonUpload().getAttribute('outerHTML').
            then(function(outerHTML) {
                expect(outerHTML).to.not.contain('disabled');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

});
