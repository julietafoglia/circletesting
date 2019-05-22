'use strict';
// vendor dependencies
const chai = require('chai');
const expect = chai.expect;


// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.admin;
const driverTimeOut = 0;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavBar = require(rootPath + '/pages/maverick/platform/nav-bar');
let SideBar = require(rootPath + '/pages/maverick/platform/side-bar');
let RtbPartnersFormPage = require(rootPath + '/pages/maverick/' +
    'internal-tools/rtb-partners-form');
let RtbPartnerLibraryPage = require(rootPath + '/pages/maverick/' +
    'internal-tools/rtb-partners-library');
let rtbPartnersFormPage;
let rtbPartnerLibraryPage;
let navBar;
let loginPage;
let sideBar;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE-PROD> {{MAVERICK}} /rtb-partners-form {UI} @MANAGER >>> (+) ' +
    'verify rtb-partners-form business settings ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBar(driver);
        sideBar = new SideBar(driver);
        rtbPartnersFormPage = new RtbPartnersFormPage(driver);
        rtbPartnerLibraryPage = new RtbPartnerLibraryPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should navigate to RTB Partners section', function(done) {
        loginPage.login(targetServer, targetUser);
        navBar.clickInternalTools();
        sideBar.clickRTBPartnerLink();
        rtbPartnerLibraryPage.waitUntilSpinnerDissapear();
        rtbPartnerLibraryPage.clickAddRtbPartner();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display all RTB Partners page elements', function(done) {
        expect(rtbPartnersFormPage.getProgramaticFeeLabel()).to.exist;
        expect(rtbPartnersFormPage.getProgramaticFeeInput()).to.exist;
        expect(rtbPartnersFormPage.getBudgetLabel()).to.exist;
        expect(rtbPartnersFormPage.getBudgetInput()).to.exist;
        expect(rtbPartnersFormPage.getBudgetDailyCapLabel()).to.exist;
        expect(rtbPartnersFormPage.getBudgetDailyCapInput()).to.exist;
        expect(rtbPartnersFormPage.getReduceBidInput()).to.exist;
        expect(rtbPartnersFormPage.getReduceBidText()).to.exist;

        driver.sleep(driverTimeOut).then(() => done());
    });

});
