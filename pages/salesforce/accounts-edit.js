'use strict';

// vendor dependencies

const rootPath = process.env.ROOT_PATH;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const promise = webdriver.promise;

const BasePage = require(rootPath + '/pages/salesforce');

const ACCOUNT_NAME =
    By.css('input[id="j_id0:j_id23:j_id34_0:j_id34_2:KEYFIELD-Name"]');
const LFM_AGENCY_ID_CLNT_DIR =
    By.css('input[id="j_id0:j_id23:j_id34_0:j_id34_2:FIELD-LFM_Agency_ID__c"]');
const LFM_AGENCY_ID_AGENCY =
    By.css('input[id="j_id0:j_id23:j_id34_0:j_id34_2:FIELD-LFM_Agency_ID__c"]');
const WEBSITE =
    By.css('input[id="j_id0:j_id23:j_id34_0:j_id34_2:KEYFIELD-Website"]');
const LFM_ADV_ID = By.css(
    'input[id="j_id0:j_id23:j_id34_0:j_id34_4:FIELD-LFM_Advertiser_ID__c"]'
);
const SAVE_BTN = By.xpath(
    '//td[@id="j_id0:j_id23:j_id34_0:j_id34_1"]/button[text()="Save"]'
);
const DEL_BTN = By.css('input[title="Delete"]');
const ERRORS = By.xpath('//div[@class="bootstrap-sf1"]/div/ul/li');

function AccountsEdit(webdriver) {
    BasePage.call(this, webdriver);
}

AccountsEdit.prototype = Object.create(BasePage.prototype);
AccountsEdit.prototype.constructor = AccountsEdit;

AccountsEdit.prototype.enterAccountName = function(name) {
    this.waitUntilVisible(ACCOUNT_NAME);
    this.driver.findElement(ACCOUNT_NAME).sendKeys(name);
    return this;
};

AccountsEdit.prototype.enterWebsite = function(url) {
    this.waitUntilVisible(WEBSITE);
    this.driver.findElement(WEBSITE).sendKeys(url);
    return this;
};

AccountsEdit.prototype.enterLfmAgencyIdClientDirect = function(id) {
    this.waitUntilVisible(LFM_AGENCY_ID_CLNT_DIR);
    this.driver.findElement(LFM_AGENCY_ID_CLNT_DIR).sendKeys(id);
    return this;
};

AccountsEdit.prototype.enterLfmAgencyIdAgency = function(id) {
    this.waitUntilVisible(LFM_AGENCY_ID_AGENCY);
    this.driver.findElement(LFM_AGENCY_ID_AGENCY).sendKeys(id);
    return this;
};

AccountsEdit.prototype.enterLfmAdvId = function(id) {
    this.waitUntilVisible(LFM_ADV_ID);
    this.driver.findElement(LFM_ADV_ID).sendKeys(id);
    return this;
};

// Expects the account to be successfully saved unlike 'clickSaveButton'
AccountsEdit.prototype.saveAccount = function() {
    this.waitUntilVisible(SAVE_BTN);
    this.driver.findElement(SAVE_BTN).click();
    return this.waitUntilVisiblePromise(DEL_BTN);
};

AccountsEdit.prototype.clickSaveButton = function() {
    this.waitUntilVisible(SAVE_BTN);
    this.driver.findElement(SAVE_BTN).click();
    return this;
};

AccountsEdit.prototype.getErrors = function() {
    this.waitUntilVisible(ERRORS);
    return new promise.Promise((resolve, reject) => {
        this.driver.findElements(ERRORS)
            .then((elements) => {
                let promises = [];
                elements.forEach((el) => {
                    promises.push(el.getText());
                });
                Promise.all(promises).then((texts) => {
                    resolve(texts);
                }, (err) => {
                    reject(err);
                });
            }, (err2) => {
                reject(err2);
            });
    });
};

module.exports = AccountsEdit;
