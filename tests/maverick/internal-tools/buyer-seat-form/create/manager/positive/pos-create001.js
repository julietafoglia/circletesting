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
const expectedrtbPartnerResult = 'live';
const seatId = Math.floor(Math.random() * (9998) + 1);

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
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
let DSP;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /buyer-seat-form {Create} @MANAGER >>> ' +
    '(+) verify buyer-seat-form create process >>>', function() {

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

    it('should navigate to Create New Buyer Seat section', function(done) {
        loginPage.login(targetServer, targetUser);
        navBar.clickInternalTools();
        sideBar.clickBuyerSeatLink();
        expect(buyerSeatLibraryPage.getCreateNewButton()).to.exist;
        buyerSeatLibraryPage.clickCreateNewBuyerSeat();
        driver.sleep(driverTimeOut).then(() => done());
    });


    it('should display Buyer Seat recently created', function(done) {
        buyerSeatForm.setInputName(seatName);
        buyerSeatForm.setInputDescription(seatName);
        buyerSeatForm.findRTBpartner(expectedrtbPartnerResult);
        buyerSeatForm.getRtbPartnerOptions().getText().
            then(function(text){
                DSP = text.split(': ')[1];
                buyerSeatForm.setInputRtbPartnerSearch(text);
            });
        buyerSeatForm.setSeatId(seatId);
        buyerSeatForm.clickCreateBuyerSeatButton();
        buyerSeatLibraryPage.setInputSearch(seatName);
        expect(buyerSeatLibraryPage.getRemoveFilterOption()).to.exist;
        expect(buyerSeatLibraryPage.getFirstBuyerNameOnTable()).to.exist;
        buyerSeatLibraryPage.getFirstBuyerNameOnTable().getText().
            then(function(text) {
                expect(text).to.equal(seatName);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display the correct DSP', function(done) {
        expect(buyerSeatLibraryPage.getRemoveFilterOption()).to.exist;
        expect(buyerSeatLibraryPage.getSeatIdOnTable()).to.exist;
        buyerSeatLibraryPage.getDSPOnTable().getText().
            then(function(text) {
                expect(text).to.equal(DSP);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display the correct Seat Id', function(done) {
        expect(buyerSeatLibraryPage.getRemoveFilterOption()).to.exist;
        expect(buyerSeatLibraryPage.getSeatIdOnTable()).to.exist;
        buyerSeatLibraryPage.getSeatIdOnTable().getText().
            then(function(text) {
                expect(text).to.equal(seatId.toString());
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

});
