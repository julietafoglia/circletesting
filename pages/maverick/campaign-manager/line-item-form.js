'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');
const driverTimeOut = 5000;
const oneSecTO = 1000;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;
const key = webdriver.Key;

// elements
const INPUT_NAME = By.css('input[name="lineItemName"]');
const INPUT_BUDGET = By.css('input[name="budget"]');
const BUDGET_TYPE_DD = By.css('select-dropdown[name="budget-type"] div ' +
    'button span');
const DAILY_BUDGET_SPAN = By.xpath('//span[text()="Daily"]');
const INPUT_START_DATE = By.css('input[placeholder="Start Date"]');
const INPUT_END_DATE = By.css('input[placeholder="End Date"]');
const START_TIME_INPUT = By.css(
    'time-picker[name = "startTime"] div div input');
const END_TIME_INPUT = By.css(
    'time-picker[name = "endTime"] div div input');
const START_DAY_TIME_DROPDOWN = By.css(
    'time-picker[name = "startTime"] div select-dropdown');
const END_DAY_TIME_DROPDOWN = By.css(
    'time-picker[name = "endTime"] div select-dropdown');
const INPUT_LABEL = By.css('input[name="label"]');
const INPUT_LIVE_AUDIENCE = By.
    xpath('//search-input[@placeholder = "Search LiveAudiences"]/div/input');
const DROPDOWN_AUDIENCE = By.xpath('//div[contains(@class,"audience-row")]' +
'/div/div/span');
// const DROPDOWN_AUDIENCE = By.xpath('//span[contains(@class,"nowrap")]');
const INPUT_LOCATION = By.css('input[placeholder="Search Locations"]');
const INPUT_BROWSERS = By.css('tags-input[name="browsers"] search-input' +
            ' div input');
const INPUT_BUNDLES = By.css('tags-input[name="bundles"] search-input' +
            ' div input');
const INPUT_CATEGORIES = By.css('tags-input[name="categories"]' +
            ' search-input div input');
const INPUT_DEVICE = By.css('tags-input[name="deviceMakers"]' +
            ' search-input div input');
const INPUT_ISP = By.css('tags-input[name="isps"]' +
            ' search-input div input');
const INPUT_OS = By.css('tags-input[name="operatingSystems"] search-input' +
            ' div input');
const INPUT_PLACEMENT_ID = By.css(
    'textarea[placeholder="Placement Id designated to sponsor this drop"]');
const INPUT_LIST_ID = By.xpath('//input[@placeholder="List ' +
    'Ids you would like to target"]');
const INPUT_KVP = By.css('kvp-input ._container');
const INPUT_THIRD_PARTY = By.xpath('//section-card/div/div[2]/form/' +
    'section/div[4]/div[2]/textarea');
const INPUT_SEARCH_WHITELIST = By.xpath('//inventory-targeting' +
            '/open-book/div/div/div[2]/div/div/div/tabs/div/div/tab' +
                '/div/search/div/input');
const INPUT_SEARCH_THIRD = By.xpath('//div[text() = "Search RapLeaf:' +
                ' children Segments"]');
const INPUT_AD_NAME = By.xpath('//ad-builder/lightbox/div[2]/div/div' +
            '/div[2]/div/tabs/div/div/tab[2]/div/div/div/section-card/' +
                'div/div[2]/form/section/div/div[2]/input');
const INPUT_SOURCE_URL = By.xpath('//ad-builder/lightbox/div[2]/div' +
            '/div/div[2]/div/tabs/div/div/tab[2]/div/div/div/section-card/' +
                'div/div[2]/form/section/div[2]/div[2]/textarea');
const INPUT_CLICK_URL = By.xpath('//ad-builder/lightbox/div[2]/div/div' +
            '/div[2]/div/tabs/div/div/tab[2]/div/div/div/section-card/' +
                'div/div[2]/form/section/div[3]/div[2]/textarea');
const INPUT_TRACKER1 = By.xpath('//ad-builder/lightbox/div[2]' +
            '/div/div/div[2]/div/tabs/div/div/tab[2]/div/div/div/' +
                'section-card/div/div[2]/form//section/div[4]/div[2]/textarea');
const INPUT_TRACKER2 = By.css('.progressive-link div div textarea');
const INPUT_SEARCH_ADS = By.xpath('//input[@placeholder="Search"]');
const INPUT_SEARCH_LOCATIONS = By.xpath('//geo-targeting/open-book/div/div/' +
    'div[2]/div[1]/div/div/search-input/div/input');
const INPUT_SEARCH_COUNTRY = By.xpath('//zip-targeting/open-book/div/div' +
    '/div[2]/div[1]/div/div/searchable-select-single/div/div/input');
const INPUT_FILE = By.css('input[type="file"]');
const INPUT_ADDED_AD_NAME = By.xpath('//ad-details/div/div/div[2]/div[1]/' +
    'form/section/div[2]/div[2]/input');
const INPUT_PARENT_CAMPAIGN = By.css('searchable-select-single' +
            '[name="campaignName"] div div input');
const INPUT_DAILY_CAP = By.name('dailyCap');
const INPUT_KVP_TEXTAREA = By.xpath('//kvp-input/open-book/div/div/div[2]' +
    '/div[1]/div/div/textarea');

const BUTTON_STATUS = By.xpath('//select-dropdown[@name="status"]/div/button');
const BUTTON_CANCEL = By.xpath('//a[text() = "Cancel"]');
const BUTTON_REVIEW = By.xpath('//button[text() = "Review"]');
const BUTTON_NEW_AD = By.xpath('//ad-details/div/div/button');
const BUTTON_ADD_TO_LINE_ITEM = By.
    xpath('//button[text() = "Add to Line Item"]');
const BUTTON_CANCEL_AD = By.xpath('//lightbox/div[2]/div/div/div[3]' +
    '/div/footer/div/div/a');
const BUTTON_CLOSE_AD = By.css('.close--lightbox-header');
const BUTTON_DELETE_LABEL = By.css('div.progressive-link button.close');
const BUTTON_DELETE_ADV_TARG = By.
    css('progressive-link[text="Add Advanced Targeting"]' +
                ' .progressive-link .close .fas.fa-times');
const BUTTON_DELETE_THIRD_PARTY = By.
    css('progressive-link[text="Add 3rd Party Targeting"] ' +
            'button.close');
const BUTTON_WHITELIST = By.xpath('//inventory-targeting/' +
    'open-book/div/div/div[2]/div[2]/div/div/div/select-dropdown/div/button');
const BUTTON_IDS = By.xpath('//tab[2]/div/select-dropdown/div/button');
const BUTTON_ADD_IDS = By.css('button.add-ids');
const BUTTON_DELETE_WHITELIST = By.xpath('//inventory-targeting/' +
            'open-book/div/div/div[2]/div[2]/div/div/list/div/ul/li');
const BUTTON_ADD_THIRD_PARTY_AD = By.xpath('//div[2]/div/button');
const BUTTON_SEARCH_EXISTING_AD = By.
    css('.icon.icon--add-create');
const BUTTON_ADD_POSTAL_CODES = By.
    xpath('//button[text() = "Add Postal Codes"]');
const BUTTON_LOCATION_TARGET = By.xpath('//geo-targeting/open-book/div/' +
    'div/div[2]/div[2]/div/div/select-dropdown/div/button');
// const BUTTON_GEO_TARGET = By.xpath('//location-targeting/open-book/div/' +
//            'div/div/div/div/div/div/switch/div/label');
const BUTTON_DELETE_LOCATION = By.xpath('//open-book' +
            '/div/div/div[2]/div[2]/div/div/list/div/ul/' +
                'li[1]/div/div/div[3]/span');
const BUTTON_ADD_AD = By.xpath('//button[text() = "Add"]');
const BUTTON_DELETE_PARENT_CAMP = By.css('searchable-select-single' +
            '[name="campaignName"] .searchable-select-single' +
                ' .input-field--cover span');
const BUTTON_DELETE_DAILY_CAP = By.xpath('//progressive-link' +
    '[@text = "Add Daily Cap"]/div/div/div/button');
const BUTTON_PACING = By.css('select-dropdown[name="lineItemPacing"]' +
    ' div button');
const BUTTON_ADD_PARAMETERS = By.xpath('//button[text() = "Add Parameters"]');
const BUTTON_KVP_TARGET = By.css('select-dropdown[name="kvpTargeting"]' +
    ' .select--dropdown .dropdown');
const BUTTON_KVP_OPERATOR = By.css('select-dropdown[name="kvpOperator"]' +
    ' div button');
const BUTTON_UPLOAD_NEW_TAG = By.xpath('//button[text()="Upload' +
    ' New Tag Sheet"]');

const DROP_AGE_TARG = By.css('select-dropdown[name="ageTargeting"]');
const DROP_AGE_OP = By.css('multi-select[name="age"]');
const DROP_GENDER_TARG = By.css('select-dropdown[name="genderTargeting"]');
const DROP_GENDER_OP = By.css('multi-select[name="gender"]');
const DROP_DEVICE_TARG = By.css('select-dropdown[name="deviceTargeting"]');
const DROP_DEVICE_OP = By.css('multi-select[name="devices"]');
const DROP_ADV_TARG = By.
    css('multi-select[name="advanced"] div button div span');
const DROP_DAY_OP = By.css('multi-select[placeholder="Select Days"] span');
const DROP_TIME_OP = By.
    css('multi-select[placeholder="Select Hours"] span');
const DROP_BROWSER_TARG = By.
    css('select-dropdown[name="browserTargeting"]');
const DROP_BUNDLE_TARG = By.css('select-dropdown[name="bundleTargeting"]');
const DROP_CATEG_TARG = By.
    css('select-dropdown[name="categoriesTargeting"]');
const DROP_DAY_TIME_TARG = By.css('select-dropdown[name="hoursdaysTargeting"]' +
    ' div button');
const DROP_DEVICE_MAKER_TARG = By.
    css('select-dropdown[name="deviceMakersTargeting"]');
const DROP_ISP_TARG = By.css('select-dropdown[name="ispTargeting"]');
const DROP_OS_TARG = By.css('select-dropdown[name="osTargeting"]');
const DROP_THIRD_PARTY_TARG = By.css('select-dropdown' +
            '[ng-reflect-name="thirdmode3"] button');
const SELECT_ADV_TARGET = By.css('multi-select[name="advanced"]');

// other
const LINK_LABEL = By.xpath('//a[@title="Line Item Label"]');
const LINK_USE_BUDGET = By.xpath('//a[text() = "Use it all!"]');
const LINK_USE_DATES = By.xpath('//button[text() = "Use Campaign Dates"]');
const LINK_LIVE_RAMP = By.css('a[title="Add LiveRamp Audience"]');
const LINK_ADV_TARG = By.css('a[title="Add Advanced Targeting"]');
const CHOOSE_THIRD_PARTY_DS = By.xpath('//button[contains(text(),' +
    '"Choose 3rd")]');
const LINK_SECOND_PARTY = By.
    css('a[title="Secondary Third Party Tracker"]');
const LINK_TEST_SOURCE = By.xpath('//div[3]/a');
const LINK_TEST_CLICK = By.xpath('//div[3]/a');
const LINK_LOCATION_CLEAR = By.xpath('//a[text()="Clear All"]');
const LINK_SELECT_AD_SLOTS = By.xpath('//a[text()="Select Ad Slots"]');
const LINK_DOWNLOAD_TEMPLATE = By.xpath('//a[text()="Download Template"]');

const TEXT_USE_BUDGET = By.css('.copy--secondary');
const TEXT_POSTAL_CODES = By.css('textarea[placeholder="Select a country and' +
            ' then add postal codes you want to target."]');
const TEXT_AD_BUILDER = By.css('.ad-builder---no-ads h2');
const TEXT_INPUT_IDS = By.css('textarea[placeholder="Enter ID numbers one per' +
            ' each line or separated by commas (ie. 2343, 3455, 3423)."]');
const TEXT_ADDED_WHITELIST = By.xpath('//inventory-targeting/open-book/' +
    'div/div/div[2]/div[2]/div/div/list/div/ul/li/div/div[2]/span');
const TEXT_TAG_EXISTING_AD = By.css('.button--small span');
const TEXT_SELECTED_AD = By.xpath('//footer/div/div/span/strong');
const TEXT_SELECTED_LOCATOIN = By.xpath('//select-dropdown[@name="targeting"]' +
    '/../list/div/ul/li/div/div/div[2]/span');
const TEXT_LOCATION_COUNT = By.xpath('//open-book/div/' +
            'div/div[2]/div[2]/div/div/span');
const TEXT_NO_LOCATION = By.xpath('//p');
const TEXT_LOCATION_LIST = By.css('.list');
const TEXT_ADDED_CLICK = By.css('textarea[name="clickUrl"]');
const TEXT_ADDED_SOURCE = By.css('textarea[name="media"]');
const TEXT_ADDED_TRACKING = By.css('textarea[name="tracking"]');
const TEXT_PARENT_CAMPAIGN = By.css('.readonly-text');
const TEXT_PARENT_CAMPAIGN_CLONE = By.xpath('//searchable-select-single' +
    '[@name="campaignName"]/div/div[2]/span[2]');
const TEXT_DAILY_CAP = By.xpath('//section-card/div/div[2]/div[1]' +
    '/div/form/section[2]/div[3]/div/div');
const TEXT_ERROR_DAILY_CAP = By.css('.copy--error-text');
const TEXT_ALERT_COPY = By.xpath('//alertnext/div');
const TEXT_PACING = By.css('.extra-card-padding .row .copy--supporting');
const TEXT_SELECTED_LIST_ID = By.xpath('//tags-input-text' +
    '[@name="listIdTargeting"]/div/ul/li/button/span');

const AD_BUILDER = By.xpath('//ad-builder');
const SPAN_ADV_TARGETING = By.
    xpath('//span[text() = "Select Advanced Targeting"]');
const SPAN_STATUS = By.css('select-dropdown[name="status"] span');
const SPAN_SEARCH = By.xpath('//inventory-targeting/open-book/div/div' +
            '/div[2]/div/div/div/tabs/div/nav/ul/li/h4');
const SPAN_INPUT_IDS = By.xpath('//inventory-targeting/open-book/div/' +
            'div/div[2]/div/div/div/tabs/div/nav/ul/li[2]/h4');
const SPAN_AGE_OP = By.css('multi-select[name="age"] ' +
            'button span');
const SPAN_AGE_TARG = By.css('select-dropdown[name="ageTargeting"] ' +
            'button span');
const SPAN_GENDER_TARG = By.css('select-dropdown[name="genderTargeting"] ' +
            'button span');
const SPAN_GENDER_OP = By.css('multi-select[name="gender"] ' +
            'button span');
const SPAN_DEVICE_TARG = By.css('select-dropdown[name="deviceTargeting"] ' +
            'button.dropdown span');
const SPAN_DEVICE_OP = By.css('multi-select[name="devices"] ' +
            'button span');
const SPAN_BROWSER_TARG = By.css('select-dropdown[name="browserTargeting"] ' +
            'button.dropdown span');
const SPAN_BROWSER_OP = By.css('tags-input[name="browsers"] ' +
            'ul li button span');
const SPAN_BUNDLE_TARG = By.css('select-dropdown[name="bundleTargeting"] ' +
            'button.dropdown span');
const SPAN_BUNDLE_OP = By.css('tags-input[name="bundles"] ' +
            'ul li button span');
const SPAN_CATEG_TARG = By.css('select-dropdown' +
            '[name="categoriesTargeting"] div button.dropdown span');
const SPAN_CATEG_OP = By.css('tags-input[name="categories"] ' +
            'ul li button span');
const SPAN_DAY_TIME_TARG = By.
    css('select-dropdown[name="hoursdaysTargeting"] ' +
            'button.dropdown span');
const SPAN_DAY_OP = By.css('multi-select[placeholder="Select Days"] ' +
            'button span');
const SPAN_TIME_OP = By.css('multi-select[placeholder="Select Hours"] ' +
            'button span');
const SPAN_DEVICE_MAKER_TARG = By.css('select-dropdown' +
            '[name="deviceMakersTargeting"] button.dropdown span');
const SPAN_DEVICE_MAKER_OP = By.css('tags-input[name="deviceMakers"] ' +
            'ul li button span');
const SPAN_ISP_TARG = By.css('select-dropdown[name="ispTargeting"] ' +
            'button.dropdown span');
const SPAN_ISP_OP = By.css('tags-input[name="isps"] ' +
            'ul li button span');
const SPAN_OS_TARG = By.css('select-dropdown[name="osTargeting"] ' +
            'button.dropdown span');
const SPAN_OS_OP = By.css('tags-input[name="operatingSystems"] ' +
            'ul li button span');
const SPAN_WHITELIST_TARG = By.xpath('//inventory-targeting/open-book' +
            '/div/div/div[2]/div[2]/div/div/div/select-dropdown/div/' +
                'button/span');
const SPAN_THIRD_PARTY_TARG = By.css('select-dropdown[ng-reflect-name' +
            '="thirdmode3"] button.dropdown span');
const SPAN_THIRD_PARTY_OP = By.css('tags-input[ng-reflect-name="third3"] ' +
            'ul li button span');
const SPAN_UPLOAD_IMAGES = By.xpath('//h4[text() = "Upload Images"]');
const SPAN_ADD_THIRD_AD = By
    .xpath('//h4[text() = "Add Third Party Tags"]');
const SPAN_USE_ADS = By.xpath('//h4[text() = "Use Existing Ads"]');
const SPAN_BULK_UPLOADER = By.xpath('//h4[text() = "Bulk Tag Uploader"]');
const SPAN_LOCATION_TARG = By.css(
    'select-dropdown[name="targeting"] div button span');
const SPAN_EVEN = By.xpath('//span[text() = "Even Pacing"]');
const SPAN_ASAP = By.xpath('//span[text() = "ASAP Pacing"]');

const LINK_CLICK_UPLOAD = By.xpath('//a[text() = "click to upload"]');
const LINK_DELETE_TAG = By.css('.button--small span.icon.icon--exit');
const LINK_DELETE_AD = By.css('.ad-card---remove.pull-right.icon.icon--exit');
const LINK_AD = By.css('.ad-card--container');
const LINK_FIRST_AD = By.xpath('//carousel/div/ul/li[1]/a/div[2]');
const LINK_SECOND_AD = By.xpath('//carousel/div/ul/li[2]/a/div[2]');
const LINK_THIRD_AD = By.xpath('//carousel/div/ul/li[3]/a/div[2]');
const LINK_DAILY_CAP = By.xpath('//a[@title="Add Daily Cap"]');

const CHECK_BROWSERS = By.xpath('//li/label');
const CHECK_BUNDLES = By.xpath('//li[2]/label');
const CHECK_CATEG = By.xpath('//li[3]/label');
const CHECK_DAY = By.xpath('//li[4]/label');
const CHECK_DEVICE = By.xpath('//li[5]/label');
const CHECK_DOMAINS = By
    .xpath('//span[text() = "Domains Whitelist/Blacklist"]');
const CHECK_ISP = By.xpath('//span[text() = "ISP"]');
const CHECK_OS = By.xpath('//span[text() = "OS"]');
const CHECK_PLACEMENT_ID = By.xpath('//label[text()="Placement Id"]');
const CHECK_LIST_ID = By.xpath('//span[text()="List Id"]');
const CHECK_WHITELIST = By.
    xpath('//span[text() = "Publisher Whitelist/Blacklist"]');
const CHECK_KEY_VALUE = By.xpath('//li[10]/label');
const VALID_MACRO_LINK = By.xpath('//a[contains(text(),"View valid macros")]');
const CHECK_SELECT_ALL =
    By.xpath('//async-table/div/div/div[2]/table/thead/tr/th/label');
const CHECK_COUNTRY = By.xpath('//span[text() = "By country, metro,' +
    ' state or city"]');
const CHECK_POSTAL_CODES = By.xpath('//span[text() = "By postal code"]');

const SEARCH_ELEMENT = By.css('a.search--item');
const REVIEW_HEADER = By.xpath('//h4[text() = "Review Line Item"]');
const MODAL_FOOTER = By.css('.modal---footer');
const SWITCH_LOCATION = By.name('usOnly');
const COUNTRY_SELECTION = By.xpath('//geo-targeting/open-book/div/div' +
    '/div[2]/div[1]/div/div/search-input/dropdown/div/div/ul/li');

function LineItemPage(webdriver) {
    BasePage.call(this, webdriver);
}

LineItemPage.prototype = Object.create(BasePage.prototype);
LineItemPage.prototype.constructor = LineItemPage;

LineItemPage.prototype.setName = function(value) {
    this.waitUntilVisible(INPUT_NAME);
    this.clear(INPUT_NAME);
    this.sendKeys(INPUT_NAME, value);
    return this;
};

LineItemPage.prototype.setStatus = function(value) {
    this.driver.sleep(driverTimeOut);
    this.waitAndClick(BUTTON_STATUS);
    return this.click(By.xpath('//span[text() = "' + value + '"]'));
};

LineItemPage.prototype.setBudget = function(value) {
    this.driver.sleep(driverTimeOut);
    this.waitUntilEnabled(INPUT_BUDGET);
    this.clear(INPUT_BUDGET);
    this.sendKeys(INPUT_BUDGET, value);
    this.click(INPUT_BUDGET);
    this.sendKeys(INPUT_BUDGET, key.TAB);
    return this;
};

LineItemPage.prototype.setDailyBudget = function(value) {
    this.waitAndClick(BUDGET_TYPE_DD);
    this.waitAndClick(DAILY_BUDGET_SPAN);
    this.waitUntilEnabled(INPUT_BUDGET);
    this.clear(INPUT_BUDGET);
    this.sendKeys(INPUT_BUDGET, value);
    this.click(INPUT_BUDGET);
    this.sendKeys(INPUT_BUDGET, key.TAB);
    return this;
};

LineItemPage.prototype.setLabel = function(value) {
    this.waitUntilVisible(INPUT_LABEL);
    this.clear(INPUT_LABEL);
    this.sendKeys(INPUT_LABEL, value);
    return this;
};

LineItemPage.prototype.setPacingEven = function() {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(BUTTON_PACING);
    this.click(BUTTON_PACING);
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(SPAN_EVEN);
    return this.click(By.xpath('//span[text()="Even Pacing"]'));
};

LineItemPage.prototype.setPacingASAP = function() {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(BUTTON_PACING);
    this.click(BUTTON_PACING);
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(SPAN_ASAP);
    return this.click(By.xpath('//span[text()="ASAP Pacing"]'));
};

LineItemPage.prototype.setStartDate = function(value) {
    this.waitUntilVisible(INPUT_START_DATE);
    this.clear(INPUT_START_DATE);
    this.sendKeys(INPUT_START_DATE, value);
    return this.click(INPUT_START_DATE);
};

LineItemPage.prototype.setEndDate = function(value) {
    this.waitUntilVisible(INPUT_END_DATE);
    this.clear(INPUT_END_DATE);
    this.sendKeys(INPUT_END_DATE, value);
    return this.click(INPUT_END_DATE);
};

LineItemPage.prototype.setStartTime = function(time) {
    this.waitUntilVisible(START_TIME_INPUT);
    this.clear(START_TIME_INPUT);
    this.sendKeys(START_TIME_INPUT, time);
    return this.click(START_TIME_INPUT);
};

LineItemPage.prototype.setEndTime = function(time) {
    this.waitUntilVisible(END_TIME_INPUT);
    this.clear(END_TIME_INPUT);
    this.sendKeys(END_TIME_INPUT, time);
    return this.click(END_TIME_INPUT);
};

LineItemPage.prototype.setStartDayTime = function(option){
    this.waitAndClick(START_DAY_TIME_DROPDOWN);
    return this.clickSpan(option);
};

LineItemPage.prototype.setEndDayTime = function(option){
    this.waitAndClick(END_DAY_TIME_DROPDOWN);
    return this.clickSpan(option);
};

LineItemPage.prototype.setInputSearchWhitelist = function(value) {
    this.waitUntilVisible(INPUT_SEARCH_WHITELIST);
    this.clear(INPUT_SEARCH_WHITELIST);
    this.sendKeys(INPUT_SEARCH_WHITELIST, value);
    return this.getSearchedElement().click();
};

LineItemPage.prototype.setInputBrowsers = function(value) {
    this.waitUntilVisible(INPUT_BROWSERS);
    this.sendKeys(INPUT_BROWSERS, value);
    this.clickSpan(value);
    return this.getModalFooter();
};

LineItemPage.prototype.setInputBundles = function(value) {
    this.waitUntilVisible(INPUT_BUNDLES);
    this.sendKeys(INPUT_BUNDLES, value);
    this.clickSpan(value);
    return this.getModalFooter();
};

LineItemPage.prototype.setInputCategories = function(value) {
    this.waitUntilVisible(INPUT_CATEGORIES);
    this.sendKeys(INPUT_CATEGORIES, value);
    this.clickSpan(value);
    return this.getModalFooter();
};

LineItemPage.prototype.setInputDeviceMakers = function(value) {
    this.waitUntilVisible(INPUT_DEVICE);
    this.sendKeys(INPUT_DEVICE, value);
    return this.clickSpan(value);
};

LineItemPage.prototype.setInputIsp = function(value) {
    this.waitUntilVisible(INPUT_ISP);
    this.sendKeys(INPUT_ISP, value);
    return this.clickSpan(value);
};

LineItemPage.prototype.setInputOs = function(value) {
    this.waitUntilVisible(INPUT_OS);
    this.sendKeys(INPUT_OS, value);
    return this.clickSpan(value);
};

LineItemPage.prototype.setInputDailyCap = function(value) {
    this.waitUntilVisible(INPUT_DAILY_CAP);
    return this.sendKeys(INPUT_DAILY_CAP, value);
};

LineItemPage.prototype.setInputPlacementId = function(value) {
    this.waitUntilVisible(INPUT_PLACEMENT_ID);
    this.clear(INPUT_PLACEMENT_ID);
    this.click(INPUT_PLACEMENT_ID);
    this.sendKeys(INPUT_PLACEMENT_ID, value);
    return this.clickButtonAddParameters();
};

LineItemPage.prototype.setInputListId = function(value) {
    this.waitUntilVisible(INPUT_LIST_ID);
    return this.sendKeys(INPUT_LIST_ID, value);
};

LineItemPage.prototype.setInputKeyValuePairs = function(value) {
    this.waitUntilVisible(INPUT_KVP_TEXTAREA);
    return this.sendKeys(INPUT_KVP_TEXTAREA, value);
};

LineItemPage.prototype.setTargetExclude = function(element) {
    this.waitUntilVisible(element);
    this.click(element);
    return this.click(By.xpath('//a/span[text()="Exclude"]'));
};

LineItemPage.prototype.setLocationTargetExclude = function() {
    this.waitUntilVisible(BUTTON_LOCATION_TARGET);
    this.click(BUTTON_LOCATION_TARGET);
    return this.click(By.xpath('//a/span[text()="Exclude"]'));
};

LineItemPage.prototype.setWhitelistTargetExclude = function() {
    this.waitUntilVisible(BUTTON_WHITELIST);
    this.click(BUTTON_WHITELIST);
    return this.click(By.xpath('//a/span[text()="Blacklist"]'));
};

LineItemPage.prototype.setAgeTargetExclude = function() {
    this.waitUntilVisible(DROP_AGE_TARG);
    this.click(DROP_AGE_TARG);
    return this.click(By.xpath('//a/span[text()="Exclude"]'));
};

LineItemPage.prototype.setGenderTargetExclude = function() {
    this.waitUntilVisible(DROP_GENDER_TARG);
    this.click(DROP_GENDER_TARG);
    return this.click(By.xpath('//a/span[text()="Exclude"]'));
};

LineItemPage.prototype.setDeviceTargetExclude = function() {
    this.waitUntilVisible(DROP_DEVICE_TARG);
    this.click(DROP_DEVICE_TARG);
    return this.click(By.xpath('//a/span[text()="Exclude"]'));
};

LineItemPage.prototype.setBrowserTargetExclude = function() {
    this.waitUntilVisible(DROP_BROWSER_TARG);
    this.click(DROP_BROWSER_TARG);
    return this.click(By.xpath('//a/span[text()="Exclude"]'));
};

LineItemPage.prototype.setCategoryTargetExclude = function() {
    this.waitUntilVisible(DROP_CATEG_TARG);
    this.click(DROP_CATEG_TARG);
    return this.click(By.xpath('//a/span[text()="Exclude"]'));
};

LineItemPage.prototype.setDayTimeTargetExclude = function() {
    this.waitUntilVisible(DROP_DAY_TIME_TARG);
    this.click(DROP_DAY_TIME_TARG);
    return this.click(By.xpath('//a/span[text()="Exclude"]'));
};

LineItemPage.prototype.setDeviceMakerTargetExclude = function() {
    this.waitUntilVisible(DROP_DEVICE_MAKER_TARG);
    this.click(DROP_DEVICE_MAKER_TARG);
    return this.click(By.xpath('//a/span[text()="Exclude"]'));
};

LineItemPage.prototype.setIspTargetExclude = function() {
    this.waitUntilVisible(DROP_ISP_TARG);
    this.click(DROP_ISP_TARG);
    return this.click(By.xpath('//a/span[text()="Exclude"]'));
};

LineItemPage.prototype.setOsTargetExclude = function() {
    this.waitUntilVisible(DROP_OS_TARG);
    this.click(DROP_OS_TARG);
    return this.click(By.xpath('//a/span[text()="Exclude"]'));
};

LineItemPage.prototype.setTargetInclude = function(element) {
    this.waitUntilVisible(element);
    this.click(element);
    return this.click(By.xpath('//div/ul/li/a/span'));
};

LineItemPage.prototype.setLocationTargetInclude = function() {
    this.waitUntilVisible(BUTTON_LOCATION_TARGET);
    this.click(BUTTON_LOCATION_TARGET);
    return this.click(By.xpath('//div/ul/li/a/span'));
};

LineItemPage.prototype.setWhitelistTargetInclude = function() {
    this.waitUntilVisible(BUTTON_WHITELIST);
    this.click(BUTTON_WHITELIST);
    return this.click(By.xpath('//div/ul/li/a/span'));
};

LineItemPage.prototype.setAgeTargetInclude = function() {
    this.waitUntilVisible(DROP_AGE_TARG);
    this.click(DROP_AGE_TARG);
    return this.click(By.xpath('//div/ul/li/a/span'));
};

LineItemPage.prototype.setGenderTargetInclude = function() {
    this.waitUntilVisible(DROP_GENDER_TARG);
    this.click(DROP_GENDER_TARG);
    return this.click(By.xpath('//div/ul/li/a/span'));
};

LineItemPage.prototype.setDeviceTargetInclude = function() {
    this.waitUntilVisible(DROP_DEVICE_TARG);
    this.click(DROP_DEVICE_TARG);
    return this.click(By.xpath('//div/ul/li/a/span'));
};

LineItemPage.prototype.setBrowserTargetInclude = function() {
    this.waitUntilVisible(DROP_BROWSER_TARG);
    this.click(DROP_BROWSER_TARG);
    return this.click(By.xpath('//div/ul/li/a/span'));
};

LineItemPage.prototype.setCategoryTargetInclude = function() {
    this.waitUntilVisible(DROP_CATEG_TARG);
    this.click(DROP_CATEG_TARG);
    return this.click(By.xpath('//div/ul/li/a/span'));
};

LineItemPage.prototype.setDayTimeTargetInclude = function() {
    this.waitUntilVisible(DROP_DAY_TIME_TARG);
    this.click(DROP_DAY_TIME_TARG);
    return this.click(By.xpath('//div/ul/li/a/span'));
};

LineItemPage.prototype.setDeviceMakerTargetInclude = function() {
    this.waitUntilVisible(DROP_DEVICE_MAKER_TARG);
    this.click(DROP_DEVICE_MAKER_TARG);
    return this.click(By.xpath('//div/ul/li/a/span'));
};

LineItemPage.prototype.setIspTargetInclude = function() {
    this.waitUntilVisible(DROP_ISP_TARG);
    this.click(DROP_ISP_TARG);
    return this.click(By.xpath('//div/ul/li/a/span'));
};

LineItemPage.prototype.setOsTargetInclude = function() {
    this.waitUntilVisible(DROP_OS_TARG);
    this.click(DROP_OS_TARG);
    return this.click(By.xpath('//div/ul/li/a/span'));
};

LineItemPage.prototype.setThirdPartyTarget = function(element) {
    this.waitUntilVisible(INPUT_THIRD_PARTY);
    this.sendKeys(INPUT_THIRD_PARTY, element);
    return this.getSearchedElement().click();
};

LineItemPage.prototype.setInputSearchThirdPartyTarget = function(element) {
    this.waitUntilVisible(INPUT_SEARCH_THIRD);
    this.sendKeys(INPUT_SEARCH_THIRD, element);
    return this.getSearchedElement().click();
};

LineItemPage.prototype.setInputSearchLocations = function(element) {
    this.waitUntilVisible(INPUT_SEARCH_LOCATIONS);
    this.clear(INPUT_SEARCH_LOCATIONS);
    this.sendKeys(INPUT_SEARCH_LOCATIONS, element);
    this.waitAndClick(INPUT_SEARCH_LOCATIONS);
    return this;
};

LineItemPage.prototype.setInputSearchCountry = function(element) {
    this.waitUntilVisible(INPUT_SEARCH_COUNTRY);
    this.click(INPUT_SEARCH_COUNTRY);
    this.clear(INPUT_SEARCH_COUNTRY);
    this.sendKeys(INPUT_SEARCH_COUNTRY, element);
    this.click(INPUT_SEARCH_COUNTRY);
    this.sendKeys(INPUT_SEARCH_COUNTRY, key.BACK_SPACE);
    return this;
};

LineItemPage.prototype.setTextPostalCodes = function(element) {
    return this.sendKeys(TEXT_POSTAL_CODES, element);
};

LineItemPage.prototype.setInputFile = function(element) {
    this.sendKeys(INPUT_FILE, element);
    return this.driver.sleep(oneSecTO);
};

LineItemPage.prototype.setTextAddedAdClick = function(element) {
    return this.sendKeys(TEXT_ADDED_CLICK, element);
};

LineItemPage.prototype.setTextAddedAdTracking = function(element) {
    return this.sendKeys(TEXT_ADDED_TRACKING, element);
};

LineItemPage.prototype.setInputAdName = function(element) {
    this.waitUntilVisible(INPUT_AD_NAME);
    return this.sendKeys(INPUT_AD_NAME, element);
};

LineItemPage.prototype.setInputAddedAdName = function(element) {
    this.waitUntilVisible(INPUT_ADDED_AD_NAME);
    this.clear(INPUT_ADDED_AD_NAME);
    return this.sendKeys(INPUT_ADDED_AD_NAME, element);
};

LineItemPage.prototype.setInputSourceUrl = function(element) {
    this.waitUntilVisible(INPUT_SOURCE_URL);
    return this.sendKeys(INPUT_SOURCE_URL, element);
};

LineItemPage.prototype.setInputClickUrl = function(element) {
    this.waitUntilVisible(INPUT_CLICK_URL);
    return this.sendKeys(INPUT_CLICK_URL, element);
};

LineItemPage.prototype.setInputThirdPartyTracker = function(element) {
    this.waitUntilVisible(INPUT_THIRD_PARTY);
    return this.sendKeys(INPUT_THIRD_PARTY, element);
};

LineItemPage.prototype.setParentCampaign = function(value) {
    this.waitUntilVisible(INPUT_PARENT_CAMPAIGN);
    this.getInputParentCampaign().click();
    this.clear(INPUT_PARENT_CAMPAIGN);
    this.sendKeys(INPUT_PARENT_CAMPAIGN, value);
    this.driver.sleep(driverTimeOut);
    this.click(SEARCH_ELEMENT);
    // this.sendKeys(INPUT_PARENT_CAMPAIGN, key.ENTER);
    return this.driver.sleep(driverTimeOut);
    // return this.waitUntilNotVisible(LOADER);
};

LineItemPage.prototype.setParentCampaignInvalid = function(value) {
    this.waitUntilVisible(INPUT_PARENT_CAMPAIGN);
    this.getInputParentCampaign().click();
    this.clear(INPUT_PARENT_CAMPAIGN);
    return this.sendKeys(INPUT_PARENT_CAMPAIGN, value);
};

LineItemPage.prototype.getInputName = function() {
    return this.findElement(INPUT_NAME);
};
LineItemPage.prototype.getInputBudget = function() {
    return this.findElement(INPUT_BUDGET);
};
LineItemPage.prototype.getInputStartDate = function() {
    return this.findElement(INPUT_START_DATE);
};
LineItemPage.prototype.getInputEndDate = function() {
    return this.findElement(INPUT_END_DATE);
};
LineItemPage.prototype.getInputLabel = function() {
    return this.findElement(INPUT_LABEL);
};
LineItemPage.prototype.getInputLiveAudienceTarget = function() {
    return this.findElement(INPUT_LIVE_AUDIENCE);
};
LineItemPage.prototype.getInputLiveAudienceExclude = function() {
    return this.getLastElement(INPUT_LIVE_AUDIENCE);
};
LineItemPage.prototype.getInputLocation = function() {
    return this.findElement(INPUT_LOCATION);
};
LineItemPage.prototype.getInputBrowsers = function() {
    return this.findElement(INPUT_BROWSERS);
};
LineItemPage.prototype.getInputBundles = function() {
    return this.findElement(INPUT_BUNDLES);
};
LineItemPage.prototype.getInputCategories = function() {
    return this.findElement(INPUT_CATEGORIES);
};
LineItemPage.prototype.getInputDeviceMakers = function() {
    return this.findElement(INPUT_DEVICE);
};
LineItemPage.prototype.getInputIsp = function() {
    return this.findElement(INPUT_ISP);
};
LineItemPage.prototype.getInputOs = function() {
    return this.findElement(INPUT_OS);
};
LineItemPage.prototype.getInputPlacementId = function() {
    return this.findElement(INPUT_PLACEMENT_ID);
};
LineItemPage.prototype.getInputListId = function() {
    return this.findElement(INPUT_LIST_ID);
};
LineItemPage.prototype.getInputKeyValuePairs = function() {
    return this.findElement(INPUT_KVP);
};
LineItemPage.prototype.getInputThirdPartyTargeting = function() {
    return this.findElement(INPUT_THIRD_PARTY);
};
LineItemPage.prototype.getInputSearchWhitelist = function() {
    return this.findElement(INPUT_SEARCH_WHITELIST);
};
LineItemPage.prototype.getInputAdName = function() {
    this.waitUntilVisible(INPUT_AD_NAME);
    return this.findElement(INPUT_AD_NAME);
};
LineItemPage.prototype.getInputSourceUrl = function() {
    return this.findElement(INPUT_SOURCE_URL);
};
LineItemPage.prototype.getInputClickUrl = function() {
    return this.findElement(INPUT_CLICK_URL);
};
LineItemPage.prototype.getInputThirdPartyTracker = function() {
    return this.findElement(INPUT_TRACKER1);
};
LineItemPage.prototype.getInputSecondaryTracker = function() {
    return this.findElement(INPUT_TRACKER2);
};
LineItemPage.prototype.getInputSearchExistingAds = function() {
    this.waitUntilVisible(INPUT_SEARCH_ADS);
    return this.findElement(INPUT_SEARCH_ADS);
};
LineItemPage.prototype.getInputSearchLocations = function() {
    return this.findElement(INPUT_SEARCH_LOCATIONS);
};
LineItemPage.prototype.getInputSearchCountry = function() {
    return this.findElement(INPUT_SEARCH_COUNTRY);
};
LineItemPage.prototype.getInputAddedAdName = function() {
    this.waitUntilVisible(INPUT_ADDED_AD_NAME);
    return this.findElement(INPUT_ADDED_AD_NAME);
};
LineItemPage.prototype.getInputDailyCap = function() {
    this.waitUntilVisible(INPUT_DAILY_CAP);
    return this.findElement(INPUT_DAILY_CAP);
};
LineItemPage.prototype.getInputKvpTextarea = function() {
    this.waitUntilVisible(INPUT_KVP_TEXTAREA);
    return this.findElement(INPUT_KVP_TEXTAREA);
};
LineItemPage.prototype.getInputFile = function() {
    this.waitUntilVisible(INPUT_FILE);
    return this.findElement(INPUT_FILE);
};

// get Texts
LineItemPage.prototype.getTextTagExistingAd = function() {
    this.waitUntilVisible(TEXT_TAG_EXISTING_AD);
    return this.findElement(TEXT_TAG_EXISTING_AD);
};
LineItemPage.prototype.getTextSelectedAd = function(text) {
    return this.getSpan(text);
};
LineItemPage.prototype.getTextSelectedLocation = function() {
    return this.findElement(TEXT_SELECTED_LOCATOIN);
};
LineItemPage.prototype.getTextSelectedListId = function() {
    this.waitUntilVisible(TEXT_SELECTED_LIST_ID);
    return this.findElement(TEXT_SELECTED_LIST_ID);
};
LineItemPage.prototype.getTextLocationsCount = function() {
    return this.findElement(TEXT_LOCATION_COUNT);
};
LineItemPage.prototype.getTextPostalCodes = function() {
    return this.findElement(TEXT_POSTAL_CODES);
};
LineItemPage.prototype.getTextLocationsList = function() {
    return this.findElement(TEXT_LOCATION_LIST);
};
LineItemPage.prototype.getTextAddedAdSource = function() {
    this.waitUntilVisible(TEXT_ADDED_SOURCE);
    return this.findElement(TEXT_ADDED_SOURCE);
};
LineItemPage.prototype.getTextAddedAdClick = function() {
    this.waitUntilVisible(TEXT_ADDED_CLICK);
    return this.findElement(TEXT_ADDED_CLICK);
};
LineItemPage.prototype.getTextAddedAdTracking = function() {
    this.waitUntilVisible(TEXT_ADDED_TRACKING);
    return this.findElement(TEXT_ADDED_TRACKING);
};
LineItemPage.prototype.getInputParentCampaign = function() {
    return this.findElement(INPUT_PARENT_CAMPAIGN);
};
LineItemPage.prototype.getTextParentCampaign = function() {
    this.waitUntilVisible(TEXT_PARENT_CAMPAIGN);
    return this.findElement(TEXT_PARENT_CAMPAIGN);
};
LineItemPage.prototype.getTextParentCampaignOnClone = function() {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(TEXT_PARENT_CAMPAIGN_CLONE);
    return this.findElement(TEXT_PARENT_CAMPAIGN_CLONE);
};
LineItemPage.prototype.getTextDailyCap = function() {
    this.waitUntilVisible(TEXT_DAILY_CAP);
    return this.findElement(TEXT_DAILY_CAP);
};
LineItemPage.prototype.getTextErrorDailyCap = function() {
    this.waitUntilVisible(TEXT_ERROR_DAILY_CAP);
    return this.findElement(TEXT_ERROR_DAILY_CAP);
};

LineItemPage.prototype.getTextAlertCopy = function() {
    this.waitToLocateNoFail(TEXT_ALERT_COPY);
    return this.findElement(TEXT_ALERT_COPY);
};

LineItemPage.prototype.getTextPacing = function() {
    this.waitUntilVisible(TEXT_PACING);
    return this.findElement(TEXT_PACING);
};

// click buttons
LineItemPage.prototype.clickCancel = function() {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(BUTTON_CANCEL);
    return this.click(BUTTON_CANCEL);
};

LineItemPage.prototype.clickReview = function() {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(BUTTON_REVIEW);
    this.click(BUTTON_REVIEW);
    return this.waitUntilVisible(REVIEW_HEADER);
};

LineItemPage.prototype.clickStartBuildingAds = function() {
    this.waitUntilVisible(BUTTON_NEW_AD);
    return this.click(BUTTON_NEW_AD);
};
LineItemPage.prototype.clickCancelAdBuilder = function() {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(BUTTON_CANCEL_AD);
    this.click(BUTTON_CANCEL_AD);
    // this.waitUntilNotVisible(LOADER);
    return this.driver.sleep(5000);
};
LineItemPage.prototype.clickLinkDailyCap = function() {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(LINK_DAILY_CAP);
    this.click(LINK_DAILY_CAP);
    return this.waitUntilVisible(INPUT_DAILY_CAP);
};
LineItemPage.prototype.clickDeleteDailyCap = function() {
    this.waitAndClick(INPUT_DAILY_CAP);
    return this.waitAndClick(BUTTON_DELETE_DAILY_CAP);
};

LineItemPage.prototype.clickFirstLiveAudienceTarget = function() {
    this.getInputLiveAudienceTarget().click();
    return this.waitAndClick(DROPDOWN_AUDIENCE);
};

LineItemPage.prototype.clickFirstLiveAudienceExclude = function() {
    this.clickLastElement(INPUT_LIVE_AUDIENCE);
    return this.waitAndClick(DROPDOWN_AUDIENCE);
};

// get buttons
LineItemPage.prototype.getButtonCancel = function() {
    return this.findElement(BUTTON_CANCEL);
};

LineItemPage.prototype.getButtonReview = function() {
    return this.findElement(BUTTON_REVIEW);
};

LineItemPage.prototype.getButtonStatus = function() {
    return this.findElement(BUTTON_STATUS);
};

LineItemPage.prototype.getButtonStartBuildingAds = function() {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(BUTTON_NEW_AD);
    return this.findElement(BUTTON_NEW_AD);
};

LineItemPage.prototype.getButtonDeleteLabel = function() {
    return this.findElement(BUTTON_DELETE_LABEL);
};

LineItemPage.prototype.getButtonDeleteAdvancedTargeting = function() {
    return this.findElement(BUTTON_DELETE_ADV_TARG);
};
LineItemPage.prototype.getButtonDeleteThirdPartyTargeting = function() {
    return this.findElement(BUTTON_DELETE_THIRD_PARTY);
};
LineItemPage.prototype.getButtonCancelAdBuilder = function() {
    this.waitUntilVisible(BUTTON_CANCEL_AD);
    return this.findElement(BUTTON_CANCEL_AD);
};
LineItemPage.prototype.getButtonCloseAdBuilder = function() {
    return this.findElement(BUTTON_CLOSE_AD);
};
LineItemPage.prototype.getButtonWhitelist = function() {
    return this.findElement(BUTTON_WHITELIST);
};
LineItemPage.prototype.getButtonDeleteWhitelist = function() {
    return this.findElement(BUTTON_DELETE_WHITELIST);
};
LineItemPage.prototype.getButtonIds = function() {
    return this.findElement(BUTTON_IDS);
};
LineItemPage.prototype.getButtonAddIds = function() {
    return this.findElement(BUTTON_ADD_IDS);
};
LineItemPage.prototype.getButtonAddToLineItem = function() {
    return this.findElement(BUTTON_ADD_TO_LINE_ITEM);
};
LineItemPage.prototype.getButtonAddThirdPartyAd = function() {
    return this.findElement(BUTTON_ADD_THIRD_PARTY_AD);
};
LineItemPage.prototype.getButtonSearchExistingAd = function() {
    return this.findElement(BUTTON_SEARCH_EXISTING_AD);
};
LineItemPage.prototype.getButtonAddPostalCodes = function() {
    return this.findElement(BUTTON_ADD_POSTAL_CODES);
};
LineItemPage.prototype.getButtonLocationTarget = function() {
    this.waitUntilVisible(BUTTON_LOCATION_TARGET);
    return this.findElement(BUTTON_LOCATION_TARGET);
};
LineItemPage.prototype.getButtonDeleteLocation = function() {
    return this.findElement(BUTTON_DELETE_LOCATION);
};
LineItemPage.prototype.clickDeleteLocation = function(value) {
    this.findElement(By.xpath('//li[contains(.,"' + value + '")]' +
        '/div/div/div[3]/span'));
    this.click(By.xpath('//li[contains(.,"' + value + '")]' +
        '/div/div/div[3]/span'));
};
LineItemPage.prototype.getButtonAddAd = function() {
    return this.findElement(BUTTON_ADD_AD);
};
LineItemPage.prototype.getButtonDeleteParentCampaign = function() {
    return this.findElement(BUTTON_DELETE_PARENT_CAMP);
};
LineItemPage.prototype.getButtonDeleteDailyCap = function() {
    return this.findElement(BUTTON_DELETE_DAILY_CAP);
};
LineItemPage.prototype.getButtonPacing = function() {
    return this.findElement(BUTTON_PACING);
};
LineItemPage.prototype.getButtonAddParameters = function() {
    this.waitUntilVisible(BUTTON_ADD_PARAMETERS);
    return this.findElement(BUTTON_ADD_PARAMETERS);
};
LineItemPage.prototype.getButtonKvpTarget = function() {
    this.waitUntilVisible(BUTTON_KVP_TARGET);
    return this.findElement(BUTTON_KVP_TARGET);
};
LineItemPage.prototype.getButtonKvpOperator = function() {
    this.waitUntilVisible(BUTTON_KVP_OPERATOR);
    return this.findElement(BUTTON_KVP_OPERATOR);
};
LineItemPage.prototype.getButtonUploadNewTag = function() {
    this.waitUntilVisible(BUTTON_UPLOAD_NEW_TAG);
    return this.findElement(BUTTON_UPLOAD_NEW_TAG);
};

LineItemPage.prototype.getTextUseAllBudget = function() {
    return this.findElement(TEXT_USE_BUDGET);
};

LineItemPage.prototype.getLinkLabel = function() {
    return this.findElement(LINK_LABEL);
};

LineItemPage.prototype.getLinkUseAllBudget = function() {
    return this.findElement(LINK_USE_BUDGET);
};

LineItemPage.prototype.getLinkUseCampaignDates = function() {
    return this.findElement(LINK_USE_DATES);
};

LineItemPage.prototype.getLinkLiveRampTargeting = function() {
    return this.findElement(LINK_LIVE_RAMP);
};

LineItemPage.prototype.getLinkAdvancedTargeting = function() {
    this.waitUntilVisible(LINK_ADV_TARG);
    return this.findElement(LINK_ADV_TARG);
};

LineItemPage.prototype.getChooseThirdPartyDataSegment = function() {
    return this.findElement(CHOOSE_THIRD_PARTY_DS);
};
LineItemPage.prototype.getLinkSecondaryThirdParty = function() {
    return this.findElement(LINK_SECOND_PARTY);
};
LineItemPage.prototype.getLinkTestSourceUrl = function() {
    return this.findElement(LINK_TEST_SOURCE);
};
LineItemPage.prototype.getLinkTestClickUrl = function() {
    return this.findElement(LINK_TEST_CLICK);
};
LineItemPage.prototype.getLinkDeleteAd = function() {
    return this.findElement(LINK_DELETE_AD);
};
LineItemPage.prototype.getLinkAd = function() {
    return this.findElement(LINK_AD);
};
LineItemPage.prototype.getLinkDailyCap = function() {
    this.waitUntilVisible(LINK_DAILY_CAP);
    return this.findElement(LINK_DAILY_CAP);
};
LineItemPage.prototype.getAdBuilder = function() {
    this.waitUntilVisible(AD_BUILDER);
    return this.findElement(AD_BUILDER);
};
LineItemPage.prototype.getSpanAdvancedTargeting = function() {
    this.waitUntilVisible(SPAN_ADV_TARGETING);
    return this.findElement(SPAN_ADV_TARGETING);
};
LineItemPage.prototype.getTextInputIds = function() {
    return this.findElement(TEXT_INPUT_IDS);
};
LineItemPage.prototype.getTextAddedWhitelist = function() {
    return this.findElement(TEXT_ADDED_WHITELIST);
};
LineItemPage.prototype.getTextNoLocations = function() {
    return this.findElement(TEXT_NO_LOCATION);
};
LineItemPage.prototype.getSpanSearch = function() {
    return this.findElement(SPAN_SEARCH);
};
LineItemPage.prototype.getSpanInputIds = function() {
    return this.findElement(SPAN_INPUT_IDS);
};
LineItemPage.prototype.getSpanAgeTarget = function() {
    return this.findElement(SPAN_AGE_TARG);
};
LineItemPage.prototype.getSpanAgeOption = function() {
    return this.findElement(SPAN_AGE_OP);
};
LineItemPage.prototype.getSpanGenderTarget = function() {
    return this.findElement(SPAN_GENDER_TARG);
};
LineItemPage.prototype.getSpanGenderOption = function() {
    return this.findElement(SPAN_GENDER_OP);
};
LineItemPage.prototype.getSpanDeviceTarget = function() {
    return this.findElement(SPAN_DEVICE_TARG);
};
LineItemPage.prototype.getSpanDeviceOption = function() {
    return this.findElement(SPAN_DEVICE_OP);
};
LineItemPage.prototype.getSpanBrowserTarget = function() {
    return this.findElement(SPAN_BROWSER_TARG);
};
LineItemPage.prototype.getSpanBrowserOption = function() {
    return this.findElement(SPAN_BROWSER_OP);
};
LineItemPage.prototype.getSpanBundleTarget = function() {
    return this.findElement(SPAN_BUNDLE_TARG);
};
LineItemPage.prototype.getSpanBundleOption = function() {
    return this.findElement(SPAN_BUNDLE_OP);
};
LineItemPage.prototype.getSpanCategoryTarget = function() {
    this.waitUntilVisible(SPAN_CATEG_TARG);
    return this.findElement(SPAN_CATEG_TARG);
};

LineItemPage.prototype.getSpanCategoryOption = function() {
    return this.findElement(SPAN_CATEG_OP);
};

LineItemPage.prototype.getSpanDayTimeTarget = function() {
    return this.findElement(SPAN_DAY_TIME_TARG);
};

LineItemPage.prototype.getSpanDayOption = function() {
    return this.findElement(SPAN_DAY_OP);
};

LineItemPage.prototype.getSpanTimeOption = function() {
    return this.findElement(SPAN_TIME_OP);
};

LineItemPage.prototype.getSpanDeviceMakerTarget = function() {
    return this.findElement(SPAN_DEVICE_MAKER_TARG);
};

LineItemPage.prototype.getSpanDeviceMakerOption = function() {
    return this.findElement(SPAN_DEVICE_MAKER_OP);
};

LineItemPage.prototype.getSpanIspTarget = function() {
    return this.findElement(SPAN_ISP_TARG);
};

LineItemPage.prototype.getSpanIspOption = function() {
    return this.findElement(SPAN_ISP_OP);
};

LineItemPage.prototype.getSpanOsTarget = function() {
    return this.findElement(SPAN_OS_TARG);
};

LineItemPage.prototype.getSpanOsOption = function() {
    return this.findElement(SPAN_OS_OP);
};

LineItemPage.prototype.getSpanWhitelistTarget = function() {
    return this.findElement(SPAN_WHITELIST_TARG);
};

LineItemPage.prototype.getSpanThirdPartyTarget = function() {
    return this.findElement(SPAN_THIRD_PARTY_TARG);
};

LineItemPage.prototype.getSpanThirdPartyOption = function() {
    return this.findElement(SPAN_THIRD_PARTY_OP);
};

LineItemPage.prototype.getSpanUploadImages = function() {
    return this.findElement(SPAN_UPLOAD_IMAGES);
};

LineItemPage.prototype.getSpanAddThirdPartyTags = function() {
    return this.findElement(SPAN_ADD_THIRD_AD);
};

LineItemPage.prototype.getSpanUseExistingAds = function() {
    this.waitUntilVisible(SPAN_USE_ADS);
    return this.findElement(SPAN_USE_ADS);
};

LineItemPage.prototype.getSpanLocationTarget = function() {
    return this.findElement(SPAN_LOCATION_TARG);
};

LineItemPage.prototype.getSpanEvenPacing = function() {
    this.waitUntilVisible(SPAN_EVEN);
    return this.findElement(SPAN_EVEN);
};

LineItemPage.prototype.getSpanASAPPacing = function() {
    this.waitUntilVisible(SPAN_ASAP);
    return this.findElement(SPAN_ASAP);
};

LineItemPage.prototype.getLinkClickToUpload = function() {
    return this.findElement(LINK_CLICK_UPLOAD);
};

LineItemPage.prototype.getLinkDeleteTag = function() {
    return this.findElement(LINK_DELETE_TAG);
};

LineItemPage.prototype.getLinkLocationClearAll = function() {
    return this.findElement(LINK_LOCATION_CLEAR);
};

LineItemPage.prototype.getLinkFirstAd = function() {
    return this.findElement(LINK_FIRST_AD);
};

LineItemPage.prototype.getLinkSecondAd = function() {
    return this.findElement(LINK_SECOND_AD);
};

LineItemPage.prototype.getLinkThirdAd = function() {
    return this.findElement(LINK_THIRD_AD);
};
LineItemPage.prototype.getLinkDownloadTemplate = function() {
    this.waitUntilVisible(LINK_DOWNLOAD_TEMPLATE);
    return this.findElement(LINK_DOWNLOAD_TEMPLATE);
};

// get dropdowns
LineItemPage.prototype.getDropdownLiveAudienceTarget = function() {
    this.getInputLiveAudienceTarget().click();
    return this.getElement(DROPDOWN_AUDIENCE);
};

LineItemPage.prototype.getDropdownLiveAudienceExclude = function() {
    this.clickLastElement(INPUT_LIVE_AUDIENCE);
    return this.getElement(DROPDOWN_AUDIENCE);
};

LineItemPage.prototype.getDropdownAgeTarget = function() {
    return this.findElement(DROP_AGE_TARG);
};

LineItemPage.prototype.getDropdownAge = function() {
    return this.findElement(DROP_AGE_OP);
};

LineItemPage.prototype.getDropdownGenderTarget = function() {
    return this.findElement(DROP_GENDER_TARG);
};

LineItemPage.prototype.getDropdownGender = function() {
    return this.findElement(DROP_GENDER_OP);
};

LineItemPage.prototype.getDropdownDeviceTarget = function() {
    return this.findElement(DROP_DEVICE_TARG);
};

LineItemPage.prototype.getDropdownDevice = function() {
    return this.findElement(DROP_DEVICE_OP);
};

LineItemPage.prototype.getDropdownAdvancedTargeting = function() {
    return this.findElement(DROP_ADV_TARG);
};

LineItemPage.prototype.getDropdownDayTimeTarget = function() {
    return this.findElement(DROP_DAY_TIME_TARG);
};

LineItemPage.prototype.getDropdownDay = function() {
    return this.findElement(DROP_DAY_OP);
};

LineItemPage.prototype.getDropdownTime = function() {
    return this.findElement(DROP_TIME_OP);
};

LineItemPage.prototype.getDropdownBrowserTarget = function() {
    return this.findElement(DROP_BROWSER_TARG);
};

LineItemPage.prototype.getDropdownBundleTarget = function() {
    return this.findElement(DROP_BUNDLE_TARG);
};

LineItemPage.prototype.getDropdownCategoryTarget = function() {
    return this.findElement(DROP_CATEG_TARG);
};

LineItemPage.prototype.getDropdownDeviceMakerTarget = function() {
    return this.findElement(DROP_DEVICE_MAKER_TARG);
};

LineItemPage.prototype.getDropdownIspTarget = function() {
    return this.findElement(DROP_ISP_TARG);
};

LineItemPage.prototype.getDropdownOsTarget = function() {
    return this.findElement(DROP_ISP_TARG);
};

LineItemPage.prototype.getDropdownThirdPartyTarget = function() {
    return this.findElement(DROP_THIRD_PARTY_TARG);
};

LineItemPage.prototype.getValidMacrosLink = function() {
    return this.findElement(VALID_MACRO_LINK);
};

// other
LineItemPage.prototype.getTextAdBuilderEmpty = function() {
    return this.findElement(TEXT_AD_BUILDER);
};
LineItemPage.prototype.getAdBuilderDisplayed = function() {
    this.waitUntilVisible(AD_BUILDER);
    return this.findElement(AD_BUILDER);
};
LineItemPage.prototype.getSpanStatus = function() {
    this.waitUntilVisible(SPAN_STATUS);
    return this.findElement(SPAN_STATUS);
};

LineItemPage.prototype.getSpanElement = function(value) {
    return this.findElement(By.
        xpath('//span[text() = "' + value + '"]'));
};

LineItemPage.prototype.getSearchedElement = function() {
    this.waitUntilVisible(SEARCH_ELEMENT);
    return this.findElement(SEARCH_ELEMENT);
};

LineItemPage.prototype.getExistingAdCheckbox = function() {
    return this.findElement(By.
        xpath('//async-table/div/div/div[2]/table/tbody/tr/td/label'));
};

LineItemPage.prototype.getExistingAdName = function(value) {
    return this.findElement(By
        .xpath('//span[@class="overflow" and text()="' + value + '"]'));
};

LineItemPage.prototype.getExistingAdId = function(value) {
    return this.findElement(By.xpath('//span[@class="copy--supporting"' +
        ' and contains(.,"' + value + '")]'));
};

LineItemPage.prototype.getExistingAdSize = function(value) {
    return this.findElement(By
        .xpath('//div[@class="supporting" and contains(.,"' + value + '")]'));
};

LineItemPage.prototype.getExistingAdSourceUrl = function(value) {
    return this.findElement(By
        .xpath('//a[text() = "' + value + '"]'));
};

LineItemPage.prototype.getExistingAdClickUrl = function(value) {
    return this.findElement(By
        .xpath('//a[text() = "' + value + '"]'));
};

LineItemPage.prototype.getExistingAdCreatedDate = function() {
    return this.findElement(
        By.xpath('//async-table/div/div/div[2]/table/tbody/tr/td[6]/span'));
};
LineItemPage.prototype.getExistingAdCreatedHour = function() {
    return this.findElement(
        By.xpath('//async-table/div/div/div[2]/table/tbody/tr/td[6]/div'));
};

LineItemPage.prototype.getSwitchLocation = function() {
    this.waitUntilVisible(SWITCH_LOCATION);
    return this.findElement(SWITCH_LOCATION);
};

LineItemPage.prototype.getCheckCountry = function() {
    this.waitUntilVisible(CHECK_COUNTRY);
    return this.findElement(CHECK_COUNTRY);
};

LineItemPage.prototype.getCheckPostalCodes = function() {
    this.waitUntilVisible(CHECK_POSTAL_CODES);
    return this.findElement(CHECK_POSTAL_CODES);
};

LineItemPage.prototype.getCountrySelection = function() {
    this.waitUntilVisible(COUNTRY_SELECTION);
    this.waitUntilStale(COUNTRY_SELECTION);
    return this.findElement(COUNTRY_SELECTION);
};

LineItemPage.prototype.clickLinkLabel = function() {
    this.waitUntilVisible(LINK_LABEL);
    return this.click(LINK_LABEL);
};

LineItemPage.prototype.clickButtonAddToLineItem = function() {
    this.click(BUTTON_ADD_TO_LINE_ITEM);
    return this.waitUntilVisible(BUTTON_REVIEW);
};

LineItemPage.prototype.clickButtonStartBuildingAds = function() {
    this.waitUntilVisible(BUTTON_NEW_AD);
    this.click(BUTTON_NEW_AD);
    return this.waitUntilVisible(SPAN_USE_ADS);
};

LineItemPage.prototype.clickButtonAddAd = function() {
    this.waitUntilVisible(BUTTON_ADD_AD);
    this.click(BUTTON_ADD_AD);
    this.driver.sleep(driverTimeOut);
    return this.waitUntilVisible(SPAN_ADD_THIRD_AD);
};

LineItemPage.prototype.clickButtonPacing = function() {
    this.waitUntilVisible(BUTTON_PACING);
    this.click(BUTTON_PACING);
    return this.waitUntilVisible(SPAN_ASAP);
};

LineItemPage.prototype.clickButtonAddParameters = function() {
    this.waitUntilVisible(BUTTON_ADD_PARAMETERS);
    return this.click(BUTTON_ADD_PARAMETERS);
};

LineItemPage.prototype.clickButtonKvpTarget = function() {
    this.waitUntilVisible(BUTTON_KVP_TARGET);
    return this.click(BUTTON_KVP_TARGET);
};

LineItemPage.prototype.clickButtonKvpOperator = function() {
    this.waitUntilVisible(BUTTON_KVP_OPERATOR);
    return this.click(BUTTON_KVP_OPERATOR);
};

LineItemPage.prototype.clickAddPostalCodes = function() {
    this.waitUntilVisible(BUTTON_ADD_POSTAL_CODES);
    return this.click(BUTTON_ADD_POSTAL_CODES);
};

LineItemPage.prototype.clickInputKeyValuePairs = function() {
    this.waitUntilVisible(INPUT_KVP_TEXTAREA);
    return this.click(INPUT_KVP_TEXTAREA);
};

LineItemPage.prototype.clickSpanUseExistingAds = function() {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(SPAN_USE_ADS);
    this.click(SPAN_USE_ADS);
    return this.waitUntilVisible(INPUT_SEARCH_ADS);
};

LineItemPage.prototype.clickSpanBulkTagUploader = function() {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(SPAN_BULK_UPLOADER);
    this.click(SPAN_BULK_UPLOADER);
    return this.waitUntilVisible(LINK_DOWNLOAD_TEMPLATE);
};

LineItemPage.prototype.clickSpanAddThirdPartyTags = function() {
    this.waitUntilVisible(SPAN_ADD_THIRD_AD);
    this.click(SPAN_ADD_THIRD_AD);
    return this.waitUntilVisible(INPUT_AD_NAME);
};

LineItemPage.prototype.clickLinkUseAllBudget = function() {
    return this.click(LINK_USE_BUDGET);
};

LineItemPage.prototype.clickLinkUseCampaignDates = function() {
    return this.click(LINK_USE_DATES);
};

LineItemPage.prototype.clickLiveRampTargeting = function() {
    return this.click(LINK_LIVE_RAMP);
};

LineItemPage.prototype.clickLinkAdvancedTargeting = function() {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(LINK_ADV_TARG);
    return this.click(LINK_ADV_TARG);
};

LineItemPage.prototype.clickDropdownAdvancedTargeting = function() {
    this.waitUntilVisible(DROP_ADV_TARG);
    return this.click(DROP_ADV_TARG);
};


LineItemPage.prototype.clickAdvancedBrowser = function() {
    return this.click(CHECK_BROWSERS);
};

LineItemPage.prototype.clickAdvancedBundles = function() {
    return this.click(CHECK_BUNDLES);
};

LineItemPage.prototype.clickAdvancedCategory = function() {
    return this.click(CHECK_CATEG);
};

LineItemPage.prototype.clickAdvancedDayTime = function() {
    return this.click(CHECK_DAY);
};

LineItemPage.prototype.clickAdvancedDeviceMaker = function() {
    return this.click(CHECK_DEVICE);
};

LineItemPage.prototype.clickAdvancedDomain = function() {
    this.waitUntilVisible(CHECK_DOMAINS);
    return this.click(CHECK_DOMAINS);
};

LineItemPage.prototype.clickAdvancedIsp = function() {
    this.waitUntilVisible(CHECK_ISP);
    return this.click(CHECK_ISP);
};

LineItemPage.prototype.clickAdvancedOs = function() {
    this.waitUntilVisible(CHECK_OS);
    return this.clickLastElement(CHECK_OS);
};

LineItemPage.prototype.clickAdvancedPlacementId = function() {
    this.waitUntilVisible(CHECK_PLACEMENT_ID);
    return this.click(CHECK_PLACEMENT_ID);
};

LineItemPage.prototype.clickAdvancedListId = function() {
    this.waitUntilVisible(CHECK_LIST_ID);
    return this.click(CHECK_LIST_ID);
};

LineItemPage.prototype.clickAdvancedKeyValuePairs = function() {
    return this.click(CHECK_KEY_VALUE);
};

LineItemPage.prototype.clickAdvancedWhitelist = function() {
    this.waitUntilVisible(CHECK_WHITELIST);
    return this.click(CHECK_WHITELIST);
};

LineItemPage.prototype.clickAdvancedTargeting = function(value) {
    return this.click(By.xpath('//span[text() = "' + value + '"]'));
};

LineItemPage.prototype.clickChooseThirdPartyDataSegment = function() {
    return this.click(CHOOSE_THIRD_PARTY_DS);
};

LineItemPage.prototype.clickCheckSelectAll = function() {
    return this.click(CHECK_SELECT_ALL);
};

LineItemPage.prototype.clickLinkSecondAd = function() {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(LINK_SECOND_AD);
    return this.click(LINK_SECOND_AD);
};

LineItemPage.prototype.clickLinkThirdAd = function() {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(LINK_THIRD_AD);
    return this.click(LINK_THIRD_AD);
};

LineItemPage.prototype.clickSelectAdSlots = function() {
    this.driver.sleep(7000);
    this.waitUntilVisible(LINK_SELECT_AD_SLOTS);
    return this.click(LINK_SELECT_AD_SLOTS);
};

LineItemPage.prototype.clickSwitchLocation = function() {
    this.waitUntilVisible(SWITCH_LOCATION);
    return this.click(SWITCH_LOCATION);
};

LineItemPage.prototype.clickCountry = function() {
    this.waitUntilVisible(CHECK_COUNTRY);
    return this.click(CHECK_COUNTRY);
};

LineItemPage.prototype.clickPostalCode = function() {
    this.waitUntilVisible(CHECK_POSTAL_CODES);
    return this.click(CHECK_POSTAL_CODES);
};

LineItemPage.prototype.clickDeleteLocation = function() {
    this.waitUntilVisible(BUTTON_DELETE_LOCATION);
    return this.click(BUTTON_DELETE_LOCATION);
};

LineItemPage.prototype.clickSelectAdvancedTarget = function() {
    return this.waitAndClick(SELECT_ADV_TARGET);
};

LineItemPage.prototype.clickRemoveAdvancedTarget = function() {
    return this.waitAndClick(BUTTON_DELETE_ADV_TARG);
};

LineItemPage.prototype.clickCountrySelection = function() {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(COUNTRY_SELECTION);
    return this.click(COUNTRY_SELECTION);
};

// Selects

LineItemPage.prototype.selectAgeTargeting = function(value) {
    this.click(DROP_AGE_OP);
    this.click(By.xpath('//span[text() = "' + value + '"]'));
    return this.click(DROP_AGE_OP);
};

LineItemPage.prototype.selectGenderTargeting = function(value) {
    this.click(DROP_GENDER_OP);
    this.click(By.xpath('//span[text() = "' + value + '"]'));
    return this.click(DROP_GENDER_OP);
};

LineItemPage.prototype.selectDeviceTargeting = function(value) {
    this.click(DROP_DEVICE_OP);
    this.click(By.xpath('//span[text() = "' + value + '"]'));
    return this.click(DROP_DEVICE_OP);
};
LineItemPage.prototype.selectDayTargeting = function(value) {
    this.click(DROP_DAY_OP);
    this.click(By.xpath('//span[text() = "' + value + '"]'));
    return this.click(DROP_DAY_OP);
};
LineItemPage.prototype.selectTimeTargeting = function(value) {
    this.click(DROP_TIME_OP);
    this.click(By.xpath('//span[text() = "' + value + '"]'));
    return this.click(DROP_TIME_OP);
};

LineItemPage.prototype.selectAdvancedTargeting = function(value) {
    this.click(DROP_ADV_TARG);
    this.click(By.xpath('//span[text() = "' + value + '"]'));
    return this.click(DROP_ADV_TARG);
};

LineItemPage.prototype.selectExistingAd = function(liName) {
    return this.click(By.xpath('//table/tbody/tr[contains(.,"'
    + liName + '")]/td[1]/checkbox/div/label/input'));
};

LineItemPage.prototype.getElementDisplayed = function(element) {
    this.findElement(element)
        .then(null, function(err) {
            if (err.name === 'NoSuchElementError') {
                return false;
            }
            return true;
        });
};

LineItemPage.prototype.getCountryDisplayed = function() {
    return this.driver.wait(until.elementLocated(By.
        xpath('//a[text() = "Argentina"]')));
};

LineItemPage.prototype.scrollUp = function() {
    return this.driver.actions().sendKeys(webdriver.Key.PAGE_UP).perform();
};

LineItemPage.prototype.scrollDown = function() {
    return this.driver.actions().sendKeys(webdriver.Key.PAGE_DOWN).perform();
};

LineItemPage.prototype.getModalFooter = function() {
    return this.click(MODAL_FOOTER);
};

LineItemPage.prototype.getInformationText = function(info) {
    return this.findElement(
        By.
            xpath('//div[contains(@class,"copy--supporting") and ' +
            'contains(text(), "' + info + '")]'));
};

LineItemPage.prototype.getInputSearchCountryNotDisplayed = function() {
    return this.elementNotLocated(INPUT_SEARCH_COUNTRY);
};

module.exports = LineItemPage;
