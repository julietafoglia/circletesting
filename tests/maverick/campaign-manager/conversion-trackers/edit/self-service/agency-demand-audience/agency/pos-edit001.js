'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002.children.agencyUser001;

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv = entitiesObj.agency002.children.advertiser001;
const targetConv = targetAdv.children.pixel001;
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
let tracker = {
    advertiserName: '',
    oldTrackerName: targetConv.name,
    oldTrackerId: targetConv.refId,
    name: '000 edited tracker'
};

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;

const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /conversion-trackers {edit} @SS-AGENCY >>> ' +
    '(+) should edit tracker >>>', function() {

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

    it('should edit tracker name', function(done) {
        trackerPage.setInputSearchTracker(tracker.oldTrackerId);
        trackerPage.editTrackerName(tracker.oldTrackerName, tracker.name);
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should assert tracker name change', function(done) {
        expect(trackerPage.getTableTracker(tracker.name)).to.exist;
        expect(
            trackerPage.dontGetTableTracker(tracker.oldTrackerName)).to.be.ok;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should re-edit tracker name', function(done) {
        trackerPage.editTrackerName(tracker.name, tracker.oldTrackerName);
        driver.sleep(driverTimeOut).then(() => done());
    });

});
