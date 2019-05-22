'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');
const driverTimeOut = 5000;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

// buttons
const BUTTON_REVIEW_PROPOSAL = By.xpath('//button[text() = "Review Proposal"]');
const SECTION_CARD = By.css('.section-card');


function ProposalsForm(webdriver) {
    BasePage.call(this, webdriver);
}

ProposalsForm.prototype = Object.create(BasePage.prototype);
ProposalsForm.prototype.constructor = ProposalsForm;

ProposalsForm.prototype.getButtonReviewProposal = function() {
    this.waitUntilVisible(BUTTON_REVIEW_PROPOSAL);
    return this.findElement(BUTTON_REVIEW_PROPOSAL);
};

ProposalsForm.prototype.getSectionCard = function() {
    this.waitUntilVisible(SECTION_CARD);
    return this.findElement(SECTION_CARD);
};

ProposalsForm.prototype.clickNewProposal = function() {
    this.waitUntilVisible(BUTTON_REVIEW_PROPOSAL);
    return this.click(BUTTON_REVIEW_PROPOSAL);
};

module.exports = ProposalsForm;
