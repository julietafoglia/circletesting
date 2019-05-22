'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

// Campaign Manager Sidebar elements
const CAMPAIGN_MANAGER = By.xpath('//span[text() = "Campaigns"]');
const INVENTORY_MANAGER = By.xpath('//span[text() = "Inventory"]');
const PROPOSALS_LINK = By.xpath('//a[@href="/reporting/proposals"]');
const AUDIENCES_LINK = By.xpath('//a[@href="/campaign-manager/audiences"]');
const CONVERSION_TRACKER_LINK =
    By.xpath('//a[@href="/campaign-manager/conversion-trackers"]');
const AD_LIBRARY_LINK = By.xpath('//a[@href="/campaign-manager/ad-library"]');
const FORECASTING_LINK = By.xpath('//a[@href="/reporting/forecasts"]');
const DEALS_LINK = By.xpath('//a[@href="/inventory-manager/deals"]');
const PACKAGES_LINK = By.xpath('//a[@href="/inventory-manager/packages"]');
const THIRD_PARTY_DATA_LINK = By
    .xpath('//a[@href="/internal-tools/third-party-data"]');
const BUYER_SEAT_LINK = By.xpath('//a[@href="/internal-tools/buyer-seat"]');
const RTB_PARTNER_LINK = By.xpath('//a[@href="/internal-tools/rtb-partners"]');

// Common Sidebar elements
const REPORTS_LINK = By.xpath('//local-navigation//span[text() = "Reports"]');
const SIDEBAR_RESIZE = By.css('.local-navigation--controls');

// Accounts page element
const MORE_ADVERTISERS = By.css('button.button--primary.more-advertisers');
// Conversion Trackers
const NEW_TRACKER = By
    .css('a[href="/campaign-manager/conversion-trackers/new"]');
// Reports page
const NEW_REPORT = By.css('button.button--create');
const REPORTS_DIV = By.css('div.reports');

function SideBar(webdriver) {
    BasePage.call(this, webdriver);
}

SideBar.prototype = Object.create(BasePage.prototype);
SideBar.prototype.constructor = SideBar;

// Getters
SideBar.prototype.getCampaignsLink = function() {
    this.waitUntilVisible(CAMPAIGN_MANAGER);
    return this.findElement(CAMPAIGN_MANAGER);
};

SideBar.prototype.getProposalsLink = function() {
    this.waitUntilVisible(PROPOSALS_LINK);
    return this.findElement(PROPOSALS_LINK);
};

SideBar.prototype.getAudiencesLink = function() {
    this.waitUntilVisible(AUDIENCES_LINK);
    return this.findElement(AUDIENCES_LINK);
};

SideBar.prototype.getConversionsLink = function() {
    this.waitUntilVisible(CONVERSION_TRACKER_LINK);
    return this.findElement(CONVERSION_TRACKER_LINK);
};

SideBar.prototype.getAdLibraryLink = function() {
    this.waitUntilVisible(AD_LIBRARY_LINK);
    return this.findElement(AD_LIBRARY_LINK);
};

SideBar.prototype.getReportsLink = function() {
    this.waitUntilVisible(REPORTS_LINK);
    return this.findElement(REPORTS_LINK);
};

SideBar.prototype.getSidebarCollapse = function() {
    this.waitUntilVisible(SIDEBAR_RESIZE);
    return this.findElement(SIDEBAR_RESIZE);
};

SideBar.prototype.getThirdPartyDataLink = function() {
    this.waitUntilVisible(THIRD_PARTY_DATA_LINK);
    return this.findElement(THIRD_PARTY_DATA_LINK);
};

SideBar.prototype.getBuyerSeatLink = function() {
    this.waitUntilVisible(BUYER_SEAT_LINK);
    return this.findElement(BUYER_SEAT_LINK);
};

SideBar.prototype.clickConversionsLinks = function() {
    this.waitUntilVisible(CONVERSION_TRACKER_LINK);
    this.click(CONVERSION_TRACKER_LINK);
    return this.waitUntilVisible(NEW_TRACKER);
};

SideBar.prototype.clickCampaignReportsLinks = function() {
    this.waitUntilVisible(CAMPAIGN_MANAGER);
    this.click(REPORTS_LINK);
    return this.waitUntilVisible(NEW_REPORT);
};

SideBar.prototype.clickInventoryReportsLink = function() {
    this.waitUntilVisible(INVENTORY_MANAGER);
    this.click(REPORTS_LINK);
    return this.waitUntilVisible(REPORTS_DIV);
};

SideBar.prototype.clickAudiencesLink = function() {
    this.waitUntilVisible(AUDIENCES_LINK);
    this.click(AUDIENCES_LINK);
    return this.waitUntilFilterNotVisible();
};

SideBar.prototype.clickProposalsLink = function() {
    this.waitUntilVisible(PROPOSALS_LINK);
    this.click(PROPOSALS_LINK);
    return this.driver.sleep(2000);
};

SideBar.prototype.clickForecastingLink = function() {
    this.waitUntilVisible(FORECASTING_LINK);
    this.click(FORECASTING_LINK);
    this.driver.sleep(2000);
};

SideBar.prototype.clickDealsLink = function() {
    this.waitUntilVisible(DEALS_LINK);
    this.click(DEALS_LINK);
    return this.driver.sleep(2000);
};

SideBar.prototype.clickPackagesLink = function() {
    this.waitUntilVisible(PACKAGES_LINK);
    this.click(PACKAGES_LINK);
    return this.driver.sleep(2000);
};

SideBar.prototype.clickCampaignManagerButton = function() {
    this.waitUntilVisible(CAMPAIGN_MANAGER);
    this.click(CAMPAIGN_MANAGER);
    return this.waitUntilVisible(CONVERSION_TRACKER_LINK);
};

SideBar.prototype.clickThirdPartyDataLink = function() {
    this.waitUntilVisible(THIRD_PARTY_DATA_LINK);
    this.click(THIRD_PARTY_DATA_LINK);
    return this.driver.sleep(2000);
};

SideBar.prototype.clickBuyerSeatLink = function() {
    this.waitUntilVisible(BUYER_SEAT_LINK);
    return this.click(BUYER_SEAT_LINK);
};

SideBar.prototype.clickRTBPartnerLink = function() {
    this.waitUntilVisible(RTB_PARTNER_LINK);
    return this.click(RTB_PARTNER_LINK);
};

SideBar.prototype.getAdvertiserInTable = function(text) {
    return this.waitUntilVisible(
        By.xpath('//a[text()=\'' + text + '\']'));
};

SideBar.prototype.goToCampaignTab = function() {
    return this.waitUntilVisible(MORE_ADVERTISERS);
};

module.exports = SideBar;
