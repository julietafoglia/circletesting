'use strict';

// vendor dependencies
const moment = require('moment');


// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002
    .children.advertiser001
    .children.advertiserUser001;
const driverTimeOut = 0;

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv = entitiesObj.agency002.children.advertiser001;

// selenium runtime variables
let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime

let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let SideBar = require(rootPath + '/pages/maverick/platform/side-bar');
let TrackerPage = require(rootPath +
    '/pages/maverick/campaign-manager/conversion-tracker');
let loginPage;
let sidebar;
let trackerPage;
let tracker = {
    advertiserName: targetAdv.name,
    name: 'Test Tracker Name ' + moment().format().slice(0,-6)
};

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;

const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /conversion-trackers {create} ' +
    '@SS-AGENCY-ADVERTISER >>> ' +
    '(+) tracker create for non-selected publisher >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        sidebar = new SideBar(driver);
        trackerPage = new TrackerPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should login to maverick', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('should go to Conversion Trackers page', function(done) {
        sidebar.clickConversionsLinks()
            .then(() => done());
    });

    it('should display new URL when opening new tracker modal', function(done) {
        trackerPage.clickNewTracker();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should fill modal with valid data', function(done) {
        trackerPage.setTrackerAdvertiser('adv001');
        trackerPage.setTrackerName('    ');
        trackerPage.clickTrackerName();
        trackerPage.clickTrackerCreate();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should assert conversion tracker not displayed', function(done) {
        trackerPage.getAlertError();
        trackerPage.dontGetTableTracker(tracker.name);
        driver.sleep(driverTimeOut).then(() => done());
    });

});
