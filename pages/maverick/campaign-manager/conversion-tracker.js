'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;
const specialTimeOut = 90000;
const twoSecondTO = 2000;

// elements
const NEW_TRACKER = By.xpath('//button[text() = "Create Conversion Tracker"]');
const TRACKER_TABLE = By.css('async-table');
const COLUMN_CREATED = By.css('th[async-sort="created"]');
const ZERO_CREATE = By.css('.data-table---zero button.button--create');
const TRACKER_TOTAL = By.css('span.supporting');
const TRACKER_SEARCH = By.css('input[placeholder="Search"]');
const EDIT_NAME_FIELD = By.css('input.ng-pristine.ng-valid.ng-touched');
const TRACKER_LIGHTBOX = By.css('conversion-tracker-create');
const TRACKER_ADVERTISER = By.css('input' +
    '[placeholder="Type an advertiser name"]');
const TRACKER_NAME = By.name('name');
const TYPE_DROPDOWN = By.css('._form--control button.dropdown');
const IMAGE_PIXE_OPTION = By.xpath('//div[@class=\'dropdown--container\']/ul' +
            '/li[2]/a/span[text()=\'Image Pixel\']');
const TRACKER_CREATE = By.xpath('//button[text() = "Create Tracker"]');
const TRACKER_SAVE = By.xpath('//button[text() = "Save and Exit"]');
const TRACKER_CLOSE = By.xpath('//conversion-tracker-create/lightbox/div[2]' +
    '/div/div/div[1]/button/span');
const TRACKER_CLOSE_DETAILS = By.xpath('//conversion-tracker-details' +
    '/lightbox/div[2]/div/div/div[1]/button/span');
const VIEW_CODE = By.xpath('//a[text()=\'View Code\']');
const VIEW_DETAILS = By.xpath('//table/tbody/tr[1]' +
    '/td[1]/row-actions/div/ul/li[1]/a');
const ATTR_WINDOW_DROPDOWN = By.css('select-dropdown[name="expiration"]' +
    ' div button');
const CODE_MODAL_BODY = By.css('.lightbox--body');
const CODE_TRACKER = By.css('textarea.spacer--small-bottom');
const CODE_MODAL_CLOSE = By.css(
    '.icon.icon--exit.icon--lg');
const EDITABLE_NAME_ICON = By.css('.selectable--remove.icon.icon--edit');
const TRACKER_EDIT_NAME = By.css(
    '.content-editable--width content-editable .content-editable input');
const FIRST_TRACKER_NAME = By.css('div.editable--content');
const ERROR_TRACKER = By.css('.error ._alert ._alert---title');
const CODE_COPY_LINK = By.linkText('Copy Code to Clipboard');
const DETAILS_MODAL = By.xpath('//conversion-tracker-details/lightbox');
const IMAGE_PIXEL = By.xpath('//h4[text() = "Image Pixel"]');
const ALERT_ERROR = By.css('.error');
const SEARCH_ELEMENT = By.css('a.search--item');
const TABLE_OVERLAY = By.css('.no-spinner.ng-trigger');
const CLOSE_ALERT = By.css('.close.button--close.pull-right');

let element;

function TrackerPage(webdriver) {
    BasePage.call(this, webdriver);
}

TrackerPage.prototype = Object.create(BasePage.prototype);
TrackerPage.prototype.constructor = TrackerPage;

TrackerPage.prototype.navigate = function(url) {
    this.driver.navigate().to(url + '/campaign-manager/conversion-trackers');
    return this;
};

TrackerPage.prototype.getNewTrackerButton = function() {
    this.waitUntilVisible(NEW_TRACKER);
    return this.findElement(NEW_TRACKER);
};

TrackerPage.prototype.getTrackerTable = function() {
    this.waitUntilVisible(TRACKER_TABLE);
    return this.findElement(TRACKER_TABLE);
};

TrackerPage.prototype.getZeroAddTrackerButton = function() {
    this.waitUntilVisible(ZERO_CREATE);
    return this.findElement(ZERO_CREATE);
};

TrackerPage.prototype.getTrackerSearchField = function() {
    this.waitUntilVisible(TRACKER_SEARCH);
    return this.findElement(TRACKER_SEARCH);
};

TrackerPage.prototype.getTrackerTotal = function() {
    this.waitUntilVisible(TRACKER_TOTAL);
    return this.findElement(TRACKER_TOTAL);
};

TrackerPage.prototype.getTrackerEditField = function() {
    this.waitUntilVisible(EDIT_NAME_FIELD);
    return this.findElement(EDIT_NAME_FIELD);
};

TrackerPage.prototype.getTrackerLightbox = function() {
    this.waitUntilVisible(TRACKER_LIGHTBOX);
    return this.findElement(TRACKER_LIGHTBOX);
};

TrackerPage.prototype.getTrackerName = function() {
    this.waitUntilVisible(TRACKER_NAME);
    return this.findElement(TRACKER_NAME);
};

TrackerPage.prototype.getAdvertiserField = function() {
    this.waitUntilVisible(TRACKER_ADVERTISER);
    return this.findElement(TRACKER_ADVERTISER);
};

TrackerPage.prototype.getTrackerTypeDropdown = function() {
    this.waitUntilVisible(TYPE_DROPDOWN);
    return this.findElement(TYPE_DROPDOWN);
};

TrackerPage.prototype.getTrackerCloseButton = function() {
    this.waitUntilVisible(TRACKER_CLOSE);
    return this.findElement(TRACKER_CLOSE);
};

TrackerPage.prototype.getTrackerCloseDetailsButton = function() {
    this.waitUntilVisible(TRACKER_CLOSE_DETAILS);
    return this.findElement(TRACKER_CLOSE_DETAILS);
};

TrackerPage.prototype.getTrackerCreateButton = function() {
    this.waitUntilVisible(TRACKER_CREATE);
    return this.findElement(TRACKER_CREATE);
};

TrackerPage.prototype.getAttributionWindowButton = function() {
    this.waitUntilVisible(ATTR_WINDOW_DROPDOWN);
    return this.findElement(ATTR_WINDOW_DROPDOWN);
};

TrackerPage.prototype.getAlertError = function() {
    this.waitUntilVisible(ALERT_ERROR);
    return this.findElement(ALERT_ERROR);
};

TrackerPage.prototype.getAlertErrorTimed = function() {
    this.waitUntilVisibleTimed(ALERT_ERROR, specialTimeOut);
    return this.findElement(ALERT_ERROR);
};

TrackerPage.prototype.getSearchItems = function() {
    this.waitUntilVisible(SEARCH_ELEMENT);
    return this.getElement(SEARCH_ELEMENT);
};

TrackerPage.prototype.getTableTracker = function(name) {
    this.waitUntilVisible(By.
        xpath('//span[@class="overflow" and contains(.,"'
            + name + '")]'));
    return this.findElement(
        By.xpath('//span[@class="overflow" and contains(.,"'
             + name + '")]'));
};

TrackerPage.prototype.clickTableTracker = function(name) {
    this.waitUntilVisible(
        By.xpath('//span[contains(text(), "' + name + '")]'));
    this.click(By.xpath('//span[contains(text(), "' + name + '")]'));
};

TrackerPage.prototype.getTableHeader = function(name) {
    return this.findElement(
        By.xpath('//div[@class="flexrow"]//div/h5[text()="' + name + '"]'));
};

TrackerPage.prototype.clickTableHeader = function(name) {
    this.waitUntilVisible(By.
        xpath('//th[text()="' + name + '"]'));
    return this.click(
        By.xpath('//th[text()="' + name + '"]'));
};

TrackerPage.prototype.clickTableHeaderCreated = function() {
    this.driver.sleep(1000);
    this.waitAndClick(COLUMN_CREATED);
    return this.waitUntilStale(TABLE_OVERLAY);
};

TrackerPage.prototype.clickNewTracker = function() {
    this.waitUntilVisible(NEW_TRACKER);
    this.click(NEW_TRACKER);
    return this.waitUntilVisible(TRACKER_LIGHTBOX);
};

TrackerPage.prototype.clickImagePixel = function() {
    this.waitUntilVisible(IMAGE_PIXEL);
    return this.click(IMAGE_PIXEL);
};

TrackerPage.prototype.clickAttributionWindowButton = function() {
    this.waitUntilVisible(ATTR_WINDOW_DROPDOWN);
    return this.click(ATTR_WINDOW_DROPDOWN);
};

TrackerPage.prototype.clickTrackerAdvertiser = function() {
    this.waitUntilVisible(TRACKER_ADVERTISER);
    return this.click(TRACKER_ADVERTISER);
};


TrackerPage.prototype.setTrackerAdvertiser = function(name) {
    this.clickTrackerAdvertiser();
    this.clear(TRACKER_ADVERTISER);
    this.sendKeys(TRACKER_ADVERTISER, name);
    this.driver.sleep(twoSecondTO);
    this.clickTrackerAdvertiser();
    this.clear(TRACKER_ADVERTISER);
    this.sendKeys(TRACKER_ADVERTISER, name);
    this.sendKeys(TRACKER_ADVERTISER, key.BACK_SPACE);
    this.driver.sleep(twoSecondTO);
    this.sendKeys(TRACKER_ADVERTISER, key.BACK_SPACE);
    this.getSearchItems();
    this.click(SEARCH_ELEMENT);
    return this;
};

TrackerPage.prototype.setTrackerName = function(name) {
    this.clear(TRACKER_NAME);
    return this.sendKeys(TRACKER_NAME, name);
};

TrackerPage.prototype.clickTrackerName = function() {
    this.click(TRACKER_NAME);
    return this.driver.sleep(1000);
};

TrackerPage.prototype.clickCloseButton = function() {
    this.waitUntilVisible(TRACKER_CLOSE);
    return this.click(TRACKER_CLOSE);
};

TrackerPage.prototype.clickTrackerCreate = function() {
    this.waitUntilVisible(TRACKER_CREATE);
    return this.click(TRACKER_CREATE);
};

TrackerPage.prototype.clickTrackerSave = function() {
    this.waitUntilVisible(TRACKER_SAVE);
    return this.click(TRACKER_SAVE);
};

TrackerPage.prototype.waitForButtonEnabled = function() {
    return this.waitUntilEnabled(TRACKER_CREATE);
};

TrackerPage.prototype.waitForModalStale = function() {
    return this.waitUntilStale(TRACKER_LIGHTBOX);
};

TrackerPage.prototype.dontGetTableTracker = function(name) {
    element = By.xpath('//div[@class="editable--content" and contains(.,\''
            + name + '\')]');
    return this.elementNotLocated(element);
};

TrackerPage.prototype.clickGetCode = function(text) {
    this.clickTableTracker(text);
    this.waitUntilVisible(VIEW_CODE);
    this.click(VIEW_CODE);
    return this.waitUntilVisible(CODE_MODAL_BODY);
};

TrackerPage.prototype.clickViewDetails = function(text) {
    this.driver.sleep(twoSecondTO);
    this.clickTableTracker(text);
    this.waitUntilVisible(VIEW_DETAILS);
    this.click(VIEW_DETAILS);
    this.waitUntilVisible(DETAILS_MODAL);
    return this.driver.sleep(twoSecondTO);
};

TrackerPage.prototype.getCodeButton = function(text) {
    return this.findElement(
        By.xpath(
            '//div[@class=\'editable--content\' and contains(.,\'' + text +
            '\')]/../../../../../li[@class=\'no-border\']/a'));
};

TrackerPage.prototype.getTrackerCodeBody = function() {
    this.waitUntilVisible(CODE_MODAL_BODY);
    return this.findElement(CODE_MODAL_BODY);
};

TrackerPage.prototype.getTrackerCodeSection = function() {
    this.waitUntilVisible(CODE_TRACKER);
    return this.findElement(CODE_TRACKER);
};

TrackerPage.prototype.getTrackerCodeClose = function() {
    this.waitUntilVisible(CODE_MODAL_CLOSE);
    return this.findElement(CODE_MODAL_CLOSE);
};

TrackerPage.prototype.getCopyCodeLink = function() {
    this.waitUntilVisible(CODE_COPY_LINK);
    return this.findElement(CODE_COPY_LINK);
};

TrackerPage.prototype.getFirstTrackerName = function() {
    this.waitUntilVisible(FIRST_TRACKER_NAME);
    return this.findElement(FIRST_TRACKER_NAME).getText();
};

TrackerPage.prototype.getTrackerId = function(tracker) {
    return this.findElement(
        By.xpath('//div[contains(text(), "' + tracker + '")]'));
};

TrackerPage.prototype.getTrackerErrorAlertPresent = function() {
    return this.waitUntilVisible(ERROR_TRACKER);
};


TrackerPage.prototype.clickCloseCodeModal = function() {
    this.click(CODE_MODAL_CLOSE);
    return this.elementNotLocated(CODE_MODAL_BODY);
};

TrackerPage.prototype.clickTrackerTypeDropdown = function() {
    return this.click(TYPE_DROPDOWN);
};

TrackerPage.prototype.selectImagePixel = function() {
    this.clickTrackerTypeDropdown();
    return this.click(IMAGE_PIXE_OPTION);
};

TrackerPage.prototype.getTrackerEdit = function() {
    return this.findElement(CODE_MODAL_BODY);
};

TrackerPage.prototype.editTrackerName = function(name, newName) {
    this.clickViewDetails(name);
    this.setTrackerName(newName);
    this.clickTrackerSave();
};

TrackerPage.prototype.chooseAdvertiserOption = function(text) {
    return this.click(By.xpath(
        '//dropdown[@class="full-width"]/div/div/div/div/ul' +
        '//a[contains(text(), "' + text + '")]'));
};

TrackerPage.prototype.getConversionTracker = function(text) {
    this.waitUntilVisible(TRACKER_TABLE);
    return this.findElement(By.xpath(
        '//div[@class="editable--content and contains(.,"' + text + '")]'));
};

TrackerPage.prototype.setInputSearchTracker = function(value) {
    this.waitUntilVisible(TRACKER_SEARCH);
    this.clear(TRACKER_SEARCH);
    this.sendKeys(TRACKER_SEARCH, value);
    this.sendKeys(TRACKER_SEARCH, key.ENTER);
    return this.driver.sleep(twoSecondTO);
};

TrackerPage.prototype.closeAlert = function() {
    return this.getElement(CLOSE_ALERT).click();
};

module.exports = TrackerPage;
