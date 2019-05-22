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

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime

let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavItems = require(rootPath + '/pages/maverick/platform/nav-bar');
let loginPage;
let navItems;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /campaign-dashboard {UI} @SS-AGENCY >>> ' +
    '(+) verify navigation ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navItems = new NavItems(driver);
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

    it('should assert nav items', function(done) {
        expect(navItems.getHomeButton()).to.exist;
        expect(navItems.getSearchBox()).to.exist;
        expect(navItems.getProfileDropdown()).to.exist;
        driver.sleep(0).then(() => done());
    });

    it('should assert profile drop down elements when clicked', function(done) {
        navItems.clickProfile();
        expect(navItems.getUserIcon()).to.exist;
        expect(navItems.getUserName()).to.exist;
        expect(navItems.getUserEmail()).to.exist;
        navItems.clickProfile();
        driver.sleep(0).then(() => done());
    });

    it('should log out from qa', function(done) {
        navItems.logout()
            .then(() => done());
    });

    it('should go back to /login', function(done) {
        navItems.getCurrentUrl()
            .then(function(currentUrl) {
                expect(currentUrl).to.contain('/login');
                done();
            });
    });

});
