'use strict';

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const promise = webdriver.promise;
const until = webdriver.until;
const key = webdriver.Key;

// common runtime variables
const util = require('util');
const TIMEOUT = 40000;
const fiveSecondTO = 5000;

// elements
const ALERT_ADVERTISER = By.css('div._alert---text strong._alert---title');
const ALERT_CLOSE = By.css('button span.icon.icon--exit.icon--lg');
const ALERT_BOLD_NAME = By.xpath('//alert');
const ALERT_TEXT = By.xpath('//div[@class="_alert---text"]/div');
const ALERT_SUCCESS = By.css('.success');
const ERROR_ALERT = By.css('.error ._alert');
const URL = '%s/campaign-manager/%s/%s';
const BUTTON_CLOSE = By.css('.modal---header button');
const OVERLAY = By.css('.overlay');
const LOADER = By.css('overlay-loading-indicator');
const DISPLAYED_OPTIONS = By.xpath(
    '//div[contains(@class,"dropdown--container")]/ul/li');
const TABLE_OVERLAY = By.css('.no-spinner.ng-trigger');
const SPINNER = By.css('.spinner');
const DIV_SPINNER_CONT = By.css('div .spinner');
const CLOSE_BTN_OUTER = By.css('div.wm-close-button.walkme-x-button');

function BasePage(webdriver) {
    this.driver = webdriver;
}

BasePage.prototype.waitUntilLocated = function(locator) {
    return this.driver.wait(until.elementLocated(locator), TIMEOUT);
};

BasePage.prototype.waitToLocateNoFail = function(locator) {
    this.driver.wait(until.elementLocated(locator), fiveSecondTO)
        .then((elements) => {
            if (elements.length) {
                this.findElement(locator);
            }
        }, (err) => {
            throw err;
        }).catch(err => [err]);
    return this;
};

BasePage.prototype.waitUntilVisible = function(locator) {
    this.waitUntilLocated(locator);
    return this.driver.wait(
        until.elementIsVisible(this.findElement(locator)), TIMEOUT
    );
};

BasePage.prototype.waitUntilVisibleTimed = function(locator, timeout) {
    this.driver.wait(until.elementLocated(locator), timeout);
    return this.driver.wait(
        until.elementIsVisible(this.findElement(locator)), timeout
    );
};

BasePage.prototype.waitUntilEnabled = function(locator) {
    this.waitUntilVisible(locator);
    return this.driver.wait(
        until.elementIsEnabled(this.findElement(locator)), TIMEOUT
    );
};

BasePage.prototype.waitUntilNotVisible = function(locator) {
    this.waitUntilLocated(locator);
    return this.driver.wait(
        until.elementIsNotVisible(this.findElement(locator)), TIMEOUT
    );
};

BasePage.prototype.waitUntilStale = function(locator) {
    return this.driver.sleep(fiveSecondTO);
};

BasePage.prototype.waitUntilFilterStale = function() {
    return this.waitUntilStale(TABLE_OVERLAY);
};

BasePage.prototype.waitUntilFilterNotVisible = function() {
    this.waitToLocateNoFail(TABLE_OVERLAY);
    return this.driver.findElements(TABLE_OVERLAY).then((elements) => {
        if (elements.length) {
            this.waitUntilStale(TABLE_OVERLAY);
        }
    }, (err) => {
        throw err;
    });
};

BasePage.prototype.waitUntilSpinnerContainerNotVisible = function() {
    this.waitToLocateNoFail(DIV_SPINNER_CONT);
    return this.driver.findElements(DIV_SPINNER_CONT).then((elements) => {
        if (elements.length) {
            this.waitUntilStale(DIV_SPINNER_CONT);
        }
    }, (err) => {
        throw err;
    });
};

BasePage.prototype.navigate = function(server, section, entity) {
    this.driver.navigate().to(util.format(URL, server, section, entity));
    this.driver.sleep(fiveSecondTO);
};

BasePage.prototype.goto = function(url) {
    this.driver.navigate().to(url);
    return this;
};

BasePage.prototype.waitUntilOverlayNotVisible = function() {
    return this.driver.findElements(OVERLAY).then((elements) => {
        if (elements.length) {
            this.waitUntilStale(OVERLAY);
        }
    }, (err) => {
        throw err;
    });
};

BasePage.prototype.waitOverlayUntilStale = function() {
    this.waitToLocateNoFail(OVERLAY);
    return this.driver.findElements(OVERLAY).then((elements) => {
        if (elements.length) {
            this.waitUntilStale(OVERLAY);
        }
    }, (err) => {
        throw err;
    }).catch(err => [err]);
};

BasePage.prototype.waitUntilSpinnerNotVisible = function() {
    return this.driver.findElements(SPINNER).then((elements) => {
        if (elements.length) {
            this.waitUntilStale(SPINNER);
        }
    }, (err) => {
        throw err;
    });
};

BasePage.prototype.waitSpinnerUntilStale = function() {
    return this.driver.sleep(fiveSecondTO);
};

BasePage.prototype.waitUntilLoaderNotVisible = function() {
    return this.driver.sleep(fiveSecondTO);
};

BasePage.prototype.waitUntilLoaderStale = function() {
    return this.driver.sleep(fiveSecondTO);
};

BasePage.prototype.getElementText = function(locator) {
    this.waitUntilVisible(locator);
    return new promise.Promise((resolve, reject) => {
        this.findElement(locator).then((el) => {
            el.getText().then((text) => {
                resolve(text);
            }, (e) => {
                reject(e);
            });
        }, (err) => {
            reject(err);
        });
    }, this.driver.controlFlow());
};

BasePage.prototype.checkArray = function(element) {
    let arr = [];
    return new promise.Promise((resolve, reject) => {
        element.then((options) => {
            options.forEach((option) => {
                option.getText().then((text) => {
                    arr.push(text);
                });
            });
            resolve(arr);
        }, (err) => {
            reject(err);
        });
    }, this.driver.controlFlow());
};

BasePage.prototype.waitUntilDisabled = function(locator) {
    this.waitUntilLocated(locator);
    this.driver.wait(
        until.elementIsDisabled(this.findElement(locator)), TIMEOUT);
    return this;
};

BasePage.prototype.elementNotLocated = function(locator) {
    return new promise.Promise((resolve, reject) => {
        this.findElements(locator)
            .then((arr) => {
                resolve(arr);
            }, (err) => {
                reject(err);
            });
    }, this.driver.controlFlow());
};

BasePage.prototype.elementHover = function(locator) {
    this.waitUntilLocated(locator);
    this.driver.actions()
        .mouseMove(this.driver.findElement(locator))
        .perform();
};

BasePage.prototype.getCurrentUrl = function() {
    return this.driver.getCurrentUrl();
};

BasePage.prototype.getAlertTitle = function() {
    return this.waitUntilVisible(ALERT_ADVERTISER);
};

BasePage.prototype.getAlertBoldName = function() {
    return this.waitUntilVisible(ALERT_BOLD_NAME);
};

BasePage.prototype.getAlertText = function() {
    return this.waitUntilVisible(ALERT_TEXT);
};

BasePage.prototype.getErrorAlertPresent = function() {
    return this.waitUntilVisible(ERROR_ALERT);
};

BasePage.prototype.closeAlert = function() {
    this.waitUntilVisible(ALERT_CLOSE);
    this.click(ALERT_CLOSE);
    return this;
};

BasePage.prototype.waitAndClick = function(element) {
    this.waitUntilVisible(element);
    return this.click(element);
};

// Wrapper around selenium methods

BasePage.prototype.findElement = function(element) {
    return this.driver.findElement(element);
};

BasePage.prototype.findElements = function(element) {
    return this.driver.findElements(element);
};

BasePage.prototype.click = function(element) {
    return this.findElement(element).click();
};

BasePage.prototype.clear = function(element) {
    return this.findElement(element).clear();
};

BasePage.prototype.sendKeys = function(element, keys) {
    return this.findElement(element).sendKeys(keys);
};

BasePage.prototype.sleep = function(time) {
    return this.driver.sleep(time);
};

BasePage.prototype.getElement = function(locator) {
    this.waitUntilVisible(locator);
    return this.findElement(locator);
};

BasePage.prototype.getElements = function(locator) {
    this.waitUntilVisible(locator);
    return this.findElements(locator);
};

BasePage.prototype.getLastElement = function(locator) {
    return new promise.Promise((resolve, reject) => {
        this.findElements(locator)
            .then((arr) => {
                resolve(arr[arr.length - 1]);
            }, (err) => {
                reject(err);
            });
    }, this.driver.controlFlow());
};

BasePage.prototype.clickLastElement = function(locator) {
    this.getElements(locator).then((elements) => {
        elements[elements.length - 1].click();
    }, (err) => {
        throw err;
    });
    return this;
};

// scroll
BasePage.prototype.scrollUp = function() {
    return this.driver.actions().sendKeys(key.PAGE_UP).perform();
};

BasePage.prototype.scrollDown = function() {
    return this.driver.actions().sendKeys(key.PAGE_DOWN).perform();
};

// campaign-manager-specific methods - waits
BasePage.prototype.waitUntilTextVisible = function(elementText) {
    return this.waitUntilVisible(
        By.xpath("//*[text() = '" + elementText + "']")
    );
};

// campaign-manager-specific gets
BasePage.prototype.getLinkText = function(elementText) {
    this.waitUntilVisible(By
        .xpath("//a[text() = '" + elementText + "']"));
    return this.findElement(By
        .xpath("//a[text() = '" + elementText + "']"));
};

BasePage.prototype.getSpan = function(elementText) {
    this.waitUntilVisible(By
        .xpath("//span[text() = '" + elementText + "']"));
    return this.findElement(By
        .xpath("//span[text() = '" + elementText + "']"));
};

BasePage.prototype.getH1Title = function(elementText) {
    this.waitUntilVisible(By
        .xpath("//h1[contains(text(),'" + elementText + "')]"));
    return this.findElement(By
        .xpath("//h1[contains(text(),'" + elementText + "')]"));
};

BasePage.prototype.getH4Title = function(elementText) {
    this.waitUntilVisible(By
        .xpath("//h4[contains(text(),'" + elementText + "')]"));
    return this.findElement(By
        .xpath("//h4[contains(text(),'" + elementText + "')]"));
};


BasePage.prototype.getTitle = function(elementText) {
    this.waitUntilVisible(By
        .xpath("//h2[contains(text(),'" + elementText + "')]"));
    return this.findElement(By
        .xpath("//h2[contains(text(),'" + elementText + "')]"));
};

BasePage.prototype.getDivText = function(elementText) {
    this.waitUntilVisible(By
        .xpath("//div[contains(text(),'" + elementText + "')]"));
    return this.findElement(By
        .xpath("//div[contains(text(),'" + elementText + "')]"));
};

BasePage.prototype.getLinkTextNotDisplayed = function(elementText) {
    return this.elementNotLocated(By
        .xpath("//a[text() = '" + elementText + "']"));
};

BasePage.prototype.getSpanNotDisplayed = function(elementText) {
    return this.elementNotLocated(By
        .xpath("//span[text() = '" + elementText + "']"));
};

BasePage.prototype.waitForAlert = function() {
    return this.waitUntilVisible(ALERT_SUCCESS);
};

BasePage.prototype.getAlert = function() {
    this.waitUntilVisible(ALERT_SUCCESS);
    return this.findElement(ALERT_SUCCESS);
};

BasePage.prototype.waitForAlertNoFail = function() {
    return this.waitToLocateNoFail(ALERT_SUCCESS);
};

BasePage.prototype.getLinkContainsText = function(elementText) {
    this.waitUntilVisible(By
        .xpath("//a[contains(text(),'" + elementText + "')]"));
    return this.findElement(By
        .xpath("//a[contains(text(),'" + elementText + "')]"));
};

BasePage.prototype.getSpanContainsText = function(elementText) {
    this.waitUntilVisible(By
        .xpath("//span[contains(text(),'" + elementText + "')]"));
    return this.findElement(By
        .xpath("//span[contains(text(),'" + elementText + "')]"));
};

// campaign-manager-specific clicks
BasePage.prototype.clickLinkText = function(elementText) {
    this.waitUntilVisible(By
        .xpath("//a[text() = '" + elementText + "']"));
    this.click(By
        .xpath("//a[text() = '" + elementText + "']"));
    return this.driver.sleep(4000);
};

BasePage.prototype.clickLinkContainsText = function(elementText) {
    this.driver.sleep(3000);
    this.waitUntilVisible(By
        .xpath("//a[contains(text(),'" + elementText + "')]"));
    return this.click(By
        .xpath("//a[contains(text(),'" + elementText + "')]"));
};

BasePage.prototype.clickSpan = function(elementText) {
    this.waitUntilVisible(By
        .xpath("//span[text() = '" + elementText + "']"));
    this.click(By
        .xpath("//span[text() = '" + elementText + "']"));
    return this.driver.sleep(3000);
};

BasePage.prototype.clickSpanContainsText = function(elementText) {
    this.waitUntilVisible(By
        .xpath("//span[contains(text(),'" + elementText + "')]"));
    return this.click(By
        .xpath("//span[contains(text(),'" + elementText + "')]"));
};

BasePage.prototype.clickDivText = function(elementText) {
    this.waitUntilVisible(By
        .xpath("//div[contains(text(),'" + elementText + "')]"));
    return this.click(By
        .xpath("//div[contains(text(),'" + elementText + "')]"));
};

BasePage.prototype.clickClose = function() {
    this.driver.sleep(fiveSecondTO);
    this.waitUntilVisible(BUTTON_CLOSE);
    this.click(BUTTON_CLOSE);
    return this.driver.sleep(4000);
};

BasePage.prototype.getDisplayedOptions = function() {
    return this.findElements(DISPLAYED_OPTIONS);
};

BasePage.prototype.getContentNGModel = function(locator) {
    return new promise.Promise((resolve, reject) => {
        this.getElement(locator).then((el) => {
            el.getAttribute('ng-reflect-model').then((text) => {
                resolve(text);
            }, (e) => {
                reject(e);
            });
        }, (err) => {
            reject(err);
        });
    }, this.driver.controlFlow());
};

BasePage.prototype.closeOuterDiv = function() {
    return new promise.Promise((resolve) => {
        this.driver.wait(until.elementLocated(CLOSE_BTN_OUTER), TIMEOUT)
            .then((element) => {
                resolve(element.click());
            })
            .catch(err=>[err]);
    }, this.driver.controlFlow());
};

BasePage.prototype.closeLastOuterDiv = function() {
    return new promise.Promise((resolve) => {
        this.driver.wait(until.elementLocated(CLOSE_BTN_OUTER), TIMEOUT)
            .then((element) => {
                // console.log(element);
                resolve(this.clickLastElement(CLOSE_BTN_OUTER));
            })
            .catch(err=>[err]);
    }, this.driver.controlFlow());
 };

BasePage.prototype.getDateTimeFromData = function(time) {
    if (time.split(':')[0] >= 12) {
        return 'PM';
    } else {
        return 'AM';
    }
};

module.exports = BasePage;
