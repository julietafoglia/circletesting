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
const titleUsers = 'Users';
const wrongEmail = 'noemailstring';
const invalidPsw = 'onlytextpsw';
const shortPsw = '1';
const keySearch = 'home';
const spaceString = ' ';
const lastNameErrorMessage = 'Uh oh! The user could not be saved because the' +
' last name is invalid. Please check the user and try again.';
const emailErrorMessage = 'Uh oh! The user could not be saved because the' +
' email is invalid. Please check the user and try again.';
const passwordErrorMessage = 'Passwords must be at least 8 characters long,' +
' include either one space or a number and symbol (i.e. #,$,!,&).';
const passwordNotMatch = 'Passwords do not match.';

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavBar = require(rootPath + '/pages/maverick/platform/nav-bar');
let UsersLibrary = require(rootPath + '/pages/maverick/' +
    'internal-tools/users-library');
let UsersForm = require(rootPath + '/pages/maverick/' +
    'internal-tools/users-form');

let usersLibrary;
let navBar;
let loginPage;
let usersForm;
let user;

// fixture
const testFixture =
    require(rootPath + '/fixtures/common/user/create/create002');

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKI> {{MAVERICK}} /users-library {UI} @MANAGER >>> ' +
    '(-) verify negative cases for users library ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBar(driver);
        usersLibrary = new UsersLibrary(driver);
        usersForm = new UsersForm(driver);
        user = Object.assign({}, testFixture);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should navigate to Internal Tools section', function(done) {
        loginPage.login(targetServer, targetUser);
        navBar.closeLastOuterDiv();
        navBar.closeLastOuterDiv();
        navBar.closeOuterDiv();
        navBar.closeOuterDiv();
        navBar.clickInternalTools();
        expect(usersLibrary.getTitleUsers()).to.exist;
        usersLibrary.getTitleUsers().getText().
            then(function(getText) {
                expect(getText).to.equal(titleUsers);
            });
        expect(usersLibrary.getCreateNewUserButton()).to.exist;
        expect(usersLibrary.getTable()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show alert if Last name field is empty',
        function(done) {
            usersLibrary.clickCreateNewUser();
            usersForm.waitSpinnerUntilStale();
            usersForm.clickCloseAccount();
            usersForm.completeUserFields(user);
            usersForm.waitUntilSaveUserButtonEnabled();
            expect(usersForm.getSaveUserButton()).to.exist;
            usersForm.completeLastName(spaceString);
            usersForm.clickSaveButton();
            expect(usersForm.getAlertMessage()).to.exist;
            usersForm.getAlertMessage().getText().
                then(function(getText) {
                    expect(getText).to.equal(lastNameErrorMessage);
                });
            usersForm.clickClose();
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should show alert if email field is wrong',
        function(done) {
            usersLibrary.clickCreateNewUser();
            usersForm.clickCloseAccount();
            usersForm.completeUserFields(user);
            usersForm.completeEmail(wrongEmail);
            usersForm.waitUntilSaveUserButtonEnabled();
            expect(usersForm.getSaveUserButton()).to.exist;
            usersForm.clickSaveButton();
            expect(usersForm.getAlertMessage()).to.exist;
            usersForm.getAlertMessage().getText().
                then(function(getText) {
                    expect(getText).to.equal(emailErrorMessage);
                });
            usersForm.clickClose();
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should show alert if password is too short', function(done) {
        usersLibrary.clickCreateNewUser();
        usersForm.clickCloseAccount();
        usersForm.completeUserFields(user);
        usersForm.completePassword(shortPsw);
        usersForm.completeConfirmPassword(shortPsw);
        usersForm.waitUntilSaveUserButtonDisabled();
        expect(usersForm.getPasswordTextError()).to.exist;
        usersForm.getPasswordTextError().getText().
            then(function(getText) {
                expect(getText).to.equal(passwordErrorMessage);
            });
        usersForm.clickClose();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should disable save button if password not match',
        function(done) {
            usersLibrary.clickCreateNewUser();
            usersForm.clickCloseAccount();
            usersForm.completeUserFields(user);
            usersForm.completeConfirmPassword(user.password + ' ');
            usersForm.waitUntilSaveUserButtonDisabled();
            expect(usersForm.getErrorText()).to.exist;
            usersForm.getErrorText().getText().
                then(function(getText) {
                    expect(getText).to.equal(passwordNotMatch);
                });
            usersForm.clickClose();
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should disable save button if password is invalid',
        function(done) {
            usersLibrary.clickCreateNewUser();
            usersForm.clickCloseAccount();
            usersForm.completeUserFields(user);
            usersForm.completePassword(invalidPsw);
            usersForm.completeConfirmPassword(invalidPsw);
            usersForm.waitUntilSaveUserButtonDisabled();
            expect(usersForm.getPasswordTextError()).to.exist;
            usersForm.getPasswordTextError().getText().
                then(function(getText) {
                    expect(getText).to.equal(passwordErrorMessage);
                });
            usersForm.clickClose();
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should disable save button if no checkbox is selected',
        function(done) {
            usersLibrary.clickCreateNewUser();
            usersForm.clickCloseAccount();
            usersForm.completeUserFields(user);
            usersForm.clickAddAccountLink();
            usersForm.waitUntilSaveUserButtonDisabled();
            usersForm.searchAndSelectFirstAccountType(keySearch);
            usersForm.clickManageAudiencesCheckBox();
            usersForm.clickManageAudiencesCheckBox();
            expect(usersForm.getErrorText()).to.exist;
            usersForm.clickClose();
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should disable save button if no checkbox is selected for Agency',
        function(done) {
            usersLibrary.clickCreateNewUser();
            usersForm.clickCloseAccount();
            usersForm.completeUserFields(user);
            usersForm.clickAddAccountLink();
            usersForm.waitUntilSaveUserButtonDisabled();
            usersForm.selectAgencyAccountType();
            usersForm.searchAndSelectFirstAccountType(keySearch);
            usersForm.clickManageAudiencesCheckBox();
            usersForm.clickManageAudiencesCheckBox();
            expect(usersForm.getErrorText()).to.exist;
            usersForm.clickClose();
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should disable save button if no checkbox is selected for Media Group',
        function(done) {
            usersLibrary.clickCreateNewUser();
            usersForm.clickCloseAccount();
            usersForm.completeUserFields(user);
            usersForm.clickAddAccountLink();
            usersForm.waitUntilSaveUserButtonDisabled();
            usersForm.selectMediaGroupAccountType();
            usersForm.searchAndSelectFirstAccountType(keySearch);
            usersForm.clickManageAudiencesCheckBox();
            usersForm.clickManageAudiencesCheckBox();
            expect(usersForm.getErrorText()).to.exist;
            usersForm.clickClose();
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should disable save button if no checkbox is selected for Publisher',
        function(done) {
            usersLibrary.clickCreateNewUser();
            usersForm.clickCloseAccount();
            usersForm.completeUserFields(user);
            usersForm.clickAddAccountLink();
            usersForm.waitUntilSaveUserButtonDisabled();
            usersForm.selectPublisherAccountType();
            usersForm.searchAndSelectFirstAccountType(keySearch);
            usersForm.clickManageAudiencesCheckBox();
            usersForm.clickManageAudiencesCheckBox();
            expect(usersForm.getErrorText()).to.exist;
            usersForm.clickClose();
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should disable save button if no checkbox is selected for Advertiser ' +
    'on second Account', function(done) {
        usersLibrary.clickCreateNewUser();
        usersForm.clickCloseAccount();
        usersForm.completeUserFields(user);
        usersForm.clickAddAccountLink();
        usersForm.waitUntilSaveUserButtonDisabled();
        usersForm.searchAndSelectFirstAccountType(keySearch);
        usersForm.clickManageAudiencesCheckBox();
        usersForm.clickAddAccountLink();
        usersForm.waitUntilSaveUserButtonDisabled();
        usersForm.searchAndSelectSecondAccountType(keySearch);
        usersForm.clickSecondManageAudiencesCheckBox();
        usersForm.clickSecondManageAudiencesCheckBox();
        expect(usersForm.getErrorText()).to.exist;
        usersForm.clickClose();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should disable save button if no checkbox is selected for Agency ' +
    'on second Account', function(done) {
        usersLibrary.clickCreateNewUser();
        usersForm.clickCloseAccount();
        usersForm.completeUserFields(user);
        usersForm.clickAddAccountLink();
        usersForm.waitUntilSaveUserButtonDisabled();
        usersForm.selectAgencyAccountType();
        usersForm.searchAndSelectFirstAccountType(keySearch);
        usersForm.clickManageAudiencesCheckBox();
        usersForm.clickAddAccountLink();
        usersForm.waitUntilSaveUserButtonDisabled();
        usersForm.selectAgencyAccountType();
        usersForm.searchAndSelectSecondAccountType(keySearch);
        usersForm.clickSecondManageAudiencesCheckBox();
        usersForm.clickSecondManageAudiencesCheckBox();
        expect(usersForm.getErrorText()).to.exist;
        usersForm.clickClose();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should disable save button if no checkbox is selected for Media Group' +
    ' on second Account', function(done) {
        usersLibrary.clickCreateNewUser();
        usersForm.clickCloseAccount();
        usersForm.completeUserFields(user);
        usersForm.clickAddAccountLink();
        usersForm.waitUntilSaveUserButtonDisabled();
        usersForm.selectMediaGroupAccountType();
        usersForm.searchAndSelectFirstAccountType(keySearch);
        usersForm.clickManageAudiencesCheckBox();
        usersForm.clickAddAccountLink();
        usersForm.waitUntilSaveUserButtonDisabled();
        usersForm.selectMediaGroupAccountType();
        usersForm.searchAndSelectSecondAccountType(keySearch);
        usersForm.clickSecondManageAudiencesCheckBox();
        usersForm.clickSecondManageAudiencesCheckBox();
        expect(usersForm.getErrorText()).to.exist;
        usersForm.clickClose();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should disable save button if no checkbox is selected for Publisher ' +
    'on second Account', function(done) {
        usersLibrary.clickCreateNewUser();
        usersForm.clickCloseAccount();
        usersForm.completeUserFields(user);
        usersForm.clickAddAccountLink();
        usersForm.waitUntilSaveUserButtonDisabled();
        usersForm.selectPublisherAccountType();
        usersForm.searchAndSelectFirstAccountType(keySearch);
        usersForm.clickManageAudiencesCheckBox();
        usersForm.clickAddAccountLink();
        usersForm.waitUntilSaveUserButtonDisabled();
        usersForm.selectPublisherSecondAccountType();
        usersForm.searchAndSelectSecondAccountType(keySearch);
        usersForm.clickSecondManageAudiencesCheckBox();
        usersForm.clickSecondManageAudiencesCheckBox();
        expect(usersForm.getErrorText()).to.exist;
        usersForm.clickClose();
        driver.sleep(driverTimeOut).then(() => done());
    });
});
