'use strict';

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

const testData001 = rootPath + '/fixtures/common/audience/create004.csv';

describe('{{MAVERICK}} /audience-form {create} @SS-AGENCY >>> ' +
    '(+) get match rate >>>', function() {

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

    it('it should fill all required fields', function(done) {
        audPage.setInputEmail('test@mail.com');
        audPage.setInputFileMatchRate(testData001);
        audPage.clickUpload();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('it should get success message', function(done) {
        audPage.waitForAlert();
        driver.sleep(driverTimeOut).then(() => done());
    });


});
