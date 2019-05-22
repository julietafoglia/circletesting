'use strict';


// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.admin;
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
let advertiserName = 'Ader';
let trackerName = 'test1';

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;

const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /conversion-tracker {create} @MANAGER >>> ' +
    '(-) do not create conversion tracker  >>>', function() {

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

    it('should get login page', function(done) {
        loginPage.navigate(targetServer);
        driver.sleep(driverTimeOut).then(() => done());
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

    it('should create one advertiser with liveConnect tracker', function(done){
        trackerPage.setTrackerAdvertiser(advertiserName);
        trackerPage.setTrackerName(trackerName);
        trackerPage.clickTrackerName();
        trackerPage.clickTrackerCreate();
        driver.sleep(driverTimeOut).then(() => done());
    });


    it('should assert conversion tracker not created', function(done) {
        trackerPage.getAlertError()
            .then(() => done());
    });

});
