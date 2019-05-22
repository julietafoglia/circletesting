'use strict';

// vendor dependencies
const rootPath = process.env.ROOT_PATH;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

const BasePage = require(rootPath + '/pages/salesforce');

const NEW_OPP_BTN = By.css('input[title="New Opportunity"]');

function AccountsDetail(webdriver) {
    BasePage.call(this, webdriver);
}

AccountsDetail.prototype = Object.create(BasePage.prototype);
AccountsDetail.prototype.constructor = AccountsDetail;

AccountsDetail.prototype.clickNewOpportunityBtn = function() {
    this.waitUntilVisible(NEW_OPP_BTN);
    return this.driver.findElement(NEW_OPP_BTN).click();
};

module.exports = AccountsDetail;
