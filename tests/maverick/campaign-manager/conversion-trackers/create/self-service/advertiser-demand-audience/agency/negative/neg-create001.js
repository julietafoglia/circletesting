'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002
    .children.advertiser001
    .children.advertiserUser001;
const driverTimeOut = 0;

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
let emptyString = '        ';

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;

const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /conversion-tracker {create}' +
    ' @SS-AGENCY-ADVERTISER >>> ' +
    '(-) do not create conversion tracker  >>>', function() {

    // disable mocha time outs
    this.timeout(driverTimeOut);

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
        /* trackerPage.getCurrentUrl().then(function(url){
            expect(url).to.contain('/new');
        });*/
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should fill modal with invalid name', function(done) {
        trackerPage.setTrackerAdvertiser('adv001');
        trackerPage.setTrackerName(emptyString);
        trackerPage.clickTrackerName();
        trackerPage.clickTrackerCreate();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should assert conversion tracker not created', function(done) {
        trackerPage.getAlertError()
            .then(() => done());
    });

});
