'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');
const threeSecTO = 3000;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;

// inputs
const INPUT_SEARCH_ADS = By.css('input[placeholder="Search"]');
const TITLE_AD_LIBRARY = By.xpath('//h1[text() = "Ad Library"]');
const TITLE_IMAGE = By.xpath('//div[text() = "Create ads from uploaded' +
            ' images."]');
// buttons
const BUTTON_NEW_AD = By.xpath('//button[text() = "Create New Ad"]');
const LINK_AD_LIBRARY = By.xpath('//span[text() = "Ad Library"]');
const TABLE_AD_NAME = By.xpath('//th[text() = "Ad Name"]');
const TABLE_ADV_NAME = By.xpath('//th[text() = "Advertiser Name"]');
const TABLE_SIZE = By.xpath('//th[text() = "Size"]');
const TABLE_SOURCE = By.xpath('//th[text() = "Source URL"]');
const TABLE_CLICK = By.xpath('//th[text() = "Click URL"]');
const TABLE_MARQUEE = By.xpath('//span[text() = "Marquee"]');
const TABLE_CREATED = By.xpath('//th[text() = "Created"]');
const TABLE_NAME = By.xpath('//h5[text() = "Ad Name"]');
const LOADER = By.id('loading-spinner');
const LINK_UPDATE = By.xpath('//a[text() = "Edit"]');
const AD_DROPDOWN = By.xpath('//div/div/div/div/div[2]/div/div' +
    '/data-table/div/div/div[3]/div/div[1]/div/div[1]/div/div/div[2]/' +
        'span/select-dropdown/div/button/span[2]');
const ALL_ACCOUNT_DROPD = By.xpath('//span[text() = "All Accounts"]');
const SELECTED_ACCOUNT_DROPD = By.xpath('//span[text() = "Selected Accounts"]');
const SPINNER = By.css('.spinner');

function AdLibraryPage(webdriver) {
    BasePage.call(this, webdriver);
}

AdLibraryPage.prototype = Object.create(BasePage.prototype);
AdLibraryPage.prototype.constructor = AdLibraryPage;

AdLibraryPage.prototype.getTitleAdLibrary = function() {
    return this.findElement(TITLE_AD_LIBRARY);
};

AdLibraryPage.prototype.getInputSearchAds = function() {
    return this.findElement(INPUT_SEARCH_ADS);
};

AdLibraryPage.prototype.setInputSearchAds = function(value) {
    this.waitUntilVisible(INPUT_SEARCH_ADS);
    this.clear(INPUT_SEARCH_ADS);
    this.sendKeys(INPUT_SEARCH_ADS, value);
    this.sendKeys(INPUT_SEARCH_ADS, key.ENTER);
    return this.driver.sleep(threeSecTO);
};

AdLibraryPage.prototype.getLoader = function() {
    return this.waitUntilVisible(LOADER);
};

AdLibraryPage.prototype.getButtonNewAd = function() {
    return this.getElement(BUTTON_NEW_AD);
};

AdLibraryPage.prototype.getLinkAdLibrary = function() {
    return this.getElement(LINK_AD_LIBRARY);
};

AdLibraryPage.prototype.getTableAdName = function() {
    return this.getElement(TABLE_AD_NAME);
};

AdLibraryPage.prototype.getTableAdvName = function() {
    return this.getElement(TABLE_ADV_NAME);
};

AdLibraryPage.prototype.getTableSize = function() {
    return this.getElement(TABLE_SIZE);
};

AdLibraryPage.prototype.getTableSource = function() {
    return this.getElement(TABLE_SOURCE);
};

AdLibraryPage.prototype.getTableClick = function() {
    return this.getElement(TABLE_CLICK);
};

AdLibraryPage.prototype.getTableMarquee = function() {
    return this.getElement(TABLE_MARQUEE);
};

AdLibraryPage.prototype.getTableCreated = function() {
    return this.getElement(TABLE_CREATED);
};

AdLibraryPage.prototype.clickAdLibrary = function() {
    this.waitAndClick(LINK_AD_LIBRARY);
    return this.waitUntilVisible(BUTTON_NEW_AD);
};

AdLibraryPage.prototype.clickNewAd = function() {
    this.waitAndClick(BUTTON_NEW_AD);
    this.waitUntilVisible(TITLE_IMAGE);
    return this;
};

AdLibraryPage.prototype.clickAdName = function() {
    return this.waitAndClick(TABLE_NAME);
};

AdLibraryPage.prototype.clickAdNameLink = function(text) {
    this.setInputSearchAds(text);
    return this.clickLinkText(text);
};

AdLibraryPage.prototype.clickCreated = function() {
    this.driver.sleep(threeSecTO);
    this.waitUntilVisible(TABLE_CREATED);
    this.click(TABLE_CREATED);
    return this.click(TABLE_CREATED);
};

AdLibraryPage.prototype.clickCreatedNotRecent = function() {
    this.driver.sleep(threeSecTO);
    this.waitUntilVisible(TABLE_CREATED);
    return this.click(TABLE_CREATED);
};

AdLibraryPage.prototype.clickTableName = function() {
    this.driver.sleep(threeSecTO);
    this.waitUntilVisible(TABLE_NAME);
    this.click(TABLE_NAME);
    return this.click(TABLE_NAME);
};

AdLibraryPage.prototype.clickEditAd = function(name) {
    this.waitUntilVisible(By.xpath('//a[text()="' + name + '"]'));
    this.elementHover(By.xpath('//a[text()="' + name + '"]'));
    this.waitUntilVisible(LINK_UPDATE);
    return this.click(LINK_UPDATE);
};

AdLibraryPage.prototype.clickEditLink = function() {
    return this.waitAndClick(LINK_UPDATE);
};

AdLibraryPage.prototype.clickSelectedAccounts = function() {
    return this.waitAndClick(SELECTED_ACCOUNT_DROPD);
};

AdLibraryPage.prototype.clickAllAccounts = function() {
    return this.waitAndClick(ALL_ACCOUNT_DROPD);
};

AdLibraryPage.prototype.clickAd = function(value) {
    let actions = this.driver.actions();
    actions
        .mouseMove(this.getAdName(value))
        .click(this.getAdName(value))
        .perform();
    this.waitUntilVisible(AD_DROPDOWN);
    this.click(AD_DROPDOWN);
    this.waitUntilVisible(LINK_UPDATE);
    this.click(LINK_UPDATE);
    return this.driver.sleep(threeSecTO);
};

AdLibraryPage.prototype.waitUntilSpinnerDissapear = function() {
    return this.waitUntilStale(SPINNER);
};

AdLibraryPage.prototype.getResult = function(name) {
    return this.getElement(
        By.xpath('//span[@class="overflow" and text()="' + name + '"]'));
};

AdLibraryPage.prototype.getAdName = function(name) {
    return this.getElement(
        By.xpath('//div[@class="ellipsis" and text()="' + name + '"]'));
};

AdLibraryPage.prototype.getAdId = function(id) {
    return this.getElement(
        By.xpath('//span[@class="copy--supporting" ' +
            'and contains(.,"' + id + '")]'));
};

AdLibraryPage.prototype.getAdvName = function(name) {
    return this.getElement(
        By.xpath('//a[@class="overflow" and text()="' + name + '"]'));
};

AdLibraryPage.prototype.getAdvId = function(id) {
    return this.getElement(
        By.xpath('//div[@class="copy--supporting" and' +
            ' contains(.,"' + id + '")]'));
};

AdLibraryPage.prototype.getAdSize = function(size) {
    return this.getElement(
        By.xpath('//div[@class="supporting" and text()="' + size + '"]'));
};

AdLibraryPage.prototype.getAdSourceUrl = function(source) {
    return this.getElement(
        By.xpath('//a[contains(.,"' + source + '")]'));
};

AdLibraryPage.prototype.getAdClickUrl = function(click) {
    return this.getElement(
        By.xpath('//a[text()="' + click + '"]'));
};

AdLibraryPage.prototype.getAdCreatedDate = function() {
    return this.getElement(
        By.xpath('//div[@class="cell cell--height cell--noflex' +
            ' cell--date"]/span'));
};

AdLibraryPage.prototype.getAdCreatedHour = function() {
    return this.getElement(
        By.xpath('//div[@class="cell cell--height cell--noflex' +
            ' cell--date"]/span[2]'));
};

AdLibraryPage.prototype.getAdTitle = function(text) {
    return this.getElement(By.xpath('//h1[text()= "' + text + '"]'));
};

module.exports = AdLibraryPage;
