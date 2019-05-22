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
const mochaTimeOut = 0;
const timeStamp = `@${moment().format('YYYY-MM-DDTHH:mm')}`;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavBar = require(rootPath + '/pages/maverick/platform/nav-bar');
let AccountsLibraryPage = require(rootPath + '/pages/maverick/' +
    'internal-tools/accounts-library');
let UsersLibrary = require(rootPath + '/pages/maverick/internal-tools/' +
    'users-library');
let MediaGroupForm = require(rootPath + '/pages/maverick/internal-tools/' +
    'media-group-form');
let usersLibrary, accountsLibrary, navBar, loginPage, account, mediaGroupForm;
let beginningOopsMsg = 'The mediaGroup could not be saved because ';
let invalidSFIdMsg = 'the salesforce id is invalid.';
let confirmSave = 'Save Media Group?';

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

// fixture
let accountTestFixture =
    require(rootPath + '/fixtures/common/media-group/create005');
account = Object.assign({}, accountTestFixture);
account.name += timeStamp;
account.salesforceId = timeStamp;
account.dspFee = 5;
account.sspFee = 4;
account.monthlyMinimum = 3;
account.directSoldFee = 1;

describe('<SMOKE> {{MAVERICK}} /accounts-form {CREATE} @MANAGER >>> ' +
    '(-) verify unable account media-group creation >>>', function() {
    // disable mocha time outs
    this.timeout(mochaTimeOut);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBar(driver);
        usersLibrary = new UsersLibrary(driver);
        accountsLibrary = new AccountsLibraryPage(driver);
        mediaGroupForm = new MediaGroupForm(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should navigate to Accounts at Internal Tools section', function(done){
        loginPage.login(targetServer, targetUser);
        navBar.closeLastOuterDiv();
        navBar.closeOuterDiv();
        navBar.clickInternalTools();
        usersLibrary.clickAccountsSideBar();
        accountsLibrary.waitSpinnerUntilStale();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should create Media Group account', function(done) {
        accountsLibrary.clickCreateAccountButton();
        mediaGroupForm.selectMediaGroupType();
        mediaGroupForm.fillRequiredFields(account);
        mediaGroupForm.waitUntilSaveButtonEnabled();
        mediaGroupForm.clickSaveButton();
        mediaGroupForm.waitUntilSpinnerDissapear();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show oops message wrong salesForceId Media Group account',
        function(done) {
            account = Object.assign({}, accountTestFixture);
            account.name += timeStamp;
            account.salesforceId = timeStamp + timeStamp;
            accountsLibrary.waitUntilSpinnerContainerNotVisible();
            accountsLibrary.clickCreateAccountButton();
            mediaGroupForm.selectMediaGroupType();
            mediaGroupForm.fillMonetizationsRequiredFields(account);
            mediaGroupForm.waitUntilSaveButtonEnabled();
            mediaGroupForm.clickSaveButton();
            expect(mediaGroupForm.getSpanContainsText(beginningOopsMsg +
                invalidSFIdMsg)).to.exist;
            mediaGroupForm.closeAlertMsg();
            mediaGroupForm.clickClose();
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should show confirmation dialog wrong cname Media Group account',
        function(done) {
            account = Object.assign({}, accountTestFixture);
            account.dspFee = 5;
            account.sspFee = 4;
            account.monthlyMinimum = 3;
            account.directSoldFee = 1;
            account.cname += 'a';
            accountsLibrary.waitUntilSpinnerContainerNotVisible();
            accountsLibrary.clickCreateAccountButton();
            mediaGroupForm.selectMediaGroupType();
            mediaGroupForm.fillRequiredFields(account);
            mediaGroupForm.waitUntilSaveButtonEnabled();
            mediaGroupForm.clickSaveButton();
            expect(mediaGroupForm.getTitle(confirmSave)).to.exist;
            mediaGroupForm.cancelConfirmDialog();
            mediaGroupForm.clickClose();
            driver.sleep(driverTimeOut).then(() => done());
        });
});
