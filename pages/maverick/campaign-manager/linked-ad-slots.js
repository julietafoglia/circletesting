'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;

// elements
const TITLE_SELECT_AD_SLOTS = By.xpath('//h4[text() = \'Select Ad Slots\']');

const TEXT_SELECTED_ADS = By.css('._badge');

const INPUT_SEARCH = By.css('input[placeholder = "Search Ad Slot"]');
const BUTTON_ADD = By.xpath('//button[text() = "Add"]');
const BUTTON_CLOSE = By.xpath('//ad-slot-targeting/div/lightbox/div[2]' +
    '/div/div/div[1]/button/span');
const LINK_CLEAR_ALL = By.xpath('//a[text()=\'Clear All\']');


function LinkedAdSlotsPage(webdriver) {
    BasePage.call(this, webdriver);
}

LinkedAdSlotsPage.prototype = Object.create(BasePage.prototype);
LinkedAdSlotsPage.prototype.constructor = LinkedAdSlotsPage;

LinkedAdSlotsPage.prototype.getTitleSelectAdSlots = function() {
    this.waitUntilVisible(TITLE_SELECT_AD_SLOTS);
    return this.findElement(TITLE_SELECT_AD_SLOTS);
};

LinkedAdSlotsPage.prototype.getTextSelectedAds = function() {
    this.waitUntilVisible(TEXT_SELECTED_ADS);
    return this.findElement(TEXT_SELECTED_ADS);
};

LinkedAdSlotsPage.prototype.getInputSearch = function() {
    this.waitUntilVisible(INPUT_SEARCH);
    return this.findElement(INPUT_SEARCH);
};

LinkedAdSlotsPage.prototype.getButtonAdd = function() {
    this.waitUntilVisible(BUTTON_ADD);
    return this.findElement(BUTTON_ADD);
};

LinkedAdSlotsPage.prototype.getLinkClearAll = function() {
    this.waitUntilVisible(LINK_CLEAR_ALL);
    return this.findElement(LINK_CLEAR_ALL);
};


LinkedAdSlotsPage.prototype.setInputSearch = function(value) {
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.sendKeys(INPUT_SEARCH, key.ENTER);
    return this;
};

LinkedAdSlotsPage.prototype.clickAdd = function() {
    this.waitUntilVisible(BUTTON_ADD);
    return this.click(BUTTON_ADD);
};

LinkedAdSlotsPage.prototype.clickLinkClearAll = function() {
    this.waitUntilVisible(LINK_CLEAR_ALL);
    return this.click(LINK_CLEAR_ALL);
};

LinkedAdSlotsPage.prototype.clickButtonClose = function() {
    this.waitUntilVisible(BUTTON_CLOSE);
    return this.click(BUTTON_CLOSE);
};


LinkedAdSlotsPage.prototype.getAddedAdSlot = function(value) {
    this.waitUntilVisible(By.xpath(
        '//span[@class="overflow" and contains' +
                    '(text(),"' + value + '")]'));
    return this.findElement(By.xpath(
        '//span[@class="overflow" and contains' +
                    '(text(),"' + value + '")]'));
};

LinkedAdSlotsPage.prototype.getDeleteAddedAdSlot = function(value) {
    this.waitUntilVisible(By.xpath(
        '//li[contains(@title, "' + value + '")]/div/div/div[3]/span'));
    return this.click(By.xpath(
        '//li[contains(@title, "' + value + '")]/div/div/div[3]/span'));
};

LinkedAdSlotsPage.prototype.getWarningMessage = function(value) {
    this.waitUntilVisible(By.xpath('//div[contains(.,"' + value + '")]'));
    return this.findElement(By.xpath('//div[contains(.,"' + value + '")]'));
};

module.exports = LinkedAdSlotsPage;
