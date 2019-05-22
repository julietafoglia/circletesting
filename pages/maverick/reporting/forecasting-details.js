'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');
const driverTimeOut = 5000;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

// buttons
const BUTTON_CHECK_INVENTORY = By.xpath('//button[text() = "Check Inventory"]');


function ForecastingDetails(webdriver) {
    BasePage.call(this, webdriver);
}

ForecastingDetails.prototype = Object.create(BasePage.prototype);
ForecastingDetails.prototype.constructor = ForecastingDetails;

ForecastingDetails.prototype.getButtonCheckInventory = function() {
    this.waitUntilVisible(BUTTON_CHECK_INVENTORY);
    return this.findElement(BUTTON_CHECK_INVENTORY);
};

ForecastingDetails.prototype.clickCheckInventory = function() {
    this.waitUntilVisible(BUTTON_CHECK_INVENTORY);
    return this.click(BUTTON_CHECK_INVENTORY);
};


module.exports = ForecastingDetails;
