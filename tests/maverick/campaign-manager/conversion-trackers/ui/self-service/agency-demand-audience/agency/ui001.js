'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');


// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002.children.agencyUser001;
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
    name: 'Test Tracker Name ' + moment().format()
};

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;

const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /conversion-trackers {ui} @SS-AGENCY >>> ' +
    '(+) page display check >>>', function() {

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

    it('should go to Conversion Tracers page', function(done) {
        sidebar.clickConversionsLinks()
            .then(() => done());
    });

    it('should assert Conversion Tracker Elements', function(done) {
        expect(trackerPage.getNewTrackerButton()).to.exist;
        expect(trackerPage.getTrackerTable()).to.exist;
        expect(trackerPage.getTrackerSearchField()).to.exist;
        expect(trackerPage.getTrackerTotal()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display new URL when opening new tracker modal', function(done) {
        trackerPage.clickNewTracker();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should assert tracker create modal elements', function(done) {
        expect(trackerPage.getAdvertiserField()).to.exist;
        expect(trackerPage.getTrackerName()).to.exist;
        expect(trackerPage.getTrackerTypeDropdown()).to.exist;
        expect(trackerPage.getAttributionWindowButton()).to.exist;
        expect(trackerPage.getDivText('Attribution window will apply' +
            ' to post-view and post-click conversions.'));
        expect(trackerPage.getTrackerCloseButton()).to.exist;
        expect(trackerPage.getTrackerCreateButton()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should assert attribution window options', function(done) {
        trackerPage.clickAttributionWindowButton();
        expect(trackerPage.getSpan('30 Days')).to.exist;
        expect(trackerPage.getSpan('14 Days')).to.exist;
        expect(trackerPage.getSpan('7 Days')).to.exist;
        expect(trackerPage.getSpan('3 Days')).to.exist;
        expect(trackerPage.getSpan('1 Day')).to.exist;
        trackerPage.clickAttributionWindowButton();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should assert create button disabled correctly', function(done){
        trackerPage.getTrackerCreateButton().getAttribute('disabled')
            .then(function(attr) {
                expect(attr).to.be.ok;
            });
        trackerPage.setTrackerAdvertiser('adv001');

        trackerPage.getTrackerCreateButton().getAttribute('disabled')
            .then(function(attr) {
                expect(attr).to.be.ok;
            });
        trackerPage.setTrackerName(tracker.name);
        trackerPage.getTrackerCreateButton().getAttribute('disabled')
            .then(function(attr) {
                expect(attr).to.be.not.ok;
            });
        trackerPage.clickTrackerName();
        trackerPage.waitForButtonEnabled();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should assert close button closes modal', function(done){
        trackerPage.clickCloseButton();
        driver.sleep(driverTimeOut).then(() => done());
    });

});
