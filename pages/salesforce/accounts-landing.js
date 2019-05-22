'use strict';

// vendor dependencies
const rootPath = process.env.ROOT_PATH;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

const BasePage = require(rootPath + '/pages/salesforce');

const ACCOUNTS_TAB = By.css('#Account_Tab');
const NEW_ACC_BTN = By.css('input[name="new"]');
const RECORD_TYPE = By.css('.requiredInput > select[name="p3"]');
const RECORD_TYPE_AGENCY = By.css('option[value="012G0000000qHTF"]');
const RECORD_TYPE_CLIENT_DIRECT = By.css('option[value="01216000001QPu9"]');
const CONTINUE_BTN = By.css('input[title="Continue"]');

function AccountsLanding(webdriver) {
    BasePage.call(this, webdriver);
}

AccountsLanding.prototype = Object.create(BasePage.prototype);
AccountsLanding.prototype.constructor = AccountsLanding;

AccountsLanding.prototype.navigate = function() {
    this.waitUntilVisible(ACCOUNTS_TAB);
    this.driver.findElement(ACCOUNTS_TAB).click();
    return this;
};

AccountsLanding.prototype.clickNewAccountBtn = function() {
    this.waitUntilVisible(NEW_ACC_BTN);
    this.driver.findElement(NEW_ACC_BTN).click();
    return this;
};

AccountsLanding.prototype.selectRecordType = function(type) {
    this.waitUntilVisible(RECORD_TYPE);
    if (type === 'Agency') {
        this.driver.findElement(RECORD_TYPE_AGENCY).click();
    } else {
        this.driver.findElement(RECORD_TYPE_CLIENT_DIRECT).click();
    }
    return this;
};

AccountsLanding.prototype.clickContinue = function() {
    this.waitUntilVisible(CONTINUE_BTN);
    return this.driver.findElement(CONTINUE_BTN).click();
};

module.exports = AccountsLanding;
