'use strict';
// vendor dependencies
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');


// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.admin;
const driverTimeOut = 0;
const timeStamp = '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');
const seatName = 'buyerSeat001 ' + timeStamp;
const seatNameEdited = '-edited-' + seatName ;
const rtbPartnerSearch = 'live';
const rtbPartnerSearch2 = 'a';
const seatId = Math.floor(Math.random() * (9998) + 1);
const seatId2 = seatId + 1;
let DSP;

let driver; // initialized during test runtime

// selenium page object(s)
// initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavBar = require(rootPath + '/pages/maverick/platform/nav-bar');
let SideBar = require(rootPath + '/pages/maverick/platform/side-bar');
let BuyerSeatForm = require(rootPath + '/pages/maverick/' +
    'internal-tools/buyer-seat-form');
let BuyerSeatLibraryPage = require(rootPath + '/pages/maverick/' +
    'internal-tools/buyer-seat-library');
let buyerSeatForm;
let buyerSeatLibraryPage;
let navBar;
let loginPage;
let sideBar;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /buyer-seat-form {Edit} @MANAGER >>> ' +
    '(+) verify buyer-seat-form edit process >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBar(driver);
        sideBar = new SideBar(driver);
        buyerSeatForm = new BuyerSeatForm(driver);
        buyerSeatLibraryPage = new BuyerSeatLibraryPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should Create New Buyer Seat', function(done) {
        loginPage.login(targetServer, targetUser);
        navBar.clickInternalTools();
        sideBar.clickBuyerSeatLink();
        expect(buyerSeatLibraryPage.getCreateNewButton()).to.exist;
        buyerSeatLibraryPage.clickCreateNewBuyerSeat();
        buyerSeatForm.createBuyerSeat(seatName, rtbPartnerSearch, seatId);
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should edit Buyer Seat DSP', function(done) {
        buyerSeatLibraryPage.setInputSearch(seatName);
        buyerSeatLibraryPage.getFirstBuyerNameOnTable().getText()
            .then(function(text) {
                expect(text).to.equal(seatName);
            });
        buyerSeatForm.clickEditBuyerSeat();
        buyerSeatForm.clickDsptButton();
        buyerSeatForm.findRTBpartner(rtbPartnerSearch2);
        buyerSeatForm.getRtbPartnerOptions().getText().
            then(function(text){
                DSP = text.split(': ')[1];
                buyerSeatForm.setInputRtbPartnerSearch(text);
            });
        buyerSeatForm.clickEditBuyerSeatButton();
        driver.navigate().refresh();
        buyerSeatLibraryPage.waitUntilSpinnerDissapear();
        buyerSeatLibraryPage.setInputSearch(seatName);
        expect(buyerSeatLibraryPage.getRemoveFilterOption()).to.exist;
        expect(buyerSeatLibraryPage.getFirstBuyerNameOnTable()).to.exist;
        buyerSeatLibraryPage.getDSPOnTable().getText().
            then(function(text) {
                expect(text).to.equal(DSP);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should edit Buyer Seat Seat Id', function(done) {
        driver.navigate().refresh();
        buyerSeatLibraryPage.waitUntilSpinnerDissapear();
        buyerSeatLibraryPage.setInputSearch(seatName);
        buyerSeatLibraryPage.getFirstBuyerNameOnTable().getText().
            then(function(text) {
                expect(text).to.equal(seatName);
            });
        buyerSeatForm.clickEditBuyerSeat();
        buyerSeatForm.setSeatId(seatId2);
        buyerSeatForm.clickEditBuyerSeatButton();
        driver.navigate().refresh();
        buyerSeatLibraryPage.waitUntilSpinnerDissapear();
        buyerSeatLibraryPage.setInputSearch(seatName);
        expect(buyerSeatLibraryPage.getRemoveFilterOption()).to.exist;
        expect(buyerSeatLibraryPage.getFirstBuyerNameOnTable()).to.exist;
        buyerSeatLibraryPage.getSeatIdOnTable().getText().
            then(function(text) {
                expect(text).to.equal(seatId2.toString());
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should edit Buyer Seat Name', function(done) {
        driver.navigate().refresh();
        buyerSeatLibraryPage.waitUntilSpinnerDissapear();
        buyerSeatLibraryPage.setInputSearch(seatName);
        buyerSeatLibraryPage.getFirstBuyerNameOnTable().getText().
            then(function(text) {
                expect(text).to.equal(seatName);
            });
        buyerSeatForm.clickEditBuyerSeat();
        buyerSeatForm.setInputName(seatNameEdited);
        buyerSeatForm.clickEditBuyerSeatButton();
        driver.navigate().refresh();
        buyerSeatLibraryPage.waitUntilSpinnerDissapear();
        buyerSeatLibraryPage.setInputSearch(seatNameEdited);
        expect(buyerSeatLibraryPage.getFirstBuyerNameOnTable()).to.exist;
        buyerSeatLibraryPage.getFirstBuyerNameOnTable().getText().
            then(function(text) {
                expect(text).to.equal(seatNameEdited);
            });
        buyerSeatLibraryPage.removeFilterOption();
        driver.sleep(driverTimeOut).then(() => done());
    });
});
