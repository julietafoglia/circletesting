'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');
const driverTimeOut = 5000;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

// elements
const MORE_ADVERTISERS = By.xpath('//button[text() = "Select More Accounts"]');
const SEARCH_FIELD = By.css('.striped sticky input');
const ADD_SEARCH_TERM = By.css('.icon.icon--add-create.icon--inherit');
const FIRST_TABLE_ROW = By.css('.striped sticky table tbody > tr');
const REMOVE_BUTTON = By.xpath('//a[text() = "Remove"]');
const SUCCESS_ALERT = By.css('.success');

const TABLE_FIRST_NAME = By.css('.flexrow .row .overflow');

function AccountsPage(webdriver) {
    BasePage.call(this, webdriver);
}

AccountsPage.prototype = Object.create(BasePage.prototype);
AccountsPage.prototype.constructor = AccountsPage;

AccountsPage.prototype.clickAddMoreAdvertisers = function() {
    this.waitUntilVisible(MORE_ADVERTISERS);
    this.click(MORE_ADVERTISERS);
    return this.driver.sleep(driverTimeOut);
},

AccountsPage.prototype.getFirstTableRow = function() {
    this.waitUntilVisible(FIRST_TABLE_ROW);
    this.findElement(FIRST_TABLE_ROW);
    return this;
};

AccountsPage.prototype.removeAdvertiser = function(text) {
    this.waitUntilVisible(By.xpath(
        '//span[@class="supporting" and contains' +
                '(text(),"' + text + '")]'));
    this.driver.sleep(1000);
    this.clickAdvertiserIdRow(text);
    this.clickRemoveButton();
    return this.waitUntilVisible(SUCCESS_ALERT);
};

AccountsPage.prototype.getAdvertiserRow = function(text) {
    return this.findElement(By.xpath('//a[text()="' + text + '"]'));
};

AccountsPage.prototype.getAdvertiserIdRow = function(id) {
    return this.findElement(By.xpath(
        '//span[@class=\'supporting\' and contains' +
                '(text(),\'' + id + '\')]'));
};

AccountsPage.prototype.clickAdvertiserIdRow = function(id) {
    this.waitUntilVisible(By.xpath(
        '//span[@class=\'supporting\' and contains' +
                '(text(),\'' + id + '\')]'));
    return this.click(By.xpath(
        '//span[@class=\'supporting\' and contains' +
                '(text(),\'' + id + '\')]'));
};


AccountsPage.prototype.getDeleteAdvertiserBtn = function() {
    return this.findElement(
        By.xpath('//a[text()="Remove"]'));
};

AccountsPage.prototype.clickRemoveButton = function() {
    this.waitUntilVisible(REMOVE_BUTTON);
    return this.click(REMOVE_BUTTON);
};

AccountsPage.prototype.AddAdvertiserFilter = function(text) {
    this.waitUntilVisible(SEARCH_FIELD);
    this.clear(SEARCH_FIELD);
    this.sendKeys(SEARCH_FIELD, text);
    this.waitUntilVisible(ADD_SEARCH_TERM);
    this.click(ADD_SEARCH_TERM);
    // Check that the searchedTag exists
    return this;
};

AccountsPage.prototype.getSearchedTermTag = function() {
    return this.waitUntilVisible(By.css('.smart-table---filters tag'));
};

AccountsPage.prototype.getFirstTableName = function() {
    return this.findElement(TABLE_FIRST_NAME);
};

module.exports = AccountsPage;
