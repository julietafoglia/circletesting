'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const promise = webdriver.promise;

// elements
const HEADER = By.xpath('//h2[contains(text(),"Advertisers")]');
const ADVERTISER_NAME = (name) => By.xpath(`//a[text()="${name}"]`);
const ADVERTISER_EDIT = (name) =>
    By.xpath(`//td/a[text()="${name}"]//parent::td//a[text()="Edit"]`);
const CREATE_ADV_BTN = By.xpath('//button[text()="Create Advertiser"]');
const ADVERTISERS_TABLE = By.css('advertisers-table > async-table > div');

function AgencyDetailsPage(webdriver) {
    this.driver = webdriver;
}

AgencyDetailsPage.prototype = Object.create(BasePage.prototype);
AgencyDetailsPage.prototype.constructor = AgencyDetailsPage;

// get buttons
AgencyDetailsPage.prototype.getCreateAdvertiserBtn = function(){
    return this.getElement(CREATE_ADV_BTN);
};

AgencyDetailsPage.prototype.getAdvertisersTable = function(){
    return this.getElement(ADVERTISERS_TABLE);
};

// click buttons
AgencyDetailsPage.prototype.editAdvertiser = function(name) {
    this.waitAndClick(ADVERTISER_NAME(name));
    this.waitAndClick(ADVERTISER_EDIT(name));
    return this;
};

AgencyDetailsPage.prototype.advertiserExists = function(advertiser) {
    return new promise.Promise((resolve, reject) => {
        this.waitUntilVisible(HEADER);
        this.findElements(ADVERTISER_NAME(advertiser)).then((elements) => {
            if (elements.length) {
                resolve(true);
            } else {
                resolve(false);
            }
        }, (err) => {
            reject(err);
        });
    });
};

AgencyDetailsPage.prototype.clickCreateAdvertiser = function() {
    return this.waitAndClick(CREATE_PUB_BTN);
};

module.exports = AgencyDetailsPage;
