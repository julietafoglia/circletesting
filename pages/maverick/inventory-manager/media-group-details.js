'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;
const promise = webdriver.promise;

// elements
const PUB_TABLE_HEADER =
    By.xpath('//h2[text()="Publishers"]');
const PUBLISHER_NAME = (name) => By.xpath(`//a[text()="${name}"]`);
const PUBLISHER_DEL = By.xpath('//a[text()="Delete"]');
const CHECKBOX_ONE = By.xpath(
    '//delete-publisher-dialog/confirm-dialog/dialogbox/div[2]/div[2]' +
        '/section/div/section/dialog-confirmation[1]/p/label/span'
);
const CHECKBOX_TWO = By.xpath(
    '//delete-publisher-dialog/confirm-dialog/dialogbox/div[2]/div[2]' +
        '/section/div/section/dialog-confirmation[2]/p/label/span'
);
const SEARCH_PUB = By.css('publishers-table input[placeholder="Search"]');
const CONFIRM_DELETE = By.xpath('//button[text()="Yes, Delete Publisher"]');
const CREATE_PUB_BTN = By.xpath('//button[text()="Create Publisher"]');
const PUB_TAB = By.xpath('//h4[contains(@class,"tab--header") and ' +
    'text()="Publishers"]');
const ADV_TAB = By.xpath('//h4[contains(@class,"tab--header") and ' +
    'text()="Advertisers"]');
const PUBLISHERS_TABLE = By.css('publishers-table > async-table > div');
const NEWSLETTERS_TABLE = By.css('newsletters-table > async-table > div');
const AD_SLOTS_TABLE = By.css('ad-slots-table > async-table > div');
const ADVERTISERS_TABLE = By.css('advertisers-table > async-table > div');
const MEDIA_GROUP_NAME = By.xpath('//section-card/div/div/div/h1/span');
const MEDIA_GROUP_ID = By.xpath('//section-card/div/div/div/span');

function MediaGroupDetailsPage(webdriver) {
    this.driver = webdriver;
}

MediaGroupDetailsPage.prototype = Object.create(BasePage.prototype);
MediaGroupDetailsPage.prototype.constructor = MediaGroupDetailsPage;

// get buttons
MediaGroupDetailsPage.prototype.getCreatePublisherBtn = function(){
    return this.getElement(CREATE_PUB_BTN);
};

MediaGroupDetailsPage.prototype.getPublisherTab = function(){
    return this.getElement(PUB_TAB);
};

MediaGroupDetailsPage.prototype.getAdvertiserTab = function(){
    return this.getElement(ADV_TAB);
};

MediaGroupDetailsPage.prototype.getPublisherTable = function(){
    return this.getElement(PUBLISHERS_TABLE);
};

MediaGroupDetailsPage.prototype.getNewsletterTable = function(){
    return this.getElement(NEWSLETTERS_TABLE);
};

MediaGroupDetailsPage.prototype.getAdSlotsTable = function(){
    return this.getElement(AD_SLOTS_TABLE);
};

MediaGroupDetailsPage.prototype.getAdvertisersTable = function(){
    return this.getElement(ADVERTISERS_TABLE);
};

MediaGroupDetailsPage.prototype.getMediaGroupName = function(){
    return this.getElementText(MEDIA_GROUP_NAME);
};

MediaGroupDetailsPage.prototype.getMediaGroupId = function(){
    return this.getElementText(MEDIA_GROUP_ID);
};

// click buttons
MediaGroupDetailsPage.prototype.deletePublisher = function(name) {
    this.clickLinkText(name);
    this.clickLinkText('Delete');
    this.waitUntilVisible(CHECKBOX_ONE);
    this.findElement(CHECKBOX_ONE).click();
    this.findElement(CHECKBOX_TWO).click();
    this.findElement(CONFIRM_DELETE).click();
    return this.waitUntilOverlayNotVisible();
};

MediaGroupDetailsPage.prototype.publisherExists = function(publisher) {
    return new promise.Promise((resolve, reject) => {
        this.waitUntilVisible(PUB_TABLE_HEADER);
        this.findElements(PUBLISHER_NAME(publisher)).then((elements) => {
            if (elements.length) {
                resolve(true);
            } else {
                resolve(false);
            }
        }, (err) => {
            reject(err);
        });
    });
};

MediaGroupDetailsPage.prototype.clickCreatePublisher = function() {
    return this.waitAndClick(CREATE_PUB_BTN);
};

MediaGroupDetailsPage.prototype.clickPublisherTab = function() {
    return this.waitAndClick(PUB_TAB);
};

MediaGroupDetailsPage.prototype.clickAdvertiserTab = function() {
    return this.waitAndClick(ADV_TAB);
};

MediaGroupDetailsPage.prototype.setSearchPublisher = function(value) {
    this.waitUntilVisible(SEARCH_PUB);
    this.clear(SEARCH_PUB);
    this.sendKeys(SEARCH_PUB, value);
    this.sendKeys(SEARCH_PUB, key.ENTER);
    return this.driver.sleep(2000);
};

module.exports = MediaGroupDetailsPage;
