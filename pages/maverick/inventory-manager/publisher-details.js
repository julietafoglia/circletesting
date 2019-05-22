'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');
const twoSecTimeOut = 2000;
const fiveSecTO = 5000;
const pubSpan = 'Publisher';

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const promise = webdriver.promise;

// Publisher Details
const PUBLISHER_NAME = By.xpath('//section-card/div/div[2]/div[1]/h1/span');
const PUBLISHER_ID = By.xpath('//section-card/div/div[2]/div[1]/span');
const IAB_CATEGORY =
    By.xpath('//section-card/div/div[2]/div[2]/div[1]/div[1]/span');
const CNAME = By.xpath('//section-card/div/div[2]/div[2]/div[2]/div[1]/span');
const DOMAIN = By.xpath('//section-card/div/div[2]/div[2]/div[1]/div[2]/span');
const LABEL = By.xpath('//section-card/div/div[2]/div[2]/div[2]/div[2]/span');
const LI_EXCHANGE_ADV =
    By.xpath('//h5[text()="LiveIntent Exchange Advertisers"]' +
        '//parent::div//span');
const RTB_ADVERTISERS =
    By.xpath('//h5[text()="Rtb Advertisers"]//parent::div//span');
const IAB_CAT_BLACKLIST =
    By.xpath('//section-card/div/div[2]/div[2]/div[3]/div/span');
const DELETE_BTN = By.xpath('//a[text()="Delete"]');
const CHECKBOX_ONE = By.xpath(
    '//delete-publisher-dialog/confirm-dialog/dialogbox/div[2]/div[2]' +
        '/section/div/section/dialog-confirmation[1]/p/label/span'
);
const CHECKBOX_TWO = By.xpath(
    '//delete-publisher-dialog/confirm-dialog/dialogbox/div[2]/div[2]' +
        '/section/div/section/dialog-confirmation[2]/p/label/span'
);
const CONFIRM_BTN = By.xpath('//button[text()="Yes, Delete Publisher"]');
const EDIT_PUB = By.css('//a[contains(text(),"Edit")]');
const DELETE_PUB = By.css('//a[contains(text(),"Delete")]');
const VIEW_HISTORY_PUB = By.css('//a[contains(text(),"View History")]');
const DOWNLOAD_ALL_TAGS_BTN = By.xpath('//button[contains(text(),' +
    '"Download All Tags")]');

// Newsletters
const CREATE_NEWSLETTER_BTN = By.css('.button--create');
const SEARCH_BOX = By.css('input[placeholder="Search"]');
const NEWSLETTER_TITLE = By.xpath('//section-card/div/div[2]/div[1]/div[1]/h2/a');
const NEWSLETTER_LINK = (name) => By.xpath(`//a[contains(text(), "${name}")]`);
const NEWSLETTER_CARDS = By.xpath('//newsletter-overview-card');
const NEWSLETTER_EDIT = By.xpath(
    '//section-card/div/div[2]/div[1]/div[1]/nav/ul/li[1]'
);
const NEWSLETTER_VIEW_TAGS =
    By.xpath('//section-card/div/div[2]/div[1]/div[1]/nav/ul/li[2]');
const DOWNLOAD_TAGS_BTN =
    By.xpath('//section-card/div/div[2]/div[1]/div[1]/nav/ul/li[3]');
const NEWSLETTER_DELETE =
    By.xpath('//section-card/div/div[2]/div[1]/div[1]/nav/ul/li[6]/a');
const DELETE_CHECKBOX_ONE =
    By.css('dialog-confirmation:nth-child(2) > p > label > span');
const DELETE_CHECKBOX_TWO =
    By.css('dialog-confirmation:nth-child(3) > p > label > span');
const DELETE_CHECKBOX_THREE =
    By.css('dialog-confirmation:nth-child(4) > p > label > span');
const CONFIRM_DELETE_BTN = By.xpath(
    '//delete-newsletter-dialog/confirm-dialog/dialogbox/div[2]/div[2]' +
        '/section/div/section/div/button[2]'
);
const DELETE_ALERT_MESSAGE =
    By.xpath('//dialog-box/div[2]/div/div/div[2]/div/div[1]/alert/div/div');
const VIEW_TAGS_DROPDOWN_BTN = By.xpath(
    '//lightbox/div[2]/div/div/div[2]/div/div[1]/div/' +
        'select-dropdown/div/button'
);
const COPY_CODE = By.css('copy-code > div > div > div > button');
const CODE_TEXT = By.css('copy-code > div > textarea');
const COPY_SUCCESS_MSG =
    By.xpath('//span[text()="Code copied to your clipboard!"]');

const LOADER = By.css('.loading-indicator');

function PublisherDetailsPage(webdriver) {
    this.driver = webdriver;
}

PublisherDetailsPage.prototype = Object.create(BasePage.prototype);
PublisherDetailsPage.prototype.constructor = PublisherDetailsPage;

PublisherDetailsPage.prototype.navigate = function(url) {
    this.driver.navigate().to(url);
    return this;
};

PublisherDetailsPage.prototype.deletePublisher = function() {
    this.waitUntilVisible(DELETE_BTN);
    this.findElement(DELETE_BTN).click();
    this.waitUntilVisible(CHECKBOX_ONE);
    this.findElement(CHECKBOX_ONE).click();
    this.findElement(CHECKBOX_TWO).click();
    return this.findElement(CONFIRM_BTN).click();
};

PublisherDetailsPage.prototype.searchNewsletter = function(name) {
    this.driver.sleep(twoSecTimeOut);
    this.waitUntilVisible(SEARCH_BOX);
    this.findElement(SEARCH_BOX).clear();
    this.driver.actions()
        .mouseMove(this.findElement(SEARCH_BOX))
        .sendKeys(name)
        .perform();
    return this.driver.sleep(twoSecTimeOut);
};

PublisherDetailsPage.prototype.clickCreateNewsletterBtn = function() {
    this.waitUntilVisible(CREATE_NEWSLETTER_BTN);
    return this.findElement(CREATE_NEWSLETTER_BTN).click();
};

PublisherDetailsPage.prototype.clickDownloadTagsBtn = function() {
    this.waitUntilVisible(DOWNLOAD_TAGS_BTN);
    this.findElement(DOWNLOAD_TAGS_BTN).click();
    return this;
};

PublisherDetailsPage.prototype.clickViewTags = function() {
    this.elementHover(NEWSLETTER_CARDS);
    this.waitUntilVisible(NEWSLETTER_VIEW_TAGS);
    this.findElement(NEWSLETTER_VIEW_TAGS).click();
    return this;
};

PublisherDetailsPage.prototype.clickEditBtn = function() {
    this.elementHover(NEWSLETTER_CARDS);
    this.waitUntilVisible(NEWSLETTER_EDIT);
    return this.findElement(NEWSLETTER_EDIT).click();
};

PublisherDetailsPage.prototype.clickEditByName = function(name) {
    this.scrollUp();
    this.scrollUp();
    this.elementHover(NEWSLETTER_LINK(name));
    this.elementHover(NEWSLETTER_LINK(name));
    this.waitUntilVisible(NEWSLETTER_EDIT);
    return this.findElement(NEWSLETTER_EDIT).click();
}

PublisherDetailsPage.prototype.initiateNewsletterDelete = function() {
    this.elementHover(NEWSLETTER_CARDS);
    this.waitUntilVisible(NEWSLETTER_DELETE);
    this.findElement(NEWSLETTER_DELETE).click();
    return this;
};

PublisherDetailsPage.prototype.deleteNewsletter = function() {
    this.waitUntilVisible(DELETE_CHECKBOX_ONE);
    this.findElement(DELETE_CHECKBOX_ONE).click();
    this.findElement(DELETE_CHECKBOX_TWO).click();
    this.findElement(DELETE_CHECKBOX_THREE).click();
    this.findElement(CONFIRM_DELETE_BTN).click();
    return this.driver.sleep(twoSecTimeOut);
};

// Allow for any combination of boxes to be checked [1,2] [1,3], [2,3] ...
PublisherDetailsPage.prototype.getUncheckedBoxesError = function(boxes) {
    this.waitUntilVisible(DELETE_CHECKBOX_ONE);
    boxes.forEach((box) => {
        switch (box) {
        case '1':
            this.findElement(DELETE_CHECKBOX_ONE).click();
            break;
        case '2':
            this.findElement(DELETE_CHECKBOX_TWO).click();
            break;
        case '3':
            this.findElement(DELETE_CHECKBOX_THREE).click();
        }
    });
    this.findElement(CONFIRM_DELETE_BTN).click();
    return this.getElementText(DELETE_ALERT_MESSAGE);
};

PublisherDetailsPage.prototype.selectTagType = function(type) {
    let tagTypeLocator = By.xpath(`//a/span[text()="${type}"]`);
    this.waitUntilVisible(VIEW_TAGS_DROPDOWN_BTN);
    this.findElement(VIEW_TAGS_DROPDOWN_BTN).click();
    this.waitUntilVisible(tagTypeLocator);
    this.findElement(tagTypeLocator).click();
    return this;
};

PublisherDetailsPage.prototype.copyCode = function() {
    this.waitUntilVisible(COPY_CODE);
    this.findElement(COPY_CODE).click();
    return this;
};

PublisherDetailsPage.prototype.codeCopied = function() {
    return new promise.Promise((resolve, reject) => {
        this.findElements(COPY_SUCCESS_MSG).then((elements) => {
            if (elements.length) {
                resolve(true);
            } else {
                resolve(false);
            }
        }, (err) => {
            reject(err);
        });
    }, this.driver.controlFlow());
};

PublisherDetailsPage.prototype.getTagCode = function() {
    this.driver.sleep(fiveSecTO);
    return new promise.Promise((resolve, reject) => {
        this.findElement(CODE_TEXT).then((el) => {
            el.getText().then((code) => {
                resolve(code);
            }, (e) => {
                reject(e);
            });
        }, (err) => {
            reject(err);
        });
    }, this.driver.controlFlow());
};

PublisherDetailsPage.prototype.getNewsletterCardName = function(name) {
    this.searchNewsletter(name);
    return new promise.Promise((resolve, reject) => {
        this.getElementText(NEWSLETTER_TITLE).then((text) => {
            resolve(text);
        }, (err) => {
            reject(err);
        });
    }, this.driver.controlFlow());
};

PublisherDetailsPage.prototype.openNewsletter = function(name) {
    this.searchNewsletter(name);
    this.findElement(NEWSLETTER_LINK(name)).click();
    this.driver.sleep(fiveSecTO);
    return this.getH1Title(name);
};

PublisherDetailsPage.prototype.getNewslettersCards = function() {
    return new promise.Promise((resolve, reject) => {
        this.findElements(NEWSLETTER_TITLE).then((elements) => {
            let newsletterNames = [];
            elements.forEach((val) => {
                newsletterNames.push(val.getText());
            });
            promise.all(newsletterNames).then((names) => {
                resolve(names);
            });
        }, (err) => {
            reject(err);
        });
    }, this.driver.controlFlow());
};

// Get element text
PublisherDetailsPage.prototype.getPublisherName = function() {
    return this.getElementText(PUBLISHER_NAME);
};

PublisherDetailsPage.prototype.getPublisherId = function() {
    return this.getElementText(PUBLISHER_ID);
};

PublisherDetailsPage.prototype.getPrimaryIabCategory = function() {
    return this.getElementText(IAB_CATEGORY);
};

PublisherDetailsPage.prototype.getCName = function() {
    return this.getElementText(CNAME);
};

PublisherDetailsPage.prototype.getPrimaryDomain = function() {
    return this.getElementText(DOMAIN);
};

PublisherDetailsPage.prototype.getLabel = function() {
    return this.getElementText(LABEL);
};

PublisherDetailsPage.prototype.getLIExchangeAdvs = function() {
    return this.getElementText(LI_EXCHANGE_ADV);
};

PublisherDetailsPage.prototype.getRTBAdvertisers = function() {
    return this.getElementText(RTB_ADVERTISERS);
};

PublisherDetailsPage.prototype.getIabBlacklist = function() {
    return this.getElementText(IAB_CAT_BLACKLIST);
};

PublisherDetailsPage.prototype.getCreateNewsletterButton = function() {
    return this.getElement(CREATE_NEWSLETTER_BTN);
};

PublisherDetailsPage.prototype.getDownloadAllTagsButton = function() {
    return this.getElement(DOWNLOAD_ALL_TAGS_BTN);
};

PublisherDetailsPage.prototype.getSearchNewsletterButton = function() {
    return this.getElement(SEARCH_BOX);
};

PublisherDetailsPage.prototype.getEditPublisherLink = function() {
    return this.getElement(EDIT_PUB);
};

PublisherDetailsPage.prototype.getDeletePublisherLink = function() {
    return this.getElement(DELETE_PUB);
};

PublisherDetailsPage.prototype.getViewHistoryPublisherLink = function() {
    return this.getElement(VIEW_HISTORY_PUB);
};

PublisherDetailsPage.prototype.getBreadcrumbLink = function() {
    return this.getSpan(pubSpan);
};

module.exports = PublisherDetailsPage;
