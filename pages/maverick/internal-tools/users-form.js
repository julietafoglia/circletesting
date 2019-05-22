'use strict';

// Common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;

// elements
const FIRST_NAME_USER = By.css('input[name="firstName"]');
const LAST_NAME_USER = By.css('input[name="lastName"]');
const EMAIL_USER = By.css('input[name="email"]');
const PASSWORD_USER = By.css('input[name="password"]');
const CONFIRM_PASSWORD_USER = By.css('input[name="confirmPassword"]');
const PSW_TEXT_INFO = By.xpath("//div[contains(@class,'copy--supporting')]");
const PSW_TEXT_ERROR = By.xpath(
    "//div[contains(@class,'copy--supporting copy--error-text')]");
const PSW_NOTMATCH_TXT = By.xpath("//div[contains(@class,'copy--error-text')]");
const LIVEINTENT_ADMIN = By.xpath('//span[text()= "LiveIntent Admin"]');
const INTERNAL_USER = By.xpath('//span[text()= "Internal User"]');
const EXTERNAL_USER = By.xpath('//span[text()= "External User"]');

const TITLE_ACCOUNTS = By.xpath('//h3[text() = "Accounts & Roles"]');
const SUBTITLE_ACCOUNT_1 = By.xpath('//h4[text() = "Account 1"]');
const SUBTITLE_ACCOUNT_2 = By.xpath('//h4[text() = "Account 2"]');
const ACCOUNT_TYPE_BUTTON = By.xpath('//section/div[1]/div[2]/div/' +
    'div[1]/div[2]/select-dropdown/div/button');
const ACCOUNT_TYPE_BUTTON_2 = By.xpath('//section-card[2]/div/div[2]/section' +
    '/div[2]/div[2]/div/div[1]/div[2]/select-dropdown/div/button');
const ADVERTISER_DROPDOWN_OPTION = By.xpath('//span[text()= "Advertiser"]');
const AGENCY_DROPDOWN_OPTION = By.xpath('//span[text()= "Agency"]');
const MEDIAGROUP_DROPDOWN_OPTION = By.xpath('//span[text()= "Media Group"]');
const PUBLISHER_DROPDOWN_OPTION = By.xpath('//span[text()= "Publisher"]');
const ACCOUNT_TYPE_SEARCH = By.css('.searchable-select-single ' +
    '[placeholder="Search"]');
const ACCOUNT_TYPE_SEARCH2 = By.xpath('(//div[contains' +
    '(@class,"placeholder-icon")])[4]/input');
const SEARCH_ITEM = By.css('a.search--item');
const VIEW_CAMPAIGNS_CHECKBOX = By.xpath('//span[text()= ' +
    '"View Campaigns"]');
const MANAGE_CAMPAIGNS_CHECKBOX = By.xpath('//span[text()= ' +
    '"Manage Campaigns"]');
const MANAGE_REPORTS_CHECKBOX = By.xpath('//span[text()= ' +
    '"Manage Reports"]');
const MANAGE_AUDIENCES_CHECKBOX = By.xpath('//span[text()= ' +
    '"Manage Audiences"]');
const MANAGE_AUDIENCES_CHECKBOX_2 = By.xpath(
    '(//span[text()= "Manage Audiences"])[2]');
const ADVERTISERS_USERS_CHECKBOX = By.xpath('//span[text()= ' +
    '"Advertiser Users"]');
const VIEW_INVENTORY_CHECKBOX = By.xpath('//span[text()= ' +
    '"View Inventory"]');
const MANAGE_INVENTORY_AND_CAMPAIGNS_CHECKBOX = By.xpath('//span[text()= ' +
    '"Manage Inventory and Campaigns"]');
const MANAGE_DIRECT_SOLD_CAMPAIGNS_CHECKBOX = By.xpath('//span[text()= ' +
    '"Manage Direct Sold Campaigns"]');
const UPLOAD_LISTS_CHECKBOX = By.xpath('//span[text()= ' +
    '"Upload Lists"]');
const SCRUB_LISTS_CHECKBOX = By.xpath('//span[text()= ' +
    '"Scrub Lists"]');
const PUBLISHER_USERS_CHECKBOX = By.xpath('//span[text()= ' +
    '"Publisher Users"]');

const ADD_ACCOUNT_LINK = By.css('button.link i');
const CLOSE_ACCOUNT = By.id('grant-close');

const IU_LIVEINTENT_ADOPS_CHECKBOX = By.xpath('//span[text()= ' +
    '"LiveIntent Ad Ops"]');
const IU_LIVEINTENT_ACC_DIRECTOR_CHECKBOX = By.xpath('//span[text()= ' +
    '"LiveIntent Account Director"]');
const IU_LIVEINTENT_STANDARD_CHECKBOX = By.xpath('//span[text()= ' +
    '"LiveIntent Standard"]');
const IU_LIVEINTENT_ACC_MANAGER_CHECKBOX = By.xpath('//span[text()= ' +
    '"LiveIntent Account Manager"]');

const SAVE_BTN = By.css('button[class="button--primary"]');
const SPINNER = By.css('.spinner');

function UserForm(webdriver){
    BasePage.call(this, webdriver);
}

UserForm.prototype = Object.create(BasePage.prototype);
UserForm.prototype.constructor = UserForm;

UserForm.prototype.getFirstName = function(){
    return this.getElement(FIRST_NAME_USER);
};

UserForm.prototype.getLastName = function() {
    return this.getElement(LAST_NAME_USER);
};

UserForm.prototype.getEmail = function() {
    return this.getElement(EMAIL_USER);
};

UserForm.prototype.getPassword = function() {
    return this.getElement(PASSWORD_USER);
};

UserForm.prototype.getPasswordHelpText = function() {
    return this.getElement(PSW_TEXT_INFO);
};

UserForm.prototype.getPasswordTextError = function() {
    return this.getElement(PSW_TEXT_ERROR);
};

UserForm.prototype.getConfirmPassword = function() {
    return this.getElement(CONFIRM_PASSWORD_USER);
};

UserForm.prototype.getErrorText = function() {
    return this.getElement(PSW_NOTMATCH_TXT);
};

UserForm.prototype.getLiveIntentAdminRadio = function() {
    return this.getElement(LIVEINTENT_ADMIN);
};

UserForm.prototype.getInternalUserRadio = function() {
    return this.getElement(INTERNAL_USER);
};

UserForm.prototype.getExternalUser = function() {
    return this.getElement(EXTERNAL_USER);
};

UserForm.prototype.getLiveIntentAdOpsCheckbox = function() {
    return this.getElement(IU_LIVEINTENT_ADOPS_CHECKBOX);
};

UserForm.prototype.noLiveIntentAdOpsCheckboxDisplayed = function() {
    return this.elementNotLocated(IU_LIVEINTENT_ADOPS_CHECKBOX);
};

UserForm.prototype.getLiveIntentAccountDirectorCheckbox = function() {
    return this.getElement(IU_LIVEINTENT_ACC_DIRECTOR_CHECKBOX);
};

UserForm.prototype.noLiveIntentAccountDirectorCheckboxDisplayed = function() {
    return this.elementNotLocated(IU_LIVEINTENT_ACC_DIRECTOR_CHECKBOX);
};

UserForm.prototype.getLiveIntentStandardCheckbox = function() {
    return this.getElement(IU_LIVEINTENT_STANDARD_CHECKBOX);
};

UserForm.prototype.noLiveIntentStandardCheckboxDisplayed = function() {
    return this.elementNotLocated(IU_LIVEINTENT_STANDARD_CHECKBOX);
};

UserForm.prototype.getLiveIntentAccountManagerCheckbox = function() {
    return this.getElement(IU_LIVEINTENT_ACC_MANAGER_CHECKBOX);
};

UserForm.prototype.noLiveIntentAccountManagerCheckboxDisplayed = function() {
    return this.elementNotLocated(IU_LIVEINTENT_ACC_MANAGER_CHECKBOX);
};

UserForm.prototype.getTitleAccount = function() {
    return this.getElement(TITLE_ACCOUNTS);
};

UserForm.prototype.noTitleAccountDisplayed = function() {
    return this.elementNotLocated(TITLE_ACCOUNTS);
};

UserForm.prototype.getAccount1Subtitle = function() {
    return this.getElement(SUBTITLE_ACCOUNT_1);
};

UserForm.prototype.noSubtitleAccountDisplayed = function() {
    return this.elementNotLocated(SUBTITLE_ACCOUNT_1);
};

UserForm.prototype.getAccount2Subtitle = function() {
    return this.getElement(SUBTITLE_ACCOUNT_2);
};

UserForm.prototype.noSecondSubtitleAccountDisplayed = function() {
    return this.elementNotLocated(SUBTITLE_ACCOUNT_2);
};

UserForm.prototype.getAccountTypeDropDown = function() {
    return this.getElement(ACCOUNT_TYPE_BUTTON);
};

UserForm.prototype.getSecondAccountTypeDropDown = function() {
    return this.getElement(ACCOUNT_TYPE_BUTTON_2);
};

UserForm.prototype.getAccountTypeDropDownList = function() {
    return this.getElements(ACCOUNT_TYPE_BUTTON);
};

UserForm.prototype.noAccountTypeDropDownDisplayed = function() {
    return this.elementNotLocated(ACCOUNT_TYPE_BUTTON);
};

UserForm.prototype.getAdvertiserDropdownOption = function() {
    return this.getElement(ADVERTISER_DROPDOWN_OPTION);
};

UserForm.prototype.getAgencyDropdownOption = function() {
    return this.getElement(AGENCY_DROPDOWN_OPTION);
};

UserForm.prototype.getMediaGroupDropdownOption = function() {
    return this.getElement(MEDIAGROUP_DROPDOWN_OPTION);
};

UserForm.prototype.getPublisherDropdownOption = function() {
    return this.getElement(PUBLISHER_DROPDOWN_OPTION);
};

UserForm.prototype.getAccountTypeSearch = function() {
    return this.getElement(ACCOUNT_TYPE_SEARCH);
};

UserForm.prototype.getAccountTypeSearchList = function() {
    return this.getElements(ACCOUNT_TYPE_SEARCH);
};

UserForm.prototype.noAccountTypeSearchDisplayed = function() {
    return this.elementNotLocated(ACCOUNT_TYPE_SEARCH);
};

UserForm.prototype.getViewCampaignsCheckbox = function() {
    return this.getElement(VIEW_CAMPAIGNS_CHECKBOX);
};

UserForm.prototype.getViewCampaignsCheckboxList = function() {
    return this.getElements(VIEW_CAMPAIGNS_CHECKBOX);
};

UserForm.prototype.noViewCampaignsCheckboxDisplayed = function() {
    return this.elementNotLocated(VIEW_CAMPAIGNS_CHECKBOX);
};

UserForm.prototype.getManageCampaignsCheckbox = function() {
    return this.getElement(MANAGE_CAMPAIGNS_CHECKBOX);
};

UserForm.prototype.getManageCampaignsCheckboxList = function() {
    return this.getElements(MANAGE_CAMPAIGNS_CHECKBOX);
};

UserForm.prototype.noManageCampaignsCheckboxDisplayed = function() {
    return this.elementNotLocated(MANAGE_CAMPAIGNS_CHECKBOX);
};

UserForm.prototype.getManageReportsCheckbox = function() {
    return this.getElement(MANAGE_REPORTS_CHECKBOX);
};

UserForm.prototype.getManageReportsCheckboxList = function() {
    return this.getElements(MANAGE_REPORTS_CHECKBOX);
};

UserForm.prototype.noManageReportsCheckboxDisplayed = function() {
    return this.elementNotLocated(MANAGE_REPORTS_CHECKBOX);
};

UserForm.prototype.getManageAudiencesCheckbox = function() {
    return this.getElement(MANAGE_AUDIENCES_CHECKBOX);
};

UserForm.prototype.getManageAudiencesCheckboxList = function() {
    return this.getElements(MANAGE_AUDIENCES_CHECKBOX);
};

UserForm.prototype.noManageAudiencesCheckboxDisplayed = function() {
    return this.elementNotLocated(MANAGE_AUDIENCES_CHECKBOX);
};

UserForm.prototype.getAdvertiserUsersCheckbox = function() {
    return this.getElement(ADVERTISERS_USERS_CHECKBOX);
};

UserForm.prototype.getAdvertiserUsersCheckboxList = function() {
    return this.getElements(ADVERTISERS_USERS_CHECKBOX);
};

UserForm.prototype.noAdvertiserUsersCheckboxDisplayed = function() {
    return this.elementNotLocated(ADVERTISERS_USERS_CHECKBOX);
};

UserForm.prototype.getViewInventoryCheckbox = function() {
    return this.getElement(VIEW_INVENTORY_CHECKBOX);
};

UserForm.prototype.noViewInventoryCheckboxtDisplayed = function() {
    return this.elementNotLocated(VIEW_INVENTORY_CHECKBOX);
};

UserForm.prototype.getManageInventoryAndCampaignsCheckbox = function() {
    return this.getElement(MANAGE_INVENTORY_AND_CAMPAIGNS_CHECKBOX);
};

UserForm.prototype.noManageInventoryAndCampaignsCheckboxDisplayed = function() {
    return this.elementNotLocated(MANAGE_INVENTORY_AND_CAMPAIGNS_CHECKBOX);
};

UserForm.prototype.getManageDirectSoldCampaignsCheckbox = function() {
    return this.getElement(MANAGE_DIRECT_SOLD_CAMPAIGNS_CHECKBOX);
};

UserForm.prototype.noManageDirectSoldCampaignsCheckboxDisplayed = function() {
    return this.elementNotLocated(MANAGE_DIRECT_SOLD_CAMPAIGNS_CHECKBOX);
};

UserForm.prototype.getUploadListsCheckbox = function() {
    return this.getElement(UPLOAD_LISTS_CHECKBOX);
};

UserForm.prototype.noUploadListsCheckboxDisplayed = function() {
    return this.elementNotLocated(TITLE_ACCOUNTS);
};

UserForm.prototype.getScrubListsCheckbox = function() {
    return this.getElement(SCRUB_LISTS_CHECKBOX);
};

UserForm.prototype.noScrubsListsCheckboxDisplayed = function() {
    return this.elementNotLocated(TITLE_ACCOUNTS);
};

UserForm.prototype.getPublisherUsersCheckbox = function() {
    return this.getElement(PUBLISHER_USERS_CHECKBOX);
};

UserForm.prototype.noPublisherUsersCheckboxDisplayed = function() {
    return this.elementNotLocated(TITLE_ACCOUNTS);
};

UserForm.prototype.getAddAcountLink = function() {
    return this.getElement(ADD_ACCOUNT_LINK);
};

UserForm.prototype.getCloseAccount = function() {
    return this.getElement(CLOSE_ACCOUNT);
};

UserForm.prototype.getSaveUserButton = function() {
    return this.getElement(SAVE_BTN);
};

UserForm.prototype.getAlertMessage = function(){
    return this.getErrorAlertPresent();
};

UserForm.prototype.waitUntilSpinnerDissapear = function() {
    return this.waitUntilStale(SPINNER);
};

UserForm.prototype.waitUntilSaveUserButtonEnabled = function(){
    return this.waitUntilEnabled(SAVE_BTN);
};

UserForm.prototype.waitUntilSaveUserButtonDisabled = function(){
    return this.waitUntilDisabled(SAVE_BTN);
};

// Clicks

UserForm.prototype.completeUserFields = function(user){
    this.completeFirstName(user.firstName);
    this.completeLastName(user.lastName);
    this.completeEmail(user.email);
    this.completePassword(user.password);
    this.completeConfirmPassword(user.confirmPassword);
    return this;
};

UserForm.prototype.completeFirstName = function(text){
    this.waitUntilVisible(FIRST_NAME_USER);
    this.clear(FIRST_NAME_USER);
    this.sendKeys(FIRST_NAME_USER, text);
    this.sendKeys(FIRST_NAME_USER, key.TAB);
    return this;
};

UserForm.prototype.completeLastName = function(text){
    this.waitUntilVisible(LAST_NAME_USER);
    this.clear(LAST_NAME_USER);
    this.sendKeys(LAST_NAME_USER, text);
    this.sendKeys(LAST_NAME_USER, key.TAB);
    return this;
};

UserForm.prototype.completeEmail = function(text){
    this.waitUntilVisible(EMAIL_USER);
    this.clear(EMAIL_USER);
    this.sendKeys(EMAIL_USER, text);
    this.sendKeys(EMAIL_USER, key.TAB);
    return this;
};

UserForm.prototype.completePassword = function(text){
    this.waitUntilVisible(PASSWORD_USER);
    this.clear(PASSWORD_USER);
    this.sendKeys(PASSWORD_USER, text);
    this.sendKeys(PASSWORD_USER, key.TAB);
    return this;
};

UserForm.prototype.completeConfirmPassword = function(text){
    this.waitUntilVisible(CONFIRM_PASSWORD_USER);
    this.clear(CONFIRM_PASSWORD_USER);
    this.sendKeys(CONFIRM_PASSWORD_USER, text);
    this.sendKeys(CONFIRM_PASSWORD_USER, key.TAB);
    return this;
};

UserForm.prototype.clickRadioLiveIntentAdmin = function() {
    return this.waitAndClick(LIVEINTENT_ADMIN);
};

UserForm.prototype.clickRadioInternalUser = function() {
    return this.waitAndClick(INTERNAL_USER);
};

UserForm.prototype.clickRadioExternalUser = function() {
    return this.waitAndClick(EXTERNAL_USER);
};

UserForm.prototype.clickLiveIntentAdOpsCheckBox = function() {
    return this.waitAndClick(IU_LIVEINTENT_ADOPS_CHECKBOX);
};

UserForm.prototype.clickLiveIntentAccountDirectorCheckBox = function() {
    return this.waitAndClick(IU_LIVEINTENT_ACC_DIRECTOR_CHECKBOX);
};

UserForm.prototype.clickLiveIntentStandardCheckBox = function() {
    return this.waitAndClick(IU_LIVEINTENT_STANDARD_CHECKBOX);
};

UserForm.prototype.clickLiveIntentAccountManagerCheckBox = function() {
    return this.waitAndClick(IU_LIVEINTENT_ACC_MANAGER_CHECKBOX);
};

UserForm.prototype.clickAccountTypeButton = function() {
    this.waitUntilVisible(ACCOUNT_TYPE_BUTTON);
    this.click(ACCOUNT_TYPE_BUTTON);
    return this;
};

UserForm.prototype.clickSecondAccountTypeButton = function() {
    this.click(ACCOUNT_TYPE_BUTTON_2);
    return this;
};

UserForm.prototype.selectAdvertiserAccountType = function() {
    this.clickAccountTypeButton();
    return this.waitAndClick(ADVERTISER_DROPDOWN_OPTION);
};

UserForm.prototype.selectAgencyAccountType = function() {
    this.clickAccountTypeButton();
    return this.waitAndClick(AGENCY_DROPDOWN_OPTION);
};

UserForm.prototype.selectMediaGroupAccountType = function() {
    this.clickAccountTypeButton();
    return this.waitAndClick(MEDIAGROUP_DROPDOWN_OPTION);
};

UserForm.prototype.selectPublisherAccountType = function() {
    this.clickAccountTypeButton();
    return this.waitAndClick(PUBLISHER_DROPDOWN_OPTION);
};

UserForm.prototype.selectPublisherSecondAccountType = function() {
    this.clickSecondAccountTypeButton();
    return this.waitAndClick(PUBLISHER_DROPDOWN_OPTION);
};

UserForm.prototype.searchAndSelectFirstAccountType = function(value) {
    this.waitUntilVisible(ACCOUNT_TYPE_SEARCH);
    this.clear(ACCOUNT_TYPE_SEARCH);
    this.sendKeys(ACCOUNT_TYPE_SEARCH, value);
    this.click(ACCOUNT_TYPE_SEARCH);
    this.getDropDownOptions().click();
    return this;
};

UserForm.prototype.searchAndSelectSecondAccountType = function(value) {
    this.waitUntilVisible(ACCOUNT_TYPE_SEARCH2);
    this.clear(ACCOUNT_TYPE_SEARCH2);
    this.sendKeys(ACCOUNT_TYPE_SEARCH2, value);
    this.click(ACCOUNT_TYPE_SEARCH2);
    this.getDropDownOptions().click();
    return this;
};

UserForm.prototype.getDropDownOptions = function() {
    this.waitUntilVisible(SEARCH_ITEM);
    return this.findElement(SEARCH_ITEM);
};

UserForm.prototype.clickViewCampaignsCheckBox = function() {
    return this.waitAndClick(VIEW_CAMPAIGNS_CHECKBOX);
};

UserForm.prototype.clickManageCampaignsCheckBox = function() {
    return this.waitAndClick(MANAGE_CAMPAIGNS_CHECKBOX);
};

UserForm.prototype.clickManageReportsCheckBox = function() {
    return this.waitAndClick(MANAGE_REPORTS_CHECKBOX);
};

UserForm.prototype.clickManageAudiencesCheckBox = function() {
    return this.waitAndClick(MANAGE_AUDIENCES_CHECKBOX);
};

UserForm.prototype.clickSecondManageAudiencesCheckBox = function() {
    return this.waitAndClick(MANAGE_AUDIENCES_CHECKBOX_2);
};

UserForm.prototype.clickAdvertiserUsersCheckBox = function() {
    return this.waitAndClick(ADVERTISERS_USERS_CHECKBOX);
};

UserForm.prototype.clickViewInventoryCheckBox = function() {
    return this.waitAndClick(VIEW_INVENTORY_CHECKBOX);
};
UserForm.prototype.clickManageInventoryAndCampaignsCheckBox = function() {
    return this.waitAndClick(MANAGE_INVENTORY_AND_CAMPAIGNS_CHECKBOX);
};

UserForm.prototype.clickManageDirectSoldCampaignsCheckBox = function() {
    return this.waitAndClick(MANAGE_DIRECT_SOLD_CAMPAIGNS_CHECKBOX);
};

UserForm.prototype.clickUploadListsCheckBox = function() {
    return this.waitAndClick(UPLOAD_LISTS_CHECKBOX);
};

UserForm.prototype.clickScrubListsCheckBox = function() {
    return this.waitAndClick(SCRUB_LISTS_CHECKBOX);
};

UserForm.prototype.clickPublisherUsersCheckBox = function() {
    return this.waitAndClick(PUBLISHER_USERS_CHECKBOX);
};

UserForm.prototype.clickAddAccountLink = function() {
    return this.waitAndClick(ADD_ACCOUNT_LINK);
};

UserForm.prototype.clickCloseAccount = function() {
    this.waitOverlayUntilStale();
    this.waitUntilSpinnerContainerNotVisible();
    return this.waitAndClick(CLOSE_ACCOUNT);
};

UserForm.prototype.clickSaveButton = function() {
    return this.waitAndClick(SAVE_BTN);
};

module.exports = UserForm;
