'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;
const twoSecTO = 2000;

// Internal Tools Side bar elements
const USERS_SIDEBAR = By.xpath('//span[text() = "Users"]');
const ACCOUNTS_SIDEBAR = By.xpath('//span[text() = "Accounts"]');

// elements page
const SPINNER_SMALL = By.xpath("//div[contains(@class,'spinner--small')]");

const TITLE_USERS = By.xpath('//h1[text() = "Users"]');
const CREATE_NEW_USER_BUTTON = By.
    xpath('//button[text() = "Create New User"]');
const INPUT_SEARCH = By.css('input[placeholder="Search"]');
const FILTER_OPTION_REMOVE = (text) =>
    By.xpath(`//span[contains(text(),"${text}")]`);
const FIRST_CONTROL_BUTTON = By.xpath('//button[text() = "First"]');
const PREVIOUS_CONTROL_BUTTON = By.xpath('//button[text() = "Previous"]');
const NEXT_CONTROL_BUTTON = By.xpath('//button[text() = "Next"]');
const LAST_CONTROL_BUTTON = By.xpath('//button[text() = "Last"]');

const TABLE = By.css('div .data > table');
const FIRST_TABLE_ROW = By.css('div .data table tbody > tr');
const TABLE_FIRST_NAME_LIST = By.css('.row-actions .row .overflow');
const COLUMN_FIRST_NAME_TITLE = By.css('div .data table thead tr > ' +
    'th:nth-child(1)');
const COLUMN_LAST_NAME_TITLE = By.css('div .data table thead tr > ' +
'th:nth-child(2)');
const COLUMN_EMAIL_TITLE = By.css('div .data table thead tr > ' +
'th:nth-child(3)');
const COLUMN_CREATED_TITLE = By.css('div .data table thead tr > ' +
'th:nth-child(4)');

const LINK_EDIT_LIST = By.xpath('//a[text() = "Edit"]');
const LINK_DELETE_LIST = By.xpath('//a[text() = "Delete"]');
const LINK_MORE_LIST = By.xpath('//span[text()= "More "]');

const LOADER = By.id('loading-spinner');

function UsersLibraryPage(webdriver){
    BasePage.call(this, webdriver);
}

UsersLibraryPage.prototype = Object.create(BasePage.prototype);
UsersLibraryPage.prototype.constructor = UsersLibraryPage;

UsersLibraryPage.prototype.getTitleUsers = function() {
    return this.getElement(TITLE_USERS);
};

UsersLibraryPage.prototype.getSpinnerSmall = function(){
    return this.getElement(SPINNER_SMALL);
};

UsersLibraryPage.prototype.getUserSideBar = function() {
    return this.getElement(USERS_SIDEBAR);
};

UsersLibraryPage.prototype.getCreateNewUserButton = function(){
    return this.getElement(CREATE_NEW_USER_BUTTON);
};

UsersLibraryPage.prototype.getInputSearch = function(){
    return this.getElement(INPUT_SEARCH);
};

UsersLibraryPage.prototype.getRemoveFilterOption = function(text){
    return this.getElement(FILTER_OPTION_REMOVE(text));
};

UsersLibraryPage.prototype.getFirstControlButton = function(){
    return this.getElement(FIRST_CONTROL_BUTTON);
};

UsersLibraryPage.prototype.waitUntilFirstControlButtonEnabled = function(){
    return this.waitUntilEnabled(FIRST_CONTROL_BUTTON);
};

UsersLibraryPage.prototype.waitUntilFirstControlButtonDisabled = function(){
    return this.waitUntilDisabled(FIRST_CONTROL_BUTTON);
};

UsersLibraryPage.prototype.getPreviousControlButton = function(){
    return this.getElement(PREVIOUS_CONTROL_BUTTON);
};

UsersLibraryPage.prototype.waitUntilPreviousControlButtonEnabled = function(){
    return this.waitUntilEnabled(PREVIOUS_CONTROL_BUTTON);
};

UsersLibraryPage.prototype.waitUntilPreviousControlButtonDisabled = function(){
    return this.waitUntilDisabled(PREVIOUS_CONTROL_BUTTON);
};

UsersLibraryPage.prototype.getNextControlButton = function(){
    return this.getElement(NEXT_CONTROL_BUTTON);
};

UsersLibraryPage.prototype.waitUntilNextControlButtonEnabled = function(){
    return this.waitUntilEnabled(NEXT_CONTROL_BUTTON);
};

UsersLibraryPage.prototype.waitUntilNextControlButtonDisabled = function(){
    return this.waitUntilDisabled(NEXT_CONTROL_BUTTON);
};

UsersLibraryPage.prototype.getLastControlButton = function(){
    return this.getElement(LAST_CONTROL_BUTTON);
};

UsersLibraryPage.prototype.waitUntilLastControlButtonEnabled = function(){
    return this.waitUntilEnabled(LAST_CONTROL_BUTTON);
};

UsersLibraryPage.prototype.waitUntilLastControlButtonDisabled = function(){
    return this.waitUntilDisabled(LAST_CONTROL_BUTTON);
};

UsersLibraryPage.prototype.getTable = function(){
    return this.getElement(TABLE);
};

UsersLibraryPage.prototype.getFirstTableRow = function(){
    return this.getElement(FIRST_TABLE_ROW);
};

UsersLibraryPage.prototype.getFirstNameOnTable = function(){
    return this.getElement(TABLE_FIRST_NAME_LIST);
};

UsersLibraryPage.prototype.getColumnFirstNameTitle = function(){
    return this.getElement(COLUMN_FIRST_NAME_TITLE);
};

UsersLibraryPage.prototype.getColumnLastNameTitle = function(){
    return this.getElement(COLUMN_LAST_NAME_TITLE);
};

UsersLibraryPage.prototype.getColumnEmailTitle = function(){
    return this.getElement(COLUMN_EMAIL_TITLE);
};

UsersLibraryPage.prototype.getColumnCreatedTitle = function(){
    return this.getElement(COLUMN_CREATED_TITLE);
};

UsersLibraryPage.prototype.getLinkEditList = function(){
    return this.getElement(LINK_EDIT_LIST);
};

UsersLibraryPage.prototype.getLinkDeleteList = function(){
    return this.getElement(LINK_DELETE_LIST);
};

UsersLibraryPage.prototype.getLinkMoreList = function(){
    return this.getElement(LINK_MORE_LIST);
};

UsersLibraryPage.prototype.getSpinnerCSS = function(){
    return this.getElement(LOADER);
};

UsersLibraryPage.prototype.noRemoveFilterOptionDisplayed = function(text) {
    return this.elementNotLocated(FILTER_OPTION_REMOVE(text));
};

// Clicks

UsersLibraryPage.prototype.clickUsersSideBar = function(){
    return this.waitAndClick(USERS_SIDEBAR);
};

UsersLibraryPage.prototype.clickAccountsSideBar = function(){
    return this.waitAndClick(ACCOUNTS_SIDEBAR);
};

UsersLibraryPage.prototype.clickCreateNewUser = function(){
    this.waitAndClick(CREATE_NEW_USER_BUTTON);
    return this.waitUntilOverlayNotVisible();
};

UsersLibraryPage.prototype.setInputSearch = function(value) {
    this.waitUntilVisible(INPUT_SEARCH);
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.sendKeys(INPUT_SEARCH, key.ENTER);
    return this.driver.sleep(twoSecTO);
};

UsersLibraryPage.prototype.removeFilterOption = function(text){
    this.waitAndClick(FILTER_OPTION_REMOVE(text));
    return this.driver.sleep(twoSecTO);
};

UsersLibraryPage.prototype.clickFirstPageTableControl = function(){
    return this.waitAndClick(FIRST_CONTROL_BUTTON);
};

UsersLibraryPage.prototype.clickPreviousPageTableControl = function(){
    return this.waitAndClick(PREVIOUS_CONTROL_BUTTON);
};

UsersLibraryPage.prototype.clickNextPageTableControl = function(){
    return this.waitAndClick(NEXT_CONTROL_BUTTON);
};

UsersLibraryPage.prototype.clickLastPageTableControl = function(){
    return this.waitAndClick(LAST_CONTROL_BUTTON);
};

module.exports = UsersLibraryPage;
