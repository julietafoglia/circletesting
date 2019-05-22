'use strict';

// vendor dependencies

const rootPath = process.env.ROOT_PATH;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const promise = webdriver.promise;

const BasePage = require(rootPath + '/pages/salesforce');

// constants
const CATEGORY_OFFSET = 27;
const MAC_OS = 'darwin';

// elements
const CAMPAIGN_NAME =
    By.css('input[id="j_id0:j_id5:selected:j_id6:0:j_id10:j_id14:j_id15"]');
const FLIGHT_START =
    By.css('input[id="j_id0:j_id5:selected:j_id6:0:j_id10:j_id17:j_id18"]');
const END_DATE =
    By.css('input[id="j_id0:j_id5:selected:j_id6:0:j_id10:j_id17:j_id19"]');
const BUDGET =
    By.css('input[id="j_id0:j_id5:selected:j_id6:0:j_id10:j_id20:j_id21"]');
const CAMPAIGN_GOALS = By.css(
    'select[name="j_id0:j_id5:selected:j_id6:0:j_id10:j_id22"] > option'
);
const PACING = By.css(
    'select[name="j_id0:j_id5:selected:j_id6:0:j_id10:j_id27:j_id29"]' +
        ' > option'
);
const BID_AMOUNT =
    By.css('input[id="j_id0:j_id5:selected:j_id6:0:j_id10:j_id27:j_id28"]');
const FREQ_CAP =
    By.css('input[id="j_id0:j_id5:selected:j_id6:0:j_id10:j_id30:j_id31"]');
const TIMES_PER = By.css(
    'select[id="j_id0:j_id5:selected:j_id6:0:j_id10:j_id30:j_id32"]' +
        ' > option'
);
const TARGETING_DESC = By.css(
    'textarea[name="j_id0:j_id5:selected:j_id6:0:j_id10:j_id34:j_id35"]'
);
const MAX_CPM_BID =
    By.css('input[id="j_id0:j_id5:selected:j_id6:0:section2:j_id37"]');
const PRI_IAB_CATEGORY = By.css(
    'select[id="j_id0:j_id5:selected:j_id6:0:section2:j_id38"] > option'
);
const SEC_IAB_CATEGORY = By.css(
    'select[name="j_id0:j_id5:selected:j_id6:0:section2:j_id39"] > option'
);
const PLACE_PIXEL =
    By.css('input[id="j_id0:j_id5:selected:j_id6:0:section2:j_id41"]');
const PIXEL_NAME =
    By.css('input[id="j_id0:j_id5:selected:j_id6:0:section2:j_id43"]');
const LFM_PIXEL_ID =
    By.css('input[id="j_id0:j_id5:selected:j_id6:0:section2:j_id42"]');
const NATIVE_BTN =
    By.css('input[id="j_id0:j_id5:j_id47:j_id51:7:j_id53"]');
const TAKEOVER_BTN =
    By.css('input[id="j_id0:j_id5:j_id47:j_id51:11:j_id53"]');
const MARQUEE_BTN =
    By.css('input[id="j_id0:j_id5:j_id47:j_id51:6:j_id53"]');
const STD_IAB_BANNERS_BTN =
    By.css('input[id="j_id0:j_id5:j_id47:j_id51:10:j_id53"]');
const CANCEL_BTN = By.css('input[value="Cancel"]');
const SAVE_BTN = By.css('input[value="Save"]');
const ERRORS = By.css('ul[role="alert"] > li');

function ProductEdit(webdriver) {
    BasePage.call(this, webdriver);
}

ProductEdit.prototype = Object.create(BasePage.prototype);
ProductEdit.prototype.constructor = ProductEdit;

ProductEdit.prototype.selectCampaignType = function(type) {
    this.waitUntilVisible(MARQUEE_BTN);
    switch (type) {
    case 'Marquee':
        this.driver.findElement(MARQUEE_BTN).click();
        break;
    case 'Native':
        this.driver.findElement(NATIVE_BTN).click();
        break;
    case 'Standard IAB Banners':
        this.driver.findElement(STD_IAB_BANNERS_BTN).click();
        break;
    default:
        this.driver.findElement(TAKEOVER_BTN).click();
    }
    return this;
};

ProductEdit.prototype.enterCampaignName = function(campaign) {
    this.waitUntilVisible(CAMPAIGN_NAME);
    this.driver.findElement(CAMPAIGN_NAME).sendKeys(campaign);
    return this;
};

ProductEdit.prototype.enterFlightStart = function(date) {
    this.waitUntilVisible(FLIGHT_START);
    this.driver.findElement(FLIGHT_START).clear();
    let sequence = this.driver.actions();
    sequence.click(this.driver.findElement(FLIGHT_START))
        .sendKeys(date)
        .sendKeys(webdriver.Key.TAB)
        .perform();
    return this;
};

ProductEdit.prototype.enterEndDate = function(date) {
    this.waitUntilVisible(END_DATE);
    this.driver.findElement(END_DATE).clear();
    let sequence = this.driver.actions();
    sequence.click(this.driver.findElement(END_DATE))
        .sendKeys(date)
        .sendKeys(webdriver.Key.TAB)
        .perform();
    return this;
};

ProductEdit.prototype.enterBudget = function(amount) {
    this.waitUntilVisible(BUDGET);
    this.driver.findElement(BUDGET).clear();
    this.driver.findElement(BUDGET).sendKeys(amount);
    return this;
};

ProductEdit.prototype.selectCampaignGoal = function(goal) {
    this.waitUntilVisible(CAMPAIGN_GOALS);
    this.driver.findElements(CAMPAIGN_GOALS).then((elements) => {
        elements[goal].click();
    }, (err) => {
        throw err;
    });
    return this;
};

ProductEdit.prototype.selectPacing = function(pacing) {
    this.waitUntilVisible(PACING);
    this.driver.findElements(PACING).then((elements) => {
        switch (pacing) {
        case 'Even':
            elements[1].click();
            break;
        case 'Varied':
            elements[2].click();
            break;
        case 'ASAP (Dedicated Only)':
            elements[3].click();
            break;
        }
    }, (err) => {
        throw err;
    });
    return this;
};

ProductEdit.prototype.enterBidAmount = function(amount) {
    this.waitUntilVisible(BID_AMOUNT);
    this.driver.findElement(BID_AMOUNT).clear();
    this.driver.findElement(BID_AMOUNT).sendKeys(amount);
    return this;
};

ProductEdit.prototype.enterFrequencyCap = function(cap) {
    this.waitUntilVisible(FREQ_CAP);
    this.driver.findElement(FREQ_CAP).sendKeys(cap);
    return this;
};

ProductEdit.prototype.selectTimesPer = function(period) {
    this.waitUntilVisible(TIMES_PER);
    this.driver.findElements(TIMES_PER).then((elements) => {
        switch (period) {
        case 'Hour':
            elements[1].click();
            break;
        case 'Day':
            elements[2].click();
            break;
        case 'Week':
            elements[3].click();
            break;
        case 'Month':
            elements[4].click();
        }
    }, (err) => {
        throw err;
    });
    return this;
};

ProductEdit.prototype.enterTargetingDescription = function(description) {
    this.waitUntilVisible(TARGETING_DESC);
    this.driver.findElement(TARGETING_DESC).sendKeys(description);
    return this;
};

ProductEdit.prototype.enterMaxCPMBid = function(amount) {
    this.waitUntilVisible(MAX_CPM_BID);
    this.driver.findElement(MAX_CPM_BID).sendKeys(amount);
    return this;
};

ProductEdit.prototype.selectPrimaryIABCat = function(category) {
    this.waitUntilVisible(PRI_IAB_CATEGORY);
    this.driver.findElements(PRI_IAB_CATEGORY).then( (elements) => {
        elements[category].click();
    });
    return this;
};

ProductEdit.prototype.selectSecondaryIABCats = function(categories) {
    this.waitUntilVisible(SEC_IAB_CATEGORY);
    this.driver.findElements(SEC_IAB_CATEGORY).then((elements) => {
        let sequence = this.driver.actions();
        // Handle Control/Command Key diffs on different OS's
        let commandKey = process.platform === MAC_OS ?
            webdriver.Key.COMMAND : webdriver.Key.CONTROL;
        sequence.keyDown(commandKey);
        categories.forEach((category) => {
            sequence.click(elements[category - CATEGORY_OFFSET]);
        });
        sequence.keyUp(commandKey)
            .perform();
    });
    return this;
};

ProductEdit.prototype.checkPixelRadioBtn = function() {
    this.waitUntilVisible(PLACE_PIXEL);
    this.driver.findElement(PLACE_PIXEL).click();
    return this;
};

ProductEdit.prototype.enterPixelName = function(name) {
    this.waitUntilVisible(PIXEL_NAME);
    this.driver.findElement(PIXEL_NAME).sendKeys(name);
    return this;
};

ProductEdit.prototype.enterLfmPixelId = function(id) {
    this.waitUntilVisible(LFM_PIXEL_ID);
    this.driver.findElement(LFM_PIXEL_ID).sendKeys(id);
    return this;
};

ProductEdit.prototype.cancelProdEdit = function() {
    this.waitUntilVisible(CANCEL_BTN);
    return this.driver.findElement(CANCEL_BTN).click();
};

// Returns a promise unlike `clickSaveBtn`
ProductEdit.prototype.saveProduct = function() {
    this.waitUntilVisible(SAVE_BTN);
    return this.driver.findElement(SAVE_BTN).click();
};

ProductEdit.prototype.clickSaveBtn = function() {
    this.waitUntilVisible(SAVE_BTN);
    this.driver.findElement(SAVE_BTN).click();
    return this;
};

ProductEdit.prototype.getErrors = function() {
    this.waitUntilVisible(ERRORS);
    return new promise.Promise((resolve, reject) => {
        this.driver.findElements(ERRORS)
            .then((elements) => {
                let promises = [];
                elements.forEach((el) => {
                    promises.push(el.getText());
                });
                Promise.all(promises).then((res) => {
                    let errors = res.map((text) => text.trim());
                    resolve(errors);
                }, (err) => {
                    reject(err);
                });
            }, (err2) => {
                reject(err2);
            });
    });
};

module.exports = ProductEdit;
