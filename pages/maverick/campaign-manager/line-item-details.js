'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');
const fiveSecTO = 5000;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;

// elements
const TITLE_GOING_LIVE = By.xpath('//h4[text() = "Send Going Live' +
    ' Notification"]');
const TITLE_DELETE = By.xpath('//h2[text()="Delete line item?"]');

const TEXT_DELETE = By.xpath('//delete-line-item-dialog/confirm-dialog' +
    '/dialogbox/div[2]/div[2]/section/div/section/dialog-message/p');
const TEXT_LI_DELETE = By.xpath('//delete-line-item-dialog/confirm-dialog' +
    '/dialogbox/div[2]/div[2]/section/div/section/dialog-message/p/strong');
const TEXT_CHECK_DELETE = By.xpath('//delete-line-item-dialog/confirm-dialog' +
    '/dialogbox/div[2]/div[2]/section/div/section/dialog-confirmation' +
        '/p/label/span');
const TEXT_GOING_LIVE = By.xpath('//label[text() = "Send a notification' +
    ' with the details of this line item to the selected recipients."]');
const TEXT_RECIPIENTS = By.xpath('//div[text() = "Account Management,' +
    ' Account Executives, Ad Operations, Accounts Receivable"]');
const TEXT_ALERT_DELETE = By.xpath('//div[text()=" Please confirm you' +
    ' understand what happens when you delete this line item."]');

const INPUT_RECIPIENTS = By.css('input[name = "recipients"]');
const BUTTON_SEND = By.xpath('//button[text() = "Send Notification"]');
const BUTTON_CANCEL = By.xpath('//a[text() = "Cancel"]');
const BUTTON_CANCEL_DELETE = By.xpath('//delete-line-item-dialog/' +
    'confirm-dialog/dialogbox/div[2]/div[2]/section/div/section/div/button[1]');
const BUTTON_CONFIRM_DELETE = By.xpath('//delete-line-item-dialog/' +
    'confirm-dialog/dialogbox/div[2]/div[2]/section/div/section/div/button[2]');
const BUTTON_DELETING = By.xpath('//button[text() = "Deleting Line Item..."]');
const BUTTON_AD_LI = By.xpath('//button[text() = "Create Ad"]');
const MODAL_GOING_LIVE = By.xpath('//going-live-notification');

const LINK_EDIT = By.xpath('//a[text()= "Edit"]');
const LINK_SEND = By.xpath('//a[text()= "Send Notification"]');
const LINK_COPY = By.xpath('//a[text()= "Copy"]');
const LINK_WATCH = By.xpath('//a[text()= "Watch"]');
const LINK_UNWATCH = By.xpath('//a[text()= "Stop Watching"]');
const LINK_DELETE = By.xpath('//a[text()= "Delete"]');
const CHECK_DELETE = By.xpath('//delete-line-item-dialog/confirm-dialog' +
    '/dialogbox/div[2]/div[2]/section/div/section/dialog-confirmation/p/label');
const MODAL_DELETE = By.css('confirm-dialog[header="Delete line item?"]');

function LineItemDetailsPage(webdriver) {
    BasePage.call(this, webdriver);
}

LineItemDetailsPage.prototype = Object.create(BasePage.prototype);
LineItemDetailsPage.prototype.constructor = LineItemDetailsPage;

LineItemDetailsPage.prototype.getTitleGoingLive = function() {
    this.waitUntilVisible(MODAL_GOING_LIVE);
    return this.findElement(TITLE_GOING_LIVE);
};

LineItemDetailsPage.prototype.getTextGoingLive = function() {
    this.waitUntilVisible(MODAL_GOING_LIVE);
    return this.findElement(TEXT_GOING_LIVE);
};

LineItemDetailsPage.prototype.getTextRecipients = function() {
    this.waitUntilVisible(MODAL_GOING_LIVE);
    return this.findElement(TEXT_RECIPIENTS);
};

LineItemDetailsPage.prototype.getTitleDelete = function() {
    this.waitUntilVisible(TITLE_DELETE);
    return this.findElement(TITLE_DELETE);
};

LineItemDetailsPage.prototype.getTextDelete = function() {
    this.waitUntilVisible(TEXT_DELETE);
    return this.findElement(TEXT_DELETE);
};

LineItemDetailsPage.prototype.getTextLIDelete = function() {
    this.waitUntilVisible(TEXT_LI_DELETE);
    return this.findElement(TEXT_LI_DELETE);
};

LineItemDetailsPage.prototype.getTextAlertDelete = function() {
    this.waitUntilVisible(TEXT_ALERT_DELETE);
    return this.findElement(TEXT_ALERT_DELETE);
};

LineItemDetailsPage.prototype.getTextCheckDelete = function() {
    this.waitUntilVisible(TEXT_CHECK_DELETE);
    return this.findElement(TEXT_CHECK_DELETE);
};

LineItemDetailsPage.prototype.getInputRecipients = function() {
    this.waitUntilVisible(MODAL_GOING_LIVE);
    return this.findElement(INPUT_RECIPIENTS);
};

LineItemDetailsPage.prototype.getButtonSave = function() {
    this.waitUntilVisible(MODAL_GOING_LIVE);
    return this.findElement(BUTTON_SEND);
};

LineItemDetailsPage.prototype.getButtonCancel = function() {
    this.waitUntilVisible(MODAL_GOING_LIVE);
    return this.findElement(BUTTON_CANCEL);
};

LineItemDetailsPage.prototype.getButtonCancelDelete = function() {
    this.waitUntilVisible(BUTTON_CANCEL_DELETE);
    return this.findElement(BUTTON_CANCEL_DELETE);
};

LineItemDetailsPage.prototype.getButtonConfirmDelete = function() {
    this.waitUntilVisible(BUTTON_CONFIRM_DELETE);
    return this.findElement(BUTTON_CONFIRM_DELETE);
};

LineItemDetailsPage.prototype.getButtonDeleting = function() {
    this.waitUntilVisible(BUTTON_DELETING);
    return this.findElement(BUTTON_DELETING);
};

LineItemDetailsPage.prototype.getCheckDelete = function() {
    this.waitUntilVisible(CHECK_DELETE);
    return this.findElement(CHECK_DELETE);
};


LineItemDetailsPage.prototype.getModalGoingLive = function() {
    this.waitUntilVisible(MODAL_GOING_LIVE);
    return this.findElement(MODAL_GOING_LIVE);
};

LineItemDetailsPage.prototype.getLinkSendNotification = function() {
    this.waitUntilVisible(LINK_SEND);
    return this.findElement(LINK_SEND);
};

LineItemDetailsPage.prototype.getLinkEdit = function() {
    this.waitUntilVisible(LINK_EDIT);
    return this.findElement(LINK_EDIT);
};
LineItemDetailsPage.prototype.getLinkWatch = function() {
    this.waitUntilVisible(LINK_WATCH);
    return this.findElement(LINK_WATCH);
};
LineItemDetailsPage.prototype.getLinkUnwatch = function() {
    this.waitUntilVisible(LINK_UNWATCH);
    return this.findElement(LINK_UNWATCH);
};

LineItemDetailsPage.prototype.getLinkDelete = function() {
    this.waitUntilVisible(LINK_DELETE);
    return this.findElement(LINK_DELETE);
};

LineItemDetailsPage.prototype.getButtonAdLineItem = function() {
    this.waitUntilVisible(BUTTON_AD_LI);
    return this.findElement(BUTTON_AD_LI);
};

LineItemDetailsPage.prototype.setInputRecipients = function(value) {
    this.clear(INPUT_RECIPIENTS);
    this.sendKeys(INPUT_RECIPIENTS, value);
    this.sendKeys(INPUT_RECIPIENTS, key.ENTER);
    return this;
};

LineItemDetailsPage.prototype.clickSend = function() {
    return this.click(BUTTON_SEND);
};

LineItemDetailsPage.prototype.clickCancel = function() {
    return this.click(BUTTON_CANCEL);
};

LineItemDetailsPage.prototype.clickLinkSendNotification = function() {
    this.click(LINK_SEND);
    return this.waitUntilVisible(MODAL_GOING_LIVE);
};

LineItemDetailsPage.prototype.clickLinkCopy = function() {
    this.click(LINK_COPY);
    this.waitUntilOverlayNotVisible();
    return this;
};

LineItemDetailsPage.prototype.clickLinkEdit = function() {
    this.waitAndClick(LINK_EDIT);
    this.waitUntilOverlayNotVisible();
    return this;
};

LineItemDetailsPage.prototype.clickLinkWatch = function() {
    this.waitUntilVisible(LINK_WATCH);
    this.click(LINK_WATCH);
    return this.waitUntilVisible(LINK_UNWATCH);
};

LineItemDetailsPage.prototype.clickLinkUnwatch = function() {
    this.waitUntilVisible(LINK_UNWATCH);
    this.click(LINK_UNWATCH);
    return this.waitUntilVisible(LINK_WATCH);
};

LineItemDetailsPage.prototype.clickLinkDelete = function() {
    this.waitUntilVisible(LINK_DELETE);
    this.click(LINK_DELETE);
    this.driver.sleep(fiveSecTO);
    return this.waitUntilVisible(MODAL_DELETE);
};

LineItemDetailsPage.prototype.clickConfirmDelete = function() {
    this.waitUntilVisible(BUTTON_CONFIRM_DELETE);
    return this.click(BUTTON_CONFIRM_DELETE);
};

LineItemDetailsPage.prototype.clickConfirmValidDelete = function() {
    this.waitUntilVisible(BUTTON_CONFIRM_DELETE);
    this.click(BUTTON_CONFIRM_DELETE);
    return this.driver.sleep(fiveSecTO);
};

LineItemDetailsPage.prototype.clickCancelDelete = function() {
    this.waitUntilVisible(BUTTON_CANCEL_DELETE);
    this.click(BUTTON_CANCEL_DELETE);
    return this.driver.sleep(fiveSecTO);
};

LineItemDetailsPage.prototype.clickCheckboxDelete = function() {
    this.waitUntilVisible(CHECK_DELETE);
    return this.click(CHECK_DELETE);
};

LineItemDetailsPage.prototype.verifyLinkDeleteNotPresent = function() {
    return this.elementNotLocated(By.xpath('//span[text()= "Delete"]'));
};

LineItemDetailsPage.prototype.getLineItemName = function(elementText) {
    return this.findElement(By.
        xpath("//span[text() = '" + elementText + "']"));
};

LineItemDetailsPage.prototype.getLineItemTitleName = function(elementText) {
    this.waitUntilVisible(By.
        xpath("//span[text() = '" + elementText + "']"));
    return this.findElement(By.
        xpath("//span[text() = '" + elementText + "']"));
};

module.exports = LineItemDetailsPage;
