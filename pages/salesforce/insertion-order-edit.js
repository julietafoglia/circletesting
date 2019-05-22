'use strict';

// vendor dependencies
const rootPath = process.env.ROOT_PATH;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

const BasePage = require(rootPath + '/pages/salesforce');

// elements
const COMP_NAME = By.css('input[id="j_id0:j_id2:j_id4:j_id34:j_id39"]');
const FLIGHT_START = By.css('input[id="j_id0:j_id2:j_id4:j_id34:j_id40"]');
const FLIGHT_END = By.css('input[id="j_id0:j_id2:j_id4:j_id34:j_id42"]');
const PAYMENT_TERMS = By.css(
    'select[id="j_id0:j_id2:j_id4:j_id34:j_id41"] > option'
);
const TM_USAGE = By.css(
    'select[id="j_id0:j_id2:j_id4:j_id34:j_id43"] > option'
);
const EXCLUSIVITY = By.css(
    'select[id="j_id0:j_id2:j_id4:j_id34:j_id44"] > option'
);
const IO_TYPE =
    By.css('select[id="j_id0:j_id2:j_id4:j_id34:j_id46"] > option');
const IS_NON_STD =
    By.css('select[id="j_id0:j_id2:j_id4:j_id34:j_id47"] > option');
const PRI_CONTACT = By.css('input[id="j_id0:j_id2:j_id4:j_id49:j_id50"]');
const BILLING_CONTACT = By.css('input[id="j_id0:j_id2:j_id4:j_id49:j_id63"]');
const BILLING_ST = By.css('textarea[id="j_id0:j_id2:j_id4:j_id49:j_id52"]');
const BILLING_CITY = By.css('input[id="j_id0:j_id2:j_id4:j_id49:j_id57"]');
const BILLING_STATE = By.css('input[id="j_id0:j_id2:j_id4:j_id49:j_id62"]');
const BILLING_ZIP = By.css('input[id="j_id0:j_id2:j_id4:j_id49:j_id65"]');
const BILLING_COUNTRY = By.css('input[id="j_id0:j_id2:j_id4:j_id49:j_id70"]');
const SAVE_BTN = By.css('input[value=" Save "]');
const SUBMIT_BTN = By.css('input[name="j_id0:j_id2:j_id3:j_id4:j_id8"]');

function InsertionOrderEdit(webdriver) {
    BasePage.call(this, webdriver);
}

InsertionOrderEdit.prototype = Object.create(BasePage.prototype);
InsertionOrderEdit.prototype.constructor = InsertionOrderEdit;

InsertionOrderEdit.prototype.enterCompanyName = function(name) {
    this.waitUntilVisible(COMP_NAME);
    this.driver.findElement(COMP_NAME).sendKeys(name);
    return this;
};

InsertionOrderEdit.prototype.selectPaymentTerms = function(paymentTerms) {
    this.waitUntilVisible(PAYMENT_TERMS);
    this.driver.findElements(PAYMENT_TERMS).then((elements) => {
        switch (paymentTerms) {
        case 'Prepay':
            elements[0].click();
            break;
        case 'On Receipt':
            elements[1].click();
            break;
        case 'Net 15':
            elements[2].click();
            break;
        case 'Net 45':
            elements[4].click();
            break;
        case 'Net 60':
            elements[5].click();
            break;
        default:
            elements[3].click();
        }
    }, (err) => {
        throw err;
    });
    return this;
};

InsertionOrderEdit.prototype.enterFlightStart = function(date) {
    this.waitUntilVisible(FLIGHT_START);
    this.driver.findElement(FLIGHT_START).clear();
    let sequence = this.driver.actions();
    sequence.click(this.driver.findElement(FLIGHT_START))
        .sendKeys(date)
        .sendKeys(webdriver.Key.TAB)
        .perform();
    return this;
};

InsertionOrderEdit.prototype.enterFlightEnd = function(date) {
    this.waitUntilVisible(FLIGHT_END);
    this.driver.findElement(FLIGHT_END).clear();
    let sequence = this.driver.actions();
    sequence.click(this.driver.findElement(FLIGHT_END))
        .sendKeys(date)
        .sendKeys(webdriver.Key.TAB)
        .perform();
    return this;
};

InsertionOrderEdit.prototype.selectTrademarkUsage = function(tmUsage) {
    this.waitUntilVisible(TM_USAGE);
    this.driver.findElements(TM_USAGE).then((elements) => {
        if (tmUsage === 'Written Consent') {
            elements[1].click();
        } else {
            elements[0].click();
        }
    }, (err) => {
        throw err;
    });
    return this;
};

InsertionOrderEdit.prototype.selectExclusivityClause = function(clause) {
    this.waitUntilVisible(EXCLUSIVITY);
    this.driver.findElements(EXCLUSIVITY).then((elements) => {
        if (clause === 'Exclude') {
            elements[1].click();
        } else {
            elements[0].click();
        }
    }, (err) => {
        throw err;
    });
    return this;
};

InsertionOrderEdit.prototype.selectIOType = function(ioType) {
    this.waitUntilVisible(IO_TYPE);
    this.driver.findElements(IO_TYPE).then((elements) => {
        if (ioType === 'Revised') {
            elements[2].click();
        } else {
            elements[1].click();
        }
    }, (err) => {
        throw err;
    });
    return this;
};

InsertionOrderEdit.prototype.isNonStandardIO = function(selectedOption) {
    this.waitUntilVisible(IS_NON_STD);
    this.driver.findElements(IS_NON_STD).then((elements) => {
        if (!selectedOption) {
            elements[2].click();
        } else {
            elements[1].click();
        }
    }, (err) => {
        throw err;
    });
    return this;
};

InsertionOrderEdit.prototype.enterPrimaryContact = function(name) {
    this.waitUntilVisible(PRI_CONTACT);
    this.driver.findElement(PRI_CONTACT).clear();
    this.driver.findElement(PRI_CONTACT).sendKeys(name);
    return this;
};

InsertionOrderEdit.prototype.enterBillingStreet = function(street) {
    this.waitUntilVisible(BILLING_ST);
    this.driver.findElement(BILLING_ST).sendKeys(street);
    return this;
};

InsertionOrderEdit.prototype.enterBillingCity = function(city) {
    this.waitUntilVisible(BILLING_CITY);
    this.driver.findElement(BILLING_CITY).sendKeys(city);
    return this;
};

InsertionOrderEdit.prototype.enterBillingState = function(state) {
    this.waitUntilVisible(BILLING_STATE);
    this.driver.findElement(BILLING_STATE).sendKeys(state);
    return this;
};

InsertionOrderEdit.prototype.enterBillingZipCode = function(zip) {
    this.waitUntilVisible(BILLING_ZIP);
    this.driver.findElement(BILLING_ZIP).sendKeys(zip);
    return this;
};

InsertionOrderEdit.prototype.enterBillingCountry = function(country) {
    this.waitUntilVisible(BILLING_COUNTRY);
    this.driver.findElement(BILLING_COUNTRY).sendKeys(country);
    return this;
};

InsertionOrderEdit.prototype.enterBillingContact = function(contactName) {
    this.waitUntilVisible(BILLING_CONTACT);
    this.driver.findElement(BILLING_CONTACT).clear();
    this.driver.findElement(BILLING_CONTACT).sendKeys(contactName);
    return this;
};

// Save button clicked twice as a get around contacts confirmation errors
InsertionOrderEdit.prototype.saveInsertionOrder = function() {
    this.waitUntilVisible(SAVE_BTN);
    this.driver.findElement(SAVE_BTN).click();
    return this.waitUntilVisiblePromise(SUBMIT_BTN);
};

module.exports = InsertionOrderEdit;
