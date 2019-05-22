'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

const TITLE_DELETE = By.xpath('//h2[text() = "Delete audience?"]');
const TEXT_MODAL = By.css('confirm-dialog:nth-child(2) dialog-message > p');
const TEXT_FIRST_CHECK = By.xpath('//span[text() = "The audience' +
    ' will be inaccessible to associated media groups or agencies."]');
const TEXT_SECOND_CHECK = By.xpath('//span[text() = "I understand this' +
    ' cannot be undone."]');

const BUTTON_CANCEL = By.xpath('//button[text() = "No, Go Back"]');
const BUTTON_DELETE = By.xpath('//button[text() = "Yes, Delete Audience"]');

const CHECK_FIRST = By.css('dialog-confirmation:nth-child(2) > p > label');
const CHECK_SECOND = By.css('dialog-confirmation:nth-child(3) > p > label');

function AudienceDeletePage(webdriver) {
    BasePage.call(this, webdriver);
}

AudienceDeletePage.prototype = Object.create(BasePage.prototype);
AudienceDeletePage.prototype.constructor = AudienceDeletePage;

AudienceDeletePage.prototype.getTitleDelete = function() {
    return this.findElement(TITLE_DELETE);
};

AudienceDeletePage.prototype.getTextModal = function() {
    return this.findElement(TEXT_MODAL);
};

AudienceDeletePage.prototype.getTextAudience = function(audience) {
    return this.findElement(By.xpath('//strong[text() = "' + audience + '" ]'));
};

AudienceDeletePage.prototype.getTextFirstCheck = function() {
    return this.findElement(TEXT_FIRST_CHECK);
};

AudienceDeletePage.prototype.getTextSecondCheck = function() {
    return this.findElement(TEXT_SECOND_CHECK);
};

// AudienceDeletePage.prototype.getTextThirdCheck = function() {
//     return this.findElement(TEXT_THIRD_CHECK);
// };

AudienceDeletePage.prototype.getButtonCancel = function() {
    return this.findElement(BUTTON_CANCEL);
};

AudienceDeletePage.prototype.getButtonDelete = function() {
    return this.findElement(BUTTON_DELETE);
};

AudienceDeletePage.prototype.getCheckFirst = function() {
    return this.findElement(CHECK_FIRST);
};

AudienceDeletePage.prototype.getCheckSecond = function() {
    return this.findElement(CHECK_SECOND);
};

// AudienceDeletePage.prototype.getCheckThird = function() {
//     return this.findElement(CHECK_THIRD);
// };

AudienceDeletePage.prototype.getAlertText = function(text) {
    return this.findElement(By.xpath('//div[contains(.,"' + text + '")]'));
};

// Clicks

AudienceDeletePage.prototype.clickCancel = function() {
    this.click(BUTTON_CANCEL);
    return this.driver.sleep(1000);
};

AudienceDeletePage.prototype.clickDelete = function() {
    this.click(BUTTON_DELETE);
    return this;
};

AudienceDeletePage.prototype.clickCheckFirst = function() {
    this.click(CHECK_FIRST);
    return this;
};

AudienceDeletePage.prototype.clickCheckSecond = function() {
    this.click(CHECK_SECOND);
    return this;
};

// AudienceDeletePage.prototype.clickCheckThird = function() {
//     this.click(CHECK_THIRD);
//     return this;
// };

module.exports = AudienceDeletePage;
