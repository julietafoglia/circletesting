'use strict';

// common runtime variables
const roothPath = process.env.ROOT_PATH;
const BasePage = require(roothPath + '/pages/maverick/');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

// elements
const TITLE = By.xpath('//h2[text()="Which type of report do you want' +
    ' to create?"]');
const SELECT_CM_REPORT_TYPE = By.xpath(
    '//div[contains(text()," agencies and advertisers")]');
const SELECT_IM_REPORT_TYPE = By.xpath(
    '//div[contains(text(),"media groups and publishers")]');
const CM_REPORT_BUBBLE_CARD = By.xpath(
    '//h3[contains(text(),"Campaign Manager Report")]');
const IM_REPORT_BUBBLE_CARD = By.xpath(
    '//h3[contains(text(),"Inventory Manager Report")]');

function ReportsCardPage(webdriver) {
    BasePage.call(this, webdriver);
}

ReportsCardPage.prototype = Object.create(BasePage.prototype);
ReportsCardPage.prototype.constructor = ReportsCardPage;

ReportsCardPage.prototype.getTitle = function(){
    return this.getElement(TITLE);
};

ReportsCardPage.prototype.getCMReportSelect = function(){
    return this.getElement(SELECT_CM_REPORT_TYPE);
};

ReportsCardPage.prototype.getIMReportSelect = function(){
    return this.getElement(SELECT_IM_REPORT_TYPE);
};

ReportsCardPage.prototype.getCMReportCard = function(){
    return this.getElement(CM_REPORT_BUBBLE_CARD);
};

ReportsCardPage.prototype.getIMReportCard = function(){
    return this.getElement(IM_REPORT_BUBBLE_CARD);
};

// clicks

ReportsCardPage.prototype.selectCMReport = function(){
    return this.waitAndClick(SELECT_CM_REPORT_TYPE);
};

ReportsCardPage.prototype.selectIMReport = function(){
    return this.waitAndClick(SELECT_IM_REPORT_TYPE);
};

module.exports = ReportsCardPage;
