'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');
const driverTimeOut = 5000;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

// buttons
const BUTTON_CHECK_AVAILABILITY = By.
    xpath('//button[text() = "Check Availability"]');
const TITLE_INVENTORY = By.
    xpath('//h1[text()="Forecast Available Inventory"]');


function ForecastingForm(webdriver) {
    BasePage.call(this, webdriver);
}

ForecastingForm.prototype = Object.create(BasePage.prototype);
ForecastingForm.prototype.constructor = ForecastingForm;

ForecastingForm.prototype.getButtonCheckAvailability = function() {
    this.waitUntilVisible(BUTTON_CHECK_AVAILABILITY);
    return this.findElement(BUTTON_CHECK_AVAILABILITY);
};

ForecastingForm.prototype.getTitleForecastInventory = function() {
    this.waitUntilVisible(TITLE_INVENTORY);
    return this.findElement(TITLE_INVENTORY);
};

ForecastingForm.prototype.clickCheckAvailability = function() {
    this.waitUntilVisible(BUTTON_CHECK_AVAILABILITY);
    return this.click(BUTTON_CHECK_AVAILABILITY);
};


module.exports = ForecastingForm;
