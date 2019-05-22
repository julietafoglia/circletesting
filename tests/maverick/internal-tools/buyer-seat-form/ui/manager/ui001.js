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

describe('{{MAVERICK}} /buyer-seat-form {UI} @MANAGER >>> ' +
    '(+) verify buyer-seat-form form ui elements >>>', function() {

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


    it('should display all Buyer Seat page elements', function(done) {
        buyerSeatForm.getBuyerSeatSubTitle().getText()
            .then(function(text) {
                expect(text).to.equal(buyerSeatForm.getSubTitleConst());
            });
        expect(buyerSeatForm.getBuyerSeatTitle()).to.exist;
        expect(buyerSeatForm.getNameTitleCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getNameInputCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getDescriptionTitleCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getDescriptionInputCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getRtbPartnerTitleCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getRtbPartnerInputCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getSeatIdTitleCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getSeatIdInputCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getCloseButtonCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getCreateButtonCreateBuyerSeat()).
            to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display Create Button Disabled when first ' +
        'opening modal', function(done) {
        buyerSeatForm.getCreateButtonCreateBuyerSeat().getAttribute('disabled')
            .then(function(disabled) {
                expect(disabled).to.equal('true');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });


    it('should show error message in blank Name field', function(done) {
        buyerSeatForm.clickNameInput();
        buyerSeatForm.clickDescribeInput();
        expect(buyerSeatForm.getErrorMessage()).to.exist;
        buyerSeatForm.getBuyerSeatSubTitle().getText()
            .then(function(text) {
                expect(text).to.equal(buyerSeatForm.getSubTitleConst());
            });
        expect(buyerSeatForm.getBuyerSeatTitle()).to.exist;
        expect(buyerSeatForm.getNameTitleCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getNameInputCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getDescriptionTitleCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getDescriptionInputCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getRtbPartnerTitleCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getRtbPartnerInputCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getSeatIdTitleCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getSeatIdInputCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getCloseButtonCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getCreateButtonCreateBuyerSeat()).
            to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show error message in blank Seat Id field', function(done) {
        buyerSeatForm.getCloseButtonCreateBuyerSeat().click();
        buyerSeatLibraryPage.clickCreateNewBuyerSeat();
        buyerSeatForm.clickSeatIdInput();
        buyerSeatForm.clickDescribeInput();
        expect(buyerSeatForm.getErrorMessage()).to.exist;
        buyerSeatForm.getBuyerSeatSubTitle().getText()
            .then(function(text) {
                expect(text).to.equal(buyerSeatForm.getSubTitleConst());
            });
        expect(buyerSeatForm.getBuyerSeatTitle()).to.exist;
        expect(buyerSeatForm.getNameTitleCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getNameInputCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getDescriptionTitleCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getDescriptionInputCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getRtbPartnerTitleCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getRtbPartnerInputCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getSeatIdTitleCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getSeatIdInputCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getCloseButtonCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getCreateButtonCreateBuyerSeat()).
            to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show error message in blank RTB Partner field', function(done) {
        buyerSeatForm.getCloseButtonCreateBuyerSeat().click();
        buyerSeatLibraryPage.clickCreateNewBuyerSeat();
        buyerSeatForm.clickRtbPartnerInput();
        buyerSeatForm.clickDescribeInput();
        expect(buyerSeatForm.getErrorMessage()).to.exist;
        buyerSeatForm.getBuyerSeatSubTitle().getText()
            .then(function(text) {
                expect(text).to.equal(buyerSeatForm.getSubTitleConst());
            });
        expect(buyerSeatForm.getBuyerSeatTitle()).to.exist;
        expect(buyerSeatForm.getNameTitleCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getNameInputCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getDescriptionTitleCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getDescriptionInputCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getRtbPartnerTitleCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getRtbPartnerInputCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getSeatIdTitleCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getSeatIdInputCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getCloseButtonCreateBuyerSeat()).to.exist;
        expect(buyerSeatForm.getCreateButtonCreateBuyerSeat()).
            to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show expected element after filtering ' +
    'RTB Partner', function(done) {
        buyerSeatForm.getCloseButtonCreateBuyerSeat().click();
        buyerSeatLibraryPage.clickCreateNewBuyerSeat();
        buyerSeatForm.waitUntilSpinnerNotVisible();
        buyerSeatForm.findRTBpartner(buyerSeatForm.getExpecPartResult());
        buyerSeatForm.getRtbPartnerOptions().getText()
            .then(function(text){
                buyerSeatForm.setInputRtbPartnerSearch(text);
                buyerSeatForm.getRtbPartnerSelected().getText()
                    .then(function(filter){
                        expect(filter).to.equal(text);
                    });
            });
        driver.sleep(driverTimeOut).then(() => done());
    });
});
