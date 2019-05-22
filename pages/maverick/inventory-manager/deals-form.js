'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

// buttons
const BUTTON_CREATE_DEAL = By.xpath('//button[text() = "Create Deal"]');
const SECTION_CARD = By.css('.padding-large');
const DEMAND_TYPE_DROPDOWN =
    By.css('.inline-block.ng-untouched.ng-pristine.ng-valid');
const LIVE_AUDIENCE_DROPDOWN = By.name('liveAudienceTargeting');

// headers
const CREATE_DEAL_HEADER = By.xpath('//h4[text() = "Create Deal"]');
const BASIC_DETAILS_HEADER = By.xpath('//h3[text() = "Basic Details"]');
const DEAL_NAME_TEXT = By.xpath('//label[text() = "Deal Name"]');
const DSP_TEXT = By.xpath('//label[text() = "DSP"]');
const PACKAGE_TEXT = By.xpath('//label[text() = "Package"]');
const DEAL_FLOOR_TEXT = By.xpath('//label[text() = "Deal Floor"]');
const DEMAND_TYPE_TEXT = By.xpath('//label[text() = "Demand Type"]');
const ADVERTISER_DOMAIN_TEXT =
    By.xpath('//label[text() = "Advertiser Domain"]');
const TARGETING_HEADER = By.xpath('//h3[text() = "Targeting"]');
const LIVE_AUDIENCE_TEXT = By.xpath('//label[text() = "LiveAudience"]');

// inputs
const DEAL_NAME_TEXTBOX = By.name('name');
const DSP_TEXTBOX =
    By.xpath('//input[@placeholder = "Choose a Data Service Provider"]');
const PACKAGE_TEXTBOX = By.xpath('//input[@placeholder = "Choose a Package"]');
const DEAL_FLOOR_TEXTBOX = By.name('floor');
const ADVERTISER_DOMAIN_TEXTBOX = By.name('advertiserDomain');
const LIVE_AUDIENCE_TEXTBOX =
    By.xpath('//input[@placeholder = "Search Your LiveAudiences"]');
const DIRECT_SPAN = By.xpath('//span[text() = "Direct"]');
const EXCHANGE_SPAN = By.xpath('//span[text() = "Exchange"]');

function DealsForm(webdriver) {
    BasePage.call(this, webdriver);
}

DealsForm.prototype = Object.create(BasePage.prototype);
DealsForm.prototype.constructor = DealsForm;

DealsForm.prototype.getButtonCreateDeal = function() {
    this.waitUntilVisible(BUTTON_CREATE_DEAL);
    return this.findElement(BUTTON_CREATE_DEAL);
};

DealsForm.prototype.getSectionCard = function() {
    this.waitUntilVisible(SECTION_CARD);
    return this.findElement(SECTION_CARD);
};

DealsForm.prototype.clickCreateDeal = function() {
    this.waitUntilVisible(BUTTON_CREATE_DEAL);
    return this.click(BUTTON_CREATE_DEAL);
};

DealsForm.prototype.getCreateDealHeader = function() {
    this.waitUntilVisible(CREATE_DEAL_HEADER);
    return this.findElement(CREATE_DEAL_HEADER);
};

// basic details section
DealsForm.prototype.getBasicDetailsHeader = function() {
    this.waitUntilVisible(BASIC_DETAILS_HEADER);
    return this.findElement(BASIC_DETAILS_HEADER);
};

DealsForm.prototype.getDealNameText = function() {
    this.waitUntilVisible(DEAL_NAME_TEXT);
    return this.findElement(DEAL_NAME_TEXT);
};

DealsForm.prototype.getDealNameTextbox = function() {
    this.waitUntilVisible(DEAL_NAME_TEXTBOX);
    return this.findElement(DEAL_NAME_TEXTBOX);
};

DealsForm.prototype.getDSPText = function() {
    this.waitUntilVisible(DSP_TEXT);
    return this.findElement(DSP_TEXT);
};

DealsForm.prototype.getDSPTextbox = function() {
    this.waitUntilVisible(DSP_TEXTBOX);
    return this.findElement(DSP_TEXTBOX);
};

DealsForm.prototype.getPackageText = function() {
    this.waitUntilVisible(PACKAGE_TEXT);
    return this.findElement(PACKAGE_TEXT);
};

DealsForm.prototype.getPackageTextbox = function() {
    this.waitUntilVisible(PACKAGE_TEXTBOX);
    return this.findElement(PACKAGE_TEXTBOX);
};

DealsForm.prototype.getDealFlorText = function() {
    this.waitUntilVisible(DEAL_FLOOR_TEXT);
    return this.findElement(DEAL_FLOOR_TEXT);
};

DealsForm.prototype.getDealFlorTextbox = function() {
    this.waitUntilVisible(DEAL_FLOOR_TEXTBOX);
    return this.findElement(DEAL_FLOOR_TEXTBOX);
};

DealsForm.prototype.getDemandTypeText = function() {
    this.waitUntilVisible(DEMAND_TYPE_TEXT);
    return this.findElement(DEMAND_TYPE_TEXT);
};

DealsForm.prototype.getDemandTypeDropdown = function() {
    this.waitUntilVisible(DEMAND_TYPE_DROPDOWN);
    return this.findElement(DEMAND_TYPE_DROPDOWN);
};

DealsForm.prototype.clickDemandTypeDropdown = function() {
    this.waitUntilVisible(DEMAND_TYPE_DROPDOWN);
    return this.click(DEMAND_TYPE_DROPDOWN);
};

DealsForm.prototype.getAdvertiserDomainText = function() {
    this.waitUntilVisible(ADVERTISER_DOMAIN_TEXT);
    return this.findElement(ADVERTISER_DOMAIN_TEXT);
};

DealsForm.prototype.getDirectSpan = function() {
    this.waitUntilVisible(DIRECT_SPAN);
    return this.findElement(DIRECT_SPAN);
};

DealsForm.prototype.getExchangeSpan = function() {
    this.waitUntilVisible(EXCHANGE_SPAN);
    return this.findElement(EXCHANGE_SPAN);
};

DealsForm.prototype.getAdvertiserDomainTextbox = function() {
    this.waitUntilVisible(ADVERTISER_DOMAIN_TEXTBOX);
    return this.findElement(ADVERTISER_DOMAIN_TEXTBOX);
};

// tergeting section
DealsForm.prototype.getTargetingHeader = function() {
    this.waitUntilVisible(TARGETING_HEADER);
    return this.findElement(TARGETING_HEADER);
};

DealsForm.prototype.getLiveAudienceText = function() {
    this.waitUntilVisible(LIVE_AUDIENCE_TEXT);
    return this.findElement(LIVE_AUDIENCE_TEXT);
};

DealsForm.prototype.getLiveAudienceDropdown = function() {
    this.waitUntilVisible(LIVE_AUDIENCE_DROPDOWN);
    return this.findElement(LIVE_AUDIENCE_DROPDOWN);
};

DealsForm.prototype.clickLiveAudienceDropdown = function() {
    this.waitUntilVisible(LIVE_AUDIENCE_DROPDOWN);
    return this.click(LIVE_AUDIENCE_DROPDOWN);
};

DealsForm.prototype.getLiveAudienceTextbox = function() {
    this.waitUntilVisible(LIVE_AUDIENCE_TEXTBOX);
    return this.findElement(LIVE_AUDIENCE_TEXTBOX);
};

module.exports = DealsForm;
