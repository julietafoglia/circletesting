'use strict';

const webdriver = require('selenium-webdriver');
const until = webdriver.until;

const TIMEOUT = 20000;

function BasePage(webdriver) {
    this.driver = webdriver;
}

BasePage.prototype.waitUntilLocated = function(locator) {
    this.driver.wait(until.elementLocated(locator), TIMEOUT);
};

BasePage.prototype.waitUntilVisible = function(locator) {
    this.waitUntilLocated(locator);
    this.driver.wait(
        until.elementIsVisible(this.driver.findElement(locator)), TIMEOUT
    );
};

BasePage.prototype.waitUntilVisiblePromise = function(locator) {
    this.waitUntilLocated(locator);
    return this.driver.wait(
        until.elementIsVisible(this.driver.findElement(locator), TIMEOUT)
    );
};

BasePage.prototype.waitUntilStale = function(locator) {
    this.waitUntilLocated(locator);
    return this.driver.wait(
        until.stalenessOf(this.driver.findElement(locator), TIMEOUT)
    );
};

module.exports = BasePage;
