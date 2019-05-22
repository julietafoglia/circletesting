'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;

const INPUT_NAME = By.name('name');
const INPUT_PRIMARY_DOMAIN = By.name('domain');
const INPUT_WHITELIST = By.xpath('//div[text() = "Search Publishers"]');
const INPUT_CATEGORY = By.css('searchable-select-single[name="category"]' +
     ' div input');
const INPUT_SEC_CATEG = By.css('tags-input[name="categories"]' +
            ' search-input div input');
const INPUT_LABEL = By.name('advertiserLabel');
const ACCOUNT_EXECUTIVE_INPUT = By.css(
    'input[placeholder="Search Account Executives"]');
const ACCOUNT_MANAGER_INPUT = By.css(
    'input[placeholder="Search Account Managers"]');
const ADVERTISER_FORM = By.css('advertiser-modal');
const BUTTON_CANCEL = By.xpath('//a[text() = "Cancel"]');
const BUTTON_SAVE = By.xpath('//button[text() = "Save and Exit"]');
const SAVE_ADV_BTN = By.xpath('//advertiser-modal//button[text() = ' +
    '"Save and Exit"]');

const LINK_SECOND_CAT = By.css('a[title="Secondary IAB Category"]');
const LINK_DOMAIN_BLOCK = By.css('a[title="Domain Blocklist"]');
const LINK_LIVERAMP = By.css('a[title="LiveRamp ID"]');
const LINK_LABEL = By.css('a[title="Advertiser Label"]');
const LINK_WHITELIST = By.xpath('//a[@title="Whitelist or Blacklist"]');

const CLOSE_LABEL_INPUT = By.css('div._form--group.extra-card-padding  button');

const TEXT_AGENCY = By.css('div:nth-child(10) > div._form--control >' +
    ' div > div');
const TEXT_ACCOUNT_MANAGER = By.css('searchable-select-single[name="manager"]');
const TEXT_ACCOUNT_MANAGER_EXTERNAL = By.xpath('//section-card[1]/div/div[2]/' +
    'div/div/section/div[6]/div[2]/div/div');
const CHECK_SUPRESS_ADS = By.xpath('//input[@name="suppressCompetitiveAds"]');

function AdvertiserPage(webdriver) {
    BasePage.call(this, webdriver);
}

AdvertiserPage.prototype = Object.create(BasePage.prototype);
AdvertiserPage.prototype.constructor = AdvertiserPage;


AdvertiserPage.prototype.setName = function(value) {
    this.waitUntilVisible(INPUT_NAME);
    this.clear(INPUT_NAME);
    this.sendKeys(INPUT_NAME, value);
    return this;
};

AdvertiserPage.prototype.getAdvertiserForm = function(){
    return this.getElement(ADVERTISER_FORM);
};

AdvertiserPage.prototype.setAdvertiserName = function(value) {
    let advName = this.getAdvertiserForm().findElement(INPUT_NAME);
    advName.clear();
    advName.sendKeys(value);
    return this;
};

AdvertiserPage.prototype.setPrimaryDomain = function(value) {
    this.waitUntilVisible(INPUT_PRIMARY_DOMAIN);
    this.clear(INPUT_PRIMARY_DOMAIN);
    this.sendKeys(INPUT_PRIMARY_DOMAIN, value);
    return this;
};

AdvertiserPage.prototype.setAdvertiserPrimaryDomain = function(value) {
    let advPDomain = this.getAdvertiserForm().findElement(INPUT_PRIMARY_DOMAIN);
    advPDomain.clear();
    advPDomain.sendKeys(value);
    return this;
};

AdvertiserPage.prototype.setWhitelist = function(value) {
    this.waitUntilVisible(INPUT_WHITELIST);
    this.clear(INPUT_WHITELIST);
    this.sendKeys(INPUT_WHITELIST, value);
    return this;
};

AdvertiserPage.prototype.setCategory = function(value) {
    this.waitUntilVisible(INPUT_CATEGORY);
    this.clear(INPUT_CATEGORY);
    this.sendKeys(INPUT_CATEGORY, value);
    return this.getSearchedElement().click();
};

AdvertiserPage.prototype.setAdvertiserCategory = function(value) {
    let advCat = this.getAdvertiserForm().findElement(INPUT_CATEGORY);
    advCat.clear();
    advCat.sendKeys(value);
    return this.getSearchedElement().click();
};

AdvertiserPage.prototype.setManager = function(value) {
    this.waitUntilVisible(ACCOUNT_MANAGER_INPUT);
    this.clear(ACCOUNT_MANAGER_INPUT);
    this.sendKeys(ACCOUNT_MANAGER_INPUT, value);
    return this.getSearchedElement().click();
};

AdvertiserPage.prototype.setAdvertiserManager = function(value) {
    let advMan = this.getAdvertiserForm().findElement(ACCOUNT_MANAGER_INPUT);
    advMan.clear();
    advMan.sendKeys(value);
    return this.getSearchedElement().click();
};

AdvertiserPage.prototype.setExecutive = function(value) {
    this.waitUntilVisible(ACCOUNT_EXECUTIVE_INPUT);
    this.clear(ACCOUNT_EXECUTIVE_INPUT);
    this.sendKeys(ACCOUNT_EXECUTIVE_INPUT, value);
    this.click(ACCOUNT_EXECUTIVE_INPUT);
    this.sendKeys(ACCOUNT_EXECUTIVE_INPUT, key.BACK_SPACE);
    this.click(ACCOUNT_EXECUTIVE_INPUT);
    return this.getSearchedElement().click();
};

AdvertiserPage.prototype.setAdvertiserExecutive = function(value) {
    let advExec = this.getAdvertiserForm().findElement(ACCOUNT_EXECUTIVE_INPUT);
    advExec.clear();
    advExec.sendKeys(value);
    advExec.click();
    advExec.sendKeys(key.BACK_SPACE);
    advExec.click();
    return this.getSearchedElement().click();
};

AdvertiserPage.prototype.setLabel = function(value) {
    this.waitUntilVisible(INPUT_LABEL);
    this.clear(INPUT_LABEL);
    this.sendKeys(INPUT_LABEL, value);
    return this;
};

AdvertiserPage.prototype.getInputName = function() {
    this.waitUntilVisible(INPUT_NAME);
    return this.findElement(INPUT_NAME);
};
AdvertiserPage.prototype.getInputPrimaryDomain = function() {
    return this.findElement(INPUT_PRIMARY_DOMAIN);
};
AdvertiserPage.prototype.getInputWhitelist = function() {
    return this.findElement(INPUT_WHITELIST);
};
AdvertiserPage.prototype.getInputCateg = function() {
    return this.findElement(INPUT_CATEGORY);
};
AdvertiserPage.prototype.getInputSecCateg = function() {
    return this.findElement(INPUT_SEC_CATEG);
};
AdvertiserPage.prototype.getInputLabel = function() {
    this.waitUntilVisible(INPUT_LABEL);
    return this.findElement(INPUT_LABEL);
};
AdvertiserPage.prototype.closeInputLabel = function() {
    this.waitUntilVisible(CLOSE_LABEL_INPUT);
    return this.findElement(CLOSE_LABEL_INPUT);
};
AdvertiserPage.prototype.getTextAgency = function() {
    return this.findElement(TEXT_AGENCY);
};
AdvertiserPage.prototype.getTextAccountManager = function() {
    return this.findElement(TEXT_ACCOUNT_MANAGER);
};
AdvertiserPage.prototype.getTextAccountManagerExternal = function() {
    return this.findElement(TEXT_ACCOUNT_MANAGER_EXTERNAL);
};
AdvertiserPage.prototype.getCheckSupressAds = function() {
    return this.findElement(CHECK_SUPRESS_ADS);
};

// click buttons
AdvertiserPage.prototype.clickCancel = function() {
    return this.click(BUTTON_CANCEL);
};

AdvertiserPage.prototype.clickSaveAndExit = function() {
    this.click(BUTTON_SAVE);
    return this.driver.sleep(3000);
};

AdvertiserPage.prototype.clickAdvertiserSaveAndExit = function() {
    this.waitAndClick(SAVE_ADV_BTN);
    return this.driver.sleep(3000);
};

// get buttons
AdvertiserPage.prototype.getButtonCancel = function() {
    return this.findElement(BUTTON_CANCEL);
};
AdvertiserPage.prototype.getButtonSaveAndExit = function() {
    return this.findElement(BUTTON_SAVE);
};
AdvertiserPage.prototype.getLinkSecCateg = function() {
    return this.findElement(LINK_SECOND_CAT);
};
AdvertiserPage.prototype.getLinkLabel = function() {
    this.waitUntilVisible(LINK_LABEL);
    return this.findElement(LINK_LABEL);
};
AdvertiserPage.prototype.getLinkDomainBlock = function() {
    return this.findElement(LINK_DOMAIN_BLOCK);
};
AdvertiserPage.prototype.getLinkLiveRamp = function() {
    return this.findElement(LINK_LIVERAMP);
};
AdvertiserPage.prototype.getLinkWhitelist = function() {
    return this.findElement(LINK_WHITELIST);
};
AdvertiserPage.prototype.getSearchedElement = function() {
    return this.findElement(By.css('a.search--item'));
};

module.exports = AdvertiserPage;
