'use strict';

// Common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;
const twoSecondTO = 2000;

// elements
const CREATE_BUYER_SEAT_TITLE = By.xpath('//h4[text()= "Create Buyer Seat"]');
const CREATE_BUYER_SEAT_SUBTITLE = By.css('div section h3');
const CREATE_BUYER_SEAT_NAME_TITLE = By.xpath('//label[text()= "Name"]');
const CREATE_BUYER_SEAT_NAME_INPUT = By.name('name');
const CREATE_BUYER_SEAT_DESCRIPTION_TITLE = By.
    xpath('//label[text()= "Description"]');
const CREATE_BUYER_SEAT_DESCRIPTION_INPUT = By.name('description');
const CREATE_BUYER_SEAT_RTB_PARTNER_TITLE = By.
    xpath('//label[text()= "RTB Partner"]');
const CREATE_BUYER_SEAT_RTB_PARTNER_INPUT = By.
    css('div.searchable-select-single div.placeholder-icon input');
const CREATE_BUYER_SEAT_SEAT_ID_TITLE = By.xpath('//label[text()= "Seat Id"]');
const CREATE_BUYER_SEAT_SEAT_ID_INPUT = By.name('seatId');
const CREATE_BUYER_SEAT_CLOSE_WHITOUT_SAVING = By.
    css('div.column--4 > button');
const CREATE_BUYER_SEAT_CREATE_BUTTON = By.
    css('buyer-seat-form button.button--primary');
const CREATE_BUYER_SEAT_RTB_PARTNER_FILTER = By.
    css('div.input-field--cover > span:nth-child(2)');
const CREATE_BUYER_SEAT_RTB_PARTNER_FILTER_CLOSE = By.
    css('span.pull-right.icon.icon--exit.icon-exit');
const CREATE_BUYER_SEAT_ERROR_MESSAGE = By.css('div.copy--error-text');
const EDIT_LINK = By.xpath('//a[text() = "Edit"]');
const BUYER_SEAT_TO_EDIT = By.xpath('//div[3]/table/tbody/tr[1]');
const EDIT_BUYER_SEAT_BUTTON = By.css('div > footer > div > button');
const CLOSE_DSP_BUTTON = By.css('span.pull-right.icon.icon--exit.icon-exit');
const RTB_PARTNER_FIRST_ROW = By.css('li:nth-child(1) > span > a');
const getBuyerSeatSubTitle = 'Basic Details';
const buyerSeatText = 'liveintent';
let DSP;


function BuyerSeatForm(webdriver){
    BasePage.call(this, webdriver);
}

BuyerSeatForm.prototype = Object.create(BasePage.prototype);
BuyerSeatForm.prototype.constructor = BuyerSeatForm;

BuyerSeatForm.prototype.getBuyerSeatTitle = function(){
    this.waitUntilVisible(CREATE_BUYER_SEAT_TITLE);
    return this.findElement(CREATE_BUYER_SEAT_TITLE);
};

BuyerSeatForm.prototype.getBuyerSeatSubTitle = function(){
    this.waitUntilVisible(CREATE_BUYER_SEAT_SUBTITLE);
    return this.findElement(CREATE_BUYER_SEAT_SUBTITLE);
};

BuyerSeatForm.prototype.getNameTitleCreateBuyerSeat = function() {
    this.waitUntilVisible(CREATE_BUYER_SEAT_NAME_TITLE);
    return this.findElement(CREATE_BUYER_SEAT_NAME_TITLE);
};

BuyerSeatForm.prototype.getNameInputCreateBuyerSeat = function() {
    this.waitUntilVisible(CREATE_BUYER_SEAT_NAME_INPUT);
    return this.findElement(CREATE_BUYER_SEAT_NAME_INPUT);
};

BuyerSeatForm.prototype.getDescriptionTitleCreateBuyerSeat = function() {
    this.waitUntilVisible(CREATE_BUYER_SEAT_DESCRIPTION_TITLE);
    return this.findElement(CREATE_BUYER_SEAT_DESCRIPTION_TITLE);
};

BuyerSeatForm.prototype.getDescriptionInputCreateBuyerSeat = function() {
    this.waitUntilVisible(CREATE_BUYER_SEAT_DESCRIPTION_INPUT);
    return this.findElement(CREATE_BUYER_SEAT_DESCRIPTION_INPUT);
};

BuyerSeatForm.prototype.getRtbPartnerTitleCreateBuyerSeat = function() {
    this.waitUntilVisible(CREATE_BUYER_SEAT_RTB_PARTNER_TITLE);
    return this.findElement(CREATE_BUYER_SEAT_RTB_PARTNER_TITLE);
};

BuyerSeatForm.prototype.getRtbPartnerInputCreateBuyerSeat = function() {
    this.waitUntilVisible(CREATE_BUYER_SEAT_RTB_PARTNER_INPUT);
    return this.findElement(CREATE_BUYER_SEAT_RTB_PARTNER_INPUT);
};

BuyerSeatForm.prototype.getSeatIdTitleCreateBuyerSeat = function() {
    this.waitUntilVisible(CREATE_BUYER_SEAT_SEAT_ID_TITLE);
    return this.findElement(CREATE_BUYER_SEAT_SEAT_ID_TITLE);
};

BuyerSeatForm.prototype.getSeatIdInputCreateBuyerSeat = function() {
    this.waitUntilVisible(CREATE_BUYER_SEAT_SEAT_ID_INPUT);
    return this.findElement(CREATE_BUYER_SEAT_SEAT_ID_INPUT);
};

BuyerSeatForm.prototype.getCloseButtonCreateBuyerSeat = function() {
    this.waitUntilVisible(CREATE_BUYER_SEAT_CLOSE_WHITOUT_SAVING);
    return this.findElement(CREATE_BUYER_SEAT_CLOSE_WHITOUT_SAVING);
};

BuyerSeatForm.prototype.getCreateButtonCreateBuyerSeat = function() {
    this.waitUntilVisible(CREATE_BUYER_SEAT_CREATE_BUTTON);
    return this.findElement(CREATE_BUYER_SEAT_CREATE_BUTTON);
};

BuyerSeatForm.prototype.getRtbPartnerOptions = function() {
    this.setInputRtbPartnerSearch(buyerSeatText);
    this.waitUntilVisible(RTB_PARTNER_FIRST_ROW);
    return this.findElement(RTB_PARTNER_FIRST_ROW);
};

BuyerSeatForm.prototype.getSubTitleConst = function() {
    return getBuyerSeatSubTitle;
};

BuyerSeatForm.prototype.getExpecPartResult = function() {
    return buyerSeatText;
};

BuyerSeatForm.prototype.findRTBpartner = function(value){
    this.waitUntilVisible(CREATE_BUYER_SEAT_RTB_PARTNER_INPUT);
    this.getRtbPartnerInputCreateBuyerSeat().click();
    this.clear(CREATE_BUYER_SEAT_RTB_PARTNER_INPUT);
    return this.sendKeys(CREATE_BUYER_SEAT_RTB_PARTNER_INPUT, value);
};

BuyerSeatForm.prototype.setInputRtbPartnerSearch = function(value) {
    this.waitUntilVisible(CREATE_BUYER_SEAT_RTB_PARTNER_INPUT);
    this.clear(CREATE_BUYER_SEAT_RTB_PARTNER_INPUT);
    this.sendKeys(CREATE_BUYER_SEAT_RTB_PARTNER_INPUT, value);
    this.driver.sleep(twoSecondTO);
    this.sendKeys(CREATE_BUYER_SEAT_RTB_PARTNER_INPUT, key.BACK_SPACE);
    return this.getRtbPartnerOptions().click();
};

BuyerSeatForm.prototype.getRtbPartnerSelected = function() {
    this.waitUntilVisible(CREATE_BUYER_SEAT_RTB_PARTNER_FILTER);
    return this.findElement(CREATE_BUYER_SEAT_RTB_PARTNER_FILTER);
};

BuyerSeatForm.prototype.getRemoveRtbPartner = function() {
    this.waitUntilVisible(CREATE_BUYER_SEAT_RTB_PARTNER_FILTER_CLOSE);
    return this.findElement(CREATE_BUYER_SEAT_RTB_PARTNER_FILTER_CLOSE);
};

BuyerSeatForm.prototype.getErrorMessage = function() {
    this.waitUntilVisible(CREATE_BUYER_SEAT_ERROR_MESSAGE);
    return this.findElement(CREATE_BUYER_SEAT_ERROR_MESSAGE);
};

BuyerSeatForm.prototype.setInputName = function(value) {
    this.waitUntilVisible(CREATE_BUYER_SEAT_NAME_INPUT);
    this.getNameInputCreateBuyerSeat().click();
    this.clear(CREATE_BUYER_SEAT_NAME_INPUT);
    return this.sendKeys(CREATE_BUYER_SEAT_NAME_INPUT, value);
};

BuyerSeatForm.prototype.setInputDescription = function(value) {
    this.waitUntilVisible(CREATE_BUYER_SEAT_DESCRIPTION_INPUT);
    this.getDescriptionInputCreateBuyerSeat().click();
    this.clear(CREATE_BUYER_SEAT_DESCRIPTION_INPUT);
    return this.sendKeys(CREATE_BUYER_SEAT_DESCRIPTION_INPUT, value);
};

BuyerSeatForm.prototype.setSeatId = function(value) {
    this.waitUntilVisible(CREATE_BUYER_SEAT_SEAT_ID_INPUT);
    this.getSeatIdInputCreateBuyerSeat().click();
    this.clear(CREATE_BUYER_SEAT_SEAT_ID_INPUT);
    return this.sendKeys(CREATE_BUYER_SEAT_SEAT_ID_INPUT, value);
};

BuyerSeatForm.prototype.createBuyerSeat =
function(seatName, rtbPartnetSearch, seatId){
    this.setInputName(seatName);
    this.setInputDescription(seatName);
    this.findRTBpartner(rtbPartnetSearch);
    DSP = this.getRtbPartnerOptions().getText();
    this.clear(CREATE_BUYER_SEAT_RTB_PARTNER_INPUT);
    this.setInputRtbPartnerSearch(DSP);
    this.setSeatId(seatId);
    return this.clickCreateBuyerSeatButton();
};

// Clicks

BuyerSeatForm.prototype.clickNameInput = function() {
    return this.waitAndClick(CREATE_BUYER_SEAT_NAME_INPUT);
};

BuyerSeatForm.prototype.clickSeatIdInput = function() {
    return this.waitAndClick(CREATE_BUYER_SEAT_SEAT_ID_INPUT);
};

BuyerSeatForm.prototype.clickDescribeInput = function() {
    return this.waitAndClick(CREATE_BUYER_SEAT_DESCRIPTION_INPUT);
};

BuyerSeatForm.prototype.clickRtbPartnerInput = function() {
    return this.waitAndClick(CREATE_BUYER_SEAT_RTB_PARTNER_INPUT);
};

BuyerSeatForm.prototype.clickCreateBuyerSeatButton = function() {
    return this.waitAndClick(CREATE_BUYER_SEAT_CREATE_BUTTON);
};

BuyerSeatForm.prototype.clickEditBuyerSeatButton = function() {
    return this.waitAndClick(EDIT_BUYER_SEAT_BUTTON);
};

BuyerSeatForm.prototype.clickDsptButton = function() {
    return this.waitAndClick(CLOSE_DSP_BUTTON);
};

BuyerSeatForm.prototype.clickEditBuyerSeat = function() {
    this.waitUntilVisible(BUYER_SEAT_TO_EDIT);
    this.elementHover(BUYER_SEAT_TO_EDIT);
    this.waitUntilVisible(EDIT_LINK);
    return this.click(EDIT_LINK);
};

module.exports = BuyerSeatForm;
