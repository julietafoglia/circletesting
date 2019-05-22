'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');
const driverTimeOut = 5000;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;
let twoSecTO = 2000;

// inputs
const BUTTON_UPLOAD = By.css('.button--create');
const BUTTON_CANCEL = By.xpath('//a[text() = "Cancel"]');
const BUTTON_ACTION = By.css('select-dropdown[name="action"] div button');
const TEXT_BUTTON_ACTION = By.css('select-dropdown[name="action"]' +
    ' div button span');
const BUTTON_DATA_TYPE = By.css('select-dropdown[name="hashType"] div button');
const BUTTON_DATA_TYPE_RATE = By.xpath('//section/div[2]/div[2]' +
    '/select-dropdown/div/button');
const BUTTON_UPDATE = By.xpath('//button[text() = "Upload Audience"]');

const INPUT_ADVERTISER = By.css('select-item > div > input[type="text"]');
const INPUT_AUDIENCE_NAME = By.css('div._form--control > input');
const INPUT_CHOOSE_AUDIENCE = By.css('select-item[name="audience"] div input');
const INPUT_FILE = By.css('file-input[name="file"] div input');
const INPUT_MATCH_RATE = By.css('file-input[name="files"] div input');
const INPUT_EMAIL = By.xpath('//input[@name="email"]');

const TEXT_CHECK_MERKLE = By.xpath('//span[text() = "This is a Merkle ' +
    'PAM audience file."]');
const TEXT_CHECK_SHARE = By.xpath('//span[text() = "Share this audience ' +
    'across the associated media group or agency."]');
const TEXT_CHECK_SPECIFIC_SHARE = By.xpath('//span[text() = "Share this ' +
    'audience with specific advertisers."]');
const TEXT_CHECK_EMAIL = By.xpath('//span[text() = "Email me when' +
    ' it\'s done."]');
const TEXT_ERROR = By.css('.copy--error-text');
const TEXT_UPLOADER = By.css('file-input[name="file"] div div div div h4');
const CHECK_MERKLE = By.xpath('//input[@name="isMerkle"]/parent::label');
const CHECK_SHARE = By.xpath('//input[@name="sharingControl"]/parent::label');
const CHECK_SPECIFIC_SHR = By.xpath('//input[@name="sharingControl"]/' +
    'parent::label/span[contains(text(), ' +
    '"Share this audience with specific advertisers")]');
const CHECK_EMAIL = By.xpath('//input[@name="emailMe"]/parent::label');
const INPUT_MERKLE = By.xpath('//upload-audience-form/div/form/' +
    'section-card[3]/div/div[2]/div[1]/div/div[3]/div[2]/label[1]/input');
const INPUT_DO_NOT_SHARE = By.xpath('//span[text() = "Do not share this' +
    ' audience."]');
const INPUT_SHARE_SPECIFIC = By.xpath('//span[text() = "Share this audience' +
    ' with specific advertisers."]');
const INPUT_SHARE_ACROSS = By.xpath('//span[text() = "Share this audience' +
    ' across the associated media group or agency."]');
const UPLOAD_CONTAINER = By.css('file-input[name="file"] div');
const UPLOAD_MATCH_RATE = By.css('file-input[name="files"] div');

const ALERT_TEXT = By.xpath('//alert/div/div');
const FILE_WIDGET = By.css('div.file-widget');
const FILE_NAME = By.css('.file-name');
const FILE_DELETE = By.xpath('//div/div/span[3]');
const ALERT_ERROR = By.xpath('//alert[1]/div/div/span');
const SEARCH_ITEM = By.css('dropdown div > ul > li:nth-child(1)');
const MODAL_BUTTON_CLOSE = By.css('div.column--4 > button');

const INPUT_DET = By.xpath('//input[@value="expansion:det"]/parent::label');
const INPUT_PROB = By.xpath('//input[@value="expansion:prob"]/parent::label');

const INPUT_PUB = By.xpath('//input[@name="doFilterPublisher"]/parent::label');

function AudienceFormPage(webdriver) {
    BasePage.call(this, webdriver);
}

AudienceFormPage.prototype = Object.create(BasePage.prototype);
AudienceFormPage.prototype.constructor = AudienceFormPage;


// Getters

AudienceFormPage.prototype.getButtonUpload = function() {
    this.waitUntilVisible(BUTTON_UPLOAD);
    return this.findElement(BUTTON_UPLOAD);
};

AudienceFormPage.prototype.getButtonCancel = function() {
    this.waitUntilVisible(BUTTON_CANCEL);
    return this.findElement(BUTTON_CANCEL);
};

AudienceFormPage.prototype.getButtonClose = function() {
    this.waitUntilVisible(MODAL_BUTTON_CLOSE);
    return this.findElement(MODAL_BUTTON_CLOSE);
};

AudienceFormPage.prototype.getButtonAction = function() {
    this.waitUntilVisible(BUTTON_ACTION);
    return this.findElement(BUTTON_ACTION);
};

AudienceFormPage.prototype.getTextButtonAction = function() {
    this.waitUntilVisible(TEXT_BUTTON_ACTION);
    return this.findElement(TEXT_BUTTON_ACTION);
};

AudienceFormPage.prototype.getButtonDataType = function() {
    this.waitUntilVisible(BUTTON_DATA_TYPE);
    return this.findElement(BUTTON_DATA_TYPE);
};

AudienceFormPage.prototype.getButtonDataTypeRate = function() {
    this.waitUntilVisible(BUTTON_DATA_TYPE_RATE);
    return this.findElement(BUTTON_DATA_TYPE_RATE);
};

AudienceFormPage.prototype.getButtonUpdate = function() {
    this.waitUntilVisible(BUTTON_UPDATE);
    return this.findElement(BUTTON_UPDATE);
};

AudienceFormPage.prototype.waitUntilSaveButtonEnabled = function() {
    return this.waitUntilEnabled(BUTTON_UPDATE);
};

AudienceFormPage.prototype.waitUntilSaveButtonDisabled = function() {
    return this.waitUntilDisabled(BUTTON_UPDATE);
};

AudienceFormPage.prototype.getInputAdvertiser = function() {
    this.waitUntilVisible(INPUT_ADVERTISER);
    return this.findElement(INPUT_ADVERTISER);
};

AudienceFormPage.prototype.getInputAudienceName = function() {
    this.waitUntilVisible(INPUT_AUDIENCE_NAME);
    return this.findElement(INPUT_AUDIENCE_NAME);
};

AudienceFormPage.prototype.getInputChooseAudience = function() {
    this.waitUntilVisible(INPUT_CHOOSE_AUDIENCE);
    return this.findElement(INPUT_CHOOSE_AUDIENCE);
};

AudienceFormPage.prototype.getInputFile = function() {
    this.waitUntilVisible(INPUT_FILE);
    return this.findElement(INPUT_FILE);
};

AudienceFormPage.prototype.getInputEmail = function() {
    this.waitUntilVisible(INPUT_EMAIL);
    return this.findElement(INPUT_EMAIL);
};


AudienceFormPage.prototype.getTextCheckMerkle = function() {
    this.waitUntilVisible(TEXT_CHECK_MERKLE);
    return this.findElement(TEXT_CHECK_MERKLE);
};

AudienceFormPage.prototype.getTextCheckShare = function() {
    this.waitUntilVisible(TEXT_CHECK_SHARE);
    return this.findElement(TEXT_CHECK_SHARE);
};

AudienceFormPage.prototype.getTextCheckEmail = function() {
    this.waitUntilVisible(TEXT_CHECK_EMAIL);
    return this.findElement(TEXT_CHECK_EMAIL);
};

AudienceFormPage.prototype.getTextUploader = function() {
    this.waitUntilVisible(TEXT_UPLOADER);
    return this.findElement(TEXT_UPLOADER);
};

AudienceFormPage.prototype.getCheckMerkle = function() {
    this.waitUntilVisible(CHECK_MERKLE);
    return this.findElement(CHECK_MERKLE);
};

AudienceFormPage.prototype.getCheckShare = function() {
    this.waitUntilVisible(CHECK_SHARE);
    return this.findElement(CHECK_SHARE);
};

AudienceFormPage.prototype.getCheckSpecificShare = function() {
    this.waitUntilVisible(CHECK_SPECIFIC_SHR);
    return this.findElement(CHECK_SPECIFIC_SHR);
};

AudienceFormPage.prototype.getCheckEmail = function() {
    this.waitUntilVisible(CHECK_EMAIL);
    return this.findElement(CHECK_EMAIL);
};

AudienceFormPage.prototype.getAlertText = function() {
    this.waitUntilVisible(ALERT_TEXT);
    return this.findElement(ALERT_TEXT);
};

AudienceFormPage.prototype.getTextError = function() {
    this.waitUntilVisible(TEXT_ERROR);
    return this.findElement(TEXT_ERROR);
};

AudienceFormPage.prototype.getInputMerkle = function() {
    this.waitUntilVisible(INPUT_MERKLE);
    return this.findElement(INPUT_MERKLE);
};

AudienceFormPage.prototype.getInputDoNotShare = function() {
    this.waitUntilVisible(INPUT_DO_NOT_SHARE);
    return this.findElement(INPUT_DO_NOT_SHARE);
};

AudienceFormPage.prototype.getInputShareSpecific = function() {
    this.waitUntilVisible(INPUT_SHARE_SPECIFIC);
    return this.findElement(INPUT_SHARE_SPECIFIC);
};

AudienceFormPage.prototype.getInputShareAcross = function() {
    this.waitUntilVisible(INPUT_SHARE_ACROSS);
    return this.findElement(INPUT_SHARE_ACROSS);
};

AudienceFormPage.prototype.getFileWidget = function() {
    this.waitUntilVisible(FILE_WIDGET);
    return this.findElement(FILE_WIDGET);
};

AudienceFormPage.prototype.getFileName = function() {
    this.waitUntilVisible(FILE_NAME);
    return this.findElement(FILE_NAME);
};

AudienceFormPage.prototype.getFileDelete = function() {
    this.waitUntilVisible(FILE_DELETE);
    return this.findElement(FILE_DELETE);
};

AudienceFormPage.prototype.getAlertError = function() {
    this.waitUntilVisible(ALERT_ERROR);
    return this.findElement(ALERT_ERROR);
};

AudienceFormPage.prototype.getUploadContainer = function() {
    return this.getElement(UPLOAD_CONTAINER);
};

AudienceFormPage.prototype.getUploadMatchRate = function() {
    return this.getElement(UPLOAD_MATCH_RATE);
};

AudienceFormPage.prototype.getAdvertiserNotDisplayed = function() {
    return this.elementNotLocated(INPUT_ADVERTISER);
};

AudienceFormPage.prototype.getInputDet = function() {
    this.waitUntilVisible(INPUT_DET);
    return this.findElement(INPUT_DET);
};

AudienceFormPage.prototype.getInputProb = function() {
    this.waitUntilVisible(INPUT_PROB);
    return this.findElement(INPUT_PROB);
};

AudienceFormPage.prototype.getInputPub = function() {
    this.waitUntilVisible(INPUT_PUB);
    return this.findElement(INPUT_PUB);
};

// Setters

AudienceFormPage.prototype.setInputAudienceName = function(value) {
    this.waitUntilVisible(INPUT_AUDIENCE_NAME);
    this.clear(INPUT_AUDIENCE_NAME);
    return this.sendKeys(INPUT_AUDIENCE_NAME, value);
};

AudienceFormPage.prototype.clearInputAudienceName = function() {
    this.waitUntilVisible(INPUT_AUDIENCE_NAME);
    return this.clear(INPUT_AUDIENCE_NAME);
};

AudienceFormPage.prototype.clearInputEmail = function() {
    this.waitUntilVisible(INPUT_EMAIL);
    return this.clear(INPUT_EMAIL);
};

AudienceFormPage.prototype.setInputAdvertiser = function(value) {
    this.waitUntilVisible(INPUT_ADVERTISER);
    this.getInputAdvertiser().click();
    this.sendKeys(INPUT_ADVERTISER, value);
    this.sleep(twoSecTO);
    this.sendKeys(INPUT_ADVERTISER, key.BACK_SPACE);
    this.getSearchedElement().click();
    return this.driver.sleep(driverTimeOut);
};

AudienceFormPage.prototype.setInputChooseAudience = function(value) {
    this.waitUntilVisible(INPUT_CHOOSE_AUDIENCE);
    this.getInputChooseAudience().click();
    this.sendKeys(INPUT_CHOOSE_AUDIENCE, value);
    this.sleep(twoSecTO);
    this.sendKeys(INPUT_CHOOSE_AUDIENCE, key.BACK_SPACE);
    this.getSearchedElement().click();
    return this.driver.sleep(driverTimeOut);
};

AudienceFormPage.prototype.getSearchedElement = function() {
    this.waitUntilVisible(SEARCH_ITEM);
    return this.findElement(SEARCH_ITEM);
};

AudienceFormPage.prototype.setInputFile = function(value) {
    this.sendKeys(INPUT_FILE, value);
    return this.driver.sleep(driverTimeOut);
};

AudienceFormPage.prototype.setInputFileMatchRate = function(value) {
    this.sendKeys(INPUT_MATCH_RATE, value);
    return this.driver.sleep(driverTimeOut);
};

AudienceFormPage.prototype.setInputEmail = function(value) {
    this.clear(INPUT_EMAIL);
    this.sendKeys(INPUT_EMAIL, value);
    return this.sendKeys(INPUT_EMAIL, key.TAB);
};

// Clicks

AudienceFormPage.prototype.clickUpload = function() {
    this.click(BUTTON_UPLOAD);
    return this.driver.sleep(twoSecTO);
};

AudienceFormPage.prototype.clickCancel = function() {
    this.click(BUTTON_CANCEL);
    return this.driver.sleep(driverTimeOut);
};

AudienceFormPage.prototype.clickAction = function() {
    this.click(BUTTON_ACTION);
    return this;
};

AudienceFormPage.prototype.clickDataType = function() {
    this.click(BUTTON_DATA_TYPE);
    return this;
};

AudienceFormPage.prototype.clickDataTypeRate = function() {
    this.click(BUTTON_DATA_TYPE);
    return this;
};

AudienceFormPage.prototype.clickCheckMerkle = function() {
    this.click(CHECK_MERKLE);
    return this;
};

AudienceFormPage.prototype.clickCheckEmail = function() {
    this.click(CHECK_EMAIL);
    return this;
};

AudienceFormPage.prototype.clickInputEmail = function() {
    this.click(INPUT_EMAIL);
    return this;
};

AudienceFormPage.prototype.clickInputName = function() {
    this.click(INPUT_AUDIENCE_NAME);
    return this;
};

AudienceFormPage.prototype.closeModal = function() {
    this.click(MODAL_BUTTON_CLOSE);
    return this;
};

AudienceFormPage.prototype.clickUpdate = function() {
    this.click(BUTTON_UPDATE);
    this.driver.sleep(driverTimeOut);
    return this.driver.sleep(driverTimeOut);
};

AudienceFormPage.prototype.clickFileDelete = function() {
    this.click(FILE_DELETE);
    return this;
};

AudienceFormPage.prototype.clickSearchItem = function() {
    this.waitUntilVisible(SEARCH_ITEM);
    this.click(SEARCH_ITEM);
    return this;
};

AudienceFormPage.prototype.clickAlertText = function() {
    this.waitUntilVisible(ALERT_TEXT);
    this.click(ALERT_TEXT);
    return this;
};

AudienceFormPage.prototype.clickCheckShare = function() {
    this.waitAndClick(CHECK_SHARE);
    return this;
};

AudienceFormPage.prototype.clickCheckSpecificShare = function() {
    this.waitAndClick(CHECK_SPECIFIC_SHR);
    return this;
};

module.exports = AudienceFormPage;
