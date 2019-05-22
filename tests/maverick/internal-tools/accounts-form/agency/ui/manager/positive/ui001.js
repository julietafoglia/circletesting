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
const mochaTimeOut = 0;
const title = 'Accounts';
const subtitleSection = 'Fees';
const subtitleForm = 'Basic Details';

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavBar = require(rootPath + '/pages/maverick/platform/nav-bar');
let AccountsLibraryPage = require(rootPath + '/pages/maverick/' +
    'internal-tools/accounts-library');
let UsersLibrary = require(rootPath + '/pages/maverick/internal-tools/' +
    'users-library');
let AgencyForm = require(rootPath + '/pages/maverick/internal-tools/' +
    'agency-form');
let usersLibrary, accountsLibrary, navBar, loginPage, account, agencyForm;

// fixture
const accountTestFixture =
    require(rootPath + '/fixtures/common/agency/create004');

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE-PROD> {{MAVERICK}} /accounts-form {UI} @MANAGER >>> ' +
    '(+) verify agency form ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(mochaTimeOut);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBar(driver);
        usersLibrary = new UsersLibrary(driver);
        accountsLibrary = new AccountsLibraryPage(driver);
        agencyForm = new AgencyForm(driver);
        account = Object.assign({}, accountTestFixture);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should navigate to Accounts at Internal Tools section', function(done){
        loginPage.login(targetServer, targetUser);
        navBar.clickInternalTools();
        usersLibrary.clickAccountsSideBar();
        accountsLibrary.waitSpinnerUntilStale();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display all Agency create form elements', function(done) {
        accountsLibrary.getTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(title);
            });
        expect(accountsLibrary.getCreateAccountButton()).to.exist;
        expect(accountsLibrary.getSearchField()).to.exist;
        accountsLibrary.clickCreateAccountButton();
        expect(agencyForm.getAccountNameInput()).to.exist;
        agencyForm.getTitle().getText().
            then(function(getText) {
                expect(getText).to.include(subtitleForm);
            });
        expect(agencyForm.getSalesforceIdInput()).to.exist;
        expect(agencyForm.getAccountActivationSlider()).to.exist;
        agencyForm.getTitleSection().getText().
            then(function(getText) {
                expect(getText).to.include(subtitleSection);
            });
        expect(agencyForm.getPlatformAdFeeInput()).to.exist;
        agencyForm.noRTBDemandDropdown()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        agencyForm.clickClose();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should enable save button', function(done) {
        accountsLibrary.clickCreateAccountButton();
        agencyForm.completeName(account.name);
        agencyForm.completeSalesforceId(account.salesforceId);
        agencyForm.clickAccountActivation();
        agencyForm.completePlatformAdFee(account.dspFee);
        agencyForm.waitUntilSaveButtonEnabled();
        expect(agencyForm.getSaveButton()).to.exist;
        agencyForm.clickClose();
        driver.sleep(driverTimeOut).then(() => done());
    });
});
