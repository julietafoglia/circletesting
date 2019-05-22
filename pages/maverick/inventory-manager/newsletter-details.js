'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const promise = webdriver.promise;
const fiveSecTO = 5000;
const newsletterSpan = 'Newsletter';

// elements
const PUB_BREADCRUMB = By.xpath('//breadcrumb/div/ul/li/a');
const NEWSLETTER_HEADER = By.xpath('//section-card/div/div[2]/div/div/div/h1');
const NEWSLETTER_ID = By.xpath('//section-card/div/div[2]/div/div/p');
const EDIT_LINK = By.xpath('//a[contains(text(),"Edit")]');
const VIEW_TAGS_LINK = By.xpath('//a[contains(text(),"View Tags")]');
const DOWNLOAD_TAGS_LINK = By.xpath('//a[contains(text(),"Download Tags")]');
const DELETE_LINK = By.xpath('//a[contains(text(),"Delete")]');
const CREATE_AD_SLOT_BTN = By.xpath('//section-card/div/div[2]/div[2]/button');
const AD_SLOT_TABLE = By.xpath('//table/thead/th[contains(text(),"Ad Slot")]');
const SORT_AD_SLOT = By.xpath('//data-table/div/div/header/div/div[1]/h5');
const SORT_SIZE = By.xpath('//data-table/div/div/header/div/div[2]/h5');
const SORT_AD_TYPE = By.xpath('//data-table/div/div/header/div/div[3]/h5');
const SORT_STATUS = By.xpath('//data-table/div/div/header/div/div[4]/h5');
const SORT_DATE_CREATED = By.xpath('//data-table/div/div/header/div/div[5]/h5');
const AD_SLOTS = By.xpath('//tr/td/a');
const AD_SLOT_DROPDOWN = By.xpath('//select-dropdown/button');
const VIEW_CODE = By.xpath('//select-dropdown/dropdown/div/div/ul/li[1]/a');
const EDIT = By.xpath('//select-dropdown/dropdown/div/div/ul/li[2]/a');
const DELETE = By.xpath('//select-dropdown/dropdown/div/div/ul/li[3]/a');
const DELETE_CHECKBOX_ONE = By.xpath(
    '//delete-newsletter-dialog/confirm-dialog/dialogbox/div[2]/div[2]/' +
        'section/div/section/dialog-confirmation[1]/p/label/span'
);
const DELETE_CHECKBOX_TWO = By.xpath(
    '//delete-newsletter-dialog/confirm-dialog/dialogbox/div[2]/div[2]/' +
        'section/div/section/dialog-confirmation[2]/p/label/span'
);
const DELETE_CHECKBOX_THREE = By.xpath(
    '//delete-newsletter-dialog/confirm-dialog/dialogbox/div[2]/div[2]/' +
        'section/div/section/dialog-confirmation[3]/p/label/span'
);
const CANCEL_DELETE_BTN = By.xpath('//section/div/button[1]');
const CONFIRM_DELETE_BTN = By.xpath(
    '//delete-newsletter-dialog/confirm-dialog/dialogbox/div[2]/div[2]/' +
        'section/div/section/div/button[2]'
);
const DELETE_ALERT_MESSAGE = By.xpath('//dialog-error/alert/div/div');
// View tags lightbox
const TAG_TYPE_BTN = By.css(
    'div.lightbox--body > div > div:nth-child(1) >' +
        ' div > select-dropdown > div > button'
);
const SAFE_RTB = By.xpath('//span[text()="SafeRTB"]');
const COPY_CODE = By.css('copy-code > div > div > div > button');
const COPY_SUCCESS_MSG =
    By.xpath('//span[text()="Code copied to your clipboard!"]');
const CODE_TEXT = By.css('copy-code > div > textarea');
const DOWNLOAD_TAGS_LIGHT_BOX =
    By.xpath('//lightbox/div[2]/div/div/div[3]/div/footer/div/div/button');
function NewsletterDetailsPage(webdriver) {
    this.driver = webdriver;
}

NewsletterDetailsPage.prototype = Object.create(BasePage.prototype);
NewsletterDetailsPage.prototype.constructor = NewsletterDetailsPage;


NewsletterDetailsPage.prototype.getNewsletterName = function() {
    return this.getElementText(NEWSLETTER_HEADER);
};

NewsletterDetailsPage.prototype.getNewsletterId = function() {
    return this.getElementText(NEWSLETTER_ID);
};

NewsletterDetailsPage.prototype.getCreateAdSlotButton = function() {
    return this.getElement(CREATE_AD_SLOT_BTN);
};

NewsletterDetailsPage.prototype.getAdSlotTableHeader = function() {
    return this.getElement(AD_SLOT_TABLE);
};

NewsletterDetailsPage.prototype.getEditNewsletterLink = function() {
    return this.getElement(EDIT_LINK);
};

NewsletterDetailsPage.prototype.getViewTagsNewsletterLink = function() {
    return this.getElement(VIEW_TAGS_LINK);
};

NewsletterDetailsPage.prototype.getDownloadTagsNewsletterLink = function() {
    return this.getElement(DOWNLOAD_TAGS_LINK);
};

NewsletterDetailsPage.prototype.getDeleteNewsletterLink = function() {
    return this.getElement(DELETE_LINK);
};

NewsletterDetailsPage.prototype.getBreadcrumbLink = function() {
    return this.getSpan(newsletterSpan);
};

NewsletterDetailsPage.prototype.clickEditBtn = function() {
    this.waitUntilVisible(EDIT_LINK);
    return this.findElement(EDIT_LINK).click();
};

NewsletterDetailsPage.prototype.clickViewTagsBtn = function() {
    this.waitUntilVisible(VIEW_TAGS_LINK);
    this.findElement(VIEW_TAGS_LINK).click();
    return this.driver.sleep(fiveSecTO);
};

NewsletterDetailsPage.prototype.clickDownload = function() {
    this.waitUntilVisible(DOWNLOAD_TAGS_LIGHT_BOX);
    this.findElement(DOWNLOAD_TAGS_LIGHT_BOX).click();
    return this;
};

NewsletterDetailsPage.prototype.selectTagType = function(name) {
    let tagType = By.xpath(`//span[text()="${name}"]`);
    this.waitUntilVisible(TAG_TYPE_BTN);
    this.findElement(TAG_TYPE_BTN).click();
    this.waitUntilVisible(tagType);
    this.findElement(tagType).click();
    return this;
};

NewsletterDetailsPage.prototype.copyCode = function() {
    this.waitUntilVisible(COPY_CODE);
    this.findElement(COPY_CODE).click();
    return this;
};

NewsletterDetailsPage.prototype.codeCopied = function() {
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

NewsletterDetailsPage.prototype.getTagCode = function() {
    return new promise.Promise((resolve, reject) => {
        this.findElement(CODE_TEXT).then((el) => {
            el.getText().then((code) => {
                resolve(code);
            });
        }, (err) => {
            reject(err);
        });
    }, this.driver.controlFlow());
};

NewsletterDetailsPage.prototype.initiateDelete = function() {
    this.waitUntilVisible(DELETE_LINK);
    this.findElement(DELETE_LINK);
    this.findElement(DELETE_LINK).click();
    return this;
};


NewsletterDetailsPage.prototype.deleteNewsletter = function() {
    this.waitUntilVisible(DELETE_CHECKBOX_ONE);
    this.findElement(DELETE_CHECKBOX_ONE).click();
    this.findElement(DELETE_CHECKBOX_TWO).click();
    this.findElement(DELETE_CHECKBOX_THREE).click();
    return this.findElement(CONFIRM_DELETE_BTN).click();
};

NewsletterDetailsPage.prototype.getUncheckedBoxesError = function(boxes) {
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

NewsletterDetailsPage.prototype.clickAdSlotCreateBtn = function() {
    this.waitUntilVisible(CREATE_AD_SLOT_BTN);
    return this.findElement(CREATE_AD_SLOT_BTN).click();
};

NewsletterDetailsPage.prototype.getAdSlotNames = function() {
    this.waitUntilVisible(AD_SLOTS);
    return new promise.Promise((resolve, reject) => {
        this.findElements(AD_SLOTS).then((elements) => {
            let promises = [];
            elements.forEach((value) => {
                promises.push(value.getText());
            });
            promise.all(promises).then((results) => {
                resolve(results);
            }, (err) => {
                reject(err);
            });
        }, (error) => {
            reject(error);
        });
    }, this.driver.controlFlow());
};

module.exports = NewsletterDetailsPage;
