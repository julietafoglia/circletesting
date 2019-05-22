'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');
const driverTimeOut = 5000;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

// buttons
const BUTTON_SAVE = By.xpath('//button[text() = "Save and Exit"]');
const SECTION_CARD = By.css('.padding-large');

function PackagesForm(webdriver) {
    BasePage.call(this, webdriver);
}

PackagesForm.prototype = Object.create(BasePage.prototype);
PackagesForm.prototype.constructor = PackagesForm;

PackagesForm.prototype.getButtonSavePackage = function() {
    this.waitUntilVisible(BUTTON_SAVE);
    return this.findElement(BUTTON_SAVE);
};

PackagesForm.prototype.getSectionCard = function() {
    this.waitUntilVisible(SECTION_CARD);
    return this.findElement(SECTION_CARD);
};

PackagesForm.prototype.clickSavePackage = function() {
    this.waitUntilVisible(BUTTON_SAVE);
    return this.click(BUTTON_SAVE);
};


module.exports = PackagesForm;
