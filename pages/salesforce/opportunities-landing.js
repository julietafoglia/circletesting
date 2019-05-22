'use strict';

// vendor dependencies

const rootPath = process.env.ROOT_PATH;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const promise = webdriver.promise;

const BasePage = require(rootPath + '/pages/salesforce');

const OPP_TAB = By.css('#Opportunity_Tab');
const OPP_LIST = By.css('th[scope="row"] > a');
const NEW_OPP_BTN = By.css('input[title="New"]');
const RECORD_TYPE = By.css('.requiredInput > select[name="p3"]');
const RECORD_TYPE_AGENCY = By.css('option[value="012G0000000qH7i"]');
const RECORD_TYPE_DIRECT_ADVERTISER = By.css('option[value="012G0000000qG5a"]');
const CONTINUE_BTN = By.css('input[title="Continue"]');

function OpportunitiesLanding(webdriver) {
    BasePage.call(this, webdriver);
}

OpportunitiesLanding.prototype = Object.create(BasePage.prototype);
OpportunitiesLanding.prototype.constructor = OpportunitiesLanding;

OpportunitiesLanding.prototype.navigate = function() {
    this.waitUntilVisible(OPP_TAB);
    this.driver.findElement(OPP_TAB).click();
    return this;
};

OpportunitiesLanding.prototype.selectExistingOpp = function(opportunity) {
    this.waitUntilVisible(OPP_LIST);
    return new promise.Promise((resolve, reject) => {
        this.driver.findElements(OPP_LIST)
            .then((elements) => {
                let promises = [];
                elements.forEach((el) => {
                    promises.push(el.getText());
                });
                Promise.all(promises).then((texts) => {
                    for (let i = 0; i < texts.length; i++) {
                        if (texts[i].includes(opportunity)) {
                            resolve(elements[i].click());
                        }
                    }
                }, (err) => {
                    reject(err);
                });
            })
            .catch((err2) => {
                reject(err2);
            });
    });
};

OpportunitiesLanding.prototype.clickNewOppBtn = function() {
    this.waitUntilVisible(NEW_OPP_BTN);
    this.driver.findElement(NEW_OPP_BTN).click();
    return this;
};

OpportunitiesLanding.prototype.selectRecordType = function(type) {
    this.waitUntilVisible(RECORD_TYPE);
    if (type === 'Agency') {
        this.driver.findElement(RECORD_TYPE_AGENCY).click();
    } else {
        this.driver.findElement(RECORD_TYPE_DIRECT_ADVERTISER).click();
    }
    return this;
};

OpportunitiesLanding.prototype.clickContinue = function() {
    this.waitUntilVisible(CONTINUE_BTN);
    return this.driver.findElement(CONTINUE_BTN).click();
};

module.exports = OpportunitiesLanding;
