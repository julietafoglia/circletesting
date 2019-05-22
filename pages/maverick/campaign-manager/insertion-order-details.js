'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');
const driverTimeOut = 5000;
const twoSecondsTO = 2000;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;

// inputs
const INPUT_SEARCH = By.xpath('//global-search-input/div/' +
            'input-field/div/div');
const INPUT_SEARCH_CAMPAIGN = By.css('input[placeholder="Search"]');
const TITLE_NO_RESULTS = By.xpath('//h3[text() = "There are currently no' +
            ' results to show."]');

// buttons
const BUTTON_NEW_IO = By.xpath('//button[text() = "Create Test' +
            ' Insertion Order"]');
const LINK_EDIT = By.xpath('//a[text() = "Edit"]');
const EDIT_IO = By.xpath('//a[text() = "Edit"]');

function InsertionOrderDetails(webdriver) {
    BasePage.call(this, webdriver);
}

InsertionOrderDetails.prototype = Object.create(BasePage.prototype);
InsertionOrderDetails.prototype.constructor = InsertionOrderDetails;

InsertionOrderDetails.prototype.getTitleNoResults = function() {
    this.waitUntilVisible(TITLE_NO_RESULTS);
    return this.findElement(TITLE_NO_RESULTS);
};

InsertionOrderDetails.prototype.getInputSearch = function() {
    return this.findElement(INPUT_SEARCH);
};

InsertionOrderDetails.prototype.setInputSearch = function(value) {
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.sendKeys(INPUT_SEARCH, key.ENTER);
    return this;
};

InsertionOrderDetails.prototype.setInputSearchCampaign = function(value) {
    this.waitUntilVisible(INPUT_SEARCH_CAMPAIGN);
    this.clear(INPUT_SEARCH_CAMPAIGN);
    this.sendKeys(INPUT_SEARCH_CAMPAIGN, value);
    this.sendKeys(INPUT_SEARCH_CAMPAIGN, key.ENTER);
    return this;
};

InsertionOrderDetails.prototype.getButtonNewIo = function() {
    return this.findElement(BUTTON_NEW_IO);
};

InsertionOrderDetails.prototype.getLinkEdit = function() {
    this.waitUntilVisible(LINK_EDIT);
    return this.findElement(LINK_EDIT);
};

InsertionOrderDetails.prototype.clickEdit = function() {
    this.driver.sleep(twoSecondsTO);
    return this.waitAndClick(EDIT_IO);
};

InsertionOrderDetails.prototype.clickNewIO = function() {
    this.waitUntilVisible(BUTTON_NEW_IO);
    return this.click(BUTTON_NEW_IO);
};

InsertionOrderDetails.prototype.clickEditIo = function(ioName) {
    this.click(By.xpath('//a[text() = "' + ioName + '"]'));
    this.driver.sleep(2000);
    this.waitUntilVisible(EDIT_IO);
    this.click(EDIT_IO);
    return this;
};

InsertionOrderDetails.prototype.clickEditFirstIo = function() {
    this.getLinkEdit();
    this.waitUntilVisible(EDIT_IO);
    this.click(EDIT_IO);
    return this;
};

InsertionOrderDetails.prototype.clickEditCampaign = function(campName) {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(By.xpath('//a[text() = "' + campName + '"]'));
    this.click(By.xpath('//a[text() = "' + campName + '"]'));
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(By.xpath('//a[text() = "Edit"]'));
    return this.click(LINK_EDIT);
};

InsertionOrderDetails.prototype.getH1Text = function(elementText) {
    return this.findElement(By.
        xpath("//span[text() = '" + elementText + "']"));
};

InsertionOrderDetails.prototype.getIoName = function(elementText) {
    return this.getH1Text(elementText);
};

InsertionOrderDetails.prototype.getCampaignName = function(elementText) {
    return this.getH1Text(elementText);
};

InsertionOrderDetails.prototype.getLineItemName = function(elementText) {
    return this.getH1Text(elementText);
};

InsertionOrderDetails.prototype.clickAdvertiser = function(elementText) {
    this.click(By.xpath("//a[text() = '" + elementText + "']"));
    return this.waitUntilVisible(By
        .xpath("//span[text() = '" + elementText + "']"));
};

InsertionOrderDetails.prototype.clickIO = function(elementText) {
    this.findElement(By.xpath("//a[text() = '" + elementText + "']"))
        .click();
    return this.driver.sleep(driverTimeOut);
};

InsertionOrderDetails.prototype.clickCampaign = function(elementText) {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(By.xpath("//a[text() = '" + elementText + "']"));
    this.click(By.xpath("//a[text() = '" + elementText + "']"));
    return this.driver.sleep(driverTimeOut);
};

InsertionOrderDetails.prototype.scrollUp = function() {
    return this.driver.actions().sendKeys(key.PAGE_UP).perform();
};

InsertionOrderDetails.prototype.scrollDown = function() {
    return this.driver.actions().sendKeys(key.PAGE_DOWN).perform();
};

InsertionOrderDetails.prototype.getAdv = function(elementText) {
    this.waitUntilVisible(By.xpath("//a[text() = '" + elementText + "']"));
    return this.driver
        .findElement(By.xpath("//a[text() = '" + elementText + "']"));
};

InsertionOrderDetails.prototype.getAdvTitle = function(elementText) {
    return this.findElement(By
        .xpath("//span[text() = '" + elementText + "']"));
};

InsertionOrderDetails.prototype.getResult = function(name) {
    return this.findElement(
        By.xpath('//span[@class="overflow" and text()="' + name + '"]'));
};

InsertionOrderDetails.prototype.getIOTableId = function(id) {
    return this.findElement(
        By.xpath('//span[text()="' + id + '"]'));
};

InsertionOrderDetails.prototype.getIOTableBudget = function(budget) {
    return this.findElement(
        By.xpath('//td[@class="currency" and text()="' + budget + '"]'));
};

InsertionOrderDetails.prototype.getIOTableSpent = function(spent) {
    return this.findElement(
        By.xpath('//td[@class="currency" and text()="' + spent + '"]'));
};

InsertionOrderDetails.prototype.getIOTableDate = function(date) {
    return this.findElement(
        By.xpath('//td[text()="' + date + '"]'));
};

InsertionOrderDetails.prototype.clickLink = function(elementText) {
    return this.click(By.
        xpath('//a[text() = "' + elementText + '"]'));
};

module.exports = InsertionOrderDetails;
