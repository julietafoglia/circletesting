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
let rtbNameEdited;
let rtbName;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /rtb-partners-form {Create} @MANAGER >>> ' +
    '(+) verify rtb-partners-form create process >>>', function() {

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

    it('should navigate to edit RTB Partners section', function(done) {
        loginPage.login(targetServer, targetUser);
        navBar.clickInternalTools();
        sideBar.clickRTBPartnerLink();
        rtbPartnerLibraryPage.waitUntilSpinnerDissapear();
        rtbPartnerLibraryPage.getColumnCreated().click();
        rtbPartnerLibraryPage.getColumnCreated().click();
        rtbPartnerLibraryPage.waitUntilSpinnerDissapear();
        rtbPartnerLibraryPage.clickEditRtbPartner();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should edit a RTB Partner', function(done) {
        rtbPartnerLibraryPage.getFirstRtbPartnerNameOnTable().getText()
            .then(function(name){
                rtbName = name;
                rtbNameEdited = name + '_edited';
                rtbPartnersFormPage.setName(rtbNameEdited);
                rtbPartnersFormPage.clickEditRtbPartner();
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should verify RTB edited', function(done) {
        rtbPartnerLibraryPage.waitUntilSpinnerDissapear();
        rtbPartnerLibraryPage.setInputSearch(rtbNameEdited);
        rtbPartnerLibraryPage.getFirstRtbPartnerNameOnTable()
            .getText().then(function(text){
                expect(text).to.equal(rtbNameEdited);
            });
        rtbPartnerLibraryPage.clickEditRtbPartner();
        rtbPartnersFormPage.setName(rtbName);
        rtbPartnersFormPage.clickEditRtbPartner();
        driver.sleep(driverTimeOut).then(() => done());
    });
});
