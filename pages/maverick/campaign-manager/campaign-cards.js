'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const driverTimeOut = 2000;

// elements
const INPUT_NAME = By.name('campaignName');
const INPUT_BUDGET = By.name('campaignBudget');
const INPUT_BID_AMOUNT = By.name('bidAmount');
const INPUT_TARGET_BID_AMOUNT = By.name('targetBidAmount');
const INPUT_CATEGORY = By.css('searchable-select-single[name="category"]' +
    ' div input-field div div');
const INPUT_SEC_CATEGORY = By.xpath('//progressive-link/div/div/div/' +
    'tags-input/div/search/input-field/div/div');
const INPUT_FREQUENCY_CAP = By.name('frequencyCapCount');
const INPUT_LABEL = By.name('externalId');
const INPUT_CONV_TRACKER = By.css('searchable-select-single' +
    '[name="conversionPixel"] div input-field div div');

const BUTTON_CANCEL = By.xpath('//button[text() = "Cancel"]');
const BUTTON_CREATE_LI = By.xpath('//button[text() = "Create Line Item"]');
const BUTTON_SAVE = By.xpath('//button[text() = "Save and Exit"]');
const BUTTON_EXCHANGE = By.xpath('//div[text() = "Buy on the exchange"]');
const BUTTON_DIRECT_SOLD = By.xpath('//div[text() = "Run direct sold ads' +
    ' on your inventory"]');
const BUTTON_HOUSE = By.xpath('//div[text() = "Run your own ads' +
    ' on your inventory"]');
const BUTTON_BRANDING = By.xpath('//div[text() = "Increase awareness of' +
    ' a brand or product."]');
const BUTTON_PERFORMANCE = By.xpath('//div[text() = "Reach a specific' +
    ' CPM, CPC or CPA."]');
const BUTTON_DAY = By.xpath('//span[text() = "Day"]');
const BUTTON_PLATFORM = By.css('select-dropdown[name="platform"]' +
    ' .select--dropdown button');
const BRANDING_IMP = By.xpath('//div[text() = "Put your message in front' +
    ' of the right people."]');
const BRANDING_CLI = By.xpath('//div[text() = "Increase site traffic "]');
const BRANDING_CONV = By.xpath('//div[text() = "Drive users to take "]');
const PERF_MAX_REACH = By.xpath('//h5[text() = "Maximize Reach"]');
const PERF_MAX_CLICK = By.xpath('//h5[text() = "Maximize Clicks"]');
const PERF_PAY_PER_CLICK = By.xpath('//h5[text() = "Pay Per Click"]');
const PERF_MAX_CONV = By.xpath('//h5[text() = "Maximize Conversions"]');
const PERF_PAY_PER_CONV = By.xpath('//h5[text() = "Pay Per Conversion"]');

const LINK_CONV_TRACK = By.css('a[title="Conversion Tracker"]');
const LINK_SEC_CATEG = By.css('a[title="Secondary IAB Category"]');
const LINK_FREQ_CAP = By.css('a[title="Frequency Cap"]');
const LINK_LABEL = By.css('a[title="Campaign Label"]');
const LINK_CHANGE_GOAL = By.xpath('//a[text() = "Change Campaign Goal"]');
const TITLE_GOAL = By.xpath('//section-card/div/form/div/section[1]/div/' +
    'section[1]/div/div/h3');
const SPAN_PLATFORM = By.css('select-dropdown[name="platform"]' +
    ' .select--dropdown button span');
const SPAN_SSP = By.xpath('//span[text() = "SSP"]');
const ALERT_TEXT = By.css('._alert---text div');

function CampaignCardsPage(webdriver) {
    BasePage.call(this, webdriver);
}

CampaignCardsPage.prototype = Object.create(BasePage.prototype);
CampaignCardsPage.prototype.constructor = CampaignCardsPage;

CampaignCardsPage.prototype.setInputName = function(value) {
    this.waitUntilVisible(INPUT_NAME);
    this.clear(INPUT_NAME);
    this.sendKeys(INPUT_NAME, value);
    return this;
};

CampaignCardsPage.prototype.setInputBudget = function(value) {
    this.waitUntilVisible(INPUT_BUDGET);
    this.clear(INPUT_BUDGET);
    this.sendKeys(INPUT_BUDGET, value);
    return this;
};

CampaignCardsPage.prototype.setBidAmount = function(value) {
    this.clear(INPUT_BID_AMOUNT);
    this.sendKeys(INPUT_BID_AMOUNT, value);
    return this;
};

CampaignCardsPage.prototype.setTargetBidAmount = function(value) {
    this.clear(INPUT_TARGET_BID_AMOUNT);
    this.sendKeys(INPUT_TARGET_BID_AMOUNT, value);
    return this;
};

CampaignCardsPage.prototype.setCategory = function() {
    this.waitUntilVisible(INPUT_CATEGORY);
    this.click(INPUT_CATEGORY);
    return this.getSearchedElement().click();
};

CampaignCardsPage.prototype.setConvTrack = function() {
    this.waitUntilVisible(INPUT_CONV_TRACKER);
    this.click(INPUT_CONV_TRACKER);
    return this.getSearchedElement().click();
};

CampaignCardsPage.prototype.getInputName = function() {
    this.waitUntilVisible(INPUT_NAME);
    return this.findElement(INPUT_NAME);
};

CampaignCardsPage.prototype.getInputBudget = function() {
    return this.findElement(INPUT_BUDGET);
};

CampaignCardsPage.prototype.getInputBidAmount = function() {
    return this.findElement(INPUT_BID_AMOUNT);
};

CampaignCardsPage.prototype.getInputTargetBidAmount = function() {
    return this.findElement(INPUT_TARGET_BID_AMOUNT);
};

CampaignCardsPage.prototype.getInputCateg = function() {
    return this.findElement(INPUT_CATEGORY);
};

CampaignCardsPage.prototype.getInputSecCateg = function() {
    return this.findElement(INPUT_SEC_CATEGORY);
};

CampaignCardsPage.prototype.getInputFreqCap = function() {
    return this.findElement(INPUT_FREQUENCY_CAP);
};

CampaignCardsPage.prototype.getInputLabel = function() {
    return this.findElement(INPUT_LABEL);
};

CampaignCardsPage.prototype.getInputConvTrack = function() {
    return this.findElement(INPUT_CONV_TRACKER);
};

CampaignCardsPage.prototype.getButtonCancel = function() {
    return this.findElement(BUTTON_CANCEL);
};

CampaignCardsPage.prototype.getButtonSaveAndExit = function() {
    return this.findElement(BUTTON_SAVE);
};

CampaignCardsPage.prototype.getButtonCreateLineItem = function() {
    return this.findElement(BUTTON_CREATE_LI);
};

CampaignCardsPage.prototype.getButtonExchange = function() {
    return this.findElement(BUTTON_EXCHANGE);
};

CampaignCardsPage.prototype.getButtonDirectSold = function() {
    return this.findElement(BUTTON_DIRECT_SOLD);
};

CampaignCardsPage.prototype.getButtonBranding = function() {
    return this.findElement(BUTTON_BRANDING);
};

CampaignCardsPage.prototype.getButtonPerformance = function() {
    return this.findElement(BUTTON_PERFORMANCE);
};

CampaignCardsPage.prototype.getButtonDay = function() {
    return this.findElement(BUTTON_DAY);
};

CampaignCardsPage.prototype.getButtonPlatform = function() {
    return this.findElement(BUTTON_PLATFORM);
};

CampaignCardsPage.prototype.getBrandingImp = function() {
    return this.findElement(BRANDING_IMP);
};

CampaignCardsPage.prototype.getBrandingCli = function() {
    return this.findElement(BRANDING_CLI);
};

CampaignCardsPage.prototype.getBrandingCon = function() {
    return this.findElement(BRANDING_CONV);
};

CampaignCardsPage.prototype.getPerfMaxReach = function() {
    return this.findElement(PERF_MAX_REACH);
};

CampaignCardsPage.prototype.getPerfMaxClick = function() {
    return this.findElement(PERF_MAX_CLICK);
};

CampaignCardsPage.prototype.getPerfPayPerClick = function() {
    return this.findElement(PERF_PAY_PER_CLICK);
};

CampaignCardsPage.prototype.getPerfMaxConv = function() {
    return this.findElement(PERF_MAX_CONV);
};

CampaignCardsPage.prototype.getPerfPayPerConv = function() {
    return this.findElement(PERF_PAY_PER_CONV);
};

CampaignCardsPage.prototype.getLinkConvTrack = function() {
    return this.findElement(LINK_CONV_TRACK);
};

CampaignCardsPage.prototype.getLinkSecCateg = function() {
    return this.findElement(LINK_SEC_CATEG);
};

CampaignCardsPage.prototype.getLinkFreqCap = function() {
    return this.findElement(LINK_FREQ_CAP);
};

CampaignCardsPage.prototype.getLinkLabel = function() {
    return this.findElement(LINK_LABEL);
};

CampaignCardsPage.prototype.getLinkChangeGoal = function() {
    return this.findElement(LINK_CHANGE_GOAL);
};

CampaignCardsPage.prototype.getTitleGoal = function() {
    return this.findElement(TITLE_GOAL);
};

CampaignCardsPage.prototype.getSpanPlatform = function() {
    return this.findElement(SPAN_PLATFORM);
};

CampaignCardsPage.prototype.getAlertText = function() {
    this.waitUntilVisible(ALERT_TEXT);
    return this.findElement(ALERT_TEXT);
};

CampaignCardsPage.prototype.getSearchedElement = function() {
    return this.findElement(By.css('a.search--item'));
};

// clicks
CampaignCardsPage.prototype.clickCancel = function() {
    this.waitUntilVisible(BUTTON_CANCEL);
    return this.click(BUTTON_CANCEL);
};

CampaignCardsPage.prototype.clickSaveAndExit = function() {
    this.waitUntilVisible(BUTTON_SAVE);
    return this.click(BUTTON_SAVE);
};

CampaignCardsPage.prototype.clickExchange = function() {
    this.driver.sleep(driverTimeOut);
    this.waitUntilOverlayNotVisible();
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(BUTTON_EXCHANGE);
    this.click(BUTTON_EXCHANGE);
    this.waitUntilOverlayNotVisible();
    return this.waitUntilVisible(BUTTON_BRANDING);
};

CampaignCardsPage.prototype.clickDirectSold = function() {
    this.waitUntilOverlayNotVisible();
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(BUTTON_DIRECT_SOLD);
    this.click(BUTTON_DIRECT_SOLD);
    this.waitUntilOverlayNotVisible();
    return this.waitUntilVisible(BUTTON_BRANDING);
};

CampaignCardsPage.prototype.clickHouse = function() {
    this.waitUntilOverlayNotVisible();
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(BUTTON_HOUSE);
    this.click(BUTTON_HOUSE);
    this.waitUntilOverlayNotVisible();
    return this.waitUntilVisible(BUTTON_BRANDING);
};

CampaignCardsPage.prototype.clickBranding = function() {
    this.waitUntilOverlayNotVisible();
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(BUTTON_BRANDING);
    this.click(BUTTON_BRANDING);
    this.waitUntilOverlayNotVisible();
    return this.waitUntilVisible(BRANDING_CLI);
};

CampaignCardsPage.prototype.clickPerformance = function() {
    this.waitUntilOverlayNotVisible();
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(BUTTON_PERFORMANCE);
    this.click(BUTTON_PERFORMANCE);
    this.waitUntilOverlayNotVisible();
    return this.waitUntilVisible(PERF_MAX_REACH);
};

CampaignCardsPage.prototype.clickPerformanceDirectSold = function() {
    this.waitUntilOverlayNotVisible();
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(BUTTON_PERFORMANCE);
    this.click(BUTTON_PERFORMANCE);
    this.waitUntilOverlayNotVisible();
    return this.waitUntilVisible(INPUT_NAME);
};

CampaignCardsPage.prototype.clickBrandingImp = function() {
    this.waitUntilOverlayNotVisible();
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(BRANDING_IMP);
    this.click(BRANDING_IMP);
    this.waitUntilOverlayNotVisible();
    return this.waitUntilVisible(INPUT_NAME);
};

CampaignCardsPage.prototype.clickBrandingClicks = function() {
    this.waitUntilOverlayNotVisible();
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(BRANDING_CLI);
    this.click(BRANDING_CLI);
    this.waitUntilOverlayNotVisible();
    return this.waitUntilVisible(INPUT_NAME);
};

CampaignCardsPage.prototype.clickBrandingConv = function() {
    this.waitUntilOverlayNotVisible();
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(BRANDING_CONV);
    this.click(BRANDING_CONV);
    this.waitUntilOverlayNotVisible();
    return this.waitUntilVisible(INPUT_NAME);
};

CampaignCardsPage.prototype.clickMaxReach = function() {
    this.waitUntilOverlayNotVisible();
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(PERF_MAX_REACH);
    this.click(PERF_MAX_REACH);
    this.waitUntilOverlayNotVisible();
    return this.waitUntilVisible(INPUT_NAME);
};

CampaignCardsPage.prototype.clickMaxClicks = function() {
    this.waitUntilOverlayNotVisible();
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(PERF_MAX_CLICK);
    this.click(PERF_MAX_CLICK);
    this.waitUntilOverlayNotVisible();
    return this.waitUntilVisible(INPUT_NAME);
};

CampaignCardsPage.prototype.clickPayPerClick = function() {
    this.waitUntilOverlayNotVisible();
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(PERF_PAY_PER_CLICK);
    this.click(PERF_PAY_PER_CLICK);
    this.waitUntilOverlayNotVisible();
    return this.waitUntilVisible(INPUT_NAME);
};

CampaignCardsPage.prototype.clickMaxConv = function() {
    this.waitUntilOverlayNotVisible();
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(PERF_MAX_CONV);
    this.click(PERF_MAX_CONV);
    this.waitUntilOverlayNotVisible();
    return this.waitUntilVisible(INPUT_NAME);
};

CampaignCardsPage.prototype.clickPayPerConv = function() {
    this.waitUntilOverlayNotVisible();
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(PERF_PAY_PER_CONV);
    this.click(PERF_PAY_PER_CONV);
    this.waitUntilOverlayNotVisible();
    return this.waitUntilVisible(INPUT_NAME);
};

CampaignCardsPage.prototype.clickLinkChangeGoal = function() {
    this.waitUntilVisible(LINK_CHANGE_GOAL);
    this.click(LINK_CHANGE_GOAL);
    return this.waitUntilVisible(BUTTON_PERFORMANCE);
};

CampaignCardsPage.prototype.clickButtonPlatform = function() {
    this.waitUntilVisible(BUTTON_PLATFORM);
    this.click(BUTTON_PLATFORM);
    return this.waitUntilVisible(SPAN_SSP);
};

CampaignCardsPage.prototype.clickSpan = function(value) {
    this.waitUntilVisible(By.xpath('//span[text() = "' + value + '"]'));
    return this.click(By.xpath('//span[text() = "' + value + '"]'));
};

CampaignCardsPage.prototype.clickSsp = function() {
    this.clickButtonPlatform();
    return this.clickSpan('SSP');
};

CampaignCardsPage.prototype.clickDsp = function() {
    this.clickButtonPlatform();
    return this.clickSpan('DSP');
};

CampaignCardsPage.prototype.verifyBrandingNotPresent = function() {
    return this.elementNotLocated(BUTTON_BRANDING);
};
CampaignCardsPage.prototype.verifyMaxClickNotPresent = function() {
    return this.elementNotLocated(PERF_MAX_CLICK);
};
CampaignCardsPage.prototype.verifyMaxReachNotPresent = function() {
    return this.elementNotLocated(PERF_MAX_REACH);
};
CampaignCardsPage.prototype.verifyPayPerClickNotPresent = function() {
    return this.elementNotLocated(PERF_PAY_PER_CLICK);
};
CampaignCardsPage.prototype.verifyPayPerConvNotPresent = function() {
    return this.elementNotLocated(PERF_PAY_PER_CONV);
};

module.exports = CampaignCardsPage;
