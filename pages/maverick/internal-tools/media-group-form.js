'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;
const specialTimeOut = 20000;

// elements
const TITLE = By.xpath('//h3[text()="Basic Details"]');
const EDIT_TITLE = By.xpath('//h4[text()="Edit Account"]');
const ACCOUNT_TYPE = By.xpath('//p[text()="Media Group"]');
const ACCOUNT_NAME_INPUT = By.name('name');
const ACCOUNT_EXECUTIVE_INPUT = By.css(
    'input[placeholder="Select Account Executive"]');
const ACCOUNT_MANAGER_INPUT = By.css(
    'input[placeholder="Select Account Manager"]');
const SEARCH_ITEM = By.css('a.search--item');
const SALESFORCE_ID_INPUT = By.name('salesforceId');
const PROTOCOL_DROPDOWN = By.name('protocol');
const CNAME_HTTPS = By.xpath('//span[text()="https://"]');
const CNAME_HTTP = By.xpath('//span[text()="http://"]');
const CNAME_INPUT = By.name('cname');
const TIER_DROPDOWN = By.xpath('//span[contains(text(),"Select")]');
const TIER_OPTIONS = (number) => By.xpath(`//span[text()=${number}]`);
const SPAN_CONTAINS = (text) => By.xpath(`//span[contains(text(),"${text}")]`);
const POWERED_BY_SLIDER = By.name('poweredBy');
const AD_CHOICES_SLIDER = By.name('adChoices');
const USER_MATCHING_SLIDER = By.name('userMatching');
const ACCOUNT_ACTIVATION_SLIDER = By.name('shouldBeActivated');
const TITLE_SECTION = By.xpath('//h3[text()="Fees"]');
const CONTRACT_DROPDOWN = By.name('contract');
const SELECT_CONTRACT = By.xpath(
    '//select-dropdown[@name="contract"]//div/button/span');
const MONTHLY_MINIMUM_OPTION = By.xpath('//span[contains(text(),' +
    '"Monthly Minimum")]');
const MONTHLY_MINIMUM_INPUT = By.name('monthlyMinimum');
const LIVEINTENT_EXCHANGE_FEE_INPUT = By.name('sspFee');
const MONETIZATION_OPTION = By.xpath('//span[contains(text(),' +
    '"Monetization")]');
const PLATFORM_AD_FEE_INPUT = By.name('dspFee');
const SECOND_FEE_LINK = By.css('a[title="Second Fee"]');
const SECOND_FEE_INPUT = By.name('secondFee');
const REMOVE_SECOND_FEE = By.css('span[class="icon icon--exit"]');
const DIRECT_SOLD_FEE_INPUT = By.name('directSoldFee');
const RTB_DEMAND_DROPDOWN = By.css('select-dropdown[name="demand"]' +
    ' div button span');
const SAVE_BTN = By.css('button[class="button--primary pull-right"]');
const OOPS_REQUIRED_FIELD = By.css('div.copy--error-text');
const SPINNER = By.css('.spinner');
const CANCEL_GO_BACK_BTN = By.css('.button--secondary.button--large' +
    '.spacer--large-right');
const CLOSE_ALERT_MSG = By.css('.close.button--close.pull-right');
const MG_CHECKBOX = By.xpath('//input[@name="isMediaGroup"]/../span');

function MediaGroupFormPage(webdriver) {
    BasePage.call(this, webdriver);
}

MediaGroupFormPage.prototype = Object.create(BasePage.prototype);
MediaGroupFormPage.prototype.constructor = MediaGroupFormPage;

MediaGroupFormPage.prototype.getTitle = function(){
    return this.getElement(TITLE);
};

MediaGroupFormPage.prototype.getEditTitle = function() {
    return this.getElement(EDIT_TITLE);
};

MediaGroupFormPage.prototype.getAccountType = function(){
    return this.getElement(ACCOUNT_TYPE);
};

MediaGroupFormPage.prototype.getAccountNameInput = function(){
    return this.getElement(ACCOUNT_NAME_INPUT);
};

MediaGroupFormPage.prototype.getAccountExecutiveInput = function(){
    return this.getElement(ACCOUNT_EXECUTIVE_INPUT);
};

MediaGroupFormPage.prototype.getAccountManagerInput = function(){
    return this.getElement(ACCOUNT_MANAGER_INPUT);
};

MediaGroupFormPage.prototype.getDropDownOptions = function() {
    this.waitUntilVisibleTimed(SEARCH_ITEM, specialTimeOut);
    return this.findElement(SEARCH_ITEM);
};

MediaGroupFormPage.prototype.getSalesforceIdInput = function(){
    return this.getElement(SALESFORCE_ID_INPUT);
};

MediaGroupFormPage.prototype.getCnameInput = function(){
    return this.getElement(CNAME_INPUT);
};

MediaGroupFormPage.prototype.getProtocolDropDown = function(){
    return this.getElement(PROTOCOL_DROPDOWN);
};

MediaGroupFormPage.prototype.getPublisherTierDropDown = function(){
    return this.getElement(TIER_DROPDOWN);
};

MediaGroupFormPage.prototype.getPoweredBySlider = function(){
    return this.getElement(POWERED_BY_SLIDER);
};

MediaGroupFormPage.prototype.getAdChoicesSlider = function(){
    return this.getElement(AD_CHOICES_SLIDER);
};

MediaGroupFormPage.prototype.getUserMatchingSlider = function(){
    return this.getElement(USER_MATCHING_SLIDER);
};

MediaGroupFormPage.prototype.getAccountActivationSlider = function(){
    return this.getElement(ACCOUNT_ACTIVATION_SLIDER);
};

MediaGroupFormPage.prototype.getTitleSection = function(){
    return this.getElement(TITLE_SECTION);
};

MediaGroupFormPage.prototype.getContractDropDown = function(){
    return this.getElement(CONTRACT_DROPDOWN);
};

MediaGroupFormPage.prototype.getMonthlyMinimumInput = function(){
    return this.getElement(MONTHLY_MINIMUM_INPUT);
};

MediaGroupFormPage.prototype.noMonthlyMinimumInput = function() {
    return this.elementNotLocated(MONTHLY_MINIMUM_INPUT);
};

MediaGroupFormPage.prototype.getLIExchangeFeeInput = function(){
    return this.getElement(LIVEINTENT_EXCHANGE_FEE_INPUT);
};

MediaGroupFormPage.prototype.getPlatformAdFeeInput = function() {
    return this.getElement(PLATFORM_AD_FEE_INPUT);
};

MediaGroupFormPage.prototype.getDirectSoldFee = function(){
    return this.getElement(DIRECT_SOLD_FEE_INPUT);
};

MediaGroupFormPage.prototype.noDirectSoldFee = function() {
    return this.elementNotLocated(DIRECT_SOLD_FEE_INPUT);
};

MediaGroupFormPage.prototype.getSecondFeeLink = function(){
    return this.getElement(SECOND_FEE_LINK);
};

MediaGroupFormPage.prototype.getSecondFeeInput = function(){
    return this.getElement(SECOND_FEE_INPUT);
};

MediaGroupFormPage.prototype.getRTBDemandDropdown = function(){
    return this.getElement(RTB_DEMAND_DROPDOWN);
};

MediaGroupFormPage.prototype.getSaveButton = function() {
    return this.getElement(SAVE_BTN);
};

MediaGroupFormPage.prototype.waitUntilSaveButtonEnabled = function(){
    return this.waitUntilEnabled(SAVE_BTN);
};

MediaGroupFormPage.prototype.waitUntilSaveButtonDisabled = function(){
    return this.waitUntilDisabled(SAVE_BTN);
};

MediaGroupFormPage.prototype.getOopsRequiredFieldMessage = function(){
    return this.getElement(OOPS_REQUIRED_FIELD);
};

MediaGroupFormPage.prototype.waitUntilSpinnerDissapear = function() {
    return this.waitUntilStale(SPINNER);
};

// Clicks

MediaGroupFormPage.prototype.completeName = function(text){
    this.waitUntilVisible(ACCOUNT_NAME_INPUT);
    this.clear(ACCOUNT_NAME_INPUT);
    this.sendKeys(ACCOUNT_NAME_INPUT, text);
    this.sendKeys(ACCOUNT_NAME_INPUT, key.TAB);
    return this;
};

MediaGroupFormPage.prototype.deleteName = function(char) {
    this.waitUntilVisible(ACCOUNT_NAME_INPUT);
    this.clear(ACCOUNT_NAME_INPUT);
    this.sendKeys(ACCOUNT_NAME_INPUT, char);
    this.sendKeys(ACCOUNT_NAME_INPUT, key.BACK_SPACE);
    this.sendKeys(ACCOUNT_NAME_INPUT, key.TAB);
    return this;
};

MediaGroupFormPage.prototype.searchAndSelectFirstAccountExecutive =
    function(value) {
        this.waitUntilVisible(ACCOUNT_EXECUTIVE_INPUT);
        this.clear(ACCOUNT_EXECUTIVE_INPUT);
        this.sendKeys(ACCOUNT_EXECUTIVE_INPUT, value);
        this.click(ACCOUNT_EXECUTIVE_INPUT);
        this.sendKeys(ACCOUNT_EXECUTIVE_INPUT, key.BACK_SPACE);
        this.click(ACCOUNT_EXECUTIVE_INPUT);
        this.getDropDownOptions().click();
        return this;
    };

MediaGroupFormPage.prototype.searchAndSelectFirstAccountManager =
    function(value) {
        this.waitUntilVisible(ACCOUNT_MANAGER_INPUT);
        this.clear(ACCOUNT_MANAGER_INPUT);
        this.sendKeys(ACCOUNT_MANAGER_INPUT, value);
        this.click(ACCOUNT_MANAGER_INPUT);
        this.getDropDownOptions().click();
        return this;
    };

MediaGroupFormPage.prototype.completeSalesforceId = function(text){
    this.waitUntilVisible(SALESFORCE_ID_INPUT);
    this.clear(SALESFORCE_ID_INPUT);
    this.sendKeys(SALESFORCE_ID_INPUT, text);
    this.sendKeys(SALESFORCE_ID_INPUT, key.TAB);
    return this;
};

MediaGroupFormPage.prototype.deleteSalesforceId = function(char) {
    this.waitUntilVisible(SALESFORCE_ID_INPUT);
    this.clear(SALESFORCE_ID_INPUT);
    this.sendKeys(SALESFORCE_ID_INPUT, char);
    this.sendKeys(SALESFORCE_ID_INPUT, key.BACK_SPACE);
    this.sendKeys(SALESFORCE_ID_INPUT, key.TAB);
    return this;
};

MediaGroupFormPage.prototype.enterCName = function(protocol, domain) {
    this.waitUntilVisible(CNAME_INPUT);
    this.waitAndClick(PROTOCOL_DROPDOWN);
    if (protocol === 'http') {
        this.waitAndClick(CNAME_HTTP);
    }else{
        this.waitAndClick(CNAME_HTTPS);
    }
    this.clear(CNAME_INPUT);
    this.findElement(CNAME_INPUT).sendKeys(domain);
    this.sendKeys(CNAME_INPUT, key.TAB);
    return this;
};

MediaGroupFormPage.prototype.selectPublisherTier = function(number) {
    this.waitAndClick(TIER_DROPDOWN);
    this.waitAndClick(TIER_OPTIONS(number));
    return this;
};

MediaGroupFormPage.prototype.editPublisherTier = function(number, newNumber) {
    this.waitAndClick(TIER_OPTIONS(number));
    this.waitAndClick(TIER_OPTIONS(newNumber));
    return this;
};

MediaGroupFormPage.prototype.clickPoweredBy = function(){
    return this.waitAndClick(POWERED_BY_SLIDER);
};

MediaGroupFormPage.prototype.clickAdChoices = function(){
    return this.waitAndClick(AD_CHOICES_SLIDER);
};

MediaGroupFormPage.prototype.clickUserMatching = function(){
    return this.waitAndClick(USER_MATCHING_SLIDER);
};

MediaGroupFormPage.prototype.clickAccountActivation = function(){
    return this.waitAndClick(ACCOUNT_ACTIVATION_SLIDER);
};

MediaGroupFormPage.prototype.selectMonthlyMinimumContract = function() {
    this.waitAndClick(CONTRACT_DROPDOWN);
    this.waitAndClick(MONTHLY_MINIMUM_OPTION);
    return this;
};

MediaGroupFormPage.prototype.selectMonetizationContract = function() {
    this.waitAndClick(SELECT_CONTRACT);
    this.waitAndClick(MONTHLY_MINIMUM_OPTION);
    this.waitAndClick(SELECT_CONTRACT);
    this.waitAndClick(MONETIZATION_OPTION);
    return this;
};

MediaGroupFormPage.prototype.completeMonthlyMinimum = function(text){
    this.waitAndClick(SELECT_CONTRACT);
    this.waitAndClick(MONTHLY_MINIMUM_OPTION);
    this.waitUntilVisible(MONTHLY_MINIMUM_INPUT);
    this.clear(MONTHLY_MINIMUM_INPUT);
    this.sendKeys(MONTHLY_MINIMUM_INPUT, text);
    this.sendKeys(MONTHLY_MINIMUM_INPUT, key.TAB);
    return this;
};

MediaGroupFormPage.prototype.completeLIExchangeFee = function(text){
    this.waitUntilVisible(LIVEINTENT_EXCHANGE_FEE_INPUT);
    this.clear(LIVEINTENT_EXCHANGE_FEE_INPUT);
    this.sendKeys(LIVEINTENT_EXCHANGE_FEE_INPUT, text);
    this.sendKeys(LIVEINTENT_EXCHANGE_FEE_INPUT, key.TAB);
    return this;
};

MediaGroupFormPage.prototype.completePlatformAdFee = function(text){
    this.waitUntilVisible(PLATFORM_AD_FEE_INPUT);
    this.clear(PLATFORM_AD_FEE_INPUT);
    this.sendKeys(PLATFORM_AD_FEE_INPUT, text);
    this.sendKeys(PLATFORM_AD_FEE_INPUT, key.TAB);
    return this;
};

MediaGroupFormPage.prototype.completeDirectSoldFee = function(text){
    this.waitUntilVisible(DIRECT_SOLD_FEE_INPUT);
    this.clear(DIRECT_SOLD_FEE_INPUT);
    this.sendKeys(DIRECT_SOLD_FEE_INPUT, text);
    this.sendKeys(DIRECT_SOLD_FEE_INPUT, key.TAB);
    return this;
};

MediaGroupFormPage.prototype.clickSecondFeeLink = function() {
    return this.waitAndClick(SECOND_FEE_LINK);
};

MediaGroupFormPage.prototype.completeSecondFee = function(text){
    this.waitUntilVisible(SECOND_FEE_INPUT);
    this.clear(SECOND_FEE_INPUT);
    this.sendKeys(SECOND_FEE_INPUT, text);
    this.sendKeys(SECOND_FEE_INPUT, key.TAB);
    return this;
};

MediaGroupFormPage.prototype.removeSecondFee = function() {
    this.waitAndClick(REMOVE_SECOND_FEE);
};

MediaGroupFormPage.prototype.clickSaveButton = function() {
    return this.waitAndClick(SAVE_BTN);
};

MediaGroupFormPage.prototype.clickSpanCompletedField = function(text){
    return this.getSpan(text).click();
};

MediaGroupFormPage.prototype.fillRequiredFields = function(account){
    this.completeName(account.name);
    this.completeSalesforceId(account.salesforceId);
    this.enterCName(account.cnameProtocol,
        account.cname);
    this.clickAccountActivation();
    this.selectPublisherTier(account.tier);
    this.completeMonthlyMinimum(account.monthlyMinimum);
    this.completeLIExchangeFee(account.sspFee);
    this.completePlatformAdFee(account.dspFee);
    this.completeDirectSoldFee(account.directSoldFee);
};

MediaGroupFormPage.prototype.editRequiredFields = function(account) {
    this.completeName(account.name);
    if (account.cname != null) {
        this.enterCName(account.cnameProtocol, account.cname);
    }
    this.clickAccountActivation();
};

MediaGroupFormPage.prototype.fillMonetizationsRequiredFields =
    function(account) {
        this.completeName(account.name);
        this.completeSalesforceId(account.salesforceId);
        this.enterCName(account.cnameProtocol,
            account.cname);
        this.clickAccountActivation();
        this.selectPublisherTier(account.tier);
        this.selectMonetizationContract();
        this.completeLIExchangeFee(account.sspFee);
        this.completePlatformAdFee(account.dspFee);
    };

MediaGroupFormPage.prototype.cancelConfirmDialog = function(){
    return this.getElement(CANCEL_GO_BACK_BTN).click();
};

MediaGroupFormPage.prototype.closeAlertMsg = function(){
    return this.clickLastElement(CLOSE_ALERT_MSG);
};

MediaGroupFormPage.prototype.selectMediaGroupType = function() {
    return this.waitAndClick(MG_CHECKBOX);
};

module.exports = MediaGroupFormPage;
