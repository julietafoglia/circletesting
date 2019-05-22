'use strict';

// vendor dependencies
const rootPath = process.env.ROOT_PATH;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const promise = webdriver.promise;

const BasePage = require(rootPath + '/pages/salesforce');

// elements
const ACCOUNT_NAME = By.css('#opp4');
const OPP_NAME = By.css('#opp3');
const BRAND = By.css('input[id="CF00NG000000C4tqD"]');
const IO_NAME = By.css('input[id="00N1600000EvbtN"]');
const ACCOUNT_MANAGER = By.css('input[id="CF00NG0000008Rm2x"]');
const AD_SERVERS = By.css('select[id="00N1600000FG67W"] > option');
const LI_NUMBERS = By.css('select[id="00N1600000FG67b"]');
const LI_NUMBERS_YES = By.css('option[value="Yes"]');
const LI_NUMBERS_NO = By.css('option[value="No"]');
const DOMAIN = By.css('input[id="00N1600000FG67X"]');
const LFM_ADV_ID = By.css('input[id="00N2C000000PPgC"]');
const IAB_CATEGORIES = By.css('option[value^="IAB"]');
const LFM_IO_ID = By.css('input[id="00N1600000F4GxV"]');
const TYPE = By.css('#opp5');
const TYPE_NEW_BUY = By.css('option[value="New Buy"]');
const TYPE_RENEWAL = By.css('option[value="Renewal"]');
const STAGE = By.css('#opp11');
const STAGE_PROPOSAL = By.css('option[value="Proposal"]');
const STAGE_CLOSED_WON = By.css('option[value="Closed Won (IO Signed)"]');
const LIVE_DATE = By.css('#opp9');
const END_DATE = By.css('input[id="00NG0000008SGik"]');
const TOTAL_BUDGET = By.css('#opp7');
const CANCEL_BTN = By.css('input[title="Cancel"]');
const SAVE_BTN = By.css('input[title="Save"]');
const ERRORS = By.css('.errorMsg');

function OpportunitiesEdit(webdriver) {
    BasePage.call(this, webdriver);
}

OpportunitiesEdit.prototype = Object.create(BasePage.prototype);
OpportunitiesEdit.prototype.constructor = OpportunitiesEdit;

OpportunitiesEdit.prototype.enterAccountName = function(name) {
    this.waitUntilVisible(ACCOUNT_NAME);
    this.driver.findElement(ACCOUNT_NAME).sendKeys(name);
    this.driver.sleep(2000);
    return this;
};

OpportunitiesEdit.prototype.enterOppName = function(name) {
    this.waitUntilVisible(OPP_NAME);
    this.driver.findElement(OPP_NAME).sendKeys(name);
    return this;
};

OpportunitiesEdit.prototype.enterBrand = function(brand) {
    this.waitUntilVisible(BRAND);
    this.driver.findElement(BRAND).sendKeys(brand);
    return this;
};

OpportunitiesEdit.prototype.enterIoName = function(ioName) {
    this.waitUntilVisible(IO_NAME);
    this.driver.findElement(IO_NAME).sendKeys(ioName);
    return this;
};

OpportunitiesEdit.prototype.enterAccountManager = function(manager) {
    this.waitUntilVisible(ACCOUNT_MANAGER);
    this.driver.findElement(ACCOUNT_MANAGER).sendKeys(manager);
    this.driver.findElement(ACCOUNT_MANAGER).sendKeys(webdriver.Key.TAB);
    return this;
};

OpportunitiesEdit.prototype.selectAdServer = function(adserver) {
    this.waitUntilVisible(AD_SERVERS);
    this.driver.findElements(AD_SERVERS).then((elements) => {
        switch (adserver) {
        case 'Atlas':
            elements[1].click();
            break;
        case 'DART':
            elements[2].click();
            break;
        case 'LiveIntent':
            elements[3].click();
            break;
        case 'MediaMind':
            elements[4].click();
            break;
        case 'MediaPlex':
            elements[5].click();
            break;
        case 'Other':
            elements[6].click();
            break;
        default:
            elements[0].click();
        }
    });
    return this;
};

OpportunitiesEdit.prototype.useLiveIntentNumbers = function(value) {
    this.waitUntilVisible(LI_NUMBERS);
    if (value === 'Yes') {
        this.driver.findElement(LI_NUMBERS_YES).click();
    } else {
        this.driver.findElement(LI_NUMBERS_NO).click();
    }
    return this;
};

OpportunitiesEdit.prototype.enterDomain = function(domain) {
    this.waitUntilVisible(DOMAIN);
    this.driver.findElement(DOMAIN).clear();
    this.driver.findElement(DOMAIN).sendKeys(domain);
    return this;
};

OpportunitiesEdit.prototype.enterLfmAdvId = function(id) {
    this.waitUntilVisible(LFM_ADV_ID);
    this.driver.findElement(LFM_ADV_ID).sendKeys(id);
    return this;
};

OpportunitiesEdit.prototype.selectIABCategory = function(category) {
    this.driver.findElements(IAB_CATEGORIES).then((elements) => {
        elements[category - 1].click();
    }, (err) => {
        throw err;
    });
    return this;
};

OpportunitiesEdit.prototype.enterLfmIoId = function(lfmIoId) {
    this.waitUntilVisible(LFM_IO_ID);
    this.driver.findElement(LFM_IO_ID).sendKeys(lfmIoId);
    return this;
};

OpportunitiesEdit.prototype.selectType = function(type) {
    this.waitUntilVisible(TYPE);
    switch (type) {
    case 'New Buy':
        this.driver.findElement(TYPE_NEW_BUY).click();
        break;
    case 'Renewal':
        this.driver.findElement(TYPE_RENEWAL).click();
    }
    return this;
};

OpportunitiesEdit.prototype.selectStage = function(stage) {
    this.waitUntilVisible(STAGE);
    if (stage === 'Closed Won (IO Signed)') {
        this.driver.findElement(STAGE_CLOSED_WON).click();
    } else {
        this.driver.findElement(STAGE_PROPOSAL).click();
    }
    return this;
};

OpportunitiesEdit.prototype.enterLiveDate = function(date) {
    this.waitUntilVisible(LIVE_DATE);
    this.driver.findElement(LIVE_DATE).clear();
    let sequence = this.driver.actions();
    sequence.click(this.driver.findElement(LIVE_DATE))
        .sendKeys(date)
        .sendKeys(webdriver.Key.TAB)
        .perform();
    return this;
};

OpportunitiesEdit.prototype.enterEndDate = function(date) {
    this.waitUntilVisible(END_DATE);
    this.driver.findElement(END_DATE).clear();
    let sequence = this.driver.actions();
    sequence.click(this.driver.findElement(END_DATE))
        .sendKeys(date)
        .sendKeys(webdriver.Key.TAB)
        .perform();
    return this;
};

OpportunitiesEdit.prototype.enterTotalBudget = function(budget) {
    this.waitUntilVisible(TOTAL_BUDGET);
    this.driver.findElement(TOTAL_BUDGET).sendKeys(budget);
    return this;
};

OpportunitiesEdit.prototype.clickSaveBtn = function() {
    this.waitUntilVisible(SAVE_BTN);
    this.driver.findElement(SAVE_BTN).click();
    return this;
};

OpportunitiesEdit.prototype.cancelOppEdit = function() {
    this.waitUntilVisible(CANCEL_BTN);
    return this.driver.findElement(CANCEL_BTN).click();
};

OpportunitiesEdit.prototype.saveOpp = function() {
    this.waitUntilVisible(SAVE_BTN);
    return this.driver.findElement(SAVE_BTN).click();
};

OpportunitiesEdit.prototype.getErrorCount = function() {
    this.waitUntilVisible(ERRORS);
    return new promise.Promise((resolve, reject) => {
        this.driver.findElements(ERRORS).then((elements) => {
            resolve(elements.length);
        }, (err) => {
            reject(err);
        });
    });
};

module.exports = OpportunitiesEdit;
