'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

// header elements
const PROFILE_DDM = By.xpath('//profile/div/h4/span');
const LOGOUT_BTN = By.css('.logout');
const ACCOUNTS_TOTAL = By.xpath('//profile//h5/span');
const SEARCH_BOX = By.css('global-search-input div div input');
const CAMPAIGN_BUTTON = By.xpath('//span[text() = "Campaign Manager"]');
const INVENTORY_BUTTON = By.linkText('Inventory Manager');
const HOME_BUTTON = By.xpath('//span[text() = "Campaign Manager"]');
const INTERNAL_TOOLS_BUTTON = By.xpath('//span[text() = "Internal Tools"]');
const REPORTING_BUTTON = By.xpath('//span[text() = "Reporting"]');

// profile drop down elements
const USER_NAME = By.css('.user-info h3.ellipsis');
const USER_EMAIL = By.css('.user-info div.supporting');
const VIEW_ACCOUNTS = By.xpath('//button[text()="View Selected Accounts"]');


// accounts page element
const MORE_ADVERTISERS = By.xpath('//button[text() = "Select More Accounts"]');

function NavBar(webdriver) {
    BasePage.call(this, webdriver);
}

NavBar.prototype = Object.create(BasePage.prototype);
NavBar.prototype.constructor = NavBar;

// Getters
NavBar.prototype.getCampaignManagerButton = function() {
    this.waitUntilVisible(CAMPAIGN_BUTTON);
    return this.findElement(CAMPAIGN_BUTTON);
};

NavBar.prototype.getInventoryManagerButton = function() {
    this.waitUntilVisible(INVENTORY_BUTTON);
    return this.findElement(INVENTORY_BUTTON);
};

NavBar.prototype.getProfileDropdown = function() {
    this.waitUntilVisible(PROFILE_DDM);
    return this.findElement(PROFILE_DDM);
};

NavBar.prototype.getLogoutButton = function() {
    this.waitUntilVisible(LOGOUT_BTN);
    return this.findElement(LOGOUT_BTN);
};

NavBar.prototype.getSearchBox = function() {
    this.waitUntilVisible(SEARCH_BOX);
    return this.findElement(SEARCH_BOX);
};

NavBar.prototype.getUserName = function() {
    this.waitUntilVisible(USER_NAME);
    return this.findElement(USER_NAME);
};

NavBar.prototype.getUserEmail = function() {
    this.waitUntilVisible(USER_EMAIL);
    return this.findElement(USER_EMAIL);
};

NavBar.prototype.getAccountsButton = function() {
    this.waitUntilVisible(VIEW_ACCOUNTS);
    return this.findElement(VIEW_ACCOUNTS);
};

NavBar.prototype.getHomeButton = function() {
    this.waitUntilVisible(HOME_BUTTON);
    return this.findElement(HOME_BUTTON);
};

NavBar.prototype.getInternalToolsButton = function() {
    this.waitUntilVisible(INTERNAL_TOOLS_BUTTON);
    return this.findElement(INTERNAL_TOOLS_BUTTON);
};

NavBar.prototype.getReportingButton = function() {
    return this.getElement(REPORTING_BUTTON);
};

// Functions
NavBar.prototype.clickCampaignManager = function() {
    this.driver.sleep(2000);
    this.waitUntilVisible(CAMPAIGN_BUTTON);
    this.click(CAMPAIGN_BUTTON);
    return this.driver.sleep(2000);
};

NavBar.prototype.clickInventoryManager = function() {
    this.waitUntilVisible(INVENTORY_BUTTON);
    this.click(INVENTORY_BUTTON);
    return this;
};

NavBar.prototype.clickProfile = function() {
    this.waitUntilVisible(PROFILE_DDM);
    this.click(PROFILE_DDM);
    return this;
};

NavBar.prototype.logout = function() {
    this.clickProfile();
    this.waitUntilVisible(LOGOUT_BTN);
    return this.click(LOGOUT_BTN);
};

NavBar.prototype.getAdvertiserInTable = function(text) {
    return this.waitUntilVisible(
        By.xpath('//a[text()=\'' + text + '\']'));
};

NavBar.prototype.getAdvertiserCount = function() {
    return this.waitUntilVisible(ACCOUNTS_TOTAL);
},

NavBar.prototype.accessAccountsPage = function() {
    this.clickProfile();
    this.waitUntilVisible(VIEW_ACCOUNTS);
    this.click(VIEW_ACCOUNTS);
    return this.waitUntilVisible(MORE_ADVERTISERS);
};

NavBar.prototype.goToCampaignTab = function() {
    return this.waitUntilVisible(MORE_ADVERTISERS);
};

NavBar.prototype.clickInternalTools = function() {
    this.waitUntilVisible(INTERNAL_TOOLS_BUTTON);
    this.click(INTERNAL_TOOLS_BUTTON);
    return this;
};

NavBar.prototype.clickReportingTab = function() {
    this.waitAndClick(REPORTING_BUTTON);
    return this;
};

module.exports = NavBar;
