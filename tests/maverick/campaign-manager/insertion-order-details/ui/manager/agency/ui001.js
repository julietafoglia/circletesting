'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.admin;
const driverTimeOut = 0;

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdvertiser = entitiesObj.agency001.children.advertiser001;
const targetIo = targetAdvertiser.children.insertionOrder001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath +
    '/pages/maverick/platform/login');
let IoDetailsPage = require(rootPath +
    '/pages/maverick/campaign-manager/insertion-order-details');
let CampaignDetailsPage = require(rootPath +
    '/pages/maverick/campaign-manager/campaign-details');
let BasePage = require(rootPath +
     '/pages/maverick/index');
let basePage;
let loginPage;
let ioDetailsPage;
let campaignDetailsPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer =
    targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/insertion-order/create001-verify');
let testData001 = Object.assign({}, testFixture);
testData001.startDate = moment().format('MMM D, YYYY');
testData001.endDate = moment().add(30, 'days').format('MMM D, YYYY');

describe('{{MAVERICK}} /insertion-order-details {UI} @MANAGER >>> ' +
    '(+) verify insertion order table elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        basePage = new BasePage(driver);
        ioDetailsPage = new IoDetailsPage(driver);
        campaignDetailsPage = new CampaignDetailsPage(driver);
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

    it('io table should have all elements', function(done) {
        basePage.navigate(targetServer, 'advertisers', targetAdvertiser.refId);

        campaignDetailsPage.getTableName(targetIo.name).then(function(element) {
            expect(element).to.exist;
        });
        ioDetailsPage.getIOTableId('ID: ' + targetIo.id)
            .then(function(element) {
                expect(element).to.exist;
            });
        ioDetailsPage.getIOTableBudget('$1,000,000.00')
            .then(function(element) {
                expect(element).to.exist;
            });
        ioDetailsPage.getIOTableSpent('$0.00')
            .then(function(element) {
                expect(element).to.exist;
            });
        ioDetailsPage.getIOTableDate(testData001.startDate)
            .then(function(element) {
                expect(element).to.exist;
            });
        ioDetailsPage.getIOTableDate(testData001.endDate)
            .then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
