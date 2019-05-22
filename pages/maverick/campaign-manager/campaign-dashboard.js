'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;

// Header elements
const CAMPAIGN_TABLE = By.css('.campaign-dashboard-tab');
const CAMPAIGN_TAB = By.xpath('//span[@class="local-navigation---label"' +
    ' and text()="Campaigns"]');
const NEEDS_ATTENTION = By.xpath('//h4[contains(@class,"tab--header") and ' +
    'text()="Needs Attention"]');
const ENDING_SOON = By.xpath('//h4[contains(@class,"tab--header") and ' +
    'text()="Ending Soon"]');
const WATCHING = By.xpath('//h4[contains(@class,"tab--header") and ' +
    'text()="Watching"]');

// view all table
const VIEW_ALL_DDM = By.css(
    '.campaign-dashboard-header .dropdown');
const VIEW_ALL_SEARCH = By.xpath(
    '//button//span[text() = "All Advertisers"]');
const ALL_DDM_OPTIONS = By.xpath(
    '//div[@class="dropdown--container"]');
const INPUT_SEARCH = By.css('input[placeholder="Search"]');

// advertiser table
const ADVERTISER_NAME = By.xpath('//th[text()="Advertiser Name"]');
const AGENCY = By.xpath('//th[text()="Agency"]');
const ACC_MANAGER = By.xpath('//th[text()="Account Manager"]');
const ACC_EXECUTIVE = By.xpath('//th[text()="Account Executive"]');

// insertion order table
const IO_NAME = By.xpath('//th[text()="Insertion Order Name"]');

// campaign table
const CAMPAING_NAME = By.xpath('//th[text()="Campaign Name"]');
const GOAL_METRIC = By.xpath('//th[text()="Goal Metric"]');

// line item table
const LINE_ITEM_NAME = By.xpath('//th[text()="Line Item Name"]');
const STATUS = By.xpath('//th[text()="Status"]');
const PACING = By.xpath('//th[text()="Pacing"]');
const LIBUDGET = By.xpath('//th[text()="Budget"]');
const LISPENT = By.xpath('//th[text()="Spent"]');
const LISTART_DATE = By.xpath('//th[text()="Start Date"]');
const LIEND_DATE = By.xpath('//th[text()="End Date"]');
const LICREATED = By.xpath('//th[text()="Created"]');
const LIADVERTISER_NAME = By.xpath('//th[text()="Advertiser Name"]');
const DROPDOWN_ADVERTISERS = By.xpath('//campaign-dashboard/div/div/' +
    'div/div[1]/div/div/select-dropdown/div/button');

const BUDGET = By.xpath('//th[text()="Budget"]');
const SPENT = By.xpath('//th[text()="Spent"]');
const START_DATE = By.xpath('//th[text()="Start Date"]');
const END_DATE = By.xpath('//th[text()="End Date"]');
const CREATED = By.xpath('//th[text()="Created"]');

// first row advertiser name
const TABLE_FIRST_NAME = By.css('.cell.cell--xlarge.ellipsis .overflow');

function CampaignDashboardPage(webdriver) {
    BasePage.call(this, webdriver);
}

CampaignDashboardPage.prototype = Object.create(BasePage.prototype);
CampaignDashboardPage.prototype.constructor = CampaignDashboardPage;

// getters
CampaignDashboardPage.prototype.getCampaignsTable = function() {
    this.driver.sleep(2000);
    return this.findElement(CAMPAIGN_TABLE);
};

CampaignDashboardPage.prototype.getNeedsAttentionLink = function() {
    return this.findElement(NEEDS_ATTENTION);
};

CampaignDashboardPage.prototype.getEndingSoonLink = function() {
    return this.findElement(ENDING_SOON);
};

CampaignDashboardPage.prototype.getWatchingLink = function() {
    this.waitUntilVisible(WATCHING);
    return this.findElement(WATCHING);
};

CampaignDashboardPage.prototype.getViewAllDropdown = function() {
    return this.findElement(VIEW_ALL_DDM);
};

CampaignDashboardPage.prototype.getViewAllSearch = function() {
    return this.findElement(VIEW_ALL_SEARCH);
};

CampaignDashboardPage.prototype.getAdvertiserHeader = function() {
    return this.findElement(ADVERTISER_NAME);
};

CampaignDashboardPage.prototype.getLiAdvertiserHeader = function() {
    return this.findElement(LIADVERTISER_NAME);
};

CampaignDashboardPage.prototype.getAgencyHeader = function() {
    return this.findElement(AGENCY);
};

CampaignDashboardPage.prototype.getAccManagerHeader = function() {
    return this.findElement(ACC_MANAGER);
};

CampaignDashboardPage.prototype.getAccExecHeader = function() {
    return this.findElement(ACC_EXECUTIVE);
};

CampaignDashboardPage.prototype.getIOHeader = function() {
    return this.findElement(IO_NAME);
};

CampaignDashboardPage.prototype.getCampaignHeader = function() {
    this.waitUntilVisible(CAMPAING_NAME);
    return this.findElement(CAMPAING_NAME);
};

CampaignDashboardPage.prototype.getGoalMetricHeader = function() {
    return this.findElement(GOAL_METRIC);
};

CampaignDashboardPage.prototype.getLineItemHeader = function() {
    this.waitUntilVisible(LINE_ITEM_NAME);
    return this.findElement(LINE_ITEM_NAME);
};

CampaignDashboardPage.prototype.getStatusHeader = function() {
    return this.findElement(STATUS);
};

CampaignDashboardPage.prototype.getPacingHeader = function() {
    return this.findElement(PACING);
};

CampaignDashboardPage.prototype.getBudgetHeader = function() {
    return this.findElement(BUDGET);
};

CampaignDashboardPage.prototype.getSpentHeader = function() {
    return this.findElement(SPENT);
};

CampaignDashboardPage.prototype.getStartDateHeader = function() {
    return this.findElement(START_DATE);
};

CampaignDashboardPage.prototype.getEndDateHeader = function() {
    return this.findElement(END_DATE);
};

CampaignDashboardPage.prototype.getCreated = function() {
    return this.findElement(CREATED);
};

CampaignDashboardPage.prototype.getLiBudgetHeader = function() {
    return this.findElement(LIBUDGET);
};

CampaignDashboardPage.prototype.getLiSpentHeader = function() {
    return this.findElement(LISPENT);
};

CampaignDashboardPage.prototype.getLiStartDateHeader = function() {
    return this.findElement(LISTART_DATE);
};

CampaignDashboardPage.prototype.getLiEndDateHeader = function() {
    return this.findElement(LIEND_DATE);
};

CampaignDashboardPage.prototype.getLiCreated = function() {
    return this.findElement(LICREATED);
};

CampaignDashboardPage.prototype.getDropdownAdvertisers = function() {
    return this.findElement(DROPDOWN_ADVERTISERS);
};

CampaignDashboardPage.prototype.getInputSearch = function() {
    return this.findElement(INPUT_SEARCH);
};

// Clicks

CampaignDashboardPage.prototype.clickNeedsAttention = function() {
    return this.click(NEEDS_ATTENTION);
};

CampaignDashboardPage.prototype.clickEndingSoon = function() {
    return this.click(ENDING_SOON);
};

CampaignDashboardPage.prototype.clickWatching = function() {
    this.waitUntilVisible(WATCHING);
    return this.click(WATCHING);
};

CampaignDashboardPage.prototype.clickCampaignManagerTab = function() {
    return this.click(CAMPAIGN_TAB);
};

CampaignDashboardPage.prototype.clickViewAllDropdown = function() {
    this.waitUntilVisible(VIEW_ALL_DDM);
    this.click(VIEW_ALL_DDM);
    return this.waitUntilVisible(ALL_DDM_OPTIONS);
};

CampaignDashboardPage.prototype.clickAdvertiserDropdown = function() {
    this.waitUntilVisible(DROPDOWN_ADVERTISERS);
    return this.click(DROPDOWN_ADVERTISERS);
};

CampaignDashboardPage.prototype.clickSelectedAdvertisers = function() {
    this.clickAdvertiserDropdown();
    this.clickSpan('Selected Advertisers');
    return this.driver.sleep(2000);
};

CampaignDashboardPage.prototype.clickViewAllDropdownOption = function(value) {
    this.waitUntilVisible(VIEW_ALL_DDM);
    this.click(VIEW_ALL_DDM);
    this.waitUntilVisible(ALL_DDM_OPTIONS);
    this.click(By.xpath('//span[text()= "' + value + '"]'));
    return this.waitUntilVisible(VIEW_ALL_DDM);
};

CampaignDashboardPage.prototype.selectAllAdvertiser = function() {
    this.clickViewAllDropdownOption('Advertisers');
    return this.driver.sleep(2000);
};

CampaignDashboardPage.prototype.selectAllIo = function() {
    this.clickViewAllDropdownOption('Insertion Orders');
    return this.driver.sleep(2000);
};

CampaignDashboardPage.prototype.selectAllCampaign = function() {
    this.clickViewAllDropdownOption('Campaigns');
    return this.driver.sleep(2000);
};

CampaignDashboardPage.prototype.selectCampaignSelfService = function() {
    this.clickViewAllDropdown();
    this.waitUntilVisible(By.xpath('//div/ul/li[2]/a/span'));
    return this.click(By.xpath('//div/ul/li[2]/a/span'));
};

CampaignDashboardPage.prototype.selectCampaign = function() {
    this.clickViewAllDropdown();
    this.waitUntilVisible(By.xpath('//div/ul/li[3]/a/span'));
    return this.click(By.xpath('//div/ul/li[3]/a/span'));
};

CampaignDashboardPage.prototype.selectAllLI = function() {
    this.clickViewAllDropdownOption('Line Items');
    return this.driver.sleep(2000);
};

CampaignDashboardPage.prototype.returnToTop = function() {
    return this.sendKeys(VIEW_ALL_SEARCH, key.PAGE_UP);
};

CampaignDashboardPage.prototype.setSearchAllField = function() {
    this.clear(VIEW_ALL_SEARCH);
    return this.click(VIEW_ALL_SEARCH);
};

CampaignDashboardPage.prototype.getFirstTableName = function() {
    return this.findElement(TABLE_FIRST_NAME);
};

CampaignDashboardPage.prototype.setInputSearch = function(value) {
    this.waitUntilVisible(INPUT_SEARCH);
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.sendKeys(INPUT_SEARCH, key.ENTER);
    return this.driver.sleep(2000);
};

module.exports = CampaignDashboardPage;
