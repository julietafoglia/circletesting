'use strict';

// vendor dependencies

const rootPath = process.env.ROOT_PATH;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const promise = webdriver.promise;

const BasePage = require(rootPath + '/pages/salesforce');

// elements
const IFRAME_1 = By.css('iframe[id="ext-comp-1005"]');
const IFRAME_2 = By.xpath('//iframe[@class=" x-border-panel"]');
const NEW_CASE_BTN = By.css('input[value="New Case"]');
const CASE_RECORD_TYPES = By.css('#p3');
const CONTINUE_BTN = By.css('input[value="Continue"]');
const PLATFORM_OPS = By.css('option[value="01216000001YbkL"]');
const CATEGORIES = By.css('select[id="00NG000000EefBK"]');
const CAMPAIGN_SETUP = By.css('option[value="New Campaign Set Up"]');
const SUBJECT = By.css('#cas14');
const DESCRIPTION = By.css('#cas15');
const PIXEL_NEEDED = By.css('select[id="00N1600000EgGfi"] > option');
const CREATIVE_ASSETS = By.css('select[id="00N1600000EgGfx"] > option');
const ADVERTISER_ID = By.css('input[id="00N1600000EgMck"]');
const ACC_LOOKUP_ICON = By.css('img[alt="Account Name Lookup (New Window)"]');
const OPPORTUNITY = By.css('input[id="CF00NG000000EefC8"]');
const AGREEMENT = By.css('input[id="CF00NG000000EefBP"]');
const LOOKUP_FRAME = By.css('frame[title="Search"]');
const RESULTS_FRAME = By.css('frame[title="Results"]');
const SEARCH_BOX = By.css('input[id="lksrch"]');
const SEARCH_SUBMIT_BTN = By.css('input[title="Go!"]');
const SEARCH_RESULT = By.css('th[scope="row"] > a');
const SAVE_BTN = By.css('input[title="Save"]');
const ERRORS = By.css('.pbError > .errorLine');
const CASE_TAB = By.css('button[id="ext-gen33"]');

function LiveInticket(webdriver) {
    BasePage.call(this, webdriver);
}

LiveInticket.prototype = Object.create(BasePage.prototype);
LiveInticket.prototype.constructor = LiveInticket;

LiveInticket.prototype.switchToLiveInticket = function(url) {
    this.driver.navigate().to(url);
    return this;
};

LiveInticket.prototype.switchToSales = function(url) {
    this.switchToDefaultFrame();
    this.waitUntilVisible(CASE_TAB);
    this.driver.findElement(CASE_TAB).click();
    // trigger alert then switch to 'Sales' view
    this.driver.navigate().to(url);
    this.driver.switchTo().alert().dismiss();
    return this.driver.navigate().to(url);
};

LiveInticket.prototype.switchToFrame = function(frame) {
    this.driver.switchTo().frame(frame);
};

LiveInticket.prototype.switchToDefaultFrame = function() {
    this.driver.switchTo().defaultContent();
};

LiveInticket.prototype.clickNewCaseBtn = function() {
    this.waitUntilVisible(IFRAME_1);
    this.switchToFrame(this.driver.findElement(IFRAME_1));
    this.waitUntilVisible(NEW_CASE_BTN);
    this.driver.findElement(NEW_CASE_BTN).click();
    this.switchToDefaultFrame();
    return this;
};

LiveInticket.prototype.selectCaseRecordType = function(type) {
    this.waitUntilVisible(IFRAME_2);
    this.switchToFrame(this.driver.findElement(IFRAME_2));
    this.waitUntilVisible(CASE_RECORD_TYPES);
    if (type === 'Platform Operations') {
        this.driver.findElement(PLATFORM_OPS).click();
    }
    this.driver.findElement(CONTINUE_BTN).click();
    this.switchToDefaultFrame();
    return this;
};

LiveInticket.prototype.selectCategory = function(category) {
    this.waitUntilVisible(IFRAME_2);
    this.switchToFrame(this.driver.findElement(IFRAME_2));
    this.waitUntilVisible(CATEGORIES);
    if (category === 'New Campaign Set Up') {
        this.driver.findElement(CAMPAIGN_SETUP).click();
    }
    return this;
};

LiveInticket.prototype.enterSubject = function(subj) {
    this.waitUntilVisible(SUBJECT);
    this.driver.findElement(SUBJECT).sendKeys(subj);
    return this;
};

LiveInticket.prototype.enterDescription = function(description) {
    this.waitUntilVisible(DESCRIPTION);
    this.driver.findElement(DESCRIPTION).sendKeys(description);
    return this;
};

LiveInticket.prototype.isPixelNeeded = function(response) {
    this.waitUntilVisible(PIXEL_NEEDED);
    this.driver.findElements(PIXEL_NEEDED).then((elements) => {
        switch (response) {
        case 'Yes':
            elements[1].click();
            break;
        case 'No':
            elements[2].click();
            break;
        default:
            elements[0].click();
        }
    }, (err) => {
        throw err;
    });
    return this;
};

LiveInticket.prototype.hasNewCreativeAssets = function(response) {
    this.waitUntilVisible(CREATIVE_ASSETS);
    this.driver.findElements(CREATIVE_ASSETS).then((elements) => {
        switch (response) {
        case 'Yes':
            elements[1].click();
            break;
        case 'No':
            elements[2].click();
            break;
        default:
            elements[0].click();
        }
    }, (err) => {
        throw err;
    });
    return this;
};

LiveInticket.prototype.enterAdvertiserId = function(id) {
    this.waitUntilVisible(ADVERTISER_ID);
    this.driver.findElement(ADVERTISER_ID).sendKeys(id);
    return this;
};

LiveInticket.prototype.enterAccountName = function(name) {
    this.waitUntilVisible(ACC_LOOKUP_ICON);
    this.driver.findElement(ACC_LOOKUP_ICON).click();
    this.driver.getAllWindowHandles().then((handles) => {
        this.driver.switchTo().window(handles[1]);
        this.switchToFrame(this.driver.findElement(LOOKUP_FRAME));
        this.waitUntilVisible(SEARCH_BOX);
        this.driver.findElement(SEARCH_BOX).sendKeys(name);
        this.driver.findElement(SEARCH_SUBMIT_BTN).click();
        this.switchToDefaultFrame();
        this.switchToFrame(this.driver.findElement(RESULTS_FRAME));
        this.waitUntilVisible(SEARCH_RESULT);
        this.driver.findElement(SEARCH_RESULT).click();
        this.driver.switchTo().window(handles[0]);
    });
    this.waitUntilVisible(IFRAME_2);
    this.switchToFrame(this.driver.findElement(IFRAME_2));
    return this;
};

LiveInticket.prototype.enterOpportunityName = function(name) {
    this.waitUntilVisible(OPPORTUNITY);
    this.driver.findElement(OPPORTUNITY).sendKeys(name);
    return this;
};

LiveInticket.prototype.enterAgreementName = function(name) {
    this.waitUntilVisible(AGREEMENT);
    this.driver.findElement(AGREEMENT).sendKeys(name);
    return this;
};

LiveInticket.prototype.clickSaveBtn = function() {
    this.waitUntilVisible(SAVE_BTN);
    this.driver.findElement(SAVE_BTN).click();
    return this;
};

LiveInticket.prototype.getErrors = function() {
    this.waitUntilVisible(ERRORS);
    return new promise.Promise((resolve, reject) => {
        this.driver.findElements(ERRORS)
            .then((elements) => {
                let promises = [];
                elements.forEach((el) => {
                    promises.push(el.getText());
                });
                Promise.all(promises).then((res) => {
                // remove bullet points from error messages
                    let errors =
                    res.map((text) => text.replace('\u2022', '').trim());
                    resolve(errors);
                }, (err) => {
                    reject(err);
                });
            }, (err2) => {
                reject(err2);
            });
    });
};

module.exports = LiveInticket;
