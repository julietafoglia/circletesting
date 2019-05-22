'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;
const specialTimeOut = 20000;
const twoSecondsTO = 2000;

// elements
const TITLE = By.xpath('//h3[text()="Basic Details"]');
const TITLE_SECTION = By.xpath('//h3[text()="Fees"]');
const EDIT_TITLE = By.xpath('//h4[text()="Edit Account"]');
const ACCOUNT_TYPE = By.xpath('//div[text()="Agency"]');
const ACCOUNT_NAME_INPUT = By.name('name');
const SELF_SERVICE_CHECKBOX = By.xpath('//span[text()="Self Service"] ');
const ACCOUNT_MANAGER_INPUT = By.css(
    'input[placeholder="Select Account Manager"]');
const ACCOUNT_MNG_CONTENT = By.xpath('//div[contains(@class,' +
    '"input-field--cover")]/span[2]');
const SEARCH_ITEM = By.css('a.search--item');
const SALESFORCE_ID_INPUT = By.name('salesforceId');
const ACCOUNT_ACTIVATION_SLIDER = By.css('div .slider');
const PLATFORM_AD_FEE_INPUT = By.name('dspFee');
const RTB_DEMAND_DROPDOWN = By.css('select-dropdown[name="demand"]' +
    ' div button span');
const SAVE_BTN = By.css('button[class="button--primary pull-right"]');
const OOPS_REQUIRED_FIELD = By.css('div.copy--error-text');
const SPAN_CONTAINS = (text) => By.xpath(`//span[contains(text(),"${text}")]`);
const SPINNER = By.css('.spinner');

function AgencyFormPage(webdriver) {
    BasePage.call(this, webdriver);
}

AgencyFormPage.prototype = Object.create(BasePage.prototype);
AgencyFormPage.prototype.constructor = AgencyFormPage;

AgencyFormPage.prototype.getTitle = function(){
    return this.getElement(TITLE);
};

AgencyFormPage.prototype.getAccountType = function(){
    return this.getElement(ACCOUNT_TYPE);
};

AgencyFormPage.prototype.getAccountNameInput = function(){
    return this.getElement(ACCOUNT_NAME_INPUT);
};

AgencyFormPage.prototype.getSelfServiceCheckbox = function(){
    return this.getElement(SELF_SERVICE_CHECKBOX);
};

AgencyFormPage.prototype.getAccountManagerInput = function(){
    return this.getElement(ACCOUNT_MANAGER_INPUT);
};

AgencyFormPage.prototype.getAccountManagerContent = function() {
    return this.getElement(ACCOUNT_MNG_CONTENT);
};

AgencyFormPage.prototype.getDropDownOptions = function() {
    this.waitUntilVisibleTimed(SEARCH_ITEM, specialTimeOut);
    return this.findElement(SEARCH_ITEM);
};

AgencyFormPage.prototype.getSalesforceIdInput = function(){
    return this.getElement(SALESFORCE_ID_INPUT);
};

AgencyFormPage.prototype.getSalesforceIdContent = function() {
    return this.getContentNGModel(SALESFORCE_ID_INPUT);
};

AgencyFormPage.prototype.getAccountActivationSlider = function(){
    return this.getElement(ACCOUNT_ACTIVATION_SLIDER);
};

AgencyFormPage.prototype.getTitleSection = function(){
    return this.getElement(TITLE_SECTION);
};

AgencyFormPage.prototype.getPlatformAdFeeInput = function(){
    return this.getElement(PLATFORM_AD_FEE_INPUT);
};

AgencyFormPage.prototype.getPlatformAdFeeContent = function() {
    return this.getContentNGModel(PLATFORM_AD_FEE_INPUT);
};

AgencyFormPage.prototype.noRTBDemandDropdown = function(){
    return this.elementNotLocated(RTB_DEMAND_DROPDOWN);
};

AgencyFormPage.prototype.getSaveButton = function() {
    return this.getElement(SAVE_BTN);
};

AgencyFormPage.prototype.waitUntilSaveButtonEnabled = function(){
    return this.waitUntilEnabled(SAVE_BTN);
};

AgencyFormPage.prototype.waitUntilSaveButtonDisabled = function(){
    return this.waitUntilDisabled(SAVE_BTN);
};

AgencyFormPage.prototype.getOopsRequiredFieldMessage = function() {
    return this.getElement(OOPS_REQUIRED_FIELD);
};

AgencyFormPage.prototype.waitUntilSpinnerDissapear = function() {
    return this.waitUntilStale(SPINNER);
};

AgencyFormPage.prototype.getEditTitle = function() {
    return this.getElement(EDIT_TITLE);
};

// Clicks

AgencyFormPage.prototype.completeName = function(text){
    this.waitUntilVisible(ACCOUNT_NAME_INPUT);
    this.clear(ACCOUNT_NAME_INPUT);
    this.sendKeys(ACCOUNT_NAME_INPUT, text);
    this.sendKeys(ACCOUNT_NAME_INPUT, key.TAB);
    return this;
};

AgencyFormPage.prototype.deleteName = function(char) {
    this.waitUntilVisible(ACCOUNT_NAME_INPUT);
    this.clear(ACCOUNT_NAME_INPUT);
    this.sendKeys(ACCOUNT_NAME_INPUT, char);
    this.sendKeys(ACCOUNT_NAME_INPUT, key.BACK_SPACE);
    this.sendKeys(ACCOUNT_NAME_INPUT, key.TAB);
    return this;
};

AgencyFormPage.prototype.selectSelfService = function(){
    return this.waitAndClick(SELF_SERVICE_CHECKBOX);
};

AgencyFormPage.prototype.searchAndSelectFirstAccountManager = function(value) {
    this.waitUntilVisible(ACCOUNT_MANAGER_INPUT);
    this.clear(ACCOUNT_MANAGER_INPUT);
    this.sendKeys(ACCOUNT_MANAGER_INPUT, value);
    this.click(ACCOUNT_MANAGER_INPUT);
    this.driver.sleep(twoSecondsTO);
    this.sendKeys(ACCOUNT_MANAGER_INPUT, key.BACK_SPACE);
    this.click(ACCOUNT_MANAGER_INPUT);
    this.driver.sleep(twoSecondsTO);
    this.sendKeys(ACCOUNT_MANAGER_INPUT, key.BACK_SPACE);
    this.click(ACCOUNT_MANAGER_INPUT);
    this.getDropDownOptions().click();
    return this;
};

AgencyFormPage.prototype.completeSalesforceId = function(text){
    this.waitUntilVisible(SALESFORCE_ID_INPUT);
    this.clear(SALESFORCE_ID_INPUT);
    this.sendKeys(SALESFORCE_ID_INPUT, text);
    this.sendKeys(SALESFORCE_ID_INPUT, key.TAB);
    return this;
};

AgencyFormPage.prototype.deleteSalesforceId = function(char) {
    this.waitUntilVisible(SALESFORCE_ID_INPUT);
    this.clear(SALESFORCE_ID_INPUT);
    this.sendKeys(SALESFORCE_ID_INPUT, char);
    this.sendKeys(SALESFORCE_ID_INPUT, key.BACK_SPACE);
    this.sendKeys(SALESFORCE_ID_INPUT, key.TAB);
    return this;
};

AgencyFormPage.prototype.clickAccountActivation = function(){
    return this.waitAndClick(ACCOUNT_ACTIVATION_SLIDER);
};

AgencyFormPage.prototype.completePlatformAdFee = function(text){
    this.waitUntilVisible(PLATFORM_AD_FEE_INPUT);
    this.clear(PLATFORM_AD_FEE_INPUT);
    this.sendKeys(PLATFORM_AD_FEE_INPUT, text);
    this.sendKeys(PLATFORM_AD_FEE_INPUT, key.TAB);
    return this;
};

AgencyFormPage.prototype.fillRequiredFields = function(account){
    this.completeSalesforceId(account.salesforceId);
    this.completeName(account.name);
};

AgencyFormPage.prototype.clickSaveButton = function() {
    return this.waitAndClick(SAVE_BTN);
};

AgencyFormPage.prototype.clickSpanCompletedField = function(text) {
    return this.getSpan(text).click();
};

AgencyFormPage.prototype.editRequiredFields = function(account) {
    this.completeName(account.name);
    this.clickAccountActivation();
    this.completeSalesforceId(account.salesforceId);
    this.completePlatformAdFee(account.dspFee);
};

module.exports = AgencyFormPage;
