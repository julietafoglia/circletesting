'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');
const driverTimeOut = 5000;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

// buttons
const BUTTON_CREATE_PACKAGE = By.xpath('//button[text() = "Create Package"]');
const TITLE_ALL_PACKAGES = By.xpath('//h1[text() = "All Packages"]');
const TABLE_PACKAGES = By.css('.table');

function PackagesDetails(webdriver) {
    BasePage.call(this, webdriver);
}

PackagesDetails.prototype = Object.create(BasePage.prototype);
PackagesDetails.prototype.constructor = PackagesDetails;

PackagesDetails.prototype.getButtonCreatePackage = function() {
    this.waitUntilVisible(BUTTON_CREATE_PACKAGE);
    return this.findElement(BUTTON_CREATE_PACKAGE);
};

PackagesDetails.prototype.getTitleAllPackages = function() {
    this.waitUntilVisible(TITLE_ALL_PACKAGES);
    return this.findElement(TITLE_ALL_PACKAGES);
};

PackagesDetails.prototype.getPackagesTable = function() {
    this.waitUntilVisible(TABLE_PACKAGES);
    return this.findElement(TABLE_PACKAGES);
};

PackagesDetails.prototype.clickCreatePackage = function() {
    this.waitUntilVisible(BUTTON_CREATE_PACKAGE);
    return this.click(BUTTON_CREATE_PACKAGE);
};


module.exports = PackagesDetails;
