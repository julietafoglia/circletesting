'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const adSlotSpan = 'Ad Slot';

// elements
const PUB_BREADCRUMB = By.xpath();
const NEWLSETTER_BREADCRUMB = By.xpath();
const AD_SLOT_HEADER = By.xpath();
const AD_SLOT_NAME = By.xpath('//section-card/div/div/div/div/div/h1');
const AD_SLOT_ID = By.xpath('//section-card/div/div/div/div/p');
const EDIT_LINK = By.xpath('//a[contains(text(),"Edit")]');
const DELETE_LINK = By.xpath('//a[contains(text(),"Archive")]');
const ACTIVATE_LINK = By.xpath('//a[contains(text(),"Activate")]');
const VIEW_HISTORY_LINK = By.xpath('//a[contains(text(),"View History")]');
const LINKED_LI_TABLE = By.css('async-table div div');
const EMPTY_LI_TABLE = By.css('zero-state div div h3');

const DELETE_CHECKBOX_ONE =
    By.xpath('//dialog-box/div[2]/div/div/div[2]/div/div[1]/label/span');
const DELETE_CHECKBOX_TWO =
    By.xpath('//dialog-box/div[2]/div/div/div[2]/div/div[2]/label/span');
const DELETE_CHECKBOX_THREE =
    By.xpath('//dialog-box/div[2]/div/div/div[2]/div/div[3]/label/span');
const CANCEL_DELETE_BTN =
    By.xpath('//dialog-box/div[2]/div/div/div[3]/footer/div/div/button[1]');
const CONFIRM_DELETE_BTN =
    By.xpath('//dialog-box/div[2]/div/div/div[3]/footer/div/div/button[2]');
const DELETE_ALERT_MESSAGE =
    By.xpath('//dialog-box/div[2]/div/div/div[2]/div/div[1]/alert/div/div');

function AdSlotDetailsPage(webdriver) {
    this.driver = webdriver;
}

AdSlotDetailsPage.prototype = Object.create(BasePage.prototype);
AdSlotDetailsPage.prototype.constructor = AdSlotDetailsPage;

AdSlotDetailsPage.prototype.getAdSlotName = function(){
    return this.getElementText(AD_SLOT_NAME);
};

AdSlotDetailsPage.prototype.getAdSlotId = function(){
    return this.getElementText(AD_SLOT_ID);
};

AdSlotDetailsPage.prototype.getBreadcrumbLink = function() {
    return this.getSpan(adSlotSpan);
};

AdSlotDetailsPage.prototype.getEditAdSlotLink = function() {
    return this.getElement(EDIT_LINK);
};

AdSlotDetailsPage.prototype.getDeleteAdSlotLink = function() {
    return this.getElement(DELETE_LINK);
};

AdSlotDetailsPage.prototype.getActivateAdSlotLink = function() {
    return this.getElement(ACTIVATE_LINK);
};

AdSlotDetailsPage.prototype.getViewHistoryAdSlotLink = function() {
    return this.getElement(VIEW_HISTORY_LINK);
};

AdSlotDetailsPage.prototype.getLinkedLITable = function() {
    return this.getElement(LINKED_LI_TABLE);
};

AdSlotDetailsPage.prototype.getEmptyLITable = function() {
    return this.getElement(EMPTY_LI_TABLE);
};

module.exports = AdSlotDetailsPage;
