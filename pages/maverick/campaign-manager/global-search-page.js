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
            'div/input');
const TITLE_NO_RESULTS = By.xpath('//h3[text() = "There are currently no' +
            ' results to show."]');
const TEXT_DDN_NO_RESULTS = By.xpath('//h4[text() = "Sorry, ' +
    'there are no results to show."]');
const LINK_VIEW_ALL_RESULTS = By.xpath('//a[text() = "View All ' +
    'Search Results"]');

// buttons
const EDIT_ADV = By.xpath('//a[text() = "Edit"]');
const DDN_SEARCH_RESULTS = By.css('.popover--content');

function GlobalSearchPage(webdriver) {
    BasePage.call(this, webdriver);
}

GlobalSearchPage.prototype = Object.create(BasePage.prototype);
GlobalSearchPage.prototype.constructor = GlobalSearchPage;

GlobalSearchPage.prototype.getTitleNoResults = function() {
    this.waitUntilVisible(TITLE_NO_RESULTS);
    return this.findElement(TITLE_NO_RESULTS);
};

GlobalSearchPage.prototype.getTextDdnNoResults = function() {
    this.waitUntilVisible(DDN_SEARCH_RESULTS);
    return this.findElement(TEXT_DDN_NO_RESULTS);
};

GlobalSearchPage.prototype.getInputSearch = function() {
    return this.findElement(INPUT_SEARCH);
};

GlobalSearchPage.prototype.setInputSearch = function(value) {
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.sendKeys(INPUT_SEARCH, key.ENTER);
    return this.driver.sleep(driverTimeOut);
};

GlobalSearchPage.prototype.setInputSearchDdn = function(value) {
    this.waitUntilVisible(INPUT_SEARCH);
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.click(INPUT_SEARCH);
    this.driver.sleep(driverTimeOut);
    return this.waitUntilVisible(DDN_SEARCH_RESULTS);
};

GlobalSearchPage.prototype.setInputSearchSecondDdn = function(value) {
    this.waitUntilVisible(INPUT_SEARCH);
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.driver.sleep(driverTimeOut);
    return this.waitUntilVisible(DDN_SEARCH_RESULTS);
};

GlobalSearchPage.prototype.clickAdvertiser = function(elementText) {
    this.clickLinkText(elementText);
    return this.waitUntilVisible(By
        .xpath("//span[text() = '" + elementText + "']"));
};

GlobalSearchPage.prototype.getEditAdv = function() {
    this.waitUntilVisible(EDIT_ADV);
    return this.findElement(EDIT_ADV);
};

GlobalSearchPage.prototype.getAdvertiserLink = function(elementText) {
    return this.getLinkText(elementText);
};

GlobalSearchPage.prototype.clickViewAllResults = function() {
    this.waitUntilVisible(LINK_VIEW_ALL_RESULTS);
    return this.click(LINK_VIEW_ALL_RESULTS);
};

GlobalSearchPage.prototype.linkNotLocated = function(elementText) {
    return this.elementNotLocated(By
        .xpath("//a[text() = '" + elementText + "']"));
};

module.exports = GlobalSearchPage;
