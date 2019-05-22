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
const targetCampaign = targetIo.children.campaign001;
const targetLineItem = targetCampaign.children.lineItem002;

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
let loginPage;
let ioDetailsPage;
let campaignDetailsPage;
let lineItemDetailsPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /line-item-details {DELETE} @SS-AGENCY-ADVERTISER >>> ' +
    '(+) delete line item>>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        ioDetailsPage = new IoDetailsPage(driver);
        campaignDetailsPage = new CampaignDetailsPage(driver);
        lineItemDetailsPage = new LineItemDetailsPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    before('maverick - login', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });


    it('line item details page should contain delete link', function(done) {
        ioDetailsPage.navigate(targetServer, 'advertisers',
            targetAdvertiser.refId);
        ioDetailsPage.clickCampaign(targetCampaign.name);
        campaignDetailsPage.clickLineItem(targetLineItem.name);
        lineItemDetailsPage.getLinkDelete();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should delete line item', function(done) {
        lineItemDetailsPage.clickLinkDelete();
        lineItemDetailsPage.clickCheckboxDelete();
        lineItemDetailsPage.clickConfirmValidDelete();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show deleted line item alert', function(done) {
        lineItemDetailsPage.getAlert();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should not show deleted line item', function(done) {
        lineItemDetailsPage.getLinkTextNotDisplayed(targetLineItem.name);
        driver.sleep(driverTimeOut).then(() => done());
    });

});
