'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const fourSecTO = 4000;
const key = webdriver.Key;

// elements
const INPUT_ADVERTISER = By.css('input[placeholder="Search Advertisers"]');
const INPUT_FILE = By.xpath('//file-input/div/input');
const INPUT_NAME = By.css('input[name="name"]');
const INPUT_NATIVE_NAME = By.name('adName');
const INPUT_SOURCE_URL = By.name('media');
const INPUT_CLICK_URL = By.name('clickUrl');
const INPUT_ADVERTISER_NAME = By.name('advertiserName');
const INPUT_PRODUCT_NAME = By.name('productName');
const INPUT_HEADLINE = By.name('headline');
const INPUT_IMAGE_URL = By.name('imageUrl');
const INPUT_CALL_TO_ACTION = By.name('callToAction');
const INPUT_PRICE = By.name('price');
const INPUT_SALE_PRICE = By.name('salePrice');
const INPUT_THIRD_PARTY_TRACKER = By.name('thirdPartyTracker');
const TRACKING_1 = By.name('tracking');
const TRACKING_2 = By.name('secondaryTracking');
const BUTTON_CANCEL = By.xpath('//a[text() = "Cancel"]');
const BUTTON_SAVE_EXIT = By.xpath('//button[text() = "Save and Exit"]');
const BUTTON_UPLOAD = By.css('.button--small');
const BUTTOND_ADD_ANOTHER = By.xpath('//button[text() = "Add Another"]');
const BUTTON_RATING = By.css('select-dropdown[name="rating"] button');
const BUTTON_CURRENCY = By.css('select-dropdown[name="currency"] button');
const TITLE_IMAGE = By.xpath('//div[text() = "Create ads from uploaded' +
            ' images."]');
const TITLE_THIRD = By.xpath('//div[text() = "Create ads from third party' +
            ' tags."]');
const TITLE_NATIVE = By.xpath('//div[text() = "Description of this type' +
    ' of native ad unit."]');

const PREVIEW_TEXT_AD = By.css('.native-ad-form--placeholder-text-ad');
const PREVIEW_IN_FEED_AD = By.css('.native-ad-form--placeholder-in-feed');
const PREVIEW_PROMOTED_LISTING = By.css('.native-ad-form--placeholder' +
    '-product-listing');
const CHECK_TEXT_AD = By.xpath('//section-card/div/div[2]/form/div/div[5]' +
    '/div[1]/label');
const CHECK_IN_FEED_AD = By.xpath('//section-card/div/div[2]/form/div/div[5]' +
    '/div[2]/label');
const CHECK_PROMOTED = By.xpath('//section-card/div/div[2]/form/div/div[5]' +
    '/div[3]/label');
const CAROUSEL = By.css('.carousel');
const LINK_SECOND_TRACK = By.css('a[title="Secondary Third Party Tracker"]');
const INPUT_MARQUEE = By.css('.ng-untouched.ng-pristine.ng-valid');
const TEXT_ERROR_CHARS = By.xpath('//div[text() = "Oops! You\'ve entered' +
    ' too many characters."]');
const TEXT_ERROR_REQUIRED = By.xpath('//div[text() = "Oops! This is' +
    ' a required field."]');
const SEARCH_ITEM = By.css('a.search--item');
const AD_PAGE_HEADER = By.css('.bubble-header');
const LOADER = By.id('loading-spinner');
const PAGE_HEADER = By.xpath('//h4[text()= "Ad Builder"]');


function AdsPage(webdriver) {
    BasePage.call(this, webdriver);
}

AdsPage.prototype = Object.create(BasePage.prototype);
AdsPage.prototype.constructor = AdsPage;

AdsPage.prototype.setAdvertiser = function(value) {
    this.waitUntilVisible(INPUT_ADVERTISER);
    this.click(INPUT_ADVERTISER);
    this.sendKeys(INPUT_ADVERTISER, value);
    this.click(INPUT_ADVERTISER);
    this.driver.sleep(fourSecTO);
    this.clear(INPUT_ADVERTISER);
    this.sendKeys(INPUT_ADVERTISER, value);
    this.sendKeys(INPUT_ADVERTISER, key.BACK_SPACE);
    this.sendKeys(INPUT_ADVERTISER, key.BACK_SPACE);
    this.driver.sleep(fourSecTO);
    this.sendKeys(INPUT_ADVERTISER, key.BACK_SPACE);
    this.sendKeys(INPUT_ADVERTISER, key.BACK_SPACE);
    this.getDropDownOptions().click();
    return this;
};

AdsPage.prototype.getDropDownOptions = function() {
    this.waitUntilVisible(SEARCH_ITEM);
    return this.findElement(SEARCH_ITEM);
};

AdsPage.prototype.setFile = function(value) {
    this.sendKeys(INPUT_FILE, value);
    this.waitUntilVisible(CAROUSEL);
    return this.waitUntilVisible(INPUT_NAME);
};

AdsPage.prototype.setName = function(value) {
    this.waitUntilVisible(INPUT_NAME);
    this.clear(INPUT_NAME);
    return this.sendKeys(INPUT_NAME, value);
};

AdsPage.prototype.setSourceUrl = function(value) {
    this.clear(INPUT_SOURCE_URL);
    return this.sendKeys(INPUT_SOURCE_URL, value);
};

AdsPage.prototype.setClickUrl = function(value) {
    this.waitUntilVisible(INPUT_CLICK_URL);
    this.clear(INPUT_CLICK_URL);
    return this.sendKeys(INPUT_CLICK_URL, value);
};

AdsPage.prototype.setTracking1 = function(value) {
    this.clear(TRACKING_1);
    return this.sendKeys(TRACKING_1, value);
};

AdsPage.prototype.setTracking2 = function(value) {
    this.clear(TRACKING_2);
    return this.sendKeys(TRACKING_2, value);
};

AdsPage.prototype.setNativeName = function(value) {
    this.clear(INPUT_NATIVE_NAME);
    this.sendKeys(INPUT_NATIVE_NAME, value);
    return this.click(INPUT_ADVERTISER_NAME);
};

AdsPage.prototype.setAdvName = function(value) {
    this.clear(INPUT_ADVERTISER_NAME);
    this.sendKeys(INPUT_ADVERTISER_NAME, value);
    return this.click(INPUT_NATIVE_NAME);
};

AdsPage.prototype.setHeadline = function(value) {
    this.clear(INPUT_HEADLINE);
    this.sendKeys(INPUT_HEADLINE, value);
    return this.click(INPUT_NATIVE_NAME);
};

AdsPage.prototype.setProductName = function(value) {
    this.clear(INPUT_PRODUCT_NAME);
    this.sendKeys(INPUT_PRODUCT_NAME, value);
    return this.click(INPUT_NATIVE_NAME);
};

AdsPage.prototype.setImageUrl = function(value) {
    this.clear(INPUT_IMAGE_URL);
    this.sendKeys(INPUT_IMAGE_URL, value);
    return this.click(INPUT_NATIVE_NAME);
};

AdsPage.prototype.setCallToAction = function(value) {
    this.clear(INPUT_CALL_TO_ACTION);
    this.sendKeys(INPUT_CALL_TO_ACTION, value);
    return this.click(INPUT_NATIVE_NAME);
};

AdsPage.prototype.setPrice = function(value) {
    this.clear(INPUT_PRICE);
    this.sendKeys(INPUT_PRICE, value);
    return this.click(INPUT_NATIVE_NAME);
};

AdsPage.prototype.setSalePrice = function(value) {
    this.clear(INPUT_SALE_PRICE);
    this.sendKeys(INPUT_SALE_PRICE, value);
    return this.click(INPUT_NATIVE_NAME);
};

AdsPage.prototype.setThirdPartyTracker = function(value) {
    this.clear(INPUT_THIRD_PARTY_TRACKER);
    this.sendKeys(INPUT_THIRD_PARTY_TRACKER, value);
    return this.click(INPUT_NATIVE_NAME);
};

// get inputs

AdsPage.prototype.getInputName = function() {
    return this.findElement(INPUT_NAME);
};

AdsPage.prototype.getInputNativeName = function() {
    return this.findElement(INPUT_NATIVE_NAME);
};

AdsPage.prototype.getInputAdvertiser = function() {
    return this.findElement(INPUT_ADVERTISER);
};

AdsPage.prototype.getInputFile = function() {
    return this.findElement(INPUT_FILE);
};

AdsPage.prototype.getInputClickUrl = function() {
    this.waitUntilVisible(INPUT_CLICK_URL);
    return this.findElement(INPUT_CLICK_URL);
};

AdsPage.prototype.getInputSourceUrl = function() {
    this.waitUntilVisible(INPUT_SOURCE_URL);
    return this.findElement(INPUT_SOURCE_URL);
};

AdsPage.prototype.getInputTracking1 = function() {
    this.waitUntilVisible(TRACKING_1);
    return this.findElement(TRACKING_1);
};

AdsPage.prototype.getInputAdvName = function() {
    this.waitUntilVisible(INPUT_ADVERTISER_NAME);
    return this.findElement(INPUT_ADVERTISER_NAME);
};

AdsPage.prototype.getInputProductName = function() {
    this.waitUntilVisible(INPUT_PRODUCT_NAME);
    return this.findElement(INPUT_PRODUCT_NAME);
};

AdsPage.prototype.getInputHeadline = function() {
    this.waitUntilVisible(INPUT_HEADLINE);
    return this.findElement(INPUT_HEADLINE);
};

AdsPage.prototype.getInputImageUrl = function() {
    this.waitUntilVisible(INPUT_IMAGE_URL);
    return this.findElement(INPUT_IMAGE_URL);
};

AdsPage.prototype.getInputCallToAction = function() {
    this.waitUntilVisible(INPUT_CALL_TO_ACTION);
    return this.findElement(INPUT_CALL_TO_ACTION);
};

AdsPage.prototype.getInputPrice = function() {
    this.waitUntilVisible(INPUT_PRICE);
    return this.findElement(INPUT_PRICE);
};

AdsPage.prototype.getInputSalePrice = function() {
    this.waitUntilVisible(INPUT_SALE_PRICE);
    return this.findElement(INPUT_SALE_PRICE);
};

AdsPage.prototype.getInputThirdPartyTracker = function() {
    this.waitUntilVisible(INPUT_THIRD_PARTY_TRACKER);
    return this.findElement(INPUT_THIRD_PARTY_TRACKER);
};

AdsPage.prototype.getButtonUploadAd = function() {
    return this.findElement(BUTTON_UPLOAD);
};

AdsPage.prototype.getButtonAddAnother = function() {
    return this.findElement(BUTTOND_ADD_ANOTHER);
};

AdsPage.prototype.getButtonRating = function() {
    return this.findElement(BUTTON_RATING);
};

AdsPage.prototype.getButtonCurrency = function() {
    return this.findElement(BUTTON_CURRENCY);
};

AdsPage.prototype.getLinkSecondTrack = function() {
    return this.findElement(LINK_SECOND_TRACK);
};

AdsPage.prototype.getInputMarquee = function() {
    this.waitUntilVisible(INPUT_MARQUEE);
    return this.findElement(INPUT_MARQUEE);
};

AdsPage.prototype.getPreviewTextAd = function() {
    this.waitUntilVisible(PREVIEW_TEXT_AD);
    return this.findElement(PREVIEW_TEXT_AD);
};

AdsPage.prototype.getPreviewInFeedAd = function() {
    this.waitUntilVisible(PREVIEW_IN_FEED_AD);
    return this.findElement(PREVIEW_IN_FEED_AD);
};

AdsPage.prototype.getPreviewPromotedListing = function() {
    this.waitUntilVisible(PAGE_HEADER);
    return this.findElement(PREVIEW_PROMOTED_LISTING);
};

AdsPage.prototype.getCheckTextAd = function() {
    this.waitUntilVisible(CHECK_TEXT_AD);
    return this.findElement(CHECK_TEXT_AD);
};

AdsPage.prototype.getCheckInFeedAd = function() {
    this.waitUntilVisible(CHECK_IN_FEED_AD);
    return this.findElement(CHECK_IN_FEED_AD);
};

AdsPage.prototype.getCheckPromotedListing = function() {
    this.waitUntilVisible(CHECK_PROMOTED);
    return this.findElement(CHECK_PROMOTED);
};

AdsPage.prototype.getTextErrorChars = function() {
    return this.findElement(TEXT_ERROR_CHARS);
};

AdsPage.prototype.getTextErrorRequired = function() {
    this.waitUntilVisible(TEXT_ERROR_REQUIRED);
    return this.findElement(TEXT_ERROR_REQUIRED);
};


// click buttons

AdsPage.prototype.clickCancel = function() {
    return this.click(BUTTON_CANCEL);
};

AdsPage.prototype.clickInputName = function() {
    this.waitUntilVisible(INPUT_NAME);
    return this.click(INPUT_NAME);
};

AdsPage.prototype.clickSaveAndExit = function() {
    this.click(BUTTON_SAVE_EXIT);
    return this.driver.sleep(3000);
};

AdsPage.prototype.clickTitleImage = function() {
    this.waitUntilVisible(AD_PAGE_HEADER);
    this.waitUntilVisible(TITLE_IMAGE);
    this.click(TITLE_IMAGE);
    this.waitUntilVisible(INPUT_ADVERTISER);
    return this;
};

AdsPage.prototype.clickTitleThirdParty = function() {
    this.waitUntilVisible(AD_PAGE_HEADER);
    this.waitUntilVisible(TITLE_THIRD);
    this.click(TITLE_THIRD);
    this.waitUntilVisible(INPUT_ADVERTISER);
    return this;
};

AdsPage.prototype.clickTitleNative = function() {
    this.waitUntilVisible(AD_PAGE_HEADER);
    this.waitUntilVisible(TITLE_NATIVE);
    this.click(TITLE_NATIVE);
    this.waitUntilVisible(INPUT_ADVERTISER);
    return this;
};

AdsPage.prototype.clickCheckTextAd = function() {
    this.waitUntilVisible(CHECK_TEXT_AD);
    return this.click(CHECK_TEXT_AD);
};

AdsPage.prototype.clickCheckInFeedAd = function() {
    this.waitUntilVisible(CHECK_IN_FEED_AD);
    return this.click(CHECK_IN_FEED_AD);
};

AdsPage.prototype.clickCheckPromotedListing = function() {
    this.waitUntilVisible(CHECK_PROMOTED);
    return this.click(CHECK_PROMOTED);
};

AdsPage.prototype.clickLinkSecondaryTracker = function() {
    this.waitUntilVisible(LINK_SECOND_TRACK);
    return this.click(LINK_SECOND_TRACK);
};

// get buttons

AdsPage.prototype.getCancelButton = function() {
    return this.findElement(BUTTON_CANCEL);
};

AdsPage.prototype.getSaveExitButton = function() {
    return this.findElement(BUTTON_SAVE_EXIT);
};

AdsPage.prototype.getTitleImage = function() {
    return this.findElement(TITLE_IMAGE);
};

AdsPage.prototype.getTitleThird = function() {
    return this.findElement(TITLE_THIRD);
};

AdsPage.prototype.getCarousel = function() {
    return this.findElement(CAROUSEL);
};

AdsPage.prototype.getTableAdName = function(value) {
    return this.findElement(By.xpath('//div[text() = "' + value + '"]'));
};

AdsPage.prototype.clickTableAdName = function(value) {
    return this.findElement(By.
        xpath('//div[text() = "' + value + '"]').click());
};

AdsPage.prototype.getTitleImage = function(value) {
    return this.findElement(By.xpath('//span[text() = "' + value + '"]'));
};

AdsPage.prototype.setRating = function(value) {
    this.click(BUTTON_RATING);
    return this.click(By.xpath('//span[text() = "' + value + '"]'));
};

AdsPage.prototype.setCurrency = function(value) {
    this.click(BUTTON_CURRENCY);
    return this.click(By.xpath('//span[text() = "' + value + '"]'));
};

module.exports = AdsPage;
