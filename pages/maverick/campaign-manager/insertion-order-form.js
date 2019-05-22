'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');
const driverTimeOut = 3000;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;

// elements
const INPUT_NAME = By.name('ioName');
const INPUT_NUMBER = By.name('referenceNumber');
const INPUT_BUDGET = By.css('input[name="budget"]');
const INPUT_START_DATE = By.xpath('//date-picker[@name="startDate"]/div/input');
const INPUT_END_DATE = By.xpath('//date-picker[@name="endDate"]/div/input');
const BUTTON_CANCEL = By.xpath('//a[text() = "Cancel"]');
const BUTTON_CREATE_CAMPAIGN = By.xpath('//button[text() = "Create Campaign"]');
const BUTTON_SAVE = By.xpath('//button[text() = "Save and Exit"]');
const ALERT_ERROR = By.css('._alert div span');

function IoPage(webdriver) {
    BasePage.call(this, webdriver);
}

IoPage.prototype = Object.create(BasePage.prototype);
IoPage.prototype.constructor = IoPage;

IoPage.prototype.getInputName = function() {
    this.waitUntilVisible(INPUT_NAME);
    return this.findElement(INPUT_NAME);
};

IoPage.prototype.getInputNumber = function() {
    return this.findElement(INPUT_NUMBER);
};

IoPage.prototype.getInputBudget = function() {
    return this.findElement(INPUT_BUDGET);
};

IoPage.prototype.getInputStartDate = function() {
    return this.findElement(INPUT_START_DATE);
};

IoPage.prototype.getInputEndDate = function() {
    return this.findElement(INPUT_END_DATE);
};

IoPage.prototype.getButtonCancel = function() {
    return this.findElement(BUTTON_CANCEL);
};

IoPage.prototype.getButtonCreateCampaign = function() {
    return this.findElement(BUTTON_CREATE_CAMPAIGN);
};

IoPage.prototype.getButtonSaveAndExit = function() {
    return this.findElement(BUTTON_SAVE);
};

IoPage.prototype.getAlertError = function() {
    this.waitSpinnerUntilStale();
    this.waitUntilVisible(ALERT_ERROR);
    return this.findElement(ALERT_ERROR);
};

IoPage.prototype.clickCancel = function() {
    this.waitUntilVisible(BUTTON_CANCEL);
    return this.click(BUTTON_CANCEL);
};

IoPage.prototype.clickCreateCampaign = function() {
    this.waitUntilVisible(BUTTON_CREATE_CAMPAIGN);
    this.click(BUTTON_CREATE_CAMPAIGN);
    return this.driver.sleep(driverTimeOut);
};

IoPage.prototype.waitUntilSaveButtonEnabled = function() {
    return this.waitUntilEnabled(BUTTON_SAVE);
};

IoPage.prototype.clickSave = function() {
    this.waitUntilVisible(BUTTON_SAVE);
    this.click(BUTTON_SAVE);
    return this;
};

IoPage.prototype.clickInputName = function() {
    return this.click(INPUT_NAME);
};

IoPage.prototype.setInputName = function(value) {
    this.waitUntilVisible(INPUT_NAME);
    this.clear(INPUT_NAME);
    this.sendKeys(INPUT_NAME, value);
    return this;
};

IoPage.prototype.setInputNumber = function(value) {
    this.clear(INPUT_NUMBER);
    this.sendKeys(INPUT_NUMBER, value);
    return this;
};

IoPage.prototype.setInputBudget = function(value) {
    this.waitUntilVisible(INPUT_BUDGET);
    this.clear(INPUT_BUDGET);
    this.sendKeys(INPUT_BUDGET, value);
    return this;
};

IoPage.prototype.setInputStartDate = function(value) {
    this.waitUntilVisible(INPUT_START_DATE);
    this.click(INPUT_START_DATE);
    this.clear(INPUT_START_DATE);
    this.sendKeys(INPUT_START_DATE, value);
    this.sendKeys(INPUT_START_DATE, key.TAB);
    return this;
};

IoPage.prototype.setManualStartDate = function() {
    this.waitUntilVisible(INPUT_START_DATE);
    this.click(INPUT_START_DATE);
    this.click(By.xpath('//div[text()="30"]'));
    return this.click(INPUT_START_DATE);
};

IoPage.prototype.setInputEndDate = function(value) {
    this.waitUntilVisible(INPUT_END_DATE);
    this.click(INPUT_END_DATE);
    this.clear(INPUT_END_DATE);
    this.sendKeys(INPUT_END_DATE, value);
    this.sendKeys(INPUT_START_DATE, key.TAB);
    return this;
};

IoPage.prototype.setManualEndDate = function() {
    this.waitUntilVisible(INPUT_END_DATE);
    this.click(INPUT_END_DATE);
    this.click(By.xpath('//div[text()="30"]'));
    return this.click(INPUT_END_DATE);
};


module.exports = IoPage;
