'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');
const driverTimeOut = 5000;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;

// inputs
const INPUT_SEARCH = By.xpath('//global-search-input/div/' +
            'input-field/div/div');
const TITLE_NO_RESULTS = By.xpath('//h3[text() = "There are currently no' +
            ' results to show."]');
const TEXT_DDN_NO_RESULTS = By.xpath('//h4[text() = "Sorry, ' +
    'there are no results to show."]');

// buttons
const EDIT_ADV = By.xpath('//a[text() = "Edit"]');
const DDN_SEARCH_RESULTS = By.css('.search-results');


function GlobalSearchDropdown(webdriver) {
    BasePage.call(this, webdriver);
}

GlobalSearchDropdown.prototype = Object.create(BasePage.prototype);
GlobalSearchDropdown.prototype.constructor = GlobalSearchDropdown;

GlobalSearchDropdown.prototype.getTitleNoResults = function() {
    this.waitUntilVisible(TITLE_NO_RESULTS);
    return this.findElement(TITLE_NO_RESULTS);
};

GlobalSearchDropdown.prototype.getTextDdnNoResults = function() {
    this.waitUntilVisible(DDN_SEARCH_RESULTS);
    return this.findElement(TEXT_DDN_NO_RESULTS);
};

GlobalSearchDropdown.prototype.getInputSearch = function() {
    return this.findElement(INPUT_SEARCH);
};

GlobalSearchDropdown.prototype.setInputSearch = function(value) {
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.sendKeys(INPUT_SEARCH, key.ENTER);
    return this;
};

GlobalSearchDropdown.prototype.setInputSearchDdn = function(value) {
    this.waitUntilVisible(INPUT_SEARCH);
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.click(INPUT_SEARCH);
    this.driver.sleep(driverTimeOut);
    return this.waitUntilVisible(DDN_SEARCH_RESULTS);
};

GlobalSearchDropdown.prototype.setInputSearchSecondDdn = function(value) {
    this.waitUntilVisible(INPUT_SEARCH);
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.driver.sleep(driverTimeOut);
    return this.waitUntilVisible(DDN_SEARCH_RESULTS);
};

GlobalSearchDropdown.prototype.clickAdvertiser = function(elementText) {
    this.click(By.xpath("//a[text() = '" + elementText + "']"));
    return this.waitUntilVisible(By
        .xpath("//span[text() = '" + elementText + "']"));
};

GlobalSearchDropdown.prototype.getEditAdv = function() {
    this.waitUntilVisible(EDIT_ADV);
    return this.findElement(EDIT_ADV);
};

module.exports = GlobalSearchDropdown;
