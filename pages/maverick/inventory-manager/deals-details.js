'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

// buttons
const BUTTON_CREATE_DEAL = By.xpath('//button[text() = "Create Deal"]');
const TITLE_ALL_DEALS = By.xpath('//h1[text() = "All Deals"]');
const TABLE_DEALS = By.css('.table');
const DEALS_PLUS_BUTTON = By.css('.icon.icon--add-create');
const FIRST_BUTTON = By.xpath('//button[text() = "First"]');
const PREVIOUS_BUTTON = By.xpath('//button[text() = "Previous"]');
const NEXT_BUTTON = By.xpath('//button[text() = "Next"]');
const LAST_BUTTON = By.xpath('//button[text() = "Last"]');

// table headers
const DEAL_HEADER = By.xpath('//th[text() = "Deal"]');
const BUYER_HEADER = By.xpath('//th[text() = "Buyer"]');
const FLOOR_HEADER = By.xpath('//th[text() = "Floor"]');
const PACKAGE_HEADER = By.xpath('//th[text() ="Package"]');
const IMPRESSIONS_HEADER = By.xpath('//th[text() = "Impressions"]');
const CREATED_HEADER = By.xpath('//th[text() = "Created"]');

// searchboxes
const DEALS_SEARCH_BOX = By.css('.placeholder-icon');

function DealsDetails(webdriver) {
    BasePage.call(this, webdriver);
}

DealsDetails.prototype = Object.create(BasePage.prototype);
DealsDetails.prototype.constructor = DealsDetails;

// deals landing page
DealsDetails.prototype.getButtonCreateDeal = function() {
    this.waitUntilVisible(BUTTON_CREATE_DEAL);
    return this.findElement(BUTTON_CREATE_DEAL);
};

DealsDetails.prototype.getTitleAllDeals = function() {
    this.waitUntilVisible(TITLE_ALL_DEALS);
    return this.findElement(TITLE_ALL_DEALS);
};

DealsDetails.prototype.getDealsTable = function() {
    this.waitUntilVisible(TABLE_DEALS);
    return this.findElement(TABLE_DEALS);
};

// elements from table
DealsDetails.prototype.getDealsSeachbox = function() {
    this.waitUntilVisible(DEALS_SEARCH_BOX);
    return this.findElement(DEALS_SEARCH_BOX);
};

DealsDetails.prototype.getDealsPlusButton = function() {
    this.waitUntilVisible(DEALS_PLUS_BUTTON);
    return this.findElement(DEALS_PLUS_BUTTON);
};

DealsDetails.prototype.getFirstNavigationTableButton = function() {
    this.waitUntilVisible(FIRST_BUTTON);
    return this.findElement(FIRST_BUTTON);
};

DealsDetails.prototype.getPreviousTableNavigationButton = function() {
    this.waitUntilVisible(PREVIOUS_BUTTON);
    return this.findElement(PREVIOUS_BUTTON);
};

DealsDetails.prototype.getNextTableNavigationButton = function() {
    this.waitUntilVisible(NEXT_BUTTON);
    return this.findElement(NEXT_BUTTON);
};

DealsDetails.prototype.getLastTableNavigationButton = function() {
    this.waitUntilVisible(LAST_BUTTON);
    return this.findElement(LAST_BUTTON);
};

DealsDetails.prototype.getDealTableHeader = function() {
    this.waitUntilVisible(DEAL_HEADER);
    return this.findElement(DEAL_HEADER);
};

DealsDetails.prototype.getBuyerTableHeader = function() {
    this.waitUntilVisible(BUYER_HEADER);
    return this.findElement(BUYER_HEADER);
};

DealsDetails.prototype.getFloorTableHeader = function() {
    this.waitUntilVisible(FLOOR_HEADER);
    return this.findElement(FLOOR_HEADER);
};

DealsDetails.prototype.getPackageTableHeader = function() {
    this.waitUntilVisible(PACKAGE_HEADER);
    return this.findElement(PACKAGE_HEADER);
};

DealsDetails.prototype.getImpressionsTableHeader = function() {
    this.waitUntilVisible(IMPRESSIONS_HEADER);
    return this.findElement(IMPRESSIONS_HEADER);
};

DealsDetails.prototype.getCreatedTableHeader = function() {
    this.waitUntilVisible(CREATED_HEADER);
    return this.findElement(CREATED_HEADER);
};

// create Deals form
DealsDetails.prototype.clickCreateDeal = function() {
    this.waitUntilVisible(BUTTON_CREATE_DEAL);
    return this.click(BUTTON_CREATE_DEAL);
};

module.exports = DealsDetails;
