'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');
const driverTimeOut = 5000;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;

// buttons
const BUTTON_NEW_LINE_ITEM = By.xpath('//button[text() = "Create Line Item"]');
const BUTTON_AD_LI = By.xpath('//button[text() = "Create Ad"]');
const LINK_EDIT = By.xpath('//line-item-section-card/div/section-card/div' +
    '/div[2]/nav/ul/li[1]/a/span');
const LINK_REVIEW_LI = By.xpath('//a[text() = "Review Line Item Details"]');
const EDIT_ADV = By.xpath('//a[text() = "Edit"]');
const LOADER = By.id('loading-spinner');
const INPUT_SEARCH = By.css('input[placeholder="Search"]');

// PERMISSION-specific - buttons
const BUTTON_NEW_IO = By.xpath('//button[text() = "Create Test' +
    ' Insertion Order"]');
const BUTTON_NEW_CAMPAIGN = By.xpath('//button[text() = "Create Campaign"]');
const EDIT_IO = By.xpath('//section-card/div/section/div/nav/ul/li/a');
const EDIT_CAMP = By.xpath('//campaign-details-card/div/section-card/div/' +
    'div[2]/nav/ul/li/a/span');

// text and non-input elements
const HEADER_PAGE_NAME = By.css('div.modal---header');

// succeding page elements (use for waituntilvisible)
const BUTTON_BRANDING = By.xpath('//span[text() = "Increase awareness of' +
    ' a brand or product."]'); // for choosing new campaign type

function advDetsPage(webdriver) {
    BasePage.call(this, webdriver);
}

advDetsPage.prototype = Object.create(BasePage.prototype);
advDetsPage.prototype.constructor = advDetsPage;

advDetsPage.prototype.getLinkEdit = function() {
    this.waitUntilVisible(LINK_EDIT);
    return this.findElement(LINK_EDIT);
};

advDetsPage.prototype.getEditAdv = function() {
    this.waitUntilVisible(EDIT_ADV);
    return this.findElement(EDIT_ADV);
};

advDetsPage.prototype.clickEditAdv = function() {
    this.driver.sleep(3000);
    this.waitUntilVisible(EDIT_ADV);
    this.click(EDIT_ADV);
    return this.driver.sleep(3000);
};

advDetsPage.prototype.getButtonAdLineItem = function() {
    this.waitUntilVisible(BUTTON_AD_LI);
    return this.findElement(BUTTON_AD_LI);
};

advDetsPage.prototype.clickEditCampaign = function(campName) {
    this.click(By.xpath('//a[text() = "' + campName + '"]'));
    this.scrollUp();
    this.waitUntilVisible(EDIT_CAMP);
    this.driver.sleep(driverTimeOut);
    this.click(EDIT_CAMP);
    this.waitUntilNotVisible(LOADER);
    return this.waitUntilVisible(HEADER_PAGE_NAME);
};

advDetsPage.prototype.clickLinkEditCampaign = function() {
    this.waitUntilVisible(EDIT_CAMP);
    this.click(EDIT_CAMP);
    this.waitUntilNotVisible(LOADER);
    return this.waitUntilVisible(HEADER_PAGE_NAME);
};

advDetsPage.prototype.clickEditLineItem = function(lineItemName) {
    this.click(
        By.xpath('//a[text() = "' + lineItemName + '"]'));
    this.driver.sleep(driverTimeOut);
    this.scrollUp();
    this.waitUntilVisible(LINK_EDIT);
    this.click(LINK_EDIT);
    this.waitUntilNotVisible(LOADER);
    return this.waitUntilVisible(HEADER_PAGE_NAME);
};

advDetsPage.prototype.clickNewLineItem = function() {
    this.waitUntilVisible(BUTTON_NEW_LINE_ITEM);
    this.click(BUTTON_NEW_LINE_ITEM);
    this.waitUntilNotVisible(LOADER);
    this.driver.sleep(3000);
    return this.waitUntilVisible(HEADER_PAGE_NAME);
};

advDetsPage.prototype.getH1Text = function(elementText) {
    return this.findElement(By.
        xpath("//span[text() = '" + elementText + "']"));
};

advDetsPage.prototype.getIoName = function(elementText) {
    return this.getH1Text(elementText);
};

advDetsPage.prototype.getCampaignName = function(elementText) {
    return this.getH1Text(elementText);
};

advDetsPage.prototype.getLineItemName = function(elementText) {
    return this.getH1Text(elementText);
};

advDetsPage.prototype.getLinkText = function(elementText) {
    return this.findElement(By
        .xpath("//a[text() = '" + elementText + "']"));
};

advDetsPage.prototype.getLinkReviewLI = function() {
    this.waitUntilVisible(LINK_REVIEW_LI);
    this.findElement(LINK_REVIEW_LI);
    return this;
};

advDetsPage.prototype.clickAdvertiser = function(elementText) {
    this.click(By.xpath("//a[text() = '" + elementText + "']"));
    return this.waitUntilVisible(By
        .xpath("//span[text() = '" + elementText + "']"));
};

advDetsPage.prototype.clickCampaign = function(elementText) {
    this.click(By.xpath("//a[text() = '" + elementText + "']"));
    this.waitUntilVisible(BUTTON_NEW_LINE_ITEM);
    return this;
};

advDetsPage.prototype.clickLineItem = function(elementText) {
    this.click(By.xpath("//a[text() = '" + elementText + "']"));
    this.driver.sleep(driverTimeOut);
    return this.waitUntilVisible(LINK_REVIEW_LI);
};

advDetsPage.prototype.getAdv = function(elementText) {
    this.waitUntilVisible(By.xpath("//a[text() = '" + elementText + "']"));
    return this.driver
        .findElement(By.xpath("//a[text() = '" + elementText + "']"));
};

advDetsPage.prototype.getAdvTitle = function(elementText) {
    return this.findElement(By
        .xpath("//span[text() = '" + elementText + "']"));
};

advDetsPage.prototype.getResult = function(name) {
    return this.findElement(
        By.xpath('//span[@class="overflow" and text()="' + name + '"]'));
};

advDetsPage.prototype.getTableName = function(name) {
    return this.findElement(
        By.xpath('//a[@class="overflow" and text()="' + name + '"]'));
};

advDetsPage.prototype.getTableId = function(id) {
    return this.findElement(
        By.xpath('//div[text()="' + id + '"]'));
};

advDetsPage.prototype.getTableBudget = function(budget) {
    return this.findElement(
        By.xpath('//div[@class="cell ellipsis align-right"]' +
            '/span[text()="' + budget + '"]'));
};

advDetsPage.prototype.getTableSpent = function(spent) {
    return this.findElement(
        By.xpath('//div[@class="cell ellipsis align-right"]' +
            '/span[text()="' + spent + '"]'));
};

advDetsPage.prototype.getTableDate = function(date) {
    return this.findElement(
        By.xpath('//div[@class="cell cell--noflex cell--date' +
            ' ellipsis align-left"]/span[text()="' + date + '"]'));
};

advDetsPage.prototype.getTableGoal = function(goal) {
    return this.findElement(
        By.xpath('//div[@class="column--6 align-left goal-number"' +
            ' and contains(.,"' + goal + '")]'));
};

advDetsPage.prototype.getTableStatus = function(stat) {
    return this.findElement(
        By.xpath('//div[@class="cell ellipsis capitalize' +
            ' align-left"]/span[text()="' + stat + '"]'));
};

advDetsPage.prototype.getTablePacing = function(pac) {
    return this.findElement(
        By.xpath('//div[@class="pacing-pill-bar--status _label"' +
            ' and text()="' + pac + '"]'));
};

advDetsPage.prototype.getIOTableId = function(id) {
    return this.findElement(
        By.xpath('//div[text()="' + id + '"]'));
};

advDetsPage.prototype.getIOTableBudget = function(budget) {
    return this.findElement(
        By.xpath('//div[@class="padding insertion-order---header"]' +
            '/div[2]/div[2]/div[text()="' + budget + '"]'));
};

advDetsPage.prototype.getIOTableSpent = function(spent) {
    return this.findElement(
        By.xpath('//div[@class="padding insertion-order---header"]' +
            '/div[2]/div[3]/div[text()="' + spent + '"]'));
};

advDetsPage.prototype.getIOTableDate = function(date) {
    return this.findElement(
        By.xpath('//div[@class="padding insertion-order---header"]' +
            '/div[2]/div[4]/div[text()="' + date + '"]'));
};

advDetsPage.prototype.clickLink = function(elementText) {
    return this.click(By.
        xpath('//a[text() = "' + elementText + '"]'));
};

// PERMISSION-specific - admin

advDetsPage.prototype.getEditIo = function() {
    this.waitUntilVisible(EDIT_IO);
    return this.click(EDIT_IO);
};

advDetsPage.prototype.clickNewIo = function() {
    return this.click(BUTTON_NEW_IO);
};

advDetsPage.prototype.clickEditIo = function(ioName) {
    this.click(By.xpath('//a[text() = "' + ioName + '"]'));
    this.waitUntilVisible(EDIT_IO);
    this.click(EDIT_IO);
    return this;
};

advDetsPage.prototype.getButtonNewIo = function() {
    return this.findElement(BUTTON_NEW_IO);
};

advDetsPage.prototype.clickIo = function(elementText) {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(By.xpath("//a[contains(text(),'" +
        elementText + "')]"));
    this.click(By.xpath("//a[contains(text(),'" + elementText + "')]"));
    this.waitUntilLoaderNotVisible();
    return this;
};

advDetsPage.prototype.searchForCampaign = function(campaignName){
    this.getElement(INPUT_SEARCH);
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, campaignName);
    this.sendKeys(INPUT_SEARCH, key.ENTER);
    return this.waitUntilFilterStale();
};

// PERMISSION-specific - self-service
advDetsPage.prototype.getButtonNewCam = function() {
    this.waitUntilVisible(BUTTON_NEW_CAMPAIGN);
    return this.click(BUTTON_NEW_CAMPAIGN);
};

advDetsPage.prototype.clickNewCam = function() {
    this.click(BUTTON_NEW_CAMPAIGN);
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(BUTTON_BRANDING);
};

advDetsPage.prototype.clickCam = function(elementText) {
    this.waitUntilVisible(By.xpath("//a[text() = '" + elementText + "']"));
    this.click(By.xpath("//a[text() = '" + elementText + "']"));
    return this.waitUntilVisible(BUTTON_NEW_LINE_ITEM);
};

module.exports = advDetsPage;
