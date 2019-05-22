'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

// elements
const INPUT_NAME = By.name('campaignName');
const INPUT_BUDGET = By.name('campaignBudget');
const INPUT_BID_AMOUNT = By.name('bidAmount');
const INPUT_TARGET_BID_AMOUNT = By.name('targetBidAmount');
const INPUT_CATEGORY = By.css('searchable-select-single[name="category"]' +
            ' div div input');
const INPUT_SEC_CATEGORY = By.css('tags-input[name="categories"]' +
    ' search-input div input');
const INPUT_FREQUENCY_CAP = By.name('frequencyCapCount');
const INPUT_LABEL = By.name('externalId');
const INPUT_CONV_TRACKER = By.css('select-item' +
    '[name="conversionPixel"] div input');
const INPUT_CONV_TRACKER_ADDED = By.css('select-item' +
'[name="pixel"] div input');
const INPUT_SHARE_OF_VOICE = By.css('input[name="shareOfVoice"]');
const INPUT_GUARANTEED = By.xpath('//span[text() = "This is a ' +
    'guaranteed campaign"]');
const INPUT_CRX = By.xpath('//span[text() = "This is a CRX campaign."]');
const INPUT_START_DATE = By.xpath('//date-picker[@name="startDate"]/div/input');
const INPUT_END_DATE = By.xpath('//date-picker[@name="endDate"]/div/input');

const BUTTON_CANCEL = By.xpath('//button[text() = "Cancel"]');
const BUTTON_CLOSE = By.css('.modal---header .icon.icon--exit');
const BUTTON_CREATE_LI = By.xpath('//button[text() = "Create Line Item"]');
const BUTTON_SAVE = By.xpath('//campaign-flow/modal/div/div[3]' +
    '/div/footer/div/div/button[1]');
const BUTTON_BRANDING = By.xpath('//span[text() = "Increase awareness of' +
            ' a brand or product."]');
const BUTTON_PERFORMANCE = By.xpath('//span[text() = "Reach a specific' +
            ' CPM, CPC or CPA."]');
const BUTTON_DAY = By.xpath('//span[text() = "Day"]');
const BUTTON_PLATFORM = By.xpath('//select-dropdown[@name="platform"]' +
    '/div/button');
const BUTTON_CAMPAIGN_TYPE = By.css('select-dropdown[name="campaignType"]' +
    ' div button');
const BUTTON_BUDGET_TYPE = By.css('select-dropdown[name="budgetType"]' +
    ' div button');
const BRANDING_IMP = By.xpath('//span[text() = "Put your message in front' +
            ' of the right people."]');
const BRANDING_CLI = By.xpath('//span[text() = "Increase site traffic "]');
const BRANDING_CONV = By.xpath('//span[text() = "Drive users to take "]');
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
const LINK_USE_BUDGET = By.xpath('//a[text() = "Use it all!"]');
// const LINK_CHANGE_GOAL = By.xpath('//a[text()[contains(., ' +
//     '"Change Campaign Goal")]]');
const LINK_USE_DATES = By.xpath('//button[text()="' +
    'Use insertion order dates."]');

const TITLE_GOAL = By.xpath('//section-card/div/div[2]/section[1]/div/' +
            'section[1]/div/div/h3');
const SPAN_PLATFORM = By.css('select-dropdown[name="platform"]' +
    ' .select--dropdown button span');
const SPAN_SSP = By.xpath('//span[text() = "SSP"]');
const TEXT_USE_BUDGET = By.xpath('//div[contains(., "Available Budget:")]');
const ALERT_TEXT = By.css('._alert---text div');
const PAGE_HEADER = By.xpath('//h4[text() = "Create Campaign"]');

function CampaignFormPage(webdriver) {
    BasePage.call(this, webdriver);
}

CampaignFormPage.prototype = Object.create(BasePage.prototype);
CampaignFormPage.prototype.constructor = CampaignFormPage;

CampaignFormPage.prototype.setInputName = function(value) {
    this.waitUntilVisible(INPUT_NAME);
    this.clear(INPUT_NAME);
    this.sendKeys(INPUT_NAME, value);
    return this;
};

CampaignFormPage.prototype.setInputBudget = function(value) {
    this.waitUntilVisible(INPUT_BUDGET);
    this.clear(INPUT_BUDGET);
    this.sendKeys(INPUT_BUDGET, value);
    return this;
};

CampaignFormPage.prototype.setBidAmount = function(value) {
    this.clear(INPUT_BID_AMOUNT);
    this.sendKeys(INPUT_BID_AMOUNT, value);
    return this;
};

CampaignFormPage.prototype.setTargetBidAmount = function(value) {
    this.clear(INPUT_TARGET_BID_AMOUNT);
    this.sendKeys(INPUT_TARGET_BID_AMOUNT, value);
    return this;
};

CampaignFormPage.prototype.setCategory = function() {
    this.waitUntilVisible(INPUT_CATEGORY);
    this.click(INPUT_CATEGORY);
    return this.getSearchedElement().click();
};

CampaignFormPage.prototype.setConvTrack = function(value) {
    this.waitUntilVisible(INPUT_CONV_TRACKER);
    this.click(INPUT_CONV_TRACKER);
    this.sendKeys(INPUT_CONV_TRACKER, value);
    return this.clickSpan(value);
};

CampaignFormPage.prototype.setInputStartDate = function(value) {
    this.waitUntilVisible(INPUT_START_DATE);
    this.clear(INPUT_START_DATE);
    this.sendKeys(INPUT_START_DATE, value);
    return this;
};

CampaignFormPage.prototype.setInputEndDate = function(value) {
    this.waitUntilVisible(INPUT_END_DATE);
    this.clear(INPUT_END_DATE);
    this.sendKeys(INPUT_END_DATE, value);
    return this;
};

CampaignFormPage.prototype.getInputName = function() {
    this.waitUntilVisible(INPUT_NAME);
    return this.findElement(INPUT_NAME);
};

CampaignFormPage.prototype.getInputBudget = function() {
    return this.findElement(INPUT_BUDGET);
};

CampaignFormPage.prototype.getInputBidAmount = function() {
    return this.findElement(INPUT_BID_AMOUNT);
};

CampaignFormPage.prototype.getInputTargetBidAmount = function() {
    return this.findElement(INPUT_TARGET_BID_AMOUNT);
};

CampaignFormPage.prototype.getInputCateg = function() {
    return this.findElement(INPUT_CATEGORY);
};

CampaignFormPage.prototype.getInputSecCateg = function() {
    return this.findElement(INPUT_SEC_CATEGORY);
};

CampaignFormPage.prototype.getInputFreqCap = function() {
    return this.findElement(INPUT_FREQUENCY_CAP);
};

CampaignFormPage.prototype.getInputLabel = function() {
    return this.findElement(INPUT_LABEL);
};

CampaignFormPage.prototype.getInputConvTrack = function() {
    this.waitUntilVisible(INPUT_CONV_TRACKER);
    return this.findElement(INPUT_CONV_TRACKER);
};

CampaignFormPage.prototype.getInputAddedConvTrack = function() {
    this.waitUntilVisible(INPUT_CONV_TRACKER_ADDED);
    return this.findElement(INPUT_CONV_TRACKER_ADDED);
};

CampaignFormPage.prototype.getInputShareOfVoice = function() {
    this.waitUntilVisible(INPUT_SHARE_OF_VOICE);
    return this.findElement(INPUT_SHARE_OF_VOICE);
};

CampaignFormPage.prototype.getInputGuaranteed = function() {
    this.waitUntilVisible(INPUT_GUARANTEED);
    return this.findElement(INPUT_GUARANTEED);
};

CampaignFormPage.prototype.getInputCrx = function() {
    this.waitUntilVisible(INPUT_CRX);
    return this.findElement(INPUT_CRX);
};

CampaignFormPage.prototype.getInputStartDate = function() {
    return this.findElement(INPUT_START_DATE);
};

CampaignFormPage.prototype.getInputEndDate = function() {
    return this.findElement(INPUT_END_DATE);
};

CampaignFormPage.prototype.getButtonCancel = function() {
    return this.findElement(BUTTON_CANCEL);
};

CampaignFormPage.prototype.getButtonSaveAndExit = function() {
    return this.findElement(BUTTON_SAVE);
};

CampaignFormPage.prototype.getButtonCreateLineItem = function() {
    return this.findElement(BUTTON_CREATE_LI);
};

CampaignFormPage.prototype.getButtonBranding = function() {
    return this.findElement(BUTTON_BRANDING);
};

CampaignFormPage.prototype.getButtonPerformance = function() {
    return this.findElement(BUTTON_PERFORMANCE);
};

CampaignFormPage.prototype.getButtonDay = function() {
    return this.findElement(BUTTON_DAY);
};

CampaignFormPage.prototype.getButtonPlatform = function() {
    this.waitUntilVisible(BUTTON_PLATFORM);
    return this.findElement(BUTTON_PLATFORM);
};

CampaignFormPage.prototype.getButtonCampaignType = function() {
    this.waitUntilVisible(BUTTON_CAMPAIGN_TYPE);
    return this.findElement(BUTTON_CAMPAIGN_TYPE);
};

CampaignFormPage.prototype.getButtonBudgetType = function() {
    this.waitUntilVisible(BUTTON_BUDGET_TYPE);
    return this.findElement(BUTTON_BUDGET_TYPE);
};

CampaignFormPage.prototype.getBrandingImp = function() {
    return this.findElement(BRANDING_IMP);
};

CampaignFormPage.prototype.getBrandingCli = function() {
    return this.findElement(BRANDING_CLI);
};

CampaignFormPage.prototype.getBrandingCon = function() {
    return this.findElement(BRANDING_CONV);
};

CampaignFormPage.prototype.getPerfMaxReach = function() {
    return this.findElement(PERF_MAX_REACH);
};

CampaignFormPage.prototype.getPerfMaxClick = function() {
    return this.findElement(PERF_MAX_CLICK);
};

CampaignFormPage.prototype.getPerfPayPerClick = function() {
    return this.findElement(PERF_PAY_PER_CLICK);
};

CampaignFormPage.prototype.getPerfMaxConv = function() {
    return this.findElement(PERF_MAX_CONV);
};

CampaignFormPage.prototype.getPerfPayPerConv = function() {
    return this.findElement(PERF_PAY_PER_CONV);
};

CampaignFormPage.prototype.getLinkConvTrack = function() {
    return this.findElement(LINK_CONV_TRACK);
};

CampaignFormPage.prototype.getLinkSecCateg = function() {
    return this.findElement(LINK_SEC_CATEG);
};

CampaignFormPage.prototype.getLinkFreqCap = function() {
    return this.findElement(LINK_FREQ_CAP);
};

CampaignFormPage.prototype.getLinkLabel = function() {
    return this.findElement(LINK_LABEL);
};

CampaignFormPage.prototype.getLinkChangeGoal = function() {
    this.waitUntilVisible(LINK_CHANGE_GOAL);
    return this.findElement(LINK_CHANGE_GOAL);
};

CampaignFormPage.prototype.getTitleGoal = function() {
    this.waitUntilVisible(TITLE_GOAL);
    return this.findElement(TITLE_GOAL);
};

CampaignFormPage.prototype.getSpanPlatform = function() {
    return this.findElement(SPAN_PLATFORM);
};

CampaignFormPage.prototype.getAlertText = function() {
    this.waitUntilVisible(ALERT_TEXT);
    return this.findElement(ALERT_TEXT);
};

CampaignFormPage.prototype.getSearchedElement = function() {
    return this.findElement(By.css('a.search--item'));
};

CampaignFormPage.prototype.getLinkUseDates = function() {
    return this.findElement(LINK_USE_DATES);
};

// clicks
CampaignFormPage.prototype.clickCancel = function() {
    this.waitUntilVisible(BUTTON_CANCEL);
    return this.click(BUTTON_CANCEL);
};

CampaignFormPage.prototype.clickClose = function() {
    this.waitUntilVisible(BUTTON_CLOSE);
    return this.click(BUTTON_CLOSE);
};

CampaignFormPage.prototype.clickSaveAndExit = function() {
    this.scrollDown();
    this.waitUntilVisible(BUTTON_SAVE);
    this.click(BUTTON_SAVE);
    return this.waitOverlayUntilStale();
};

CampaignFormPage.prototype.clickBranding = function() {
    this.waitUntilVisible(PAGE_HEADER);
    this.click(BUTTON_BRANDING);
    return this.waitUntilVisible(BRANDING_IMP);
};

CampaignFormPage.prototype.clickPerformance = function() {
    this.waitUntilVisible(PAGE_HEADER);
    this.waitUntilVisible(BUTTON_PERFORMANCE);
    this.click(BUTTON_PERFORMANCE);
    return this.waitUntilVisible(PERF_MAX_REACH);
};

CampaignFormPage.prototype.clickBrandingImp = function() {
    this.waitUntilVisible(BRANDING_IMP);
    this.click(BRANDING_IMP);
    return this.waitUntilVisible(INPUT_NAME);
};

CampaignFormPage.prototype.clickBrandingClick = function() {
    this.waitUntilVisible(BRANDING_CLI);
    this.click(BRANDING_CLI);
    return this.waitUntilVisible(INPUT_NAME);
};

CampaignFormPage.prototype.clickBrandingConv = function() {
    this.waitUntilVisible(BRANDING_CONV);
    this.click(BRANDING_CONV);
    return this.waitUntilVisible(INPUT_NAME);
};

CampaignFormPage.prototype.clickMaxReach = function() {
    this.waitUntilVisible(PERF_MAX_REACH);
    this.click(PERF_MAX_REACH);
    return this.waitUntilVisible(INPUT_NAME);
};

CampaignFormPage.prototype.clickMaxClick = function() {
    this.waitUntilVisible(PERF_MAX_CLICK);
    this.click(PERF_MAX_CLICK);
    return this.waitUntilVisible(INPUT_NAME);
};

CampaignFormPage.prototype.clickPayPerClick = function() {
    this.waitUntilVisible(PERF_PAY_PER_CLICK);
    this.click(PERF_PAY_PER_CLICK);
    return this.waitUntilVisible(INPUT_NAME);
};

CampaignFormPage.prototype.clickMaxConv = function() {
    this.waitUntilVisible(PERF_MAX_CONV);
    this.click(PERF_MAX_CONV);
    return this.waitUntilVisible(INPUT_NAME);
};

CampaignFormPage.prototype.clickPayPerConv = function() {
    this.waitUntilVisible(PERF_PAY_PER_CONV);
    this.click(PERF_PAY_PER_CONV);
    return this.waitUntilVisible(INPUT_NAME);
};

CampaignFormPage.prototype.clickLinkChangeGoal = function() {
    this.waitUntilVisible(LINK_CHANGE_GOAL);
    this.click(LINK_CHANGE_GOAL);
    return this.waitUntilVisible(BUTTON_PERFORMANCE);
};

CampaignFormPage.prototype.clickButtonPlatform = function() {
    this.waitUntilVisible(BUTTON_PLATFORM);
    this.click(BUTTON_PLATFORM);
    return this.waitUntilVisible(SPAN_SSP);
};

CampaignFormPage.prototype.clickButtonCampaignType = function() {
    this.waitUntilVisible(BUTTON_CAMPAIGN_TYPE);
    this.click(BUTTON_CAMPAIGN_TYPE);
};

CampaignFormPage.prototype.clickButtonBudgetType = function() {
    this.waitUntilVisible(BUTTON_BUDGET_TYPE);
    this.click(BUTTON_BUDGET_TYPE);
};

CampaignFormPage.prototype.clickSpan = function(value) {
    this.waitUntilVisible(By.xpath('//span[text() = "' + value + '"]'));
    return this.click(By.xpath('//span[text() = "' + value + '"]'));
};

CampaignFormPage.prototype.clickSsp = function() {
    this.clickButtonPlatform();
    return this.clickSpan('SSP');
};

CampaignFormPage.prototype.clickDsp = function() {
    this.clickButtonPlatform();
    return this.clickSpan('DSP');
};

CampaignFormPage.prototype.clickGuaranteed = function() {
    this.waitUntilVisible(INPUT_GUARANTEED);
    this.click(INPUT_GUARANTEED);
    return this.waitUntilVisible(INPUT_SHARE_OF_VOICE);
};

CampaignFormPage.prototype.clickCreateLineItem = function() {
    this.findElement(BUTTON_CREATE_LI);
    this.click(BUTTON_CREATE_LI);
    return this.driver.sleep(4000);
};

CampaignFormPage.prototype.clickLinkUseDates = function() {
    return this.waitAndClick(LINK_USE_DATES);
};

CampaignFormPage.prototype.verifyBrandingNotPresent = function() {
    return this.elementNotLocated(BUTTON_BRANDING);
};
CampaignFormPage.prototype.verifyMaxClickNotPresent = function() {
    return this.elementNotLocated(PERF_MAX_CLICK);
};
CampaignFormPage.prototype.verifyMaxReachNotPresent = function() {
    return this.elementNotLocated(PERF_MAX_REACH);
};
CampaignFormPage.prototype.verifyPayPerConvNotPresent = function() {
    return this.elementNotLocated(PERF_PAY_PER_CONV);
};
CampaignFormPage.prototype.verifyChangeGoalNotPresent = function() {
    return this.elementNotLocated(LINK_CHANGE_GOAL);
};
CampaignFormPage.prototype.verifyButtonPlatformNotPresent = function() {
    return this.elementNotLocated(BUTTON_PLATFORM);
};
CampaignFormPage.prototype.verifyLinkUseBudgetNotPresent = function() {
    return this.elementNotLocated(LINK_USE_BUDGET);
};
CampaignFormPage.prototype.verifyTextUseBudgetNotPresent = function() {
    return this.elementNotLocated(TEXT_USE_BUDGET);
};
module.exports = CampaignFormPage;
