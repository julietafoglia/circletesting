'use strict';
// vendor dependencies
const chai = require('chai');
const moment = require('moment');
const expect = chai.expect;


// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.admin;
const driverTimeOut = 0;
const timeStamp = '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');
const rtbPartnerName = 'rtbPartner001 ' + timeStamp;
const bidUrl = 'https://www.test.com';

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

    it('should navigate to RTB Partners section', function(done) {
        loginPage.login(targetServer, targetUser);
        navBar.clickInternalTools();
        sideBar.clickRTBPartnerLink();
        rtbPartnerLibraryPage.getAddRtbPartnerButton().click();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should create a RTB Partner', function(done) {
        rtbPartnersFormPage.setName(rtbPartnerName);
        rtbPartnersFormPage.clickBidTypeDropdownButton();
        rtbPartnersFormPage.clickBidTypeDisplay();
        rtbPartnersFormPage.setCreativeSizes();
        rtbPartnersFormPage.clickProtocolDropdownButton();
        rtbPartnersFormPage.clickProtocolCriteo();
        rtbPartnersFormPage.clickAuctionTypeButton();
        rtbPartnersFormPage.clickAuctionTypeOne();
        rtbPartnersFormPage.clickUsEast();
        rtbPartnersFormPage.setBidUrl(bidUrl);
        rtbPartnersFormPage.clickCreateRtbPartner();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should verify RTB created', function(done) {
        rtbPartnerLibraryPage.setInputSearch(rtbPartnerName);
        rtbPartnerLibraryPage.getFirstRtbPartnerNameOnTable()
            .getText().then(function(text){
                expect(text).to.equal(rtbPartnerName);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });
});
