'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;
const fiveSecTo = 5000;

const ENTER_DETAILS_TAB = By.xpath('//h4[text()="Enter Details"]');
const UPLOAD_TAB = By.xpath('//h4[text()="Upload"]');
const NEWSLETTER_NAME = By.css('input[name="newsletterName"');
const IAB_CATEGORY = By.css('input[placeholder="Search Categories"');
const SEARCH_ITEM = By.css('a.search--item');
const ADD_ADDITIONAL_IAB = By.css(
    'a[title="Additional IAB Categories"]'
);
const ADDITIONAL_IAB_CATEGORIES = By.css(
    'tags-input[name="newsletter.secondaryCategories"] input'
);
const SELECTED_ADDL_IAB_CATEGORY = By.xpath('//dropdown/div/div/ul/li');
const ALLOW_EXCHANGE = By.xpath('//input[@name="newsletterExchangeAllow"]/..');
const ADVANCED_SETTINGS = By.css('a[title="Show Advanced Settings"]');
const ADS_DIFF_SOURCES = By.xpath(
    '//span[text()="Ads must be from different sources"]'
);
const ADS_DIFF_ADVS = By.xpath(
    '//span[text()="Ads should be from different advertisers"]'
);
const ADS_DIFF_LINEITEMS = By.xpath(
    '//span[text()="Ads should be from different line items"]'
);
const AD_SLOT_NAME = (idx) => By.xpath(
    `//ad-slot-form-group[${idx}]/div/div/div[1]/div[2]/input`
);
const AD_SLOT_ALLOW_EXCHANGE = (idx) => By.xpath(
    `//ad-slot-form-group[${idx}]/div/div/div[7]/div/div[2]/label/span`
);
const AD_TYPE = (idx) => By.xpath(
    `//ad-slot-form-group[${idx}]//span[text()="Select"]`
);
// Ad types
const MARQUEE = By.xpath(
    '//select-dropdown/div/dropdown/div/div/ul/li[1]/a/span'
);
const CUSTOM = By.css(
    'ad-slot-form-group > div > div > div > div >' +
        ' div:nth-child(3) > div._form--control > label > span'
);
const EXCHANGE_FLOOR = By.css(
    'ad-slot-form-group > div > div > div > div > ' +
        'div:nth-child(3) > div._form--control > div >' +
        ' div:nth-child(1) > div > input'
);
const FIXED_RATIO =
    By.xpath('//select-dropdown/div/dropdown/div/div/ul/li[2]/a/span');
const NATIVE =
    By.xpath('//select-dropdown/div/dropdown/div/div/ul/li[3]/a/span');
// Native options
const IN_FEED = By.xpath('//span[text()="In-feed"]');
const RECOMMENDATION = By.xpath('//span[text()="Recommendation"]');
const TEXT_AD = By.xpath('//span[text()="Text Ad"]');
const PROD_LISTING = By.xpath('//span[text()="Product Listing"]');
const IN_ARTICLE = By.xpath('//span[text()="In-article"]');
const OUTSIDE_OF_CORE = By.xpath('//span[text()="Outside of Core Content"]');
// Ad Sizes
const RATIO = By.xpath('//button[@class="dropdown"]/span[text()="Select"]');
const RATIO_ONE = By.xpath('//li/a/span[text()="300x250"]'); // 300x250
const RATIO_TWO = By.xpath('//li/span[text()="728x90"]');
const RATIO_THREE = By.xpath('//li/span[text()="160x600"]');
const RATIO_FOUR = By.xpath('//li/span[text()="300x600"]');
const RATIO_CUSTOM = By.xpath(
    '//select-dropdown/div/dropdown/div/div/ul/li[5]/a'
);
const ADSLOT_WIDTH = (idx) => By.xpath(
    `//ad-slot-form-group[${idx}]/div/div/div[6]/div[1]/div[2]/input`
);

const ADSLOT_HEIGHT = (idx) => By.xpath(
    `//ad-slot-form-group[${idx}]/div/div/div[6]/div[2]/div[2]/input`
);

const ADD_AD_SLOT = By.css('a[title="Add Ad Slot"]');
const CANCEL_BTN = By.xpath('//a[text()="Cancel"]');
const CREATE_BTN = By.css('button[class="button--primary"]');
const UPLOAD_BOX = By.css('div[class="upload empty"] input');

function NewsletterFormPage(webdriver) {
    this.driver = webdriver;
}

NewsletterFormPage.prototype = Object.create(BasePage.prototype);
NewsletterFormPage.prototype.constructor = NewsletterFormPage;

NewsletterFormPage.prototype.navigate = function(url) {
    this.driver.navigate().to(url);
    return this;
};

NewsletterFormPage.prototype.selectTab = function(tab) {
    this.waitUntilOverlayNotVisible();
    if (tab === 'Upload') {
        this.waitUntilVisible(UPLOAD_TAB);
        this.findElement(UPLOAD_TAB).click();
    } else if (tab === 'Enter Details') {
        this.waitUntilVisible(ENTER_DETAILS_TAB);
        this.findElement(ENTER_DETAILS_TAB).click();
    }
    return this;
};

NewsletterFormPage.prototype.enterNewsletterName = function(name) {
    this.waitUntilVisible(NEWSLETTER_NAME);
    this.findElement(NEWSLETTER_NAME).sendKeys(name);
    return this;
};

NewsletterFormPage.prototype.pickIabCategory = function(category) {
    this.waitUntilVisible(IAB_CATEGORY);
    this.getElement(IAB_CATEGORY).click();
    this.findElement(IAB_CATEGORY).sendKeys(`${category.split(':')[0]}:`);
    this.driver.sleep(2000);
    this.sendKeys(IAB_CATEGORY, key.BACK_SPACE);
    this.getElement(IAB_CATEGORY).click();
    this.getElement(IAB_CATEGORY).click();
    this.getDropDownOptions().click();
    return this;
};

NewsletterFormPage.prototype.pickAdditionalCategories = function(categories) {
    this.waitAndClick(ADD_ADDITIONAL_IAB);
    this.waitAndClick(ADDITIONAL_IAB_CATEGORIES);
    categories.forEach((category) => {
        this.findElement(ADDITIONAL_IAB_CATEGORIES).then((el) => {
            el.click();
            el.sendKeys(`${category.split(':')[0]}:`);
            el.click();
        });
        this.waitUntilVisible(SELECTED_ADDL_IAB_CATEGORY);
        this.findElement(SELECTED_ADDL_IAB_CATEGORY).click();
    });
    this.findElement(ADDITIONAL_IAB_CATEGORIES)
        .sendKeys(webdriver.Key.TAB);
    return this;
};

NewsletterFormPage.prototype.uncheckAllowExchange = function() {
    this.waitUntilVisible(ALLOW_EXCHANGE);
    this.driver.actions()
        .mouseMove(this.findElement(ALLOW_EXCHANGE))
        .click()
        .perform();
    return this;
};

NewsletterFormPage.prototype.clickAdvancedSettings = function() {
    this.waitUntilVisible(ADVANCED_SETTINGS);
    this.findElement(ADVANCED_SETTINGS).click();
    return this;
};

NewsletterFormPage.prototype.checkDiffAdSources = function(option) {
    this.waitUntilVisible(ADS_DIFF_SOURCES);
    this.findElement(ADS_DIFF_SOURCES).click();
    if (option === 1) {
        this.waitUntilVisible(ADS_DIFF_ADVS);
        this.findElement(ADS_DIFF_ADVS).click();
    } else if (option === 2) {
        this.waitUntilVisible(ADS_DIFF_LINEITEMS);
        this.findElement(ADS_DIFF_LINEITEMS).click();
    }
    return this;
};

NewsletterFormPage.prototype.selectAdSize = function(adSlot, index) {
    if (adSlot.adType === 'Fixed Ratio') {
        this.waitUntilVisible(FIXED_RATIO);
        this.findElement(FIXED_RATIO).click();
        this.waitUntilVisible(RATIO);
        this.findElement(RATIO).click();
        switch (adSlot.ratio) {
        case '300x250':
            this.waitUntilVisible(RATIO_ONE);
            this.findElement(RATIO_ONE).click();
            break;
        case '728x90':
            this.waitUntilVisible(RATIO_TWO);
            this.findElement(RATIO_TWO).click();
            break;
        case '160x600':
            this.waitUntilVisible(RATIO_THREE);
            this.findElement(RATIO_THREE).click();
            break;
        case '300x600':
            this.waitUntilVisible(RATIO_FOUR);
            this.findElement(RATIO_FOUR).click();
            break;
        case 'Custom':
            this.waitUntilVisible(RATIO_CUSTOM);
            this.findElement(RATIO_CUSTOM).click();
            this.waitUntilVisible(ADSLOT_WIDTH(index + 1));
            this.findElement(ADSLOT_WIDTH(index + 1)).sendKeys(adSlot.width);
            this.findElement(ADSLOT_HEIGHT(index + 1)).sendKeys(adSlot.height);
            break;
        }
    } else if (adSlot.adType === 'Marquee') {
        this.waitUntilVisible(MARQUEE);
        this.findElement(MARQUEE).click();
        if (adSlot.exchangeFloor) {
            this.findElements(ADVANCED_SETTINGS).then((els) => {
                els[index].click();
            });
            this.findElements(CUSTOM).then((els) => {
                els[index].click();
            });
            this.findElements(EXCHANGE_FLOOR).then((els) => {
                els[index].clear();
                els[index].sendKeys(adSlot.exchangeFloor);
                els[index].sendKeys(webdriver.Key.TAB);
            });
        }
    } else {
        this.waitUntilVisible(NATIVE);
        this.driver.actions()
            .mouseMove(this.findElement(NATIVE))
            .click()
            .perform();
        switch (adSlot.displayType) {
        case 'In-feed':
            this.findElements(IN_FEED).then((els) => {
                els[index].click();
            });
            break;
        case 'Recommendation':
            this.findElements(RECOMMENDATION).then((els) => {
                els[index].click();
            });
            break;
        case 'Product Listing':
            this.findElements(PROD_LISTING).then((els) => {
                els[index].click();
            });
            this.selectAdContext(adSlot.adContext, index);
            break;
        case 'Text Ad':
            this.findElements(TEXT_AD).then((els) => {
                els[index].click();
            });
            this.selectAdContext(adSlot.adContext, index);
            break;
        default:
            throw new Error('Invalid display type');
        }
    }
    return this;
};

NewsletterFormPage.prototype.selectAdContext = function(adContext, index) {
    this.waitUntilLocated(IN_ARTICLE);
    if (adContext === 'In-article') {
        this.findElements(IN_ARTICLE).then((els) => {
            els[index].click();
        });
    } else {
        this.findElements(OUTSIDE_OF_CORE).then((els) => {
            els[index].click();
        });
    }
};

NewsletterFormPage.prototype.getDropDownOptions = function() {
    this.waitUntilVisible(SEARCH_ITEM);
    return this.findElement(SEARCH_ITEM);
};

/**
 * Create ad slots
 * @param adSlots an array of ad slot objects
 * @param masterAllow indicates whether "Allow exchange for all ad slots"
 *                  has been checked for this newsletter
 * @param offset the number of ad slots that have already been created for
 *              this newsletter
 */
NewsletterFormPage.prototype.createAdSlots = function(adSlots,
    masterAllow = true,
    offset = 0) {
    this.waitUntilVisible(ADD_AD_SLOT);
    let length = offset ? adSlots.length : adSlots.length - 1;
    for (let i = 0; i < length; i++) {
        this.driver.actions()
            .mouseMove(this.findElement(ADD_AD_SLOT))
            .click()
            .perform();
    }
    for (let j = offset; j < adSlots.length + offset; j++) {
        if (!masterAllow && adSlots[j - offset].allowExchange) {
            this.findElement(AD_SLOT_ALLOW_EXCHANGE(j + 1)).click();
        }
        this.findElement(
            AD_SLOT_NAME(j + 1)).sendKeys(adSlots[j - offset].name);
        this.findElement(AD_TYPE(j + 1)).click();
        this.selectAdSize(adSlots[j - offset], j);
    }
    return this;
};

NewsletterFormPage.prototype.uploadFile = function(filePath) {
    this.waitUntilLocated(UPLOAD_BOX);
    this.findElement(UPLOAD_BOX).sendKeys(filePath);
    this.driver.sleep(fiveSecTo);
    return this;
};

NewsletterFormPage.prototype.clickCreateBtn = function() {
    this.waitUntilEnabled(CREATE_BTN);
    this.findElement(CREATE_BTN).click();
    return this.waitOverlayUntilStale();
};

NewsletterFormPage.prototype.clickCancelBtn = function() {
    this.waitUntilVisible(CANCEL_BTN);
    this.findElement(CANCEL_BTN).click();
    return this;
};

module.exports = NewsletterFormPage;
