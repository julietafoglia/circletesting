'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const driverTimeOut = 2000;

// elements
const CREATE_LIVE_AUDIENCE = By.xpath('//strong[text() = "Create LiveAudience"]');
const GET_MATCH_RATE = By.xpath('//strong[text() = "Get Match Rate"]');
const URL_AUDIENCE = By.xpath('//strong[text() = "URL based audience"]');
const EVENT_AUDIENCE = By.xpath('//strong[text() = "Event based audience"]');
const ADD_TO_SEGMENT = By.xpath('//strong[text() = "Add to Segment"]');
const REMOVE_FROM_SEGMENT = By.xpath('//strong[text() = "Remove from Segment"]');
const EXPANSION_DET = By.xpath('//strong[text() = "Deterministically"]');
const EXPANSION_PROB = By.xpath('//strong[text() = "Probabilistically"]');

function AudienceCardsPage(webdriver) {
    BasePage.call(this, webdriver);
}

AudienceCardsPage.prototype = Object.create(BasePage.prototype);
AudienceCardsPage.prototype.constructor = AudienceCardsPage;

AudienceCardsPage.prototype.clickCreateLiveAudience = function() {
    this.waitUntilVisible(CREATE_LIVE_AUDIENCE);
    return this.click(CREATE_LIVE_AUDIENCE);
};

AudienceCardsPage.prototype.clickGetMatchRate = function() {
    this.waitUntilVisible(GET_MATCH_RATE);
    return this.click(GET_MATCH_RATE);
};

AudienceCardsPage.prototype.clickUrlAudience = function() {
    this.waitUntilVisible(URL_AUDIENCE);
    return this.click(URL_AUDIENCE);
};

AudienceCardsPage.prototype.clickEventAudience = function() {
    this.waitUntilVisible(EVENT_AUDIENCE);
    return this.click(EVENT_AUDIENCE);
};

AudienceCardsPage.prototype.clickAddToSegment = function() {
    this.waitUntilVisible(ADD_TO_SEGMENT);
    return this.click(ADD_TO_SEGMENT);
};

AudienceCardsPage.prototype.clickRemoveFromSegment = function() {
    this.waitUntilVisible(REMOVE_FROM_SEGMENT);
    return this.click(REMOVE_FROM_SEGMENT);
};

AudienceCardsPage.prototype.clickExpansionDet = function() {
    this.waitUntilVisible(EXPANSION_DET);
    return this.click(EXPANSION_DET);
};

AudienceCardsPage.prototype.clickExpansionProb = function() {
    this.waitUntilVisible(EXPANSION_PROB);
    return this.click(EXPANSION_PROB);
};

module.exports = AudienceCardsPage;
