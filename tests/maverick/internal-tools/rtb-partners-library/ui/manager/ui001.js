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
const rtbTitle = 'RTB Partner Manager';
const firstPage = '1';
const defaultRows = '10';

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavBar = require(rootPath + '/pages/maverick/platform/nav-bar');
let SideBar = require(rootPath + '/pages/maverick/platform/side-bar');
let RtbPartnerLibraryPage = require(rootPath + '/pages/maverick/' +
    'internal-tools/rtb-partners-library');
let rtbPartnerLibraryPage;
let navBar;
let loginPage;
let sideBar;
let searchedName;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE-PROD> {{MAVERICK}} /rtb-partners-library {UI} @MANAGER >>> ' +
    '(+) verify rtb-partners-library library ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBar(driver);
        sideBar = new SideBar(driver);
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
        driver.sleep(driverTimeOut).then(() => done());
    });


    it('should display all RTB Partners page elements', function(done) {
        rtbPartnerLibraryPage.getTitleRtbPartner().getText()
            .then(function(text) {
                expect(text).to.equal(rtbTitle);
            });
        expect(rtbPartnerLibraryPage.getAddRtbPartnerButton()).to.exist;
        expect(rtbPartnerLibraryPage.getInputSearch()).to.exist;
        expect(rtbPartnerLibraryPage.getFirstControlButton()).to.exist;
        expect(rtbPartnerLibraryPage.getPreviousControlButton()).to.exist;
        expect(rtbPartnerLibraryPage.getNextControlButton()).to.exist;
        expect(rtbPartnerLibraryPage.getLastControlButton()).to.exist;
        expect(rtbPartnerLibraryPage.getTable()).to.exist;
        expect(rtbPartnerLibraryPage.getRtbPartnerName()).to.exist;
        expect(rtbPartnerLibraryPage.getColumnStatus()).to.exist;
        expect(rtbPartnerLibraryPage.getColumnBudget()).to.exist;
        expect(rtbPartnerLibraryPage.getColumnSpent()).to.exist;
        expect(rtbPartnerLibraryPage.getColumnDailyCap()).to.exist;
        expect(rtbPartnerLibraryPage.getColumnCreated()).to.exist;
        expect(rtbPartnerLibraryPage.getColumnUpdated()).to.exist;
        expect(rtbPartnerLibraryPage.getLinkEditList()).to.exist;
        expect(rtbPartnerLibraryPage.getLinkDeleteList()).to.exist;
        expect(rtbPartnerLibraryPage.getShowingView()).to.exist;
        expect(rtbPartnerLibraryPage.getPageView()).to.exist;
        expect(rtbPartnerLibraryPage.getRowsSelect()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it ('should show 10 rows in table by default', function(done) {
        rtbPartnerLibraryPage.getRowsNumber().then(function(rows){
            expect(rows.length).to.be.most(defaultRows);
        });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it ('should show 5 rows in table by default', function(done) {
        rtbPartnerLibraryPage.clickGetRowsSelect();
        rtbPartnerLibraryPage.selectFiveRows();
        rtbPartnerLibraryPage.waitUntilFilterNotVisible();
        rtbPartnerLibraryPage.getRowsSelectNumber().getText()
            .then(function(text){
                rtbPartnerLibraryPage.getRowsNumber().then(function(rows){
                    expect(text.split(' ')[0]).to.most(rows);
                });
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it ('should show 25 rows in table by default', function(done) {
        rtbPartnerLibraryPage.clickGetRowsSelect();
        rtbPartnerLibraryPage.selectTwentyFiveRows();
        rtbPartnerLibraryPage.waitUntilFilterNotVisible();
        rtbPartnerLibraryPage.getRowsSelectNumber().getText()
            .then(function(text){
                rtbPartnerLibraryPage.getRowsNumber().then(function(rows){
                    expect(text.split(' ')[0]).to.most(rows);
                });
            });
        driver.sleep(driverTimeOut).then(() => done());
    });


    it('should show expected element after filtering table', function(done) {
        rtbPartnerLibraryPage.getSecondRtbPartnerNameOnTable().getText()
            .then(function(secondRTB){
                searchedName = secondRTB;
                rtbPartnerLibraryPage.setInputSearch(searchedName);
                rtbPartnerLibraryPage.waitUntilFilterStale();
                rtbPartnerLibraryPage.getFirstRtbPartnerNameOnTable().getText()
                    .then(function(text) {
                        expect(text).to.equal(searchedName);
                    });
                rtbPartnerLibraryPage.removeFilterOption(searchedName);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should not show filtered element in first row after removing' +
     ' filter', function(done) {
        rtbPartnerLibraryPage.waitUntilSpinnerDissapear();
        rtbPartnerLibraryPage.getFirstRtbPartnerNameOnTable().getText()
            .then(function(text) {
                expect(text).to.not.equal(searchedName);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate through Next table pages', function(done) {
        rtbPartnerLibraryPage.waitUntilNextControlButtonEnabled();
        rtbPartnerLibraryPage.clickNextPageTableControl();
        rtbPartnerLibraryPage.waitUntilFirstControlButtonEnabled();
        rtbPartnerLibraryPage.waitUntilPreviousControlButtonEnabled();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate through Previous table pages', function(done) {
        rtbPartnerLibraryPage.clickPreviousPageTableControl();
        rtbPartnerLibraryPage.waitUntilFirstControlButtonDisabled();
        rtbPartnerLibraryPage.waitUntilPreviousControlButtonDisabled();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate through Last table pages', function(done) {
        rtbPartnerLibraryPage.waitUntilLastControlButtonEnabled();
        rtbPartnerLibraryPage.clickLastPageTableControl();
        rtbPartnerLibraryPage.waitUntilLastControlButtonDisabled();
        rtbPartnerLibraryPage.waitUntilNextControlButtonDisabled();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it ('should show last page in page number', function(done) {
        rtbPartnerLibraryPage.getPageView().getText()
            .then(function(text) {
                let lastPage = text.split(' ')[3];
                let actualPage = text.split(' ')[1];
                expect(lastPage).to.equal(actualPage);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate through First table pages', function(done) {
        rtbPartnerLibraryPage.waitUntilFirstControlButtonEnabled();
        rtbPartnerLibraryPage.clickFirstPageTableControl();
        rtbPartnerLibraryPage.waitUntilFirstControlButtonDisabled();
        rtbPartnerLibraryPage.waitUntilPreviousControlButtonDisabled();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it ('should show number 1 in page number', function(done) {
        rtbPartnerLibraryPage.getPageView().getText()
            .then(function(text) {
                let actualPage = text.split(' ')[1];
                expect(firstPage).to.equal(actualPage);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

});
