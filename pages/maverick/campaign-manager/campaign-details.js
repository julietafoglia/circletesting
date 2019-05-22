'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');
const driverTimeOut = 5000;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;

// inputs
const INPUT_SEARCH = By.css('async-table input');
const TITLE_NO_RESULTS = By.xpath('//h3[text() = "There are currently no' +
            ' results to show."]');
const TEXT_DDN_NO_RESULTS = By.xpath('//h4[text() = "Sorry, ' +
    'there are no results to show."]');

// buttons
const BUTTON_NEW_LINE_ITEM = By.xpath('//button[text() = "Create Line Item"]');
const BUTTON_NEW_CAMPAIGN = By.xpath('//button[text() = "Create Campaign"]');
const LINK_EDIT = By.xpath('//line-item-section-card/div/section-card/div' +
    '/div[2]/nav/ul/li[1]/a/span');
const LINK_REVIEW_LI = By.xpath('//a[text() = "Review Line Item Details"]');
const EDIT_CAMP = By.xpath('//a[text() = "Edit"]');
const ALERT_SUCCESS = By.css ('.success');
const DDN_SEARCH_RESULTS = By.css('.search-results');
const LOADER = By.xpath('//line-item-form/modal/div/div[2]/overlay/div/div');


function CampaignDetailsPage(webdriver) {
    BasePage.call(this, webdriver);
}

CampaignDetailsPage.prototype = Object.create(BasePage.prototype);
CampaignDetailsPage.prototype.constructor = CampaignDetailsPage;

CampaignDetailsPage.prototype.getTitleNoResults = function() {
    this.waitUntilVisible(TITLE_NO_RESULTS);
    return this.findElement(TITLE_NO_RESULTS);
};

CampaignDetailsPage.prototype.getTextDdnNoResults = function() {
    this.waitUntilVisible(DDN_SEARCH_RESULTS);
    return this.findElement(TEXT_DDN_NO_RESULTS);
};

CampaignDetailsPage.prototype.getInputSearch = function() {
    return this.findElement(INPUT_SEARCH);
};

CampaignDetailsPage.prototype.setInputSearch = function(value) {
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.sendKeys(INPUT_SEARCH, key.ENTER);
    return this;
};

CampaignDetailsPage.prototype.setInputSearchDdn = function(value) {
    this.waitUntilVisible(INPUT_SEARCH);
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.click(INPUT_SEARCH);
    this.driver.sleep(driverTimeOut);
    return this.waitUntilVisible(DDN_SEARCH_RESULTS);
};

CampaignDetailsPage.prototype.setInputSearchSecondDdn = function(value) {
    this.waitUntilVisible(INPUT_SEARCH);
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.driver.sleep(driverTimeOut);
    return this.waitUntilVisible(DDN_SEARCH_RESULTS);
};

CampaignDetailsPage.prototype.getButtonNewLineItem = function() {
    this.waitUntilVisible(BUTTON_NEW_LINE_ITEM);
    return this.findElement(BUTTON_NEW_LINE_ITEM);
};

CampaignDetailsPage.prototype.getButtonNewCampaign = function() {
    return this.findElement(BUTTON_NEW_CAMPAIGN);
};

CampaignDetailsPage.prototype.getLinkEdit = function() {
    this.waitUntilVisible(LINK_EDIT);
    return this.findElement(LINK_EDIT);
};

CampaignDetailsPage.prototype.clickEditCampaign = function(campName) {
    this.click(By.xpath('//a[text() = "' + campName + '"]'));
    this.scrollUp();
    this.waitUntilVisible(EDIT_CAMP);
    this.driver.sleep(driverTimeOut);
    this.click(EDIT_CAMP);
    this.waitUntilNotVisible(LOADER);
    return this;
};

CampaignDetailsPage.prototype.clickLinkEditCampaign = function() {
    this.waitUntilVisible(EDIT_CAMP);
    this.click(EDIT_CAMP);
    this.driver.sleep(driverTimeOut);
    return this;
};

CampaignDetailsPage.prototype.clickEditLineItem = function(lineItemName) {
    this.click(
        By.xpath('//a[text() = "' + lineItemName + '"]'));
    this.driver.sleep(driverTimeOut);
    this.scrollUp();
    this.waitUntilVisible(LINK_EDIT);
    this.click(LINK_EDIT);
    this.driver.sleep(driverTimeOut);
    return this;
};

CampaignDetailsPage.prototype.clickNewLineItem = function() {
    this.waitUntilVisible(BUTTON_NEW_LINE_ITEM);
    this.click(BUTTON_NEW_LINE_ITEM);
    this.waitUntilOverlayNotVisible();
    return this;
};

CampaignDetailsPage.prototype.clickNewCampaign = function() {
    this.waitAndClick(BUTTON_NEW_CAMPAIGN);
    this.waitOverlayUntilStale();
    return this;
};

CampaignDetailsPage.prototype.getH1Text = function(elementText) {
    return this.findElement(By.
        xpath("//span[text() = '" + elementText + "']"));
};

CampaignDetailsPage.prototype.getIoName = function(elementText) {
    return this.getH1Text(elementText);
};

CampaignDetailsPage.prototype.getCampaignName = function(elementText) {
    this.waitUntilVisible(this.getH1Text(elementText));
    return this.getH1Text(elementText);
};

CampaignDetailsPage.prototype.getLinkReviewLI = function() {
    this.waitUntilVisible(LINK_REVIEW_LI);
    this.findElement(LINK_REVIEW_LI);
    return this;
};

CampaignDetailsPage.prototype.clickAdvertiser = function(elementText) {
    this.click(By.xpath("//a[text() = '" + elementText + "']"));
    return this.waitUntilVisible(By
        .xpath("//span[text() = '" + elementText + "']"));
};

CampaignDetailsPage.prototype.clickIo = function(elementText) {
    this.findElement(By.xpath("//a[text() = '" + elementText + "']"))
        .click();
    return this.waitUntilVisible(BUTTON_NEW_CAMPAIGN);
};

CampaignDetailsPage.prototype.clickCampaign = function(elementText) {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(By.xpath("//a[text() = '" + elementText + "']"));
    this.click(By.xpath("//a[text() = '" + elementText + "']"));
    this.waitUntilVisible(BUTTON_NEW_LINE_ITEM);
    return this;
};

CampaignDetailsPage.prototype.clickLineItem = function(elementText) {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(By.xpath("//a[text() = '" + elementText + "']"));
    this.click(By.xpath("//a[text() = '" + elementText + "']"));
    this.driver.sleep(driverTimeOut);
    return this.waitUntilVisible(LINK_REVIEW_LI);
};

CampaignDetailsPage.prototype.scrollUp = function() {
    return this.driver.actions().sendKeys(key.PAGE_UP).perform();
};

CampaignDetailsPage.prototype.scrollDown = function() {
    return this.driver.actions().sendKeys(key.PAGE_DOWN).perform();
};

CampaignDetailsPage.prototype.getAdv = function(elementText) {
    this.waitUntilVisible(By.xpath("//a[text() = '" + elementText + "']"));
    return this.driver
        .findElement(By.xpath("//a[text() = '" + elementText + "']"));
};

CampaignDetailsPage.prototype.getAdvTitle = function(elementText) {
    return this.findElement(By
        .xpath("//span[text() = '" + elementText + "']"));
};

CampaignDetailsPage.prototype.getResult = function(name) {
    return this.findElement(
        By.xpath('//span[@class="overflow" and text()="' + name + '"]'));
};

CampaignDetailsPage.prototype.getTableName = function(name) {
    this.driver.sleep(driverTimeOut);
    return this.getElement(By.xpath('//a[text()="' + name + '"]'));
};

CampaignDetailsPage.prototype.getTableId = function(id) {
    return this.findElement(
        By.xpath('//span[text()="' + id + '"]'));
};

CampaignDetailsPage.prototype.getLineItemTableId = function(id) {
    return this.findElement(
        By.xpath('//span[text()="' + id + '"]'));
};

CampaignDetailsPage.prototype.getTableBudget = function(budget) {
    return this.findElement(
        By.xpath('//td[@class="currency"]/span[text()="' + budget + '"]'));
};

CampaignDetailsPage.prototype.getTableType = function(type) {
    return this.findElement(
        By.xpath('//span[text()="' + type + '"]'));
};

CampaignDetailsPage.prototype.getLineItemTableBudget = function(budget) {
    return this.findElement(
        By.xpath('//span[text()="' + budget + '"]'));
};

CampaignDetailsPage.prototype.getLineItemTableSpent = function(spent) {
    return this.findElement(
        By.xpath('//span[text()="' + spent + '"]'));
};


CampaignDetailsPage.prototype.getTableSpent = function(spent) {
    return this.findElement(
        By.xpath('//td[@class="currency"]/span[text()="' + spent + '"]'));
};

CampaignDetailsPage.prototype.getTableDate = function(date) {
    return this.findElement(
        By.xpath('//td[contains(.,"' + date + '")]'));
};

CampaignDetailsPage.prototype.getLineItemTableDate = function(date) {
    return this.findElement(
        By.xpath('//span[contains(.,"' + date + '")]'));
};

CampaignDetailsPage.prototype.getTableGoal = function(goal) {
    return this.findElement(
        By.xpath('//div[@class="column--6 align-left' +
            ' goal-number copy--supporting"' +
            ' and contains(.,"' + goal + '")]'));
};

CampaignDetailsPage.prototype.getTableStatus = function(stat) {
    return this.getElement(
        By.xpath('//span[@class="capitalize"' +
        ' and contains(.,"' + stat + '")]'));
};

CampaignDetailsPage.prototype.getTablePacing = function(pac) {
    return this.findElement(
        By.xpath('//div[@class="relative"' +
        ' and contains(.,"' + pac + '")]'));
};

CampaignDetailsPage.prototype.getIOTableId = function(id) {
    return this.findElement(
        By.xpath('//div[text()="' + id + '"]'));
};

CampaignDetailsPage.prototype.getIOTableBudget = function(budget) {
    return this.findElement(
        By.xpath('//div[@class="padding insertion-order---header"]' +
            '/div[2]/div[2]/div[text()="' + budget + '"]'));
};

CampaignDetailsPage.prototype.getIOTableSpent = function(spent) {
    return this.findElement(
        By.xpath('//div[@class="padding insertion-order---header"]' +
            '/div[2]/div[3]/div[text()="' + spent + '"]'));
};

CampaignDetailsPage.prototype.getIOTableDate = function(date) {
    return this.findElement(
        By.xpath('//div[@class="padding insertion-order---header"]' +
            '/div[2]/div[4]/div[text()="' + date + '"]'));
};

CampaignDetailsPage.prototype.clickLink = function(elementText) {
    this.click(By.
        xpath('//a[text() = "' + elementText + '"]'));
    return this.driver.sleep(driverTimeOut);
};

CampaignDetailsPage.prototype.getAlert = function() {
    this.waitUntilVisible(ALERT_SUCCESS);
    return this.findElement(ALERT_SUCCESS);
};

CampaignDetailsPage.prototype.verifyLinkNotPresent = function(value) {
    return this.elementNotLocated(By.
        xpath("//a[text() = '" + value + "']"));
};

module.exports = CampaignDetailsPage;
