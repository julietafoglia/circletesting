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
let SideBarPage = require(rootPath + '/pages/maverick/platform/side-bar');
let NavBarPage = require(rootPath + '/pages/maverick/platform/nav-bar');
let DealsDetailsPage = require(rootPath +
     '/pages/maverick/inventory-manager/deals-details');
let DealsFormPage = require(rootPath +
     '/pages/maverick/inventory-manager/deals-form');
let loginPage;
let sideBarPage;
let navBarPage;
let dealsDetailsPage;
let dealsFormPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE-PROD> {{MAVERICK}} /deals {UI} @MANAGER >>> ' +
    '(+) verify ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        sideBarPage = new SideBarPage(driver);
        navBarPage = new NavBarPage(driver);
        dealsDetailsPage = new DealsDetailsPage(driver);
        dealsFormPage = new DealsFormPage(driver);
        driver.manage().deleteAllCookies().then( ()=> {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('maverick - login', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('should check deals details elements', function(done) {
        navBarPage.clickInventoryManager();
        navBar.closeLastOuterDiv();
        navBarPage.closeOuterDiv();
        sideBarPage.clickDealsLink();
        expect(dealsDetailsPage.getButtonCreateDeal()).to.exist;
        expect(dealsDetailsPage.getTitleAllDeals()).to.exist;
        expect(dealsDetailsPage.getDealsTable()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should check elements from talble', function(done) {
        expect(dealsDetailsPage.getDealsSeachbox()).to.exist;
        expect(dealsDetailsPage.getFirstNavigationTableButton()).to.exist;
        expect(dealsDetailsPage.getPreviousTableNavigationButton()).to.exist;
        expect(dealsDetailsPage.getNextTableNavigationButton()).to.exist;
        expect(dealsDetailsPage.getLastTableNavigationButton()).to.exist;
        expect(dealsDetailsPage.getDealTableHeader()).to.exist;
        expect(dealsDetailsPage.getBuyerTableHeader()).to.exist;
        expect(dealsDetailsPage.getFloorTableHeader()).to.exist;
        expect(dealsDetailsPage.getPackageTableHeader()).to.exist;
        expect(dealsDetailsPage.getImpressionsTableHeader()).to.exist;
        expect(dealsDetailsPage.getCreatedTableHeader()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should check deals modal elements', function(done) {
        navBarPage.closeOuterDiv();
        dealsDetailsPage.clickCreateDeal();
        expect(dealsFormPage.getButtonCreateDeal()).to.exist;
        expect(dealsFormPage.getSectionCard()).to.exist;
        expect(dealsFormPage.getCreateDealHeader()).exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should check basic details section', function(done) {
        expect(dealsFormPage.getBasicDetailsHeader()).exist;
        expect(dealsFormPage.getDealNameText()).to.exist;
        expect(dealsFormPage.getDealNameTextbox()).to.exist;
        expect(dealsFormPage.getDSPText()).to.exist;
        expect(dealsFormPage.getDSPTextbox()).to.exist;
        expect(dealsFormPage.getPackageText()).to.exist;
        expect(dealsFormPage.getPackageTextbox()).to.exist;
        expect(dealsFormPage.getDealFlorText()).to.exist;
        expect(dealsFormPage.getDealFlorTextbox()).to.exist;
        expect(dealsFormPage.getDemandTypeText()).to.exist;
        expect(dealsFormPage.getDemandTypeDropdown()).to.exist;
        dealsFormPage.clickDemandTypeDropdown();
        expect(dealsFormPage.getDirectSpan()).to.exist;
        expect(dealsFormPage.getExchangeSpan()).to.exist;
        expect(dealsFormPage.getAdvertiserDomainText()).to.exist;
        expect(dealsFormPage.getAdvertiserDomainTextbox()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should check targeting section', function(done) {
        expect(dealsFormPage.getTargetingHeader()).to.exist;
        expect(dealsFormPage.getLiveAudienceText()).to.exist;
        expect(dealsFormPage.getLiveAudienceDropdown()).to.exist;
        dealsFormPage.clickLiveAudienceDropdown();
        expect(dealsFormPage.getSpan('Target')).to.exist;
        expect(dealsFormPage.getSpan('Exclude')).to.exist;
        expect(dealsFormPage.getLiveAudienceTextbox()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });
});
