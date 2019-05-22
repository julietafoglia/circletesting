'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');
const driverTimeOut = 5000;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

// buttons
const BUTTON_NEW_PROPOSAL = By.xpath('//button[text() = "Create Proposal"]');


function ProposalsDetails(webdriver) {
    BasePage.call(this, webdriver);
}

ProposalsDetails.prototype = Object.create(BasePage.prototype);
ProposalsDetails.prototype.constructor = ProposalsDetails;

ProposalsDetails.prototype.getButtonNewProposal = function() {
    this.waitUntilVisible(BUTTON_NEW_PROPOSAL);
    return this.findElement(BUTTON_NEW_PROPOSAL);
};

ProposalsDetails.prototype.clickNewProposal = function() {
    this.waitUntilVisible(BUTTON_NEW_PROPOSAL);
    return this.click(BUTTON_NEW_PROPOSAL);
};


module.exports = ProposalsDetails;
