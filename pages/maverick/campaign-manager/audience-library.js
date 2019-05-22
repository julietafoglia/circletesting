'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');
const driverTimeOut = 0;
const oneSecTO = 1000;
const twoSecTO = 2000;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;

// inputs
const BUTTON_NEW_AUDIENCE = By.
    css('a[class="button create"]');
const INPUT_SEARCH = By.css('async-table input[type="text"]');
const INPUT_AUDIENCE_NAME = By.xpath('//content-editable/div/input');
const TITLE_AUDIENCES = By.xpath('//h1[text() = "Audiences"]');
const TITLE_AUDIENCES_VIEW = By.css(
    'section:nth-child(2) > div:nth-child(1) > div > div > h3');
const AUDIENCES_SELECT = By.xpath('//span[contains(text(),"All Advertisers")]');
const ROWS_TO_SHOW = By.css('section:nth-child(2) > div:nth-child(2) ' +
    'select-dropdown > div');
const FIRST_CONTROL_BUTTON = By.css('section:nth-child(2) > div:nth-child(2) ' +
    'button:nth-child(5)');
const PREVIOUS_CONTROL_BUTTON = By.css('section:nth-child(2) > ' +
    'div:nth-child(2) button:nth-child(6)');
const NEXT_CONTROL_BUTTON = By.css('section:nth-child(2) > div:nth-child(2) ' +
    'button:nth-child(7)');
const LAST_CONTROL_BUTTON = By.css('section:nth-child(2) > div:nth-child(2) ' +
    'button:nth-child(8)');
const UPLOAD_AUDIENCE_FILE = By.css('section:nth-child(1) ' +
    'div.column--2.align-right > button');
const AUDIENCE_TABLE = By.css('div:nth-child(2) div.data > table');
const INPUT_FILE = By.xpath('//upload/div/input');
const SAVE_AND_EXIT = By.css('div.modal---footer footer > div > button');
const ALERT = By.css('div.notifications > alertnext > div');
const TITLE_AUDIENCE_DETAILS = By.css('div.column--12.lightbox--header > h4');
const LINK_REMOVE = By.xpath('//a[text() = "Remove from Audience"]');
const CREATE_LIVE_AUDIENCE = By.css('bubble-card[title="Upload LiveAudience"]' +
    ' div ul li span');


const FIRTS_AUDIENCE_NAME = By.css('tr:nth-child(1) ' +
    'span.ellipsis-wrap-white-space');
const TABLE_AUDIENCE_NAME = By.css('table tr > th.name.active.ascending');
const TABLE_ADV_NAME = By.css('table tr > th:nth-child(2)');
const TABLE_MATCH_COUNT = By.css('table tr > th:nth-child(3)');
const TABLE_SEGMENT_SIZE = By.css('table tr > th:nth-child(4)');
const TABLE_CREATED = By.css('table tr > th:nth-child(5)');
const TABLE_UPDATED = By.css('table tr > th:nth-child(6)');
const TABLE_ACTION = By.xpath('//h5[text() = "Action"]');
const TABLE_TYPE = By.xpath('//h5[text() = "Type"]');
const TABLE_TOTAL = By.xpath('//h5[text() = "Total"]');
const TABLE_REJECTED = By.xpath('//h5[text() = "Rejected"]');
const TITLE_SHARE = By.xpath('//h2[text() = "Share audience?"]');

const LOADER = By.id('loading-spinner');
const LINK_EDIT = By.xpath('//a[text() = "Edit"]');
const LINK_VIEW_DETAILS = By.css('tr:nth-child(1) ul > li:nth-child(2) > a');
const LINK_SHARE = By.xpath('//span[text() = "Share"]');
const LINK_DELETE = By.xpath('//span[text() = "Delete"]');
const LINK_DOWNLOAD = By.xpath('//a[text() = ' +
    '"Download Rejected Hashes"]');
const LINK_MORE = By.xpath('//span[text()= "More "]');
const FIRST_ROW = By.css('table tbody > tr');
const CLOSE_VIEW_DETAILS = By.css('div > footer > button');
const CLOSE_VIEW_DETAILS_HEADER = By.css('div.column--12.lightbox--header > ' +
    'button');
const TABLE_DETAILS = By.css('div.lightbox.ng-trigger.ng-trigger-lightbox > '
    + 'div > div div.data > table');
const BUTTON_CANCEL = By.css('confirm-dialog:nth-child(3) ' +
    '.spacer--large-right');
const BUTTON_SHARE = By.xpath('//button[text() = "Yes, Share Audience"]');
const SPINNER = By.css('div .spinner--small');


function AudienceLibraryPage(webdriver) {
    BasePage.call(this, webdriver);
}

AudienceLibraryPage.prototype = Object.create(BasePage.prototype);
AudienceLibraryPage.prototype.constructor = AudienceLibraryPage;

AudienceLibraryPage.prototype.getTitleAudiences = function() {
    this.waitUntilVisible(TITLE_AUDIENCES);
    return this.findElement(TITLE_AUDIENCES);
};

AudienceLibraryPage.prototype.getTitleDetails = function() {
    this.waitUntilVisible(TITLE_AUDIENCE_DETAILS);
    return this.findElement(TITLE_AUDIENCE_DETAILS);
};

AudienceLibraryPage.prototype.getTitleAudienceSelect = function() {
    return this.findElement(AUDIENCES_SELECT);
};

AudienceLibraryPage.prototype.getTitleAudienceView = function() {
    return this.findElement(TITLE_AUDIENCES_VIEW);
};

AudienceLibraryPage.prototype.getRowsToShow = function() {
    return this.findElement(ROWS_TO_SHOW);
};

AudienceLibraryPage.prototype.getFirstControlButton = function() {
    return this.findElement(FIRST_CONTROL_BUTTON);
};

AudienceLibraryPage.prototype.getPreviousControlButton = function() {
    return this.findElement(PREVIOUS_CONTROL_BUTTON);
};

AudienceLibraryPage.prototype.getNextControlButton = function() {
    return this.findElement(NEXT_CONTROL_BUTTON);
};

AudienceLibraryPage.prototype.getLastControlButton = function() {
    return this.findElement(LAST_CONTROL_BUTTON);
};

AudienceLibraryPage.prototype.getUploadFileButton = function() {
    return this.findElement(UPLOAD_AUDIENCE_FILE);
};

AudienceLibraryPage.prototype.getAudienceTable = function() {
    return this.findElement(AUDIENCE_TABLE);
};

AudienceLibraryPage.prototype.getInputSearch = function() {
    this.waitUntilVisible(INPUT_SEARCH);
    return this.findElement(INPUT_SEARCH);
};

AudienceLibraryPage.prototype.setInputSearch = function(value) {
    this.waitUntilVisible(INPUT_SEARCH);
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.sendKeys(INPUT_SEARCH, key.ENTER);
    return this.driver.sleep(driverTimeOut);
};

AudienceLibraryPage.prototype.setInputAudienceName = function(value) {
    this.clear(INPUT_AUDIENCE_NAME);
    return this.sendKeys(INPUT_AUDIENCE_NAME, value);
};

AudienceLibraryPage.prototype.getLoader = function() {
    return this.waitUntilVisible(LOADER);
};

AudienceLibraryPage.prototype.getTableAudienceName = function() {
    return this.findElement(TABLE_AUDIENCE_NAME);
};

AudienceLibraryPage.prototype.getFirstAudienceName = function() {
    return this.getElementText(FIRTS_AUDIENCE_NAME);
};

AudienceLibraryPage.prototype.getTableAdvName = function() {
    return this.findElement(TABLE_ADV_NAME);
};

// AudienceLibraryPage.prototype.getTableFileName = function() {
//     return this.findElement(TABLE_FILE_NAME);
// };

AudienceLibraryPage.prototype.getTableMatchCount = function() {
    return this.findElement(TABLE_MATCH_COUNT);
};

AudienceLibraryPage.prototype.getTableSegmentSize = function() {
    return this.findElement(TABLE_SEGMENT_SIZE);
};

AudienceLibraryPage.prototype.getTableUpdated = function() {
    return this.findElement(TABLE_UPDATED);
};

AudienceLibraryPage.prototype.getTableCreated = function() {
    return this.findElement(TABLE_CREATED);
};

AudienceLibraryPage.prototype.getTableAction = function() {
    return this.findElement(TABLE_ACTION);
};

AudienceLibraryPage.prototype.getTableType = function() {
    return this.findElement(TABLE_TYPE);
};

AudienceLibraryPage.prototype.getTableTotal = function() {
    return this.findElement(TABLE_TOTAL);
};

AudienceLibraryPage.prototype.getTableRejected = function() {
    return this.findElement(TABLE_REJECTED);
};

AudienceLibraryPage.prototype.getButtonNewAudience = function() {
    return this.findElement(BUTTON_NEW_AUDIENCE);
};

AudienceLibraryPage.prototype.getLinkEdit = function() {
    this.findElement(LINK_EDIT);
    return this.driver.sleep(driverTimeOut);
};

AudienceLibraryPage.prototype.getLinkViewDetails = function() {
    this.findElement(LINK_VIEW_DETAILS);
    return this.driver.sleep(driverTimeOut);
};

AudienceLibraryPage.prototype.getLinkMore = function() {
    this.findElement(LINK_MORE);
    return this.driver.sleep(driverTimeOut);
};

AudienceLibraryPage.prototype.getShareAudience = function() {
    return this.findElement(LINK_SHARE);
};

AudienceLibraryPage.prototype.getDeleteAudience = function() {
    return this.findElement(LINK_DELETE);
};

AudienceLibraryPage.prototype.getDownloadRejectedHashes = function() {
    return this.findElement(LINK_DOWNLOAD);
};

AudienceLibraryPage.prototype.getTableDetails = function() {
    return this.findElement(TABLE_DETAILS);
};

AudienceLibraryPage.prototype.getButtonClose = function() {
    return this.findElement(CLOSE_VIEW_DETAILS);
};

AudienceLibraryPage.prototype.getButtonCloseHeader = function() {
    return this.findElement(CLOSE_VIEW_DETAILS_HEADER);
};

AudienceLibraryPage.prototype.getButtonCancel = function() {
    return this.findElement(BUTTON_CANCEL);
};

AudienceLibraryPage.prototype.getButtonShare = function() {
    return this.findElement(BUTTON_SHARE);
};

AudienceLibraryPage.prototype.getTitleShare = function() {
    this.waitUntilVisible(TITLE_SHARE);
    return this.findElement(TITLE_SHARE);
};

AudienceLibraryPage.prototype.waitUntilSpinnerDissapear = function(){
    return this.waitUntilStale(SPINNER);
};


// Clicks


AudienceLibraryPage.prototype.clickDeleteAudience = function(value) {
    this.waitUntilVisible(INPUT_SEARCH);
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.driver.sleep(oneSecTO);
    this.waitAndClick(FIRST_ROW);
    this.waitAndClick(LINK_MORE);
    return this.waitAndClick(LINK_DELETE);
};

AudienceLibraryPage.prototype.clickShareAudience = function(value) {
    this.waitUntilVisible(INPUT_SEARCH);
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.driver.sleep(oneSecTO);
    this.waitAndClick(FIRST_ROW);
    this.waitAndClick(LINK_MORE);
    return this.waitAndClick(LINK_SHARE);
};

AudienceLibraryPage.prototype.clickDetailsAudience = function() {
    this.waitUntilVisible(FIRST_ROW);
    this.click(FIRST_ROW);
    this.waitUntilVisible(LINK_VIEW_DETAILS);
    return this.click(LINK_VIEW_DETAILS);
};

AudienceLibraryPage.prototype.clickNewAudience = function() {
    this.waitAndClick(BUTTON_NEW_AUDIENCE);
    this.driver.sleep(twoSecTO);
    return this;
};

AudienceLibraryPage.prototype.clickCreateLiveAudience = function() {
    this.waitAndClick(CREATE_LIVE_AUDIENCE);
    return this.driver.sleep(driverTimeOut);
};

AudienceLibraryPage.prototype.clickRemoveFromAudience = function() {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(LINK_REMOVE);
    this.click(LINK_REMOVE);
    return this.driver.sleep(driverTimeOut);
};

AudienceLibraryPage.prototype.uploadFile = function(value, file) {
    this.waitUntilVisible(INPUT_SEARCH);
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.sendKeys(INPUT_SEARCH, key.ENTER);
    this.clickLinkEdit();
    this.sendKeys(INPUT_FILE, file);
    this.click(SAVE_AND_EXIT);
};

AudienceLibraryPage.prototype.clickLinkMore = function() {
    this.waitUntilVisible(FIRST_ROW);
    this.elementHover(FIRST_ROW);
    this.waitUntilVisible(LINK_MORE);
    this.click(LINK_MORE);
    return this.driver.sleep(driverTimeOut);
};

AudienceLibraryPage.prototype.clickLinkEdit = function() {
    this.waitAndClick(FIRST_ROW);
    this.waitUntilVisible(LINK_EDIT);
    this.click(LINK_EDIT);
    return this.driver.sleep(driverTimeOut);
};

AudienceLibraryPage.prototype.clickLinkAdd = function() {
    this.waitUntilVisible(LINK_EDIT);
    return this.click(LINK_EDIT);
};

AudienceLibraryPage.prototype.clickCreated = function() {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(TABLE_CREATED);
    this.click(TABLE_CREATED);
    return this.click(TABLE_CREATED);
};

AudienceLibraryPage.prototype.clickUpdated = function() {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(TABLE_UPDATED);
    return this.click(TABLE_UPDATED);
};

AudienceLibraryPage.prototype.goToEdit = function(value) {
    this.waitUntilVisible(By
        .xpath("//span[text() = 'ID: " + value + "']/" +
            "following-sibling::row-actions//div/ul/li/a[text()='Edit']"));
    this.click(By
        .xpath("//span[text() = 'ID: " + value + "']/" +
            "following-sibling::row-actions//div/ul/li/a[text()='Edit']"));
    return this.driver.sleep(driverTimeOut);
};

AudienceLibraryPage.prototype.goToEditByName = function(value) {
    this.waitUntilVisible(By
        .xpath("//span[text() = '" + value + "']/" +
            "following-sibling::row-actions//div/ul/li/a[text()='Edit']"));
    this.click(By
        .xpath("//span[text() = '" + value + "']/" +
            "following-sibling::row-actions//div/ul/li/a[text()='Edit']"));
    return this.driver.sleep(driverTimeOut);
};

AudienceLibraryPage.prototype.clickEditAudience = function(value) {
    this.waitUntilVisible(By
        .xpath("//span[contains(text(),'" + value + "')]"));
    this.click(By
        .xpath("//span[contains(text(),'" + value + "')]"));
    return this.driver.sleep(driverTimeOut);
};

AudienceLibraryPage.prototype.clickAudience = function(value) {
    this.waitUntilVisible(By
        .xpath("//span[contains(text(),'" + value + "')]"));
    this.click(By
        .xpath("//span[contains(text(),'" + value + "')]"));
    return this.driver.sleep(driverTimeOut);
};

AudienceLibraryPage.prototype.clickAudienceName = function(value) {
    this.waitUntilVisible(By
        .xpath("//span[contains(text(),'" + value + "')]"));
    this.elementHover(By
        .xpath("//span[contains(text(),'" + value + "')]"));
    return this.driver.sleep(driverTimeOut);
};

AudienceLibraryPage.prototype.getAudienceName = function(name) {
    this.waitUntilVisible(By.xpath(
        '//span[@class="ellipsis-wrap-white-space" and contains' +
                '(text(),"' + name + '")]'));
    return this.findElement(By.xpath(
        '//span[@class="ellipsis-wrap-white-space" and contains' +
                '(text(),"' + name + '")]'));
};

AudienceLibraryPage.prototype.clickFileViewAudience = function(value) {
    let actions = this.driver.actions();
    actions
        .mouseMove(this.getFileViewAudienceName(value))
        .click(this.getFileViewAudienceName(value))
        .perform();
    return this.driver.sleep(driverTimeOut);
};

AudienceLibraryPage.prototype.getFileViewAudienceName = function(name) {
    this.waitUntilVisible(By.xpath(
        '//div[@class="column--12 ellipsis" and contains' +
                '(text(),"' + name + '")]'));
    return this.findElement(By.xpath(
        '//div[@class="column--12 ellipsis" and contains' +
                '(text(),"' + name + '")]'));
};

AudienceLibraryPage.prototype.closeShareModal = function() {
    this.waitUntilVisible(BUTTON_CANCEL);
    this.click(BUTTON_CANCEL);
};

AudienceLibraryPage.prototype.searchForAudience = function(value) {
    this.waitUntilVisible(INPUT_SEARCH);
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    return this.waitAndClick(FIRST_ROW);
};

module.exports = AudienceLibraryPage;
