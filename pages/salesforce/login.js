'use strict';

// vendor dependencies
const rootPath = process.env.ROOT_PATH;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

const BasePage = require(rootPath + '/pages/salesforce');

// elements
const USERNAME = By.css('#username');
const PASSWORD = By.css('#password');
const LOGIN_BTN = By.css('#Login');
const HOME_TAB = By.css('#home_Tab');

function LoginPage(webdriver) {
    BasePage.call(this, webdriver);
}

LoginPage.prototype = Object.create(BasePage.prototype);
LoginPage.prototype.constructor = LoginPage;

LoginPage.prototype.navigate = function(url) {
    this.driver.navigate().to(url);
    return this;
};

LoginPage.prototype.enterUsername = function(username) {
    this.waitUntilVisible(USERNAME);
    this.driver.findElement(USERNAME).sendKeys(username);
    return this;
};

LoginPage.prototype.enterPassword = function(pwd) {
    this.waitUntilVisible(PASSWORD);
    this.driver.findElement(PASSWORD).sendKeys(pwd);
    return this;
};

LoginPage.prototype.clickLoginBtn = function() {
    this.waitUntilLocated(LOGIN_BTN);
    this.driver.findElement(LOGIN_BTN).click();
    return this.waitUntilVisiblePromise(HOME_TAB);
};

module.exports = LoginPage;
