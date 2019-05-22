
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
const searchKey = 'met';

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

describe('<SMOKE-PROD> {{MAVERICK}} /users-library {UI} @MANAGER >>> ' +
    '(+) verify users library ui elements >>>', function() {

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

    it('should display all new user form page elements', function(done) {
        usersLibrary.clickCreateNewUser();
        expect(usersForm.getFirstName()).to.exist;
        expect(usersForm.getLastName()).to.exist;
        expect(usersForm.getEmail()).to.exist;
        expect(usersForm.getPassword()).to.exist;
        expect(usersForm.getPasswordHelpText()).to.exist;
        expect(usersForm.getConfirmPassword()).to.exist;
        expect(usersForm.getLiveIntentAdminRadio()).to.exist;
        expect(usersForm.getInternalUserRadio()).to.exist;
        expect(usersForm.getExternalUser()).to.exist;
        expect(usersForm.getTitleAccount()).to.exist;
        expect(usersForm.getAccount1Subtitle()).to.exist;
        expect(usersForm.getAccountTypeDropDown()).to.exist;
        expect(usersForm.getAccountTypeSearch()).to.exist;
        expect(usersForm.getViewCampaignsCheckbox()).to.exist;
        expect(usersForm.getManageCampaignsCheckbox()).to.exist;
        expect(usersForm.getManageReportsCheckbox()).to.exist;
        expect(usersForm.getManageAudiencesCheckbox()).to.exist;
        expect(usersForm.getAdvertiserUsersCheckbox()).to.exist;
        expect(usersForm.getAddAcountLink()).to.exist;
        expect(usersForm.getCloseAccount()).to.exist;
        usersForm.noSecondSubtitleAccountDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.clickClose();
        usersForm.waitSpinnerUntilStale();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display all checkbox elements for Agency Account Type',
        function(done) {
            usersLibrary.clickCreateNewUser();
            usersForm.clickRadioExternalUser();
            usersForm.selectAgencyAccountType();
            expect(usersForm.getFirstName()).to.exist;
            expect(usersForm.getLastName()).to.exist;
            expect(usersForm.getEmail()).to.exist;
            expect(usersForm.getPassword()).to.exist;
            expect(usersForm.getPasswordHelpText()).to.exist;
            expect(usersForm.getConfirmPassword()).to.exist;
            expect(usersForm.getLiveIntentAdminRadio()).to.exist;
            expect(usersForm.getInternalUserRadio()).to.exist;
            expect(usersForm.getExternalUser()).to.exist;
            expect(usersForm.getTitleAccount()).to.exist;
            expect(usersForm.getAccount1Subtitle()).to.exist;
            expect(usersForm.getAccountTypeDropDown()).to.exist;
            expect(usersForm.getAccountTypeSearch()).to.exist;
            expect(usersForm.getViewCampaignsCheckbox()).to.exist;
            expect(usersForm.getManageCampaignsCheckbox()).to.exist;
            expect(usersForm.getManageReportsCheckbox()).to.exist;
            expect(usersForm.getManageAudiencesCheckbox()).to.exist;
            usersForm.noAdvertiserUsersCheckboxDisplayed()
                .then(function(arr) {
                    expect(arr).to.be.empty;
                });
            expect(usersForm.getAddAcountLink()).to.exist;
            usersForm.clickClose();
            usersForm.waitSpinnerUntilStale();
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should display all checkbox elements for Media Group Account Type',
        function(done) {
            usersLibrary.clickCreateNewUser();
            usersForm.clickRadioExternalUser();
            usersForm.selectMediaGroupAccountType();
            expect(usersForm.getFirstName()).to.exist;
            expect(usersForm.getLastName()).to.exist;
            expect(usersForm.getEmail()).to.exist;
            expect(usersForm.getPassword()).to.exist;
            expect(usersForm.getPasswordHelpText()).to.exist;
            expect(usersForm.getConfirmPassword()).to.exist;
            expect(usersForm.getLiveIntentAdminRadio()).to.exist;
            expect(usersForm.getInternalUserRadio()).to.exist;
            expect(usersForm.getExternalUser()).to.exist;
            expect(usersForm.getTitleAccount()).to.exist;
            expect(usersForm.getAccount1Subtitle()).to.exist;
            expect(usersForm.getAccountTypeDropDown()).to.exist;
            expect(usersForm.getAccountTypeSearch()).to.exist;
            expect(usersForm.getViewInventoryCheckbox()).to.exist;
            expect(usersForm.getManageInventoryAndCampaignsCheckbox()).to.exist;
            expect(usersForm.getManageCampaignsCheckbox()).to.exist;
            expect(usersForm.getManageReportsCheckbox()).to.exist;
            expect(usersForm.getManageAudiencesCheckbox()).to.exist;
            usersForm.noAdvertiserUsersCheckboxDisplayed()
                .then(function(arr) {
                    expect(arr).to.be.empty;
                });
            usersForm.noViewCampaignsCheckboxDisplayed()
                .then(function(arr) {
                    expect(arr).to.be.empty;
                });
            expect(usersForm.getAddAcountLink()).to.exist;
            usersForm.clickClose();
            usersForm.waitSpinnerUntilStale();
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should display all checkbox elements for Publisher Account Type',
        function(done) {
            usersLibrary.clickCreateNewUser();
            usersForm.clickRadioExternalUser();
            usersForm.selectPublisherAccountType();
            expect(usersForm.getFirstName()).to.exist;
            expect(usersForm.getLastName()).to.exist;
            expect(usersForm.getEmail()).to.exist;
            expect(usersForm.getPassword()).to.exist;
            expect(usersForm.getPasswordHelpText()).to.exist;
            expect(usersForm.getConfirmPassword()).to.exist;
            expect(usersForm.getLiveIntentAdminRadio()).to.exist;
            expect(usersForm.getInternalUserRadio()).to.exist;
            expect(usersForm.getExternalUser()).to.exist;
            expect(usersForm.getTitleAccount()).to.exist;
            expect(usersForm.getAccount1Subtitle()).to.exist;
            expect(usersForm.getAccountTypeDropDown()).to.exist;
            expect(usersForm.getAccountTypeSearch()).to.exist;
            expect(usersForm.getViewInventoryCheckbox()).to.exist;
            expect(usersForm.getManageInventoryAndCampaignsCheckbox()).to.exist;
            expect(usersForm.getManageDirectSoldCampaignsCheckbox()).to.exist;
            expect(usersForm.getUploadListsCheckbox()).to.exist;
            expect(usersForm.getScrubListsCheckbox()).to.exist;
            expect(usersForm.getManageReportsCheckbox()).to.exist;
            expect(usersForm.getManageAudiencesCheckbox()).to.exist;
            expect(usersForm.getPublisherUsersCheckbox()).to.exist;
            usersForm.noAdvertiserUsersCheckboxDisplayed()
                .then(function(arr) {
                    expect(arr).to.be.empty;
                });
            usersForm.noViewCampaignsCheckboxDisplayed()
                .then(function(arr) {
                    expect(arr).to.be.empty;
                });
            usersForm.noManageCampaignsCheckboxDisplayed()
                .then(function(arr) {
                    expect(arr).to.be.empty;
                });
            expect(usersForm.getAddAcountLink()).to.exist;
            usersForm.clickClose();
            usersForm.waitSpinnerUntilStale();
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should enable save button after complete fields for External User',
        function(done) {
            usersLibrary.clickCreateNewUser();
            usersForm.completeUserFields(user);
            usersForm.searchAndSelectFirstAccountType(searchKey);
            usersForm.clickManageAudiencesCheckBox();
            usersForm.waitUntilSaveUserButtonEnabled();
            expect(usersForm.getSaveUserButton()).to.exist;
            usersForm.clickClose();
            usersForm.waitSpinnerUntilStale();
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should display all page elements for LiveIntent Admin', function(done) {
        usersLibrary.clickCreateNewUser();
        usersForm.clickRadioLiveIntentAdmin();
        expect(usersForm.getFirstName()).to.exist;
        expect(usersForm.getLastName()).to.exist;
        expect(usersForm.getEmail()).to.exist;
        expect(usersForm.getPassword()).to.exist;
        expect(usersForm.getPasswordHelpText()).to.exist;
        expect(usersForm.getConfirmPassword()).to.exist;
        expect(usersForm.getLiveIntentAdminRadio()).to.exist;
        expect(usersForm.getInternalUserRadio()).to.exist;
        expect(usersForm.getExternalUser()).to.exist;
        usersForm.noTitleAccountDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noTitleAccountDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noSubtitleAccountDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noAccountTypeDropDownDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noAccountTypeSearchDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noViewCampaignsCheckboxDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noManageCampaignsCheckboxDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noManageReportsCheckboxDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noManageAudiencesCheckboxDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noAdvertiserUsersCheckboxDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noLiveIntentAdOpsCheckboxDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noLiveIntentAccountDirectorCheckboxDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noLiveIntentStandardCheckboxDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noLiveIntentAccountManagerCheckboxDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.clickClose();
        usersForm.waitSpinnerUntilStale();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should display all page elements for Internal User', function(done) {
        usersLibrary.clickCreateNewUser();
        usersForm.clickRadioInternalUser();
        expect(usersForm.getFirstName()).to.exist;
        expect(usersForm.getLastName()).to.exist;
        expect(usersForm.getEmail()).to.exist;
        expect(usersForm.getPassword()).to.exist;
        expect(usersForm.getPasswordHelpText()).to.exist;
        expect(usersForm.getConfirmPassword()).to.exist;
        expect(usersForm.getLiveIntentAdminRadio()).to.exist;
        expect(usersForm.getInternalUserRadio()).to.exist;
        expect(usersForm.getExternalUser()).to.exist;
        usersForm.noTitleAccountDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noTitleAccountDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noSubtitleAccountDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noAccountTypeDropDownDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noAccountTypeSearchDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noViewCampaignsCheckboxDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noManageCampaignsCheckboxDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noManageReportsCheckboxDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noManageAudiencesCheckboxDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        usersForm.noAdvertiserUsersCheckboxDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        expect(usersForm.getLiveIntentAdOpsCheckbox()).to.exist;
        expect(usersForm.getLiveIntentAccountDirectorCheckbox()).to.exist;
        expect(usersForm.getLiveIntentStandardCheckbox()).to.exist;
        expect(usersForm.getLiveIntentAccountManagerCheckbox()).to.exist;
        usersForm.clickClose();
        usersForm.waitSpinnerUntilStale();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should enable save button for Internal User',
        function(done) {
            usersLibrary.clickCreateNewUser();
            usersForm.clickRadioInternalUser();
            usersForm.completeUserFields(user);
            usersForm.clickLiveIntentStandardCheckBox();
            usersForm.clickLiveIntentAdOpsCheckBox();
            usersForm.waitUntilSaveUserButtonEnabled();
            expect(usersForm.getSaveUserButton()).to.exist;
            usersForm.clickClose();
            usersForm.waitSpinnerUntilStale();
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should display all elements for Two accounts',
        function(done) {
            usersLibrary.clickCreateNewUser();
            usersForm.clickRadioExternalUser();
            usersForm.selectAdvertiserAccountType();
            usersForm.clickAddAccountLink();
            expect(usersForm.getAccount2Subtitle());
            expect(usersForm.getTitleAccount()).to.exist;
            expect(usersForm.getAccount1Subtitle()).to.exist;
            expect(usersForm.getAccountTypeSearch()).to.exist;
            expect(usersForm.getAddAcountLink()).to.exist;
            usersForm.getAccountTypeSearchList()
                .then(function(arr) {
                    expect(arr).to.have.lengthOf(2);
                });
            usersForm.getViewCampaignsCheckboxList()
                .then(function(arr) {
                    expect(arr).to.have.lengthOf(2);
                });
            usersForm.getManageCampaignsCheckboxList()
                .then(function(arr) {
                    expect(arr).to.have.lengthOf(2);
                });
            usersForm.getManageReportsCheckboxList()
                .then(function(arr) {
                    expect(arr).to.have.lengthOf(2);
                });
            usersForm.getManageAudiencesCheckboxList()
                .then(function(arr) {
                    expect(arr).to.have.lengthOf(2);
                });
            usersForm.getAdvertiserUsersCheckboxList()
                .then(function(arr) {
                    expect(arr).to.have.lengthOf(2);
                });
            usersForm.clickCloseAccount();
            usersForm.clickClose();
            usersForm.waitSpinnerUntilStale();
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should enable save button for External User with Two accounts',
        function(done) {
            usersLibrary.clickCreateNewUser();
            usersForm.clickRadioExternalUser();
            usersForm.selectAdvertiserAccountType();
            usersForm.completeUserFields(user);
            usersForm.searchAndSelectFirstAccountType(searchKey);
            usersForm.clickManageAudiencesCheckBox();
            usersForm.waitUntilSaveUserButtonEnabled();
            usersForm.clickAddAccountLink();
            usersForm.searchAndSelectSecondAccountType(searchKey);
            usersForm.clickSecondManageAudiencesCheckBox();
            expect(usersForm.getSaveUserButton()).to.exist;
            usersForm.clickClose();
            driver.sleep(driverTimeOut).then(() => done());
        });
});
