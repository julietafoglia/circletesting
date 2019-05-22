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
    'verify rtb-partners-form data center ui elements >>>', function() {

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
        expect(rtbPartnersFormPage.getDataCenterToAdd()).to.exist;
        expect(rtbPartnersFormPage.getDataCenterToAddClose()).to.exist;
        expect(rtbPartnersFormPage.getDataCenterLabel()).to.exist;
        expect(rtbPartnersFormPage.getUsEastSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsEastText()).to.exist;
        expect(rtbPartnersFormPage.getUsWestSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsWestText()).to.exist;
        expect(rtbPartnersFormPage.getUsEmeaSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsEmeaText()).to.exist;
        expect(rtbPartnersFormPage.getUsApacSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsApactext()).to.exist;
        expect(rtbPartnersFormPage.getUsLatamSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsLatamText()).to.exist;
        expect(rtbPartnersFormPage.getQpsLabel()).to.exist;
        expect(rtbPartnersFormPage.getQpsInput()).to.exist;
        expect(rtbPartnersFormPage.getBidUrlLabel()).to.exist;
        expect(rtbPartnersFormPage.getBidUrlInput()).to.exist;
        expect(rtbPartnersFormPage.getAddDataCenterLink()).to.exist;

        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should set the selected input elements', function(done) {

        rtbPartnersFormPage.clickUsEast();
        expect(rtbPartnersFormPage.getUsEastSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsEastText()).to.exist;
        expect(rtbPartnersFormPage.getUsWestSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsWestText()).to.exist;
        expect(rtbPartnersFormPage.getUsEmeaSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsEmeaText()).to.exist;
        expect(rtbPartnersFormPage.getUsApacSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsApactext()).to.exist;
        expect(rtbPartnersFormPage.getUsLatamSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsLatamText()).to.exist;

        rtbPartnersFormPage.clickUsWest();
        expect(rtbPartnersFormPage.getUsEastSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsEastText()).to.exist;
        expect(rtbPartnersFormPage.getUsWestSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsWestText()).to.exist;
        expect(rtbPartnersFormPage.getUsEmeaSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsEmeaText()).to.exist;
        expect(rtbPartnersFormPage.getUsApacSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsApactext()).to.exist;
        expect(rtbPartnersFormPage.getUsLatamSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsLatamText()).to.exist;

        rtbPartnersFormPage.clickEmea();
        expect(rtbPartnersFormPage.getUsEastSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsEastText()).to.exist;
        expect(rtbPartnersFormPage.getUsWestSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsWestText()).to.exist;
        expect(rtbPartnersFormPage.getUsEmeaSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsEmeaText()).to.exist;
        expect(rtbPartnersFormPage.getUsApacSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsApactext()).to.exist;
        expect(rtbPartnersFormPage.getUsLatamSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsLatamText()).to.exist;

        rtbPartnersFormPage.clickApac();
        expect(rtbPartnersFormPage.getUsEastSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsEastText()).to.exist;
        expect(rtbPartnersFormPage.getUsWestSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsWestText()).to.exist;
        expect(rtbPartnersFormPage.getUsEmeaSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsEmeaText()).to.exist;
        expect(rtbPartnersFormPage.getUsApacSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsApactext()).to.exist;
        expect(rtbPartnersFormPage.getUsLatamSelection()).to.exist;
        expect(rtbPartnersFormPage.getUsLatamText()).to.exist;

        driver.sleep(driverTimeOut).then(() => done());
    });

});
