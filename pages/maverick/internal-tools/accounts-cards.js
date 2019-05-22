'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

// elements
const TITLE = By.xpath('//h2[text()="Account Type"]');
const SELECT_AGENCY_TYPE = By.xpath('//span[contains(text(),"Manage brands")]');
const SELECT_MEDIA_GROUP_TYPE = By.xpath(
    '//span[contains(text(),"Manage publisher")]');
const AGENCY_BUBBLE_CARD = By.xpath('//h3[contains(text(),"Agency")]');
const MEDIA_GROUP_BUBBLE_CARD = By.xpath(
    '//h3[contains(text(),"Media Group")]');

function AccountsCardsPage(webdriver) {
    BasePage.call(this, webdriver);
}

AccountsCardsPage.prototype = Object.create(BasePage.prototype);
AccountsCardsPage.prototype.constructor = AccountsCardsPage;

AccountsCardsPage.prototype.getTitle = function(){
    return this.getElement(TITLE);
};

AccountsCardsPage.prototype.getAgencySelect = function(){
    return this.getElement(SELECT_AGENCY_TYPE);
};

AccountsCardsPage.prototype.getMediaGroupSelect = function(){
    return this.getElement(SELECT_MEDIA_GROUP_TYPE);
};

AccountsCardsPage.prototype.getAgencyCard = function(){
    return this.getElement(AGENCY_BUBBLE_CARD);
};

AccountsCardsPage.prototype.getMediaGroupCard = function(){
    return this.getElement(MEDIA_GROUP_BUBBLE_CARD);
};


// Clicks

AccountsCardsPage.prototype.selectAgencyType = function(){
    return this.waitAndClick(SELECT_AGENCY_TYPE);
};

AccountsCardsPage.prototype.selectMediaGroupType = function(){
    return this.waitAndClick(SELECT_MEDIA_GROUP_TYPE);
};

module.exports = AccountsCardsPage;
