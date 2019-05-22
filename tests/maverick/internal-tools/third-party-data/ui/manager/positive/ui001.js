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
const titleThirdPartyData = '3rd Party Data';
const dataToSearch = 'it qa';
const expectedUserResult = 'IT QA';
const firstPage = '1';

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavBar = require(rootPath + '/pages/maverick/platform/nav-bar');
let SideBar = require(rootPath + '/pages/maverick/platform/side-bar');
let ThirdPartyDataLibrary = require(rootPath + '/pages/maverick/' +
    'internal-tools/third-party-data-library');
let thirdPartyDataLibrary;
let navBar;
let loginPage;
let sideBar;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE-PROD> {{MAVERICK}}/third-party-data-library {UI} @MANAGER ' +
    '>>> (+) verify third-party-data library ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBar(driver);
        sideBar = new SideBar(driver);
        thirdPartyDataLibrary = new ThirdPartyDataLibrary(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should navigate to Third Party Data section', function(done) {
        loginPage.login(targetServer, targetUser);
        navBar.clickInternalTools();
        sideBar.clickThirdPartyDataLink();

        driver.sleep(driverTimeOut).then(() => done());
    });


    it('should display all third party data page elements', function(done) {
        thirdPartyDataLibrary.getTitleThirdPartyData().getText().
            then(function(getText) {
                expect(getText).to.equal(titleThirdPartyData);
            });
        expect(thirdPartyDataLibrary.getDownloadAllButton()).to.exist;
        expect(thirdPartyDataLibrary.getInputSearch()).to.exist;
        expect(thirdPartyDataLibrary.getFirstControlButton()).to.exist;
        expect(thirdPartyDataLibrary.getPreviousControlButton()).to.exist;
        expect(thirdPartyDataLibrary.getNextControlButton()).to.exist;
        expect(thirdPartyDataLibrary.getLastControlButton()).to.exist;
        expect(thirdPartyDataLibrary.getTable()).to.exist;
        expect(thirdPartyDataLibrary.getColumnCheckBox()).to.exist;
        expect(thirdPartyDataLibrary.getColumnSegmentDescription()).to.exist;
        expect(thirdPartyDataLibrary.getColumnCost()).to.exist;
        expect(thirdPartyDataLibrary.getColumnMatchCount()).to.exist;
        expect(thirdPartyDataLibrary.getColumnSegmentSize()).to.exist;
        expect(thirdPartyDataLibrary.getColumnCategory()).to.exist;
        expect(thirdPartyDataLibrary.getColumnProvider()).to.exist;
        expect(thirdPartyDataLibrary.getShowingView()).to.exist;
        expect(thirdPartyDataLibrary.getPageView()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show expected element after filtering table', function(done) {
        thirdPartyDataLibrary.setInputSearch(dataToSearch);
        expect(thirdPartyDataLibrary.getRemoveFilterOption(dataToSearch))
            .to.exist;
        expect(thirdPartyDataLibrary.getFirstSegmentOnTable()).to.exist;
        thirdPartyDataLibrary.getFirstSegmentOnTable().getText().
            then(function(getText) {
                expect(getText).to.equal(expectedUserResult);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show table after removing filter added', function(done) {
        thirdPartyDataLibrary.removeFilterOption(dataToSearch);
        thirdPartyDataLibrary.noRemoveFilterOptionDisplayed(dataToSearch)
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        expect(thirdPartyDataLibrary.getTable()).to.exist;
        expect(thirdPartyDataLibrary.getColumnCheckBox()).to.exist;
        expect(thirdPartyDataLibrary.getColumnSegmentDescription()).to.exist;
        expect(thirdPartyDataLibrary.getColumnCost()).to.exist;
        expect(thirdPartyDataLibrary.getColumnSegmentSize()).to.exist;
        expect(thirdPartyDataLibrary.getColumnCategory()).to.exist;
        expect(thirdPartyDataLibrary.getPageView()).to.exist;
        expect(thirdPartyDataLibrary.getColumnProvider()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough Next table pages', function(done) {
        thirdPartyDataLibrary.waitUntilNextControlButtonEnabled();
        thirdPartyDataLibrary.clickNextPageTableControl();
        thirdPartyDataLibrary.waitUntilFirstControlButtonEnabled();
        thirdPartyDataLibrary.waitUntilPreviousControlButtonEnabled();
        expect(thirdPartyDataLibrary.getInputSearch()).to.exist;
        expect(thirdPartyDataLibrary.getTable()).to.exist;
        expect(thirdPartyDataLibrary.getColumnCheckBox()).to.exist;
        expect(thirdPartyDataLibrary.getColumnSegmentDescription()).to.exist;
        expect(thirdPartyDataLibrary.getColumnCost()).to.exist;
        expect(thirdPartyDataLibrary.getColumnSegmentSize()).to.exist;
        expect(thirdPartyDataLibrary.getColumnCategory()).to.exist;
        expect(thirdPartyDataLibrary.getPageView()).to.exist;
        expect(thirdPartyDataLibrary.getColumnProvider()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough Previous table pages', function(done) {
        thirdPartyDataLibrary.clickPreviousPageTableControl();
        thirdPartyDataLibrary.waitUntilFirstControlButtonDisabled();
        thirdPartyDataLibrary.waitUntilPreviousControlButtonDisabled();
        expect(thirdPartyDataLibrary.getInputSearch()).to.exist;
        expect(thirdPartyDataLibrary.getTable()).to.exist;
        expect(thirdPartyDataLibrary.getColumnCheckBox()).to.exist;
        expect(thirdPartyDataLibrary.getColumnSegmentDescription()).to.exist;
        expect(thirdPartyDataLibrary.getColumnCost()).to.exist;
        expect(thirdPartyDataLibrary.getColumnSegmentSize()).to.exist;
        expect(thirdPartyDataLibrary.getColumnCategory()).to.exist;
        expect(thirdPartyDataLibrary.getPageView()).to.exist;
        expect(thirdPartyDataLibrary.getColumnProvider()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough Last table pages', function(done) {
        thirdPartyDataLibrary.waitUntilLastControlButtonEnabled();
        thirdPartyDataLibrary.clickLastPageTableControl();
        thirdPartyDataLibrary.waitUntilLastControlButtonDisabled();
        thirdPartyDataLibrary.waitUntilNextControlButtonDisabled();
        expect(thirdPartyDataLibrary.getInputSearch()).to.exist;
        expect(thirdPartyDataLibrary.getTable()).to.exist;
        expect(thirdPartyDataLibrary.getColumnCheckBox()).to.exist;
        expect(thirdPartyDataLibrary.getColumnSegmentDescription()).to.exist;
        expect(thirdPartyDataLibrary.getColumnCost()).to.exist;
        expect(thirdPartyDataLibrary.getColumnSegmentSize()).to.exist;
        expect(thirdPartyDataLibrary.getColumnCategory()).to.exist;
        expect(thirdPartyDataLibrary.getPageView()).to.exist;
        expect(thirdPartyDataLibrary.getColumnProvider()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it ('should show last page in page number', function(done) {
        thirdPartyDataLibrary.getPageView().getText().
            then(function(getText) {
                let numberOfPages = getText.split('/ ');
                let lastPage = numberOfPages[1];
                let actualPage = getText.split(' ')[1];
                expect(lastPage).to.equal(actualPage);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough First table pages', function(done) {
        thirdPartyDataLibrary.waitUntilFirstControlButtonEnabled();
        thirdPartyDataLibrary.clickFirstPageTableControl();
        thirdPartyDataLibrary.waitUntilFirstControlButtonDisabled();
        thirdPartyDataLibrary.waitUntilPreviousControlButtonDisabled();
        expect(thirdPartyDataLibrary.getInputSearch()).to.exist;
        expect(thirdPartyDataLibrary.getTable()).to.exist;
        expect(thirdPartyDataLibrary.getColumnCheckBox()).to.exist;
        expect(thirdPartyDataLibrary.getColumnSegmentDescription()).to.exist;
        expect(thirdPartyDataLibrary.getColumnCost()).to.exist;
        expect(thirdPartyDataLibrary.getColumnSegmentSize()).to.exist;
        expect(thirdPartyDataLibrary.getColumnCategory()).to.exist;
        expect(thirdPartyDataLibrary.getPageView()).to.exist;
        expect(thirdPartyDataLibrary.getColumnProvider()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it ('should show number 1 in page number', function(done) {
        thirdPartyDataLibrary.getPageView().getText().
            then(function(getText) {
                let actualPage = getText.split(' ')[1];
                expect(firstPage).to.equal(actualPage);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });
});
