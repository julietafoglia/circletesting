'use strict';

// vendor dependencies

const rootPath = process.env.ROOT_PATH;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const promise = webdriver.promise;

const BasePage = require(rootPath + '/pages/salesforce');

// elements
const FEED_ITEMS = By.css('span[class="feeditemtext cxfeeditemtext"]');
const OPP_EDIT_BTN = By.css('input[title="Edit"]');
const ADD_PROD_BTN = By.css('input[title="Add Product"]');
const NEW_IO_BTN = By.css('input[name="new_insertion_order"]');
const SYNC_TO_LI = By.css('input[name="sync_to_liveintent"]');
const SYNC_OVERLAY = By.css('.loader');

function OpportunitiesDetail(webdriver) {
    BasePage.call(this, webdriver);
}

OpportunitiesDetail.prototype = Object.create(BasePage.prototype);
OpportunitiesDetail.prototype.constructor = OpportunitiesDetail;

OpportunitiesDetail.prototype.navigate = function(url) {
    this.driver.navigate().to(url);
    return this;
};

OpportunitiesDetail.prototype.clickOppEditButton = function() {
    this.waitUntilVisible(OPP_EDIT_BTN);
    return this.driver.findElement(OPP_EDIT_BTN).click();
};

OpportunitiesDetail.prototype.clickAddProdButton = function() {
    this.waitUntilVisible(ADD_PROD_BTN);
    return this.driver.findElement(ADD_PROD_BTN).click();
};

OpportunitiesDetail.prototype.clickNewIOButton = function() {
    this.waitUntilVisible(NEW_IO_BTN);
    return this.driver.findElement(NEW_IO_BTN).click();
};

OpportunitiesDetail.prototype.getOpportunityUrl = function() {
    return this.driver.getCurrentUrl();
};

OpportunitiesDetail.prototype.getChatterFeed = function(key) {
    this.waitUntilVisible(FEED_ITEMS);
    return new promise.Promise((resolve, reject) => {
        this.driver.findElements(FEED_ITEMS)
            .then((elements) => {
                let promises = [];
                elements.forEach((el) => {
                    promises.push(el.getText());
                });
                Promise.all(promises).then((texts) => {
                    let response = false;
                    for (let i = 0; i < texts.length; i++) {
                        if (texts[i].includes(key)) {
                            response = true;
                        }
                    }
                    resolve(response);
                }, (err) => {
                    reject(err);
                });
            }, (err) => {
                reject(err);
            });
    });
};

OpportunitiesDetail.prototype.syncToLiveIntent = function() {
    this.waitUntilVisible(SYNC_TO_LI);
    this.driver.findElement(SYNC_TO_LI).click();
    return this.waitUntilStale(SYNC_OVERLAY);
};

module.exports = OpportunitiesDetail;
