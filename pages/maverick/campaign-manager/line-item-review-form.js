'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');
const driverTimeOut = 5000;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

// elements
const BUTTON_RETURN_TO_LI = By.css('.line-item-review--rtn-link');
const BUTTON_SAVE = By.xpath('//button[text() = "Save"]');

const TEXT_PARENT_CAMP = By.xpath('//line-item-review/lightbox/div[2]/div/' +
    'div/div[2]/div/div/section[1]/div[1]/div[2]');
const TEXT_NAME = By.xpath('//line-item-review/lightbox/div[2]/div/div/' +
            'div[2]/div/div/section[1]/div[2]/div[2]');
const TEXT_STATUS = By.xpath('//line-item-review/lightbox/div[2]/div/div' +
            '/div[2]/div/div/section[1]/div[3]/div[2]');
const TEXT_LABEL = By.xpath('//line-item-review/lightbox/div[2]/div/div' +
            '/div[2]/div/div/section[1]/div[4]/div[2]');
const TEXT_BUDGET = By.xpath('//line-item-review/lightbox/div[2]/div/div' +
            '/div[2]/div/div/section[1]/div[5]/div[2]');
const TEXT_PACING = By.xpath('//line-item-review/lightbox/div[2]/div/div/' +
    'div[2]/div/div/section[1]/div[6]/div[2]');

    // targeting
const TEXT_LOCATION_TARG = By.xpath('//section[2]/selection-summary[1]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[1]');
const TEXT_LOCATION_COUNT = By.xpath('//section[2]/selection-summary[1]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[2]');
const TEXT_LOCATION_SELECTION = By.xpath('//section[2]/selection-summary[1]' +
            '/div/div/div/div[2]/div[2]/div/div/div' +
                '/zebra-list/table/tbody/tr/td[2]');

const TEXT_GENDER_TARG = By.xpath('//section[2]/selection-summary[2]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[1]');
const TEXT_GENDER_COUNT = By.xpath('//section[2]/selection-summary[2]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[2]');
const TEXT_GENDER_SELECTION = By.xpath('//section[2]/selection-summary[2]' +
            '/div/div/div/div[2]/div[2]/div/div/div/span');

const TEXT_DEVICE_TARG = By.xpath('//section[2]/selection-summary[3]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[1]');
const TEXT_DEVICE_COUNT = By.xpath('//section[2]/selection-summary[3]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[2]');
const TEXT_DEVICE_SELECTION = By.xpath('//section[2]/selection-summary[3]' +
            '/div/div/div/div[2]/div[2]/div/div/div/span');

const TEXT_AGE_TARG = By.xpath('//section[2]/selection-summary[4]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[1]');
const TEXT_AGE_COUNT = By.xpath('//section[2]/selection-summary[4]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[2]');
const TEXT_AGE_SELECTION = By.xpath('//section[2]/selection-summary[4]' +
            '/div/div/div/div[2]/div[2]/div/div/div/span');

const TEXT_OS_TARG = By.xpath('//section[2]/selection-summary[5]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[1]');
const TEXT_OS_COUNT = By.xpath('//section[2]/selection-summary[5]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[2]');
const TEXT_OS_SELECTION = By.xpath('//section[2]/selection-summary[5]' +
            '/div/div/div/div[2]/div[2]/div/div/div/span');

const TEXT_BROWSER_TARG = By.xpath('//section[2]/selection-summary[6]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[1]');
const TEXT_BROWSER_COUNT = By.xpath('//section[2]/selection-summary[6]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[2]');
const TEXT_BROWSER_SELECTION = By.xpath('//section[2]/selection-summary[6]' +
            '/div/div/div/div[2]/div[2]/div/div/div/span');

const TEXT_DEVICE_MAKER_TARG = By.xpath('//section[2]/selection-summary[7]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[1]');
const TEXT_DEVICE_MAKER_COUNT = By.xpath('//section[2]/selection-summary[7]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[2]');
const TEXT_DEVICE_MAKER_SELECTION = By
    .xpath('//section[2]/selection-summary[7]' +
            '/div/div/div/div[2]/div[2]/div/div/div/span');

const TEXT_DAY_TARG = By.xpath('//section[2]/selection-summary[8]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[1]');
const TEXT_DAY_COUNT = By.xpath('//section[2]/selection-summary[8]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[2]');
const TEXT_DAY_SELECTION = By.xpath('//section[2]/selection-summary[8]' +
            '/div/div/div/div[2]/div[2]/div/div/div/span');

const TEXT_TIME_TARG = By.xpath('//section[2]/selection-summary[9]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[1]');
const TEXT_TIME_COUNT = By.xpath('//section[2]/selection-summary[9]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[2]');
const TEXT_TIME_SELECTION = By.xpath('//section[2]/selection-summary[9]' +
            '/div/div/div/div[2]/div[2]/div/div/div/span');

const TEXT_ISP_TARG = By.xpath('//section[2]/selection-summary[10]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[1]');
const TEXT_ISP_COUNT = By.xpath('//section[2]/selection-summary[10]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[2]');
const TEXT_ISP_SELECTION = By.xpath('//section[2]/selection-summary[10]' +
            '/div/div/div/div[2]/div[2]/div/div/div/span');

const TEXT_BUNDLE_TARG = By.xpath('//section[2]/selection-summary[11]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[1]');
const TEXT_BUNDLE_COUNT = By.xpath('//section[2]/selection-summary[11]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[2]');
const TEXT_BUNDLE_SELECTION = By.xpath('//section[2]/selection-summary[11]' +
            '/div/div/div/div[2]/div[2]/div/div/div/span');

const TEXT_CATEGORY_TARG = By.xpath('//section[2]/selection-summary[12]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[1]');
const TEXT_CATEGORY_COUNT = By.xpath('//section[2]/selection-summary[12]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[2]');
const TEXT_CATEGORY_SELECTION = By.xpath('//section[2]/selection-summary[12]' +
            '/div/div/div/div[2]/div[2]/div/div/div/span');

const TEXT_WHITELIST_TARG = By.xpath('//section[2]/selection-summary[13]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[1]');
const TEXT_WHITELIST_COUNT = By.xpath('//section[2]/selection-summary[13]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[2]');
const TEXT_WHITELIST_SELECTION = By.xpath('//section[2]/selection-summary[13]' +
            '/div/div/div/div[2]/div[2]/div/div/div/' +
                'zebra-list/table/tbody/tr/td[2]');
const TEXT_BLACKLIST_TARG = By.xpath('//section[2]/selection-summary[13]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[1]');
const TEXT_BLACKLIST_COUNT = By.xpath('//section[2]/selection-summary[13]/' +
            'div/div/div/div[2]/div[1]/div/h5/span[2]');
const TEXT_BLACKLIST_SELECTION = By.xpath('//section[2]/selection-summary[13]' +
            '/div/div/div/div[2]/div[2]/div/div/div/' +
                'zebra-list/table/tbody/tr/td[2]');

const TEXT_THIRD_PARTY_TARG = By.css('selection-summary[ng-reflect-title' +
            '="RapLeaf = children"] ._form--review h5 span');
const TEXT_THIRD_PARTY_COUNT = By.css('selection-summary[ng-reflect-title' +
            '="RapLeaf = children"] ._form--review h5 span._badge');
const TEXT_THIRD_PARTY_SELECTION = By.
    css('selection-summary[ng-reflect-title=' +
            '"RapLeaf = children"] ._form--review .row .column--12' +
                ' div div span');
const TEXT_REVIEW_AD_NAME = By.xpath('//line-item-review/lightbox/div[2]/' +
            'div/div/div[2]/div/div/section[3]/div/div/div[2]');
const TEXT_REVIEW_AD_ID = By.xpath('//line-item-review/lightbox/div[2]/' +
            'div/div/div[2]/div/div/section[3]/div/div[2]/div[2]');
const TEXT_REVIEW_CLICK_URL = By.xpath('//line-item-review/lightbox/' +
            'div[2]/div/div/div[2]/div/div/section[3]/div/div[3]/div[2]');

function LineItemReviewPage(webdriver) {
    BasePage.call(this, webdriver);
}

LineItemReviewPage.prototype = Object.create(BasePage.prototype);
LineItemReviewPage.prototype.constructor = LineItemReviewPage;

// gets
LineItemReviewPage.prototype.getButtonReturnToLineItem = function() {
    return this.findElement(BUTTON_RETURN_TO_LI);
};
LineItemReviewPage.prototype.getButtonSave = function() {
    this.waitUntilVisible(BUTTON_SAVE);
    return this.findElement(BUTTON_SAVE);
};
LineItemReviewPage.prototype.getTextParentCampaign = function() {
    return this.findElement(TEXT_PARENT_CAMP);
};
LineItemReviewPage.prototype.getTextName = function() {
    return this.findElement(TEXT_NAME);
};
LineItemReviewPage.prototype.getTextStatus = function() {
    return this.findElement(TEXT_STATUS);
};
LineItemReviewPage.prototype.getTextLabel = function() {
    return this.findElement(TEXT_LABEL);
};
LineItemReviewPage.prototype.getTextBudget = function() {
    return this.findElement(TEXT_BUDGET);
};
LineItemReviewPage.prototype.getTextPacing = function() {
    return this.findElement(TEXT_PACING);
};
LineItemReviewPage.prototype.getTextStartDate = function(value) {
    return this.findElement(By
        .xpath('//span[contains(text(),"' + value + '")]'));
};
LineItemReviewPage.prototype.getTextEndDate = function(value) {
    return this.findElement(By
        .xpath('//span[contains(text(),"' + value + '")]'));
};
LineItemReviewPage.prototype.getTextLocationTarget = function() {
    return this.findElement(TEXT_LOCATION_TARG);
};

LineItemReviewPage.prototype.getTextLocationCount = function() {
    return this.findElement(TEXT_LOCATION_COUNT);
};

LineItemReviewPage.prototype.getTextLocationSelection = function() {
    return this.findElement(TEXT_LOCATION_SELECTION);
};

LineItemReviewPage.prototype.getTextGenderTarget = function() {
    return this.findElement(TEXT_GENDER_TARG);
};

LineItemReviewPage.prototype.getTextGenderCount = function() {
    return this.findElement(TEXT_GENDER_COUNT);
};

LineItemReviewPage.prototype.getTextGenderSelection = function() {
    return this.findElement(TEXT_GENDER_SELECTION);
};

LineItemReviewPage.prototype.getTextDeviceTarget = function() {
    return this.findElement(TEXT_DEVICE_TARG);
};

LineItemReviewPage.prototype.getTextDeviceCount = function() {
    return this.findElement(TEXT_DEVICE_COUNT);
};

LineItemReviewPage.prototype.getTextDeviceSelection = function() {
    return this.findElement(TEXT_DEVICE_SELECTION);
};

LineItemReviewPage.prototype.getTextAgeTarget = function() {
    return this.findElement(TEXT_AGE_TARG);
};

LineItemReviewPage.prototype.getTextAgeCount = function() {
    return this.findElement(TEXT_AGE_COUNT);
};

LineItemReviewPage.prototype.getTextAgeSelection = function() {
    return this.findElement(TEXT_AGE_SELECTION);
};

LineItemReviewPage.prototype.getTextOsTarget = function() {
    return this.findElement(TEXT_OS_TARG);
};

LineItemReviewPage.prototype.getTextOsCount = function() {
    return this.findElement(TEXT_OS_COUNT);
};

LineItemReviewPage.prototype.getTextOsSelection = function() {
    return this.findElement(TEXT_OS_SELECTION);
};

LineItemReviewPage.prototype.getTextBrowserTarget = function() {
    return this.findElement(TEXT_BROWSER_TARG);
};

LineItemReviewPage.prototype.getTextBrowserCount = function() {
    return this.findElement(TEXT_BROWSER_COUNT);
};

LineItemReviewPage.prototype.getTextBrowserSelection = function() {
    return this.findElement(TEXT_BROWSER_SELECTION);
};

LineItemReviewPage.prototype.getTextDeviceMakerTarget = function() {
    return this.findElement(TEXT_DEVICE_MAKER_TARG);
};

LineItemReviewPage.prototype.getTextDeviceMakerCount = function() {
    return this.findElement(TEXT_DEVICE_MAKER_COUNT);
};

LineItemReviewPage.prototype.getTextDeviceMakerSelection = function() {
    return this.findElement(TEXT_DEVICE_MAKER_SELECTION);
};

LineItemReviewPage.prototype.getTextDayTarget = function() {
    return this.findElement(TEXT_DAY_TARG);
};

LineItemReviewPage.prototype.getTextDayCount = function() {
    return this.findElement(TEXT_DAY_COUNT);
};

LineItemReviewPage.prototype.getTextDaySelection = function() {
    return this.findElement(TEXT_DAY_SELECTION);
};

LineItemReviewPage.prototype.getTextTimeTarget = function() {
    return this.findElement(TEXT_TIME_TARG);
};

LineItemReviewPage.prototype.getTextTimeCount = function() {
    return this.findElement(TEXT_TIME_COUNT);
};

LineItemReviewPage.prototype.getTextTimeSelection = function() {
    return this.findElement(TEXT_TIME_SELECTION);
};

LineItemReviewPage.prototype.getTextIspTarget = function() {
    return this.findElement(TEXT_ISP_TARG);
};

LineItemReviewPage.prototype.getTextIspCount = function() {
    return this.findElement(TEXT_ISP_COUNT);
};

LineItemReviewPage.prototype.getTextIspSelection = function() {
    return this.findElement(TEXT_ISP_SELECTION);
};

LineItemReviewPage.prototype.getTextBundleTarget = function() {
    return this.findElement(TEXT_BUNDLE_TARG);
};

LineItemReviewPage.prototype.getTextBundleCount = function() {
    return this.findElement(TEXT_BUNDLE_COUNT);
};

LineItemReviewPage.prototype.getTextBundleSelection = function() {
    return this.findElement(TEXT_BUNDLE_SELECTION);
};

LineItemReviewPage.prototype.getTextCategoryTarget = function() {
    return this.findElement(TEXT_CATEGORY_TARG);
};

LineItemReviewPage.prototype.getTextCategoryCount = function() {
    return this.findElement(TEXT_CATEGORY_COUNT);
};

LineItemReviewPage.prototype.getTextCategorySelection = function() {
    return this.findElement(TEXT_CATEGORY_SELECTION);
};

LineItemReviewPage.prototype.getTextWhitelistTarget = function() {
    return this.findElement(TEXT_WHITELIST_TARG);
};

LineItemReviewPage.prototype.getTextWhitelistCount = function() {
    return this.findElement(TEXT_WHITELIST_COUNT);
};

LineItemReviewPage.prototype.getTextWhitelistSelection = function() {
    return this.findElement(TEXT_WHITELIST_SELECTION);
};
LineItemReviewPage.prototype.getTextBlacklistTarget = function() {
    return this.findElement(TEXT_BLACKLIST_TARG);
};

LineItemReviewPage.prototype.getTextBlacklistCount = function() {
    return this.findElement(TEXT_BLACKLIST_COUNT);
};

LineItemReviewPage.prototype.getTextBlacklistSelection = function() {
    return this.findElement(TEXT_BLACKLIST_SELECTION);
};

LineItemReviewPage.prototype.getTextThirdPartyTarget = function() {
    return this.findElement(TEXT_THIRD_PARTY_TARG);
};

LineItemReviewPage.prototype.getTextThirdPartyCount = function() {
    return this.findElement(TEXT_THIRD_PARTY_COUNT);
};

LineItemReviewPage.prototype.getTextThirdPartySelection = function() {
    return this.findElement(TEXT_THIRD_PARTY_SELECTION);
};

LineItemReviewPage.prototype.getTextReviewAdName = function() {
    return this.findElement(TEXT_REVIEW_AD_NAME);
};

LineItemReviewPage.prototype.getTextReviewAdId = function() {
    return this.findElement(TEXT_REVIEW_AD_ID);
};

LineItemReviewPage.prototype.getTextReviewAdClickUrl = function() {
    return this.findElement(TEXT_REVIEW_CLICK_URL);
};

// clicks
LineItemReviewPage.prototype.clickSave = function() {
    this.driver.sleep(driverTimeOut);
    this.waitUntilVisible(BUTTON_SAVE);
    this.click(BUTTON_SAVE);
    return this.waitOverlayUntilStale();
};
LineItemReviewPage.prototype.clickReturnToLineItem = function() {
    return this.click(BUTTON_RETURN_TO_LI);
};

module.exports = LineItemReviewPage;
