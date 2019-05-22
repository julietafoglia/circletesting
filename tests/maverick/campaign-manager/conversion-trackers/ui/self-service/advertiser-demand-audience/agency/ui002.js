'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;


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
const targetConv = targetAdv.children.pixel001;

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
let firstTrackerName = targetConv.name;
let firstTrackerId = targetConv.refId;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;

const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /conversion-trackers {ui} @SS-AGENCY-ADVERTISER >>> ' +
    '(+) create modal check >>>', function() {

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

    it('should check first tracker\'s code modal', function(done) {
        trackerPage.setInputSearchTracker(firstTrackerId);
        trackerPage.clickViewDetails(firstTrackerName)
            .then(() => done());
    });

    it('should assert code modal elements', function(done) {
        expect(trackerPage.getTrackerName()).to.exist;
        expect(trackerPage.getDivText('image')).to.exist;
        expect(trackerPage.getAttributionWindowButton()).to.exist;
        expect(trackerPage.getDivText('Attribution window will apply' +
            ' to post-view and post-click conversions.'));
        expect(trackerPage.getTrackerCloseDetailsButton()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should assert code section formatting', function(done) {
        trackerPage.clickImagePixel();
        expect(trackerPage.getCopyCodeLink()).to.exist;
        trackerPage.getTrackerCodeSection().getAttribute('value')
            .then(function(text) {
                expect(text.substr(0,10)).to.equal('<img src="');
                expect(text.substr(-3)).to.equal('"/>');
                expect(text).to.contain(firstTrackerId);
                driver.sleep(driverTimeOut).then(() => done());
            });
    });

    it('should close code modal', function(done) {
        trackerPage.clickCloseCodeModal();
        driver.sleep(driverTimeOut).then(() => done());
    });

});
