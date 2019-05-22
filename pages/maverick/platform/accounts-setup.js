'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;

// elements
const LANDING_JUMBOTRON = By.css('.section--zero-state.align-center');
const CHOOSE_ADV_BUTTON = By.xpath('//button[text() = "Choose Accounts"]');
const CHOOSE_ADV_INPUT = By.xpath('//lightboxnext//input');
const FIRST_SEARCH_NAME = By.xpath('//table/tbody/tr[1]/td[1]/div');
const FIRST_SEARCH_ID = By.xpath('//table/tbody/tr[1]/td[1]/span');
const FIRST_ACC_MANAGER = By.xpath('//table/tbody/tr[1]/td[4]/div');
const FIRST_ACC_EXEC = By.xpath('//table/tbody/tr[1]/td[5]/div');
const FIRST_SEARCH_RESULT = By.xpath('//table/tbody/tr[1]');
const ADD_ADVERTISER_BUTTON = By.xpath('//button[text()="Add Accounts"]');
const CANCEL_ADVERTISER_MODAL = By.xpath('//a[text()="Cancel"]');
const DASHBOARD_TAB = By.css('.campaign-dashboard-tab');
const SELECTED_BADGE = By.xpath('//lightboxnext//h5/span[2]');
const PROFILE = By.css('.profile-button');
const VIEW_SELECTED_ACCOUNTS = By.xpath('//button[text()' +
    '="View Selected Accounts"]');
const SELECT_ACCOUNTS = By.xpath('//button[text()' +
    '="Select More Accounts"]');

const MORE_ADVERTISERS = By.xpath('//button[text() = "Select More Accounts"]');

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
    this.waitUntilVisible(CHOOSE_ADV_BUTTON);
    return this.findElement(CHOOSE_ADV_BUTTON);
};

AccountSetupPage.prototype.getChooseAdvertiserInput = function() {
    this.waitUntilVisible(CHOOSE_ADV_INPUT);
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
    return this.elementNotLocated(this.getLandingJumbotron());
};

AccountSetupPage.prototype.noChooseAdvertisers = function() {
    return this.elementNotLocated(CHOOSE_ADV_BUTTON);
};

AccountSetupPage.prototype.setAdvInput = function(advertiser) {
    this.waitUntilVisible(CHOOSE_ADV_INPUT);
    this.clear(CHOOSE_ADV_INPUT);
    this.sendKeys(CHOOSE_ADV_INPUT, key.BACK_SPACE);
    return this.sendKeys(CHOOSE_ADV_INPUT, advertiser);
};

AccountSetupPage.prototype.setAdvInputNoClear = function(advertiser) {
    this.waitUntilVisible(CHOOSE_ADV_INPUT);
    this.sendKeys(CHOOSE_ADV_INPUT, advertiser);
    return this.driver.sleep(2000);
};

AccountSetupPage.prototype.continueToDashboard = function() {
    this.waitUntilVisible(ADD_ADVERTISER_BUTTON);
    this.click(ADD_ADVERTISER_BUTTON);
    return this.waitUntilVisible(DASHBOARD_TAB);
};

AccountSetupPage.prototype.returnToAccounts = function() {
    this.waitUntilVisible(ADD_ADVERTISER_BUTTON);
    this.findElement(ADD_ADVERTISER_BUTTON).click();
    this.closeAlert();
    this.waitUntilVisible(MORE_ADVERTISERS);
    return this.driver.sleep(1000);
};

AccountSetupPage.prototype.clickFirstResult = function() {
    this.waitUntilVisible(FIRST_SEARCH_RESULT);
    return this.click(FIRST_SEARCH_RESULT);
};

AccountSetupPage.prototype.clickAddAccounts = function() {
    this.driver.sleep(2000);
    this.waitUntilVisible(ADD_ADVERTISER_BUTTON);
    this.click(ADD_ADVERTISER_BUTTON);
    return this.driver.sleep(3000);
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
            '//span[@class="supporting" and text()="' + id + '"]'));
};

AccountSetupPage.prototype.getSelectedName = function(name) {
    return this.findElement(
        By.xpath('//div[@class="ellipsis" and text()="' + name + '"]'));
};

AccountSetupPage.prototype.getSelectedTotal = function() {
    return this.findElement(SELECTED_BADGE);
};

AccountSetupPage.prototype.getNoAccountsText = function() {
    this.waitUntilVisible(By.xpath('//h3[text()="No Accounts Selected"]'));
    return this.findElement(By.xpath('//h3[text()="No Accounts Selected"]'));
};

AccountSetupPage.prototype.clickProfile = function() {
    this.waitUntilVisible(PROFILE);
    return this.click(PROFILE);
};

AccountSetupPage.prototype.clickViewSelectedAccounts = function() {
    this.waitUntilVisible(VIEW_SELECTED_ACCOUNTS);
    return this.click(VIEW_SELECTED_ACCOUNTS);
};

AccountSetupPage.prototype.navigateToSetup = function() {
    this.clickProfile();
    this.clickViewSelectedAccounts();
    return this.waitUntilVisible(SELECT_ACCOUNTS);
};

AccountSetupPage.prototype.clickSelectAccounts = function() {
    this.waitUntilVisible(SELECT_ACCOUNTS);
    return this.click(SELECT_ACCOUNTS);
};

module.exports = AccountSetupPage;
