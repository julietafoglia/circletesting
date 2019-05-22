'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

// elements
const MORE_ADVERTISERS = By.css('button.button--primary.more-advertisers');
const SEARCH_FIELD = By.css('.striped sticky input');
const ADD_SEARCH_TERM = By.css('.icon.icon--add-create.icon--inherit');
const FIRST_TABLE_ROW = By.css('.striped sticky table tbody > tr');
const REMOVE_BUTTON = By.css('.dropdown > .dropdown--container li > a > span');
const SUCCESS_ALERT = By.css('.success ._alert._alert---overlay');

const TABLE_FIRST_NAME = By.css('.flexrow .row .overflow');

function AccountsPage(webdriver) {
    BasePage.call(this, webdriver);
}

AccountsPage.prototype = Object.create(BasePage.prototype);
AccountsPage.prototype.constructor = AccountsPage;

AccountsPage.prototype.clickAddMoreAdvertisers = function() {
    this.waitUntilVisible(MORE_ADVERTISERS);
    return this.click(MORE_ADVERTISERS);
},

AccountsPage.prototype.getFirstTableRow = function() {
    this.waitUntilVisible(FIRST_TABLE_ROW);
    this.findElement(FIRST_TABLE_ROW);
    return this;
};

AccountsPage.prototype.removeAdvertiser = function(text) {
    let actions = this.driver.actions();
    this.waitUntilVisible(this.getAdvertiserRow(text));
    actions
        .mouseMove(this.getAdvertiserRow(text))
        .click(this.getDeleteAdvertiserBtn(text))
        .perform();
    this.driver.sleep(3000);
    this.click(REMOVE_BUTTON);
    return this.waitUntilVisible(SUCCESS_ALERT);
};

AccountsPage.prototype.getAdvertiserRow = function(text) {
    return this.findElement(By.xpath(
        '//a[@class=\'overflow\' and text()=\'' + text + '\']'));
};

AccountsPage.prototype.getDeleteAdvertiserBtn = function(text) {
    return this.findElement(
        By.xpath(
            '//a[@class=\'overflow\' and text()=\'' + text + '\']'
            + '/../../div[@class=\'column--2\']' +
            '//span[@class=\'icon icon--arrow-down\']'));
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
