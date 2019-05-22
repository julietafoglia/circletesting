'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment = require(rootPath +
    '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002
    .children.advertiser001
    .children.advertiserUser001;
const driverTimeOut = 0;

// bootstrap variables
const entitiesFile =
    require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv = entitiesObj.agency002.children.advertiser001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath +
    '/pages/maverick/platform/login');
let AdvDetsPage = require(rootPath +
    '/pages/maverick/campaign-manager/advertiser-details');
let CampaignCardsPage = require(rootPath +
    '/pages/maverick/campaign-manager/campaign-cards');
let loginPage;
let advDetsPage;
let campaignCardsPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /campaign-manager/campaign-goal {ui}' +
    ' @SS-AGENCY-ADVERTISER >>> ' +
    '(+) verify campaign cards ui >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        advDetsPage = new AdvDetsPage(driver);
        campaignCardsPage = new CampaignCardsPage(driver);
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

    it('should navigate to cards page', function(done) {
        advDetsPage.navigate(targetServer, 'advertisers', targetAdv.refId);
        advDetsPage.clickNewCam();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should display correct cards', function(done) {
        expect(campaignCardsPage.getButtonBranding()).to.exist;
        expect(campaignCardsPage.getButtonPerformance()).to.exist;
        expect(campaignCardsPage.clickBranding()).to.exist;
        expect(campaignCardsPage.getBrandingCli()).to.exist;
        expect(campaignCardsPage.getBrandingCon()).to.exist;
        driver.navigate().back();
        expect(campaignCardsPage.clickPerformance()).to.exist;
        expect(campaignCardsPage.getPerfMaxReach()).to.exist;
        expect(campaignCardsPage.getPerfMaxClick()).to.exist;
        expect(campaignCardsPage.getPerfMaxConv()).to.exist;
        expect(campaignCardsPage.verifyPayPerClickNotPresent()).to.exist;
        expect(campaignCardsPage.verifyPayPerConvNotPresent()).to.exist;
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
