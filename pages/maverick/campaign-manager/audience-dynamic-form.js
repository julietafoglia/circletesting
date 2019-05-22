'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

const TEXT_TITLE = By.xpath('//h2[text() = "Create Dynamic Website Audience"]');
const BUTTON_AUDIENCE_MEMBERS = By.css('select-dropdown[name="visitorType"]' +
    ' div button');
const TEXT_AUDIENCE_MEMBERS = By.xpath('//span[text() = "Include people that' +
    ' visited a webpage with the following rules."]');
const BUTTON_VISITED_PAGE = By.css('select-dropdown[name="operator"]' +
    ' div button');
const BUTTON_RULE = By.xpath('//regex-rule/div/select-dropdown/div/button');
const INPUT_RULE = By.css('input[name="input"]');
const BUTTON_PIXEL = By.css('switch[name="enablePixel"]');
const INPUT_MEMBER_LIFETIME = By.css('input[name="ttlInDays"]');
const TEXT_MEMBER_LIFETIME = By.xpath('//span[text() = "Enter the number' +
    ' of days you want people to stay in your audience after meeting' +
    ' the URL criteria specified. People will be removed from your' +
    ' audience after this time unless they meet the criteria again."]');
const BUTTON_OR = By.xpath('//button[text() = "OR"]');
const BUTTON_AND = By.xpath('//button[text() = "AND"]');
const BUTTON_EVENT = By.css('multi-select[name="eventTypes"] div button');
const TEXT_EVENT = By.xpath('//div[text() = "Select the LiveConnect' +
    ' event(s) that you would like to build your audience from."]');
const CHECK_CUSTOM_NAME = By.css('input[name="customizeName"]');

function AudienceDynamicFormPage(webdriver) {
    BasePage.call(this, webdriver);
}

AudienceDynamicFormPage.prototype = Object.create(BasePage.prototype);
AudienceDynamicFormPage.prototype.constructor = AudienceDynamicFormPage;


// Getters

AudienceDynamicFormPage.prototype.getTextTitle = function() {
    this.waitUntilVisible(TEXT_TITLE);
    return this.findElement(TEXT_TITLE);
};

AudienceDynamicFormPage.prototype.getButtonAudienceMembers = function() {
    this.waitUntilVisible(BUTTON_AUDIENCE_MEMBERS);
    return this.findElement(BUTTON_AUDIENCE_MEMBERS);
};

AudienceDynamicFormPage.prototype.getTextAudienceMembers = function() {
    this.waitUntilVisible(TEXT_AUDIENCE_MEMBERS);
    return this.findElement(TEXT_AUDIENCE_MEMBERS);
};

AudienceDynamicFormPage.prototype.getButtonVisitedPage = function() {
    this.waitUntilVisible(BUTTON_VISITED_PAGE);
    return this.findElement(BUTTON_VISITED_PAGE);
};

AudienceDynamicFormPage.prototype.getInputRule = function() {
    this.waitUntilVisible(INPUT_RULE);
    return this.findElement(INPUT_RULE);
};

AudienceDynamicFormPage.prototype.getButtonRule = function() {
    this.waitUntilVisible(BUTTON_RULE);
    return this.findElement(BUTTON_RULE);
};

AudienceDynamicFormPage.prototype.getButtonPixel = function() {
    this.waitUntilVisible(BUTTON_PIXEL);
    return this.findElement(BUTTON_PIXEL);
};

AudienceDynamicFormPage.prototype.getInputMemberLifetime = function() {
    this.waitUntilVisible(INPUT_MEMBER_LIFETIME);
    return this.findElement(INPUT_MEMBER_LIFETIME);
};

AudienceDynamicFormPage.prototype.getTextMemberLifetime = function() {
    this.waitUntilVisible(TEXT_MEMBER_LIFETIME);
    return this.findElement(TEXT_MEMBER_LIFETIME);
};

AudienceDynamicFormPage.prototype.getButtonOr = function() {
    this.waitUntilVisible(BUTTON_OR);
    return this.findElement(BUTTON_OR);
};

AudienceDynamicFormPage.prototype.getButtonAnd = function() {
    this.waitUntilVisible(BUTTON_AND);
    return this.findElement(BUTTON_AND);
};

AudienceDynamicFormPage.prototype.getButtonEvent = function() {
    this.waitUntilVisible(BUTTON_EVENT);
    return this.findElement(BUTTON_EVENT);
};

AudienceDynamicFormPage.prototype.getTextEvent = function() {
    this.waitUntilVisible(TEXT_EVENT);
    return this.findElement(TEXT_EVENT);
};

AudienceDynamicFormPage.prototype.getCheckCustomName = function() {
    this.waitUntilVisible(CHECK_CUSTOM_NAME);
    return this.findElement(CHECK_CUSTOM_NAME);
};

// Setters

AudienceDynamicFormPage.prototype.setInputRule = function(value) {
    this.waitUntilVisible(INPUT_RULE);
    this.clear(INPUT_RULE);
    return this.sendKeys(INPUT_RULE, value);
};

AudienceDynamicFormPage.prototype.setInputMemberLifetime = function(value) {
    this.waitUntilVisible(INPUT_MEMBER_LIFETIME);
    this.clear(INPUT_MEMBER_LIFETIME);
    return this.sendKeys(INPUT_MEMBER_LIFETIME, value);
};

// Clicks

AudienceDynamicFormPage.prototype.clickButtonAudienceMembers = function() {
    this.click(BUTTON_AUDIENCE_MEMBERS);
    return this.waitUntilLoaderNotVisible();
};

AudienceDynamicFormPage.prototype.clickButtonVisitedPage = function() {
    this.click(BUTTON_VISITED_PAGE);
    return this.waitUntilLoaderNotVisible();
};

AudienceDynamicFormPage.prototype.clickButtonRule = function() {
    this.click(BUTTON_RULE);
    return this.waitUntilLoaderNotVisible();
};

AudienceDynamicFormPage.prototype.clickButtonEvent = function() {
    this.click(BUTTON_EVENT);
    return this.waitUntilLoaderNotVisible();
};

module.exports = AudienceDynamicFormPage;
