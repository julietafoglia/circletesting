'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;

// Internal Tools Side bar elements
const USERS_SIDEBAR = By.xpath('//span[text() = "Users"]');
const ACCOUNTS_SIDEBAR = By.xpath('//span[text() = "Accounts"]');

// elements
const TITLE = By.xpath('//h1[text()="Accounts"]');
const CREATE_ACCOUNT_BUTTON = By.xpath('//button[text()="Create Account"]');
const AGENCIES_CURRENT_VIEW = By.xpath('//span[text()="Agencies"]');
const MEDIA_GROUPS_CURRENT_VIEW = By.xpath('//span[text()="Media Groups"]');
const SEARCH_ACCOUNT = By.css('input[placeholder="Search"]');
const FILTER_OPTION_REMOVE = (text) =>
    By.xpath(`//span[contains(text(),"${text}")]`);
const FIRST_CONTROL_BUTTON = By.xpath('//button[text() = "First"]');
const PREVIOUS_CONTROL_BUTTON = By.xpath('//button[text() = "Previous"]');
const NEXT_CONTROL_BUTTON = By.xpath('//button[text() = "Next"]');
const LAST_CONTROL_BUTTON = By.xpath('//button[text() = "Last"]');
const FIRST_TABLE_ROW = By.css('table tbody > tr');
const TABLE_FIRST_NAME = By.css('.row-actions .overflow');
const TABLE_FIRST_SPAN = By.css('.row-actions > span');
const SPINNER = By.css('div .spinner--small');
const TABLE_OVERLAY = By.css('.no-spinner.ng-trigger');

const COLUMN_NAME_TITLE = By.css('div .data table thead tr > ' +
    'th:nth-child(1)');
const COLUMN_CREATEDBY_TITLE = By.css('div .data table thead tr > ' +
'th:nth-child(2)');
const COLUMN_CREATED_TITLE = By.css('div .data table thead tr > ' +
'th:nth-child(3)');
const COLUMN_UPDATED_TITLE = By.css('div .data table thead tr > ' +
'th:nth-child(4)');

const LINK_EDIT_LIST = By.xpath('//a[text() = "Edit"]');
const LINK_ADD_ADVERTISER_LIST = By.xpath('//a[text() = "Add Advertiser"]');
const MORE_SPAN_LIST = By.xpath('//span[text() = "More "]');
const ADD_PUBLISHER_SPAN_LIST = By.xpath('//span[text() = "Add Publisher"]');

function AccountsLibraryPage(webdriver) {
    BasePage.call(this, webdriver);
}

AccountsLibraryPage.prototype = Object.create(BasePage.prototype);
AccountsLibraryPage.prototype.constructor = AccountsLibraryPage;

AccountsLibraryPage.prototype.getTitle = function(){
    return this.getElement(TITLE);
};

AccountsLibraryPage.prototype.getAgencyView = function(){
    return this.getElement(AGENCIES_CURRENT_VIEW);
};

AccountsLibraryPage.prototype.getMediaGroupView = function(){
    return this.getElement(MEDIA_GROUPS_CURRENT_VIEW);
};

AccountsLibraryPage.prototype.getCreateAccountButton = function(){
    return this.getElement(CREATE_ACCOUNT_BUTTON);
};

AccountsLibraryPage.prototype.getSearchField = function(){
    return this.getElement(SEARCH_ACCOUNT);
};

AccountsLibraryPage.prototype.getRemoveFilterOption = function(spanText){
    return this.getElement(FILTER_OPTION_REMOVE(spanText));
};

AccountsLibraryPage.prototype.noRemoveFilterOptionDisplayed = function() {
    return this.elementNotLocated(FILTER_OPTION_REMOVE);
};

AccountsLibraryPage.prototype.getFirstControlButton = function(){
    return this.getElement(FIRST_CONTROL_BUTTON);
};

AccountsLibraryPage.prototype.waitUntilFirstControlButtonEnabled = function(){
    return this.waitUntilEnabled(FIRST_CONTROL_BUTTON);
};

AccountsLibraryPage.prototype.waitUntilFirstControlButtonDisabled = function(){
    return this.waitUntilDisabled(FIRST_CONTROL_BUTTON);
};

AccountsLibraryPage.prototype.getPreviousControlButton = function(){
    return this.getElement(PREVIOUS_CONTROL_BUTTON);
};

AccountsLibraryPage.prototype.waitUntilPreviousControlButtonEnabled =
    function(){
        return this.waitUntilEnabled(PREVIOUS_CONTROL_BUTTON);
    };

AccountsLibraryPage.prototype.waitUntilPreviousControlButtonDisabled =
    function(){
        return this.waitUntilDisabled(PREVIOUS_CONTROL_BUTTON);
    };

AccountsLibraryPage.prototype.getNextControlButton = function(){
    return this.getElement(NEXT_CONTROL_BUTTON);
};

AccountsLibraryPage.prototype.waitUntilNextControlButtonEnabled = function(){
    return this.waitUntilEnabled(NEXT_CONTROL_BUTTON);
};

AccountsLibraryPage.prototype.waitUntilNextControlButtonDisabled = function(){
    return this.waitUntilDisabled(NEXT_CONTROL_BUTTON);
};

AccountsLibraryPage.prototype.getLastControlButton = function(){
    return this.getElement(LAST_CONTROL_BUTTON);
};

AccountsLibraryPage.prototype.waitUntilLastControlButtonEnabled = function(){
    return this.waitUntilEnabled(LAST_CONTROL_BUTTON);
};

AccountsLibraryPage.prototype.waitUntilLastControlButtonDisabled = function(){
    return this.waitUntilDisabled(LAST_CONTROL_BUTTON);
};

AccountsLibraryPage.prototype.getFirstTableRow = function(){
    return this.getElement(FIRST_TABLE_ROW);
};

AccountsLibraryPage.prototype.getFirstTableName = function() {
    this.waitUntilSpinnerContainerNotVisible();
    return this.getElement(TABLE_FIRST_NAME);
};

AccountsLibraryPage.prototype.getColumnAccountNameTitle = function(){
    return this.getElement(COLUMN_NAME_TITLE);
};

AccountsLibraryPage.prototype.getColumnCreatedByTitle = function(){
    return this.getElement(COLUMN_CREATEDBY_TITLE);
};

AccountsLibraryPage.prototype.getColumnCreatedTitle = function(){
    return this.getElement(COLUMN_CREATED_TITLE);
};

AccountsLibraryPage.prototype.getColumnUpdatedTitle = function(){
    return this.getElement(COLUMN_UPDATED_TITLE);
};

AccountsLibraryPage.prototype.getLinkEdit = function(){
    this.waitAndClick(TABLE_FIRST_SPAN);
    return this.getElement(LINK_EDIT_LIST);
};

AccountsLibraryPage.prototype.getLinkAddAdvertiserList = function(){
    this.waitAndClick(TABLE_FIRST_SPAN);
    return this.getElement(LINK_ADD_ADVERTISER_LIST);
};

AccountsLibraryPage.prototype.getMoreLinkList = function() {
    this.waitAndClick(TABLE_FIRST_SPAN);
    return this.getElement(MORE_SPAN_LIST);
};

AccountsLibraryPage.prototype.getAddPublisherLinkList = function(){
    this.waitAndClick(TABLE_FIRST_SPAN);
    return this.getElement(ADD_PUBLISHER_SPAN_LIST);
};

AccountsLibraryPage.prototype.waitUntilSpinnerDissapear = function(){
    return this.waitUntilStale(SPINNER);
};

AccountsLibraryPage.prototype.waitUntilTableIsFiltered = function() {
    return this.waitUntilNotVisible(TABLE_OVERLAY);
};

AccountsLibraryPage.prototype.waitUntilFilterStale = function() {
    return this.waitUntilStale(TABLE_OVERLAY);
};

// Clicks

AccountsLibraryPage.prototype.clickUsersSideBar = function(){
    return this.waitAndClick(USERS_SIDEBAR);
};

AccountsLibraryPage.prototype.clickAccountsSideBar = function(){
    return this.waitAndClick(ACCOUNTS_SIDEBAR);
};

AccountsLibraryPage.prototype.clickCreateAccountButton = function(){
    return this.waitAndClick(CREATE_ACCOUNT_BUTTON);
};

AccountsLibraryPage.prototype.clickAgenciesView = function() {
    return this.waitAndClick(AGENCIES_CURRENT_VIEW);
};

AccountsLibraryPage.prototype.clickMediaGroupView = function() {
    return this.waitAndClick(MEDIA_GROUPS_CURRENT_VIEW);
};

AccountsLibraryPage.prototype.setSearchField = function(value) {
    this.waitUntilVisible(SEARCH_ACCOUNT);
    this.clear(SEARCH_ACCOUNT);
    this.sendKeys(SEARCH_ACCOUNT, value);
    this.sendKeys(SEARCH_ACCOUNT, key.ENTER);
    return this.waitUntilFilterNotVisible();
};

AccountsLibraryPage.prototype.removeFilterOption = function(spanText){
    return this.waitAndClick(FILTER_OPTION_REMOVE(spanText));
};

AccountsLibraryPage.prototype.clickFirstPageTableControl = function(){
    return this.waitAndClick(FIRST_CONTROL_BUTTON);
};

AccountsLibraryPage.prototype.clickPreviousPageTableControl = function(){
    return this.waitAndClick(PREVIOUS_CONTROL_BUTTON);
};

AccountsLibraryPage.prototype.clickNextPageTableControl = function(){
    return this.waitAndClick(NEXT_CONTROL_BUTTON);
};

AccountsLibraryPage.prototype.clickLastPageTableControl = function(){
    return this.waitAndClick(LAST_CONTROL_BUTTON);
};

AccountsLibraryPage.prototype.clickEditAccount = function(){
    return this.getLinkEdit().click();
};

AccountsLibraryPage.prototype.clickFirstTableName = function(){
    return this.getFirstTableName().click();
};

AccountsLibraryPage.prototype.clickAddAdvertiser = function() {
    return this.getLinkAddAdvertiserList().click();
};

AccountsLibraryPage.prototype.clickMoreLink = function(){
    this.getMoreLinkList().click();
};

AccountsLibraryPage.prototype.clickAddPublisher = function() {
    return this.waitAndClick(ADD_PUBLISHER_SPAN_LIST);
};

module.exports = AccountsLibraryPage;
