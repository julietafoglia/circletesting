'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment = require(rootPath +
    '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002.children.agencyUser001;
const driverTimeOut = 0;

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdvertiser = entitiesObj.agency002.children.advertiser001;
const targetIo = targetAdvertiser.children.insertionOrder001;
const targetCampaign = targetIo.children.campaign001;
const targetLineItem = targetCampaign.children.lineItem001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let IoDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/insertion-order-details');
let CampaignDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/campaign-details');
let LineItemDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-details');
let SideBarPage = require(rootPath +
     '/pages/maverick/platform/side-bar');
let DashboardPage = require(rootPath +
     '/pages/maverick/campaign-manager/campaign-dashboard');
let loginPage;
let ioDetailsPage;
let campaignDetailsPage;
let lineItemDetailsPage;
let sideBarPage;
let dashboardPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /line-item-details {UI} @SS-AGENCY >>> ' +
    '(+) verify watching section >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        ioDetailsPage = new IoDetailsPage(driver);
        campaignDetailsPage = new CampaignDetailsPage(driver);
        lineItemDetailsPage = new LineItemDetailsPage(driver);
        dashboardPage = new DashboardPage(driver);
        sideBarPage = new SideBarPage(driver);
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

    it('should click watch link displayed', function(done) {
        ioDetailsPage.navigate(targetServer, 'advertisers',
            targetAdvertiser.refId);
        ioDetailsPage.clickCampaign(targetCampaign.name);
        campaignDetailsPage.clickLineItem(targetLineItem.name);

        lineItemDetailsPage.clickLinkWatch();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should navigate to dashboard page', function(done) {
        sideBarPage.clickCampaignManagerButton();
        dashboardPage.getWatchingLink();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('line item should be in watching section', function(done) {
        driver.navigate().refresh();
        dashboardPage.clickWatching();
        dashboardPage.getLinkText(targetLineItem.name);
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should unwatch line item', function(done) {
        campaignDetailsPage.clickLineItem(targetLineItem.name);
        lineItemDetailsPage.clickLinkUnwatch();
        sideBarPage.clickCampaignManagerButton();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('line item should not be in watching section', function(done) {
        dashboardPage.clickWatching();
        dashboardPage.getLinkTextNotDisplayed(targetLineItem.name);
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
