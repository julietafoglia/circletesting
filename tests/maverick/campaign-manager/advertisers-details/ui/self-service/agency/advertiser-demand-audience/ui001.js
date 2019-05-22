'use strict';


// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment = require(rootPath +
    '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002
    .children.advertiser001
    .children.advertiserUser001;
const driverTimeOut = 0;

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdvertiser = entitiesObj.agency002.children.advertiser001;
const targetIo = targetAdvertiser.children.insertionOrder001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let basePage;
let loginPage;
let advDetsPage;
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let BasePage = require(rootPath + '/pages/maverick/index');
let AdvDetsPage = require(rootPath +
     '/pages/maverick/campaign-manager/advertiser-details');

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /advertisers {UI} @SS-AGENCY-ADVERTISER >>> ' +
    '(+) verify IO not displayed >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        basePage = new BasePage(driver);
        advDetsPage = new AdvDetsPage(driver);
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

    it('should navigate to advertiser details page', function(done) {
        basePage.navigate(targetServer, 'advertisers', targetAdvertiser.refId);
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('PERMISSION: should not display insertion order', function(done) {
        advDetsPage.getLinkTextNotDisplayed(targetIo.name);
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
