'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;
const fiveSecondsTO = 5000;

// elements
// Publisher details
const PUBLISHER_FORM = By.css('publisher-form');
const MEDIA_GROUP = By.css('input[placeholder="Search Media Groups"]');
const MEDIA_GROUP_SELECTED = By.css('searchable-select-single[name="mediaGroup"]');
const PUBLISHER = By.xpath(
    '//section-card/div/div[2]/section[1]/div/div/div[2]/div[2]/input'
);
const IAB_CATEGORY = By.css('input[placeholder="Search IAB Categories"]');
const IAB_CATEGORY_OPTION = (category) =>
    By.xpath(`//span[text()="${category}"]`);
const IAB_CAT_LABEL = By.xpath('//label[text()="IAB Category Blacklist"]');
const DOMAIN = By.css('input[name="domain"]');
const CNAME = By.xpath('//modal/div/div[2]/div/div/div/section-card[1]' +
    '/div/div[2]/section[1]/div/div/div[5]/div[2]/div[1]/input');
const PROTOCOL_DROPDOWN = By.name('protocol');
const CNAME_HTTPS = By.xpath('//span[text()="https://"]');
const CNAME_HTTP = By.xpath('//span[text()="http://"]');
const ESP_INPUT = By.css('input[placeholder="Select or Add an ESP"]');
const KVP = By.css('a[title="Key-Value Pairs"]');
const KVP_TEXTAREA =
    By.xpath('//kvp-input/open-book/div/div/div[2]/div[1]/div/div/textarea');
const KVP_LIST =
    By.xpath('//kvp-input/open-book/div/div/div[2]/div[2]/div/div/list/div');
const KVP_ADD_PARAM = By.xpath('//button[text()="Add Parameters"]');
const PUBLISHER_LABEL = By.css('a[title="Publisher Label"]');
const PUBLISHER_LABEL_INPUT = By.name('externalId');
const TIER_DROPDOWN = By.xpath('//span[contains(text(),"Default")]');
const TIER_OPTIONS = (number) => By.xpath(`//span[text()=${number}]`);
const POWERED_BY_BTN = By.css('select-dropdown[name=allowPoweredBy]' +
    ' div button span');
const AD_CHOICES_BTN = By.css('select-dropdown[name=allowAdChoices]' +
    ' div button span');
const ALLOW_SPAN = By.xpath('//span[contains(text(),"Allow")]');
const BLOCK_SPAN = By.xpath('//span[contains(text(),"Block")]');
const INHERIT_SPAN = By.xpath('//span[contains(text(),"Inherit")]');
const DEAL_SSP_FEE = By.css('input[name=dealSspFee]');
const ALLOW_USER_MATCH = By.css('switch[name=publisherUserMatchAllow]' +
    ' div label div');
const EMAIL_CONTACTS_INPUT = By.css('tags-input-text[name=listIdTargeting]' +
    ' div input');
const SEARCH_ITEM = By.css('a.search--item');
const SPINNER = By.css('.spinner');
const ACCOUNT_EXECUTIVE_INPUT = By.css(
    'input[placeholder="Search Account Executives"]');
const ACCOUNT_MANAGER_INPUT = By.css(
    'input[placeholder="Search Account Managers"]');
const RTB_DEMAND_BTN = By.css('select-dropdown[name=demand] div button span');
const TRANSPARENCY_BTN = By.css('select-dropdown[name=transparency]' +
    ' div button span');
const INHERIT_FLOOR_CHKBOX = By.xpath('//input[@name="inheritFloor"]' +
    '/parent::label/span');
const DEMAND_TITLE = By.xpath('//h5[contains(text(),"Demand")]');
const TRANSPARENCY_TITLE = By.xpath('//h5[contains(text(),"Transparency")]');
const PUB_FLOOR_TITLE = By.xpath('//h5[contains(text(),"Publisher Floor")]');

// Fallback Creatives
const BUILD_ADS = By.xpath('//button[text()="Build Ads"]');
const FILE_UPLOAD_INPUT = By.xpath(
    '//publisher-form/lightbox/div[2]/div/div/div[2]/div/upload/div/input'
);
const AD_NAME = By.css('input[name="adName"]');
const CLICK_URL = By.css('textarea[name="clickUrl"]');

// Demand blocking
const IAB_BLACKLIST = By.css('a[title="IAB Category Blacklist"]');
const IAB_BLACKLIST_INPUT =
    By.css('search-input[placeholder="Search IAB Categories"]');
const LI_EXCHANGE_ADVS = By.css('a[title="LiveIntent Exchange Advertisers"]');
const RTB_ADVERTISERS = By.css('a[title="RTB Advertisers"]');
const INPUT_DOMAINS = By.xpath('//h4[text()="Input Domains"]');
const LI_DOMAINS_TEXT_AREA = By.xpath(
    '//domain-targeting/open-book/div/div/div[2]/div[1]/div/div/div/div' +
        '/tabs/div/div/tab[2]/div/textarea'
);
const LI_ADD_DOMAINS_BTN = By.xpath(
    '//domain-targeting/open-book/div/div/div[2]/div[1]/div/div/div/div' +
        '/tabs/div/div/tab[2]/div/button'
);
const BLACKLIST_BTN = By.xpath('//button/span[text()="Blacklist"]');
const WHITELIST = By.xpath('//ul/li/a/span[text()="Whitelist"]');
const RTB_DOMAINS_TEXT_AREA = By.xpath(
    '//domain-targeting/open-book/div/div/div[2]/div[1]/' +
        'div/div/div/div/textarea'
);
const RTB_ADD_DOMAINS_BTN = By.xpath(
    '//domain-targeting/open-book/div/div/div[2]/div[1]/' +
        'div/div/div/div/button'
);
const RTB_DOMAIN_LIST = By.xpath('//progressive-link/div/div/div/' +
    'domain-targeting/open-book/div/div/div[2]/div[2]/div/div/list/div');

// Save and exit
const SAVE_BTN = By.xpath('//button[text()="Save and Exit"]');
const PUB_SAVE_BTN = By.xpath('//publisher-form//button[text()=' +
    '"Save and Exit"]');


function PublisherFormPage(webdriver) {
    this.driver = webdriver;
}

PublisherFormPage.prototype = Object.create(BasePage.prototype);
PublisherFormPage.prototype.constructor = PublisherFormPage;

PublisherFormPage.prototype.getPublisherForm = function(){
    return this.getElement(PUBLISHER_FORM);
};

PublisherFormPage.prototype.getDropDownOptions = function() {
    this.waitUntilVisible(SEARCH_ITEM);
    return this.findElement(SEARCH_ITEM);
};

PublisherFormPage.prototype.getPublisherTierDropDown = function(){
    return this.getElement(TIER_DROPDOWN);
};

PublisherFormPage.prototype.getPoweredByDropDown = function(){
    return this.getElement(POWERED_BY_BTN);
};

PublisherFormPage.prototype.getAdChoicesDropDown = function(){
    return this.getElement(AD_CHOICES_BTN);
};

PublisherFormPage.prototype.getDealSSPFee = function() {
    return this.getElement(DEAL_SSP_FEE);
};

PublisherFormPage.prototype.getAllowUserMatch = function() {
    return this.getElement(ALLOW_USER_MATCH);
};

PublisherFormPage.prototype.getEmailContacts = function() {
    return this.getElement(ALLOW_USER_MATCH);
};

PublisherFormPage.prototype.getAccountExecutiveInput = function(){
    return this.getElement(ACCOUNT_EXECUTIVE_INPUT);
};

PublisherFormPage.prototype.getAccountManagerInput = function(){
    return this.getElement(ACCOUNT_MANAGER_INPUT);
};

PublisherFormPage.prototype.getRTBDemandButton = function(){
    return this.getElement(RTB_DEMAND_BTN);
};

PublisherFormPage.prototype.getTransparencyButton = function(){
    return this.getElement(TRANSPARENCY_BTN);
};

PublisherFormPage.prototype.getInheritCheckBox = function(){
    return this.getElement(INHERIT_FLOOR_CHKBOX);
};

PublisherFormPage.prototype.getDemandTitle = function(){
    return this.getElement(DEMAND_TITLE);
};

PublisherFormPage.prototype.getTransparencyTitle = function(){
    return this.getElement(TRANSPARENCY_TITLE);
};

PublisherFormPage.prototype.getPubFloorTitle = function(){
    return this.getElement(PUB_FLOOR_TITLE);
};

PublisherFormPage.prototype.setPoweredByAs = function(option) {
    this.waitAndClick(POWERED_BY_BTN);
    if (option === 'Allow') {
        this.waitAndClick(ALLOW_SPAN);
    } else {
        if (option == 'Block') {
            this.waitAndClick(BLOCK_SPAN);
        } else {
            this.waitAndClick(INHERIT_SPAN);
        }
    }
    return this;
};

PublisherFormPage.prototype.setAdChoicesAs = function(option) {
    this.waitAndClick(AD_CHOICES_BTN);
    if (option === 'Allow') {
        this.waitAndClick(ALLOW_SPAN);
    } else {
        if (option == 'Block') {
            this.waitAndClick(BLOCK_SPAN);
        } else {
            this.waitAndClick(INHERIT_SPAN);
        }
    }
    return this;
};

PublisherFormPage.prototype.enterDealSSPFee = function(number) {
    this.getElement(DEAL_SSP_FEE).sendKeys(number);
    return this;
};

PublisherFormPage.prototype.clickAllowUserMatch = function() {
    this.waitAndClick(ALLOW_USER_MATCH);
    return this;
};

PublisherFormPage.prototype.selectPublisherTier = function(number) {
    this.waitAndClick(TIER_DROPDOWN);
    this.waitAndClick(TIER_OPTIONS(number));
    return this;
};

PublisherFormPage.prototype.waitUntilSpinnerDissapear = function() {
    return this.waitUntilStale(SPINNER);
};

PublisherFormPage.prototype.chooseMediaGroup = function(mediaGroup) {
    this.waitUntilOverlayNotVisible();
    this.waitUntilVisible(MEDIA_GROUP_SELECTED);
    this.findElement(MEDIA_GROUP_SELECTED).click();
    this.findElement(MEDIA_GROUP_SELECTED).click();
    this.findElement(MEDIA_GROUP).sendKeys(mediaGroup);
    this.getDropDownOptions().click();
    return this;
};

PublisherFormPage.prototype.enterPubName = function(name) {
    this.waitUntilVisible(PUBLISHER);
    this.findElement(PUBLISHER).sendKeys(name);
    return this;
};

PublisherFormPage.prototype.clickPubName = function(name) {
    this.click(PUBLISHER);
    return this;
};

PublisherFormPage.prototype.pickIabCategory = function(category) {
    this.waitUntilVisible(IAB_CATEGORY);
    this.findElement(IAB_CATEGORY).click();
    this.sendKeys(IAB_CATEGORY, category);
    this.getDropDownOptions().click();
    return this;
};

PublisherFormPage.prototype.enterPrimaryDomain = function(domain) {
    this.waitUntilVisible(DOMAIN);
    this.findElement(DOMAIN).sendKeys(domain);
    return this;
};

PublisherFormPage.prototype.enterCName = function(protocol, domain) {
    this.click(PROTOCOL_DROPDOWN);
    if (protocol === 'http') {
        this.click(CNAME_HTTP);
    } else {
        this.click(CNAME_HTTPS);
    }
    this.clear(CNAME);
    this.findElement(CNAME).sendKeys(domain);
    this.sendKeys(CNAME, key.TAB);
    return this;
};

PublisherFormPage.prototype.completeCName = function(domain) {
    this.clear(CNAME);
    this.findElement(CNAME).sendKeys(domain);
    this.sendKeys(CNAME, key.TAB);
    return this;
};

PublisherFormPage.prototype.selectESP = function(esp) {
    this.waitAndClick(ESP_INPUT);
    if (esp !== 'Other ESP') {
        this.sendKeys(ESP_INPUT, esp);
        this.getDropDownOptions().click();
    } else {
        // TODO: other esp
    }
    return this;
};

PublisherFormPage.prototype.addKeyValuePairs = function(kvps) {
    this.waitUntilVisible(KVP);
    this.findElement(KVP).click();
    let actions = this.driver.actions();
    actions.mouseMove(this.findElement(KVP_TEXTAREA)).click();
    for (let key in kvps) {
        actions.sendKeys(`${key}=${kvps[key]}`).sendKeys(webdriver.Key.ENTER);
    }
    actions.perform();
    this.findElement(KVP_LIST).click();
    this.findElement(KVP_ADD_PARAM).click();
    return this;
};

PublisherFormPage.prototype.enterPublisherLabel = function(label) {
    this.waitUntilVisible(PUBLISHER_LABEL);
    this.findElement(PUBLISHER_LABEL).click();
    this.findElement(PUBLISHER_LABEL_INPUT).sendKeys(label);
    return this;
};

// Fallback Creatives
PublisherFormPage.prototype.addFallbackCreatives = function(creative) {
    this.waitUntilVisible(BUILD_ADS);
    this.findElement(BUILD_ADS).click();
    this.findElement(FILE_UPLOAD_INPUT).sendKeys(creative.location);
    this.findElement(AD_NAME).clear();
    this.findElement(AD_NAME).sendKeys(creative.name);
    this.findElement(CLICK_URL).sendKeys(creative.clickUrl);
    return this;
};

// Demand Blocking
PublisherFormPage.prototype.blockCategories = function(categories) {
    this.waitAndClick(IAB_BLACKLIST);
    categories.forEach(category => {
        this.findElement(IAB_BLACKLIST_INPUT).click();
        this.findElement(IAB_CATEGORY_OPTION(category)).click();
    });
    this.waitAndClick(IAB_CAT_LABEL);
    return this;
};

PublisherFormPage.prototype.liExchangeAdvertisers = function(domains) {
    this.waitAndClick(LI_EXCHANGE_ADVS);
    this.waitUntilVisible(INPUT_DOMAINS);
    this.findElement(INPUT_DOMAINS).click();
    this.driver.actions()
        .click(this.findElement(LI_DOMAINS_TEXT_AREA))
        .sendKeys(domains.join(','))
        .click()
        .perform(this.findElement(INPUT_DOMAINS));
    this.findElement(LI_ADD_DOMAINS_BTN).click();
    return this;
};

PublisherFormPage.prototype.rtbAdvertisers = function(isWhitelist, domains) {
    this.waitUntilVisible(RTB_ADVERTISERS);
    this.driver.actions()
        .mouseMove(this.findElement(RTB_ADVERTISERS))
        .click()
        .perform();
    this.waitUntilVisible(BLACKLIST_BTN);
    if (isWhitelist) {
        this.findElement(BLACKLIST_BTN).click();
        this.findElement(WHITELIST).click();
    }
    this.driver.actions()
        .click(this.findElement(RTB_DOMAINS_TEXT_AREA))
        .sendKeys(domains.join(','))
        .click(this.findElement(RTB_DOMAIN_LIST))
        .perform();
    this.findElement(RTB_ADD_DOMAINS_BTN).click();
    return this;
};

PublisherFormPage.prototype.searchAndSelectFirstAccountExecutive =
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

PublisherFormPage.prototype.searchAndSelectFirstAccountManager =
    function(value) {
        this.waitUntilVisible(ACCOUNT_MANAGER_INPUT);
        this.clear(ACCOUNT_MANAGER_INPUT);
        this.sendKeys(ACCOUNT_MANAGER_INPUT, value);
        this.click(ACCOUNT_MANAGER_INPUT);
        this.getDropDownOptions().click();
        return this;
    };

PublisherFormPage.prototype.waitUntilSaveButtonEnabled = function() {
    return this.waitUntilEnabled(PUB_SAVE_BTN);
};

PublisherFormPage.prototype.saveAndExit = function() {
    this.waitUntilSaveButtonEnabled();
    this.findElement(PUB_SAVE_BTN).click();
    this.waitUntilOverlayNotVisible();
    return this.driver.sleep(fiveSecondsTO);
};

PublisherFormPage.prototype.savePubAndExit = function() {
    this.waitUntilEnabled(PUB_SAVE_BTN);
    this.waitAndClick(PUB_SAVE_BTN);
    return this.waitUntilOverlayNotVisible();
};

module.exports = PublisherFormPage;
