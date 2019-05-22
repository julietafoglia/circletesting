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
const buyerSeat = 'Buyer Seat';
const dataToSearch = 'xhub';
const expectedUserResult = 'XHUB';
const firstPage = '1';

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavBar = require(rootPath + '/pages/maverick/platform/nav-bar');
let SideBar = require(rootPath + '/pages/maverick/platform/side-bar');
let BuyerSeatLibraryPage = require(rootPath + '/pages/maverick/' +
    'internal-tools/buyer-seat-library');
let buyerSeatLibraryPage;
let navBar;
let loginPage;
let sideBar;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE-PROD> {{MAVERICK}} /buyer-seat-library {UI} @MANAGER >>> ' +
    '(+) verify buyer-seat-library library ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBar(driver);
        sideBar = new SideBar(driver);
        buyerSeatLibraryPage = new BuyerSeatLibraryPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should navigate to Buyer Seat section', function(done) {
        loginPage.login(targetServer, targetUser);
        navBar.closeOuterDiv();
        navBar.clickInternalTools();
        sideBar.clickBuyerSeatLink();
        driver.sleep(driverTimeOut).then(() => done());
    });


    it('should display all Buyer Seat page elements', function(done) {
        buyerSeatLibraryPage.getTitleBuyerSeat().getText()
            .then(function(text) {
                expect(text).to.equal(buyerSeat);
            });
        expect(buyerSeatLibraryPage.getCreateNewButton()).to.exist;
        expect(buyerSeatLibraryPage.getInputSearch()).to.exist;
        expect(buyerSeatLibraryPage.getFirstControlButton()).to.exist;
        expect(buyerSeatLibraryPage.getPreviousControlButton()).to.exist;
        expect(buyerSeatLibraryPage.getNextControlButton()).to.exist;
        expect(buyerSeatLibraryPage.getLastControlButton()).to.exist;
        expect(buyerSeatLibraryPage.getTable()).to.exist;
        expect(buyerSeatLibraryPage.getColumnBuyerName()).to.exist;
        expect(buyerSeatLibraryPage.getColumnDsp()).to.exist;
        expect(buyerSeatLibraryPage.getColumnSeatId()).to.exist;
        expect(buyerSeatLibraryPage.getColumnCreated()).to.exist;
        expect(buyerSeatLibraryPage.getColumnModified()).to.exist;
        expect(buyerSeatLibraryPage.getLinkEditList()).to.exist;
        expect(buyerSeatLibraryPage.getShowingView()).to.exist;
        expect(buyerSeatLibraryPage.getPageView()).to.exist;
        expect(buyerSeatLibraryPage.getRowsSelect()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show expected element after filtering table', function(done) {
        buyerSeatLibraryPage.setInputSearch(dataToSearch);
        expect(buyerSeatLibraryPage.getRemoveFilterOption(dataToSearch))
            .to.exist;
        expect(buyerSeatLibraryPage.getFirstBuyerNameOnTable()).to.exist;
        buyerSeatLibraryPage.getFirstBuyerNameOnTable().getText()
            .then(function(text) {
                expect(text).to.equal(expectedUserResult);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should not show filtered element in first row after removing' +
     ' filter', function(done) {
        buyerSeatLibraryPage.removeFilterOption(dataToSearch);
        buyerSeatLibraryPage.waitUntilSpinnerDissapear();
        buyerSeatLibraryPage.getFirstBuyerNameOnTable().getText()
            .then(function(text) {
                expect(text).to.not.equal(expectedUserResult);
            });
        expect(buyerSeatLibraryPage.getTable()).to.exist;
        expect(buyerSeatLibraryPage.getColumnBuyerName()).to.exist;
        expect(buyerSeatLibraryPage.getColumnDsp()).to.exist;
        expect(buyerSeatLibraryPage.getColumnSeatId()).to.exist;
        expect(buyerSeatLibraryPage.getColumnCreated()).to.exist;
        expect(buyerSeatLibraryPage.getColumnModified()).to.exist;
        expect(buyerSeatLibraryPage.getLinkEditList()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough Next table pages', function(done) {
        buyerSeatLibraryPage.waitUntilNextControlButtonEnabled();
        buyerSeatLibraryPage.clickNextPageTableControl();
        buyerSeatLibraryPage.waitUntilFirstControlButtonEnabled();
        buyerSeatLibraryPage.waitUntilPreviousControlButtonEnabled();
        expect(buyerSeatLibraryPage.getInputSearch()).to.exist;
        expect(buyerSeatLibraryPage.getTable()).to.exist;
        expect(buyerSeatLibraryPage.getColumnBuyerName()).to.exist;
        expect(buyerSeatLibraryPage.getColumnDsp()).to.exist;
        expect(buyerSeatLibraryPage.getColumnSeatId()).to.exist;
        expect(buyerSeatLibraryPage.getColumnCreated()).to.exist;
        expect(buyerSeatLibraryPage.getColumnModified()).to.exist;
        expect(buyerSeatLibraryPage.getLinkEditList()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough Previous table pages', function(done) {
        buyerSeatLibraryPage.clickPreviousPageTableControl();
        buyerSeatLibraryPage.waitUntilFirstControlButtonDisabled();
        buyerSeatLibraryPage.waitUntilPreviousControlButtonDisabled();
        expect(buyerSeatLibraryPage.getInputSearch()).to.exist;
        expect(buyerSeatLibraryPage.getTable()).to.exist;
        expect(buyerSeatLibraryPage.getColumnBuyerName()).to.exist;
        expect(buyerSeatLibraryPage.getColumnDsp()).to.exist;
        expect(buyerSeatLibraryPage.getColumnSeatId()).to.exist;
        expect(buyerSeatLibraryPage.getColumnCreated()).to.exist;
        expect(buyerSeatLibraryPage.getColumnModified()).to.exist;
        expect(buyerSeatLibraryPage.getLinkEditList()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough Last table pages', function(done) {
        buyerSeatLibraryPage.waitUntilLastControlButtonEnabled();
        buyerSeatLibraryPage.clickLastPageTableControl();
        buyerSeatLibraryPage.waitUntilLastControlButtonDisabled();
        buyerSeatLibraryPage.waitUntilNextControlButtonDisabled();
        expect(buyerSeatLibraryPage.getInputSearch()).to.exist;
        expect(buyerSeatLibraryPage.getTable()).to.exist;
        expect(buyerSeatLibraryPage.getColumnBuyerName()).to.exist;
        expect(buyerSeatLibraryPage.getColumnDsp()).to.exist;
        expect(buyerSeatLibraryPage.getColumnSeatId()).to.exist;
        expect(buyerSeatLibraryPage.getColumnCreated()).to.exist;
        expect(buyerSeatLibraryPage.getColumnModified()).to.exist;
        expect(buyerSeatLibraryPage.getLinkEditList()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it ('should show last page in page number', function(done) {
        buyerSeatLibraryPage.getPageView().getText()
            .then(function(text) {
                let lastPage = text.split(' ')[3];
                let actualPage = text.split(' ')[1];
                expect(lastPage).to.equal(actualPage);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough First table pages', function(done) {
        buyerSeatLibraryPage.waitUntilFirstControlButtonEnabled();
        buyerSeatLibraryPage.clickFirstPageTableControl();
        buyerSeatLibraryPage.waitUntilFirstControlButtonDisabled();
        buyerSeatLibraryPage.waitUntilPreviousControlButtonDisabled();
        expect(buyerSeatLibraryPage.getInputSearch()).to.exist;
        expect(buyerSeatLibraryPage.getTable()).to.exist;
        expect(buyerSeatLibraryPage.getColumnBuyerName()).to.exist;
        expect(buyerSeatLibraryPage.getColumnDsp()).to.exist;
        expect(buyerSeatLibraryPage.getColumnSeatId()).to.exist;
        expect(buyerSeatLibraryPage.getColumnCreated()).to.exist;
        expect(buyerSeatLibraryPage.getColumnModified()).to.exist;
        expect(buyerSeatLibraryPage.getLinkEditList()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it ('should show number 1 in page number', function(done) {
        buyerSeatLibraryPage.getPageView().getText()
            .then(function(text) {
                let actualPage = text.split(' ')[1];
                expect(firstPage).to.equal(actualPage);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });
});
