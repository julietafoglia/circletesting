'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;

// elements
const LANDING_JUMBOTRON = By.css('.page.page--padding.landing-page');
const CHOOSE_ADV_BUTTON = By.css('.landing-page---text button.button--primary');
const CHOOSE_ADV_INPUT = By.css('input[type="text"]');
const HOLD_TEXT = By.css('.data-table---zero---container .zero p');
const FIRST_SEARCH_NAME = By.css('.lightbox .body .virtual-row ' +
    '.flexrow .overflow');
const FIRST_SEARCH_ID = By.css('.lightbox .body .virtual-row .flexrow ' +
    '.copy--supporting');
const FIRST_ACC_MANAGER = By.css('.lightbox .body .virtual-row .flexrow ' +
        ' div.cell:nth-child(3) span');
const FIRST_ACC_EXEC = By.css('.lightbox .body .virtual-row .flexrow ' +
        ' div.cell:nth-child(4) span');
const FIRST_SEARCH_RESULT = By.css('.lightbox .body .virtual-row .flexrow');
const ADD_ADVERTISER_BUTTON = By.css('.lightbox div.column--12.align-right > ' +
    'button.button--primary');
const CANCEL_ADVERTISER_MODAL = By.css('.column--12.lightbox--footer a.button');
const DASHBOARD_TAB = By.css('.campaign-dashboard-tab');
const SELECTED_BADGE = By.css('div.account-setup--right span._badge');

const MORE_ADVERTISERS = By.css('button.button--primary.more-advertisers');

function AccountSetupPage(webdriver) {
    BasePage.call(this, webdriver);
}

AccountSetupPage.prototype = Object.create(BasePage.prototype);
AccountSetupPage.prototype.constructor = AccountSetupPage;

AccountSetupPage.prototype.getLandingJumbotron = function() {
    this.waitUntilVisible(LANDING_JUMBOTRON);
    return this.findElement(LANDING_JUMBOTRON);
};

AccountSetupPage.prototype.getChooseAdvertisers = function() {
    return this.findElement(CHOOSE_ADV_BUTTON);
};

AccountSetupPage.prototype.getChooseAdvertiserInput = function() {
    return this.findElement(CHOOSE_ADV_INPUT);
};

AccountSetupPage.prototype.getAddAdvertisers = function() {
    return this.findElement(ADD_ADVERTISER_BUTTON);
};

AccountSetupPage.prototype.getCancelAdvertiserModal = function() {
    return this.findElement(CANCEL_ADVERTISER_MODAL);
};

AccountSetupPage.prototype.clickAdvButton = function() {
    this.waitUntilVisible(CHOOSE_ADV_BUTTON);
    return this.click(CHOOSE_ADV_BUTTON);
};

AccountSetupPage.prototype.noLandingJumbotron = function() {
    return this.elementNotLocated(LANDING_JUMBOTRON);
};

AccountSetupPage.prototype.noChooseAdvertisers = function() {
    return this.elementNotLocated(CHOOSE_ADV_BUTTON);
};

AccountSetupPage.prototype.setAdvInput = function(advertiser) {
    this.waitUntilVisible(CHOOSE_ADV_INPUT);
    this.clear(CHOOSE_ADV_INPUT);
    this.sendKeys(CHOOSE_ADV_INPUT, key.BACK_SPACE);
    this.waitUntilVisible(HOLD_TEXT);
    this.sendKeys(CHOOSE_ADV_INPUT, advertiser);
    return this;
};

AccountSetupPage.prototype.setAdvInputNoClear = function(advertiser) {
    this.waitUntilVisible(CHOOSE_ADV_INPUT);
    this.sendKeys(CHOOSE_ADV_INPUT, advertiser);
    return this;
};

AccountSetupPage.prototype.continueToDashboard = function() {
    this.waitUntilVisible(ADD_ADVERTISER_BUTTON);
    this.click(ADD_ADVERTISER_BUTTON);
    return this.waitUntilVisible(DASHBOARD_TAB);
};

AccountSetupPage.prototype.returnToAccounts = function() {
    this.waitUntilVisible(ADD_ADVERTISER_BUTTON);
    this.findElement(ADD_ADVERTISER_BUTTON).click();
    return this.waitUntilVisible(MORE_ADVERTISERS);
};

AccountSetupPage.prototype.clickFirstResult = function() {
    this.waitUntilVisible(FIRST_SEARCH_RESULT);
    return this.click(FIRST_SEARCH_RESULT);
};

AccountSetupPage.prototype.getFirstName = function() {
    this.waitUntilVisible(FIRST_SEARCH_NAME);
    return this.findElement(FIRST_SEARCH_NAME);
};

AccountSetupPage.prototype.getFirstID = function() {
    this.waitUntilVisible(FIRST_SEARCH_ID);
    return this.findElement(FIRST_SEARCH_ID);
};

AccountSetupPage.prototype.getFirstAccMngr = function() {
    this.waitUntilVisible(FIRST_ACC_MANAGER);
    return this.findElement(FIRST_ACC_MANAGER);
};

AccountSetupPage.prototype.getFirstAccExec = function() {
    this.waitUntilVisible(FIRST_ACC_EXEC);
    return this.findElement(FIRST_ACC_EXEC);
};

AccountSetupPage.prototype.getSelectedId = function(id) {
    return this.findElement(
        By.xpath(
            '//span[@class="list--value overflow" and text()="' + id + '"]'));
};

AccountSetupPage.prototype.getSelectedName = function(name) {
    return this.findElement(
        By.xpath('//span[@class="overflow" and text()="' + name + '"]'));
};

AccountSetupPage.prototype.getSelectedTotal = function() {
    return this.findElement(SELECTED_BADGE);
};

module.exports = AccountSetupPage;
