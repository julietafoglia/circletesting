'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const threeSecTO = 10000;

// elements
const LINK_EDIT = By.xpath('//row-actions/div/ul/li[1]/a');
const LINK_COPY = By.xpath('//a[text() = "Copy"]');
const LINK_DELETE = By.xpath('//a[text() = "Delete"]');
const LINK_MORE = By.xpath('//row-actions/div/ul/li[4]/a');
const LINK_MORE_ARROW = By.css('.icon.icon--arrow-down');
const LINK_VIEW_HISTORY = By.xpath('//row-actions/div/div/dropdown' +
    '/div/div/ul/li/a');
const AD_IMAGE = By.xpath('//div[@class="padding-large creative-preview"]' +
    '/img');
const BUTTON_REJECT_DELETE = By.css('.dialog--body .button--secondary');
const BUTTON_CONFIRM_DELETE = By.css('.dialog--body .button--primary');
const CHECKBOX_DELETE = By.css('input[type="checkbox"]');
const TEXT_CHECKBOX_DELETE = By.xpath('//span[text()="It will no longer serve' +
 ' in connected line items. I understand this cannot be undone."]');
const MODAL_VIEW_HISTORY = By.xpath('//history-view');
const BUTTON_CANCEL_VIEW_HISTORY = By.xpath('//history-view/lightboxnext' +
    '/div[2]/div/footer/a');
const BUTTON_CLOSE_VIEW_HISTORY = By.css('icon.icon--exit');
const BUTTON_CLOSE_MODAL = By.xpath('//modal/div/div[1]/div/div/div[2]' +
    '/button/span');
const TITLE_DELETE_MODAL = By.xpath('//h2[text() = "Delete Ad?"]');
const TITLE_EDIT_FORM = By.xpath('//h4[text() = "Edit Ad"]');
const TITLE_CREATE_FORM = By.xpath('//h4[text() = "Create Ad"]');

function AdDetailsPage(webdriver) {
    BasePage.call(this, webdriver);
}

AdDetailsPage.prototype = Object.create(BasePage.prototype);
AdDetailsPage.prototype.constructor = AdDetailsPage;

AdDetailsPage.prototype.getLinkEdit = function() {
    return this.getElement(LINK_EDIT);
};

AdDetailsPage.prototype.getLinkCopy = function() {
    return this.getElement(LINK_COPY);
};

AdDetailsPage.prototype.getLinkDelete = function() {
    return this.getElement(LINK_DELETE);
};

AdDetailsPage.prototype.getLinkMore = function() {
    return this.getElement(LINK_MORE);
};

AdDetailsPage.prototype.getLinkViewHistory = function() {
    return this.getElement(LINK_VIEW_HISTORY);
};

AdDetailsPage.prototype.getTextAdId = function(text) {
    return this.getElement(By.xpath(
        '//span[text()=\'' + text + '\']'));
};

AdDetailsPage.prototype.getAdSize = function(text) {
    return this.getElement(By.xpath(
        '//span[text()=\'' + text + '\']'));
};

AdDetailsPage.prototype.getAdClickUrl = function(text) {
    return this.getElement(By.xpath(
        '//a[text()=\'' + text + '\']'));
};

AdDetailsPage.prototype.getAdThirdPartyTracker = function(text) {
    return this.getElement(By.xpath(
        '//span[text()=\'' + text + '\']'));
};

AdDetailsPage.prototype.getAdImage = function() {
    return this.getElement(AD_IMAGE);
};

AdDetailsPage.prototype.getAdImage = function() {
    return this.getElement(AD_IMAGE);
};

AdDetailsPage.prototype.getTextLinkedLI = function() {
    return this.getTitle('Linked Line Items');
};

AdDetailsPage.prototype.getTitleDeleteAd = function() {
    return this.findElement(TITLE_DELETE_MODAL);
};

AdDetailsPage.prototype.getButtonRejectDelete = function() {
    return this.findElement(BUTTON_REJECT_DELETE);
};

AdDetailsPage.prototype.getButtonConfirmDelete = function() {
    return this.findElement(BUTTON_CONFIRM_DELETE);
};

AdDetailsPage.prototype.getCheckboxDelete = function() {
    return this.findElement(CHECKBOX_DELETE);
};

AdDetailsPage.prototype.getTextCheckboxDelete = function() {
    return this.findElement(TEXT_CHECKBOX_DELETE);
};

AdDetailsPage.prototype.getTextCreativeNameDelete = function(text) {
    return this.findElement(By.xpath(
        '//strong[text()=\'' + text + '\']'));
};

AdDetailsPage.prototype.getModalViewHistory = function() {
    return this.getElement(MODAL_VIEW_HISTORY);
};

AdDetailsPage.prototype.getTitleEditForm = function() {
    this.waitUntilVisible(TITLE_EDIT_FORM);
    return this.findElement(TITLE_EDIT_FORM);
};


AdDetailsPage.prototype.getTitleCreateForm = function() {
    this.waitUntilOverlayNotVisible();
    return this.getElement(TITLE_CREATE_FORM);
};


// Clicks

AdDetailsPage.prototype.clickLinkEdit = function() {
    this.waitUntilOverlayNotVisible();
    this.waitUntilVisible(LINK_EDIT);
    return this.click(LINK_EDIT);
};

AdDetailsPage.prototype.clickLinkCopy = function() {
    this.waitUntilVisible(LINK_COPY);
    return this.click(LINK_COPY);
};

AdDetailsPage.prototype.clickLinkDelete = function() {
    this.waitUntilVisible(LINK_DELETE);
    this.click(LINK_DELETE);
    return this.driver.sleep(threeSecTO);
};

AdDetailsPage.prototype.clickLinkMore = function() {
    this.waitUntilVisible(LINK_MORE);
    this.click(LINK_MORE);
    return this.waitUntilVisible(LINK_VIEW_HISTORY);
};

AdDetailsPage.prototype.clickLinkMoreArrow = function() {
    this.waitAndClick(LINK_MORE_ARROW);
    return this.waitUntilVisible(LINK_VIEW_HISTORY);
};

AdDetailsPage.prototype.clickLinkViewHistory = function() {
    this.waitAndClick(LINK_VIEW_HISTORY);
    return this.waitUntilVisible(MODAL_VIEW_HISTORY);
};

AdDetailsPage.prototype.clickButtonRejectDelete = function() {
    this.waitUntilVisible(BUTTON_REJECT_DELETE);
    return this.click(BUTTON_REJECT_DELETE);
};

AdDetailsPage.prototype.clickButtonCancelViewHistory = function() {
    this.waitUntilVisible(BUTTON_CANCEL_VIEW_HISTORY);
    this.click(BUTTON_CANCEL_VIEW_HISTORY);
    return this.driver.sleep(threeSecTO);
};

AdDetailsPage.prototype.clickButtonCloseViewHistory = function() {
    this.waitUntilVisible(BUTTON_CLOSE_VIEW_HISTORY);
    this.click(BUTTON_CLOSE_VIEW_HISTORY);
    return this.driver.sleep(threeSecTO);
};

AdDetailsPage.prototype.clickButtonCloseModal = function() {
    this.waitUntilOverlayNotVisible();
    return this.click(BUTTON_CLOSE_MODAL);
};

module.exports = AdDetailsPage;
