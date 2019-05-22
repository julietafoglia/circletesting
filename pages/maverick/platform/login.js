'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const specialTimeOut = 40000;

// elements
const LOGIN_PATH = '/login';
const USERNAME = By.id('email');
const PASSWORD = By.id('password');
const LOGIN_BTN = By.xpath('//button[text() = "Log In"]');
const RESET_PASSWORD_BTN = By.xpath('//button[text() = "Reset Password"]');
const RETURN_LOGIN_BTN = By.xpath('//button[text() = "Return to Login"]');
const PROFILE_DDM = By.css('.profile-button');
const EMAIL_PASSWORD_ERROR = By.css('.error.login-error');
const RESET_EMAIL_ERROR = By.css('.error.email-error');
const FORGOT_PASSWORD_LINK = By.xpath('//a[text() = "Forgot Password?"]');

function LoginPage(webdriver) {
    BasePage.call(this, webdriver);
}

LoginPage.prototype = Object.create(BasePage.prototype);
LoginPage.prototype.constructor = LoginPage;

LoginPage.prototype.navigate = function(targetServer) {
    this.driver.navigate().to(targetServer + LOGIN_PATH);
    return this;
};

LoginPage.prototype.getUsernameField = function() {
    this.waitUntilVisible(USERNAME);
    return this.findElement(USERNAME);
};

LoginPage.prototype.getPasswordField = function() {
    this.waitUntilVisible(PASSWORD);
    return this.findElement(PASSWORD);
};

LoginPage.prototype.getLoginButton = function() {
    this.waitUntilVisible(LOGIN_BTN);
    return this.findElement(LOGIN_BTN);
};

LoginPage.prototype.getLoginError = function() {
    this.waitUntilVisible(EMAIL_PASSWORD_ERROR);
    return this.findElement(EMAIL_PASSWORD_ERROR);
};

LoginPage.prototype.getResetError = function() {
    this.waitUntilVisible(RESET_EMAIL_ERROR);
    return this.findElement(RESET_EMAIL_ERROR);
};

LoginPage.prototype.getForgotPasswordLink = function() {
    this.waitUntilVisible(FORGOT_PASSWORD_LINK);
    return this.findElement(FORGOT_PASSWORD_LINK);
};

LoginPage.prototype.getForgotPasswordText = function(text) {
    this.waitUntilVisible(By.xpath('//p[contains(.,"' + text + '")]'));
    return this.findElement(By.
        xpath('//p[contains(.,"' + text + '")]'));
};

LoginPage.prototype.getEmailSentText = function(text) {
    this.waitUntilVisible(By.xpath('//p[text() = "' + text + '"]'));
    return this.findElement(By.
        xpath('//p[text() = "' + text + '"]'));
};

LoginPage.prototype.getResetPasswordButton = function() {
    this.waitUntilVisible(RESET_PASSWORD_BTN);
    return this.findElement(RESET_PASSWORD_BTN);
};

LoginPage.prototype.getReturnToLoginButton = function() {
    this.waitUntilVisible(RETURN_LOGIN_BTN);
    return this.findElement(RETURN_LOGIN_BTN);
};

LoginPage.prototype.getResetedPasswordEmail = function(elementText) {
    this.waitUntilVisible(By.xpath("//strong[text() = '" + elementText + "']"));
    return this.findElement(By.
        xpath("//strong[text() = '" + elementText + "']"));
};

LoginPage.prototype.enterUsername = function(user) {
    this.waitUntilVisible(USERNAME);
    this.clear(USERNAME);
    this.sendKeys(USERNAME, user);
    return this;
};

LoginPage.prototype.enterPassword = function(password) {
    this.waitUntilVisible(PASSWORD);
    this.sendKeys(PASSWORD, password);
    return this;
};

LoginPage.prototype.clickLoginBtn = function() {
    this.waitUntilLocated(LOGIN_BTN);
    this.click(LOGIN_BTN);
    return this.waitUntilVisibleTimed(PROFILE_DDM, specialTimeOut);
};

LoginPage.prototype.clickLoginButton = function() {
    this.waitUntilLocated(LOGIN_BTN);
    this.click(LOGIN_BTN);
};

LoginPage.prototype.clickForgotPasswordLink = function() {
    this.waitUntilLocated(FORGOT_PASSWORD_LINK);
    this.click(FORGOT_PASSWORD_LINK);
};

LoginPage.prototype.clickResetPassword = function() {
    this.waitUntilLocated(RESET_PASSWORD_BTN);
    this.click(RESET_PASSWORD_BTN);
};

LoginPage.prototype.clickReturnToLogin = function() {
    this.waitUntilLocated(RETURN_LOGIN_BTN);
    this.click(RETURN_LOGIN_BTN);
};

LoginPage.prototype.login = function(targetServer, user) {
    this.navigate(targetServer);
    this.enterUsername(user.username);
    this.enterPassword(user.password);
    this.clickLoginBtn();
    return this.waitUntilVisible(PROFILE_DDM);
};

module.exports = LoginPage;
