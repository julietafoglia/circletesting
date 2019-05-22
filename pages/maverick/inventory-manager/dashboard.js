'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;

// elements
const CREATE_PUB_BTN = By.xpath('//button[text()="Create Publisher"]');
const ENTITY_LINK = (name) => By.xpath(`//a[text()="${name}"]`);
const SEARCH_ENTITY = By.css('input[placeholder="Search"]');
const VIEW_ALL_BUTTON = By.xpath('//h3[contains(@class,"inline-block")]' +
    '[contains(text(),"View All")]/following-sibling:' +
    ':select-dropdown/div/button/span');
const FROM_BUTTON = By.xpath('//span[contains(text(),"from")]/' +
    'following-sibling::select-dropdown/div/button/span');
const NEWSLETTER_SPAN = By.xpath('//span[contains(text(),"Newsletters")]');
const MEDIAGROUP_SPAN = By.xpath('//span[contains(text(),"Media Groups")]');
const AD_SLOTS_SPAN = By.xpath('//span[contains(text(),"Ad Slots")]');
const SELECTED_ACCOUNTS = By.xpath('//span[contains(text(), ' +
    '"Selected Accounts")]');

const FILTER_OPTION_REMOVE = By.css('.button--small .fas.fa-times');
const FIRST_CONTROL_BUTTON = By.xpath('//button[text() = "First"]');
const PREVIOUS_CONTROL_BUTTON = By.xpath('//button[text() = "Previous"]');
const NEXT_CONTROL_BUTTON = By.xpath('//button[text() = "Next"]');
const LAST_CONTROL_BUTTON = By.xpath('//button[text() = "Last"]');
const FIRST_TABLE_ROW = By.css('table tbody > tr');
const TABLE_FIRST_NAME = By.css('.overflow');

const FIRST_COLUMN_TITLE = By.css('div .data table thead tr > ' +
    'th:nth-child(1)');
const SECOND_COLUMN_TITLE = By.css('div .data table thead tr > ' +
    'th:nth-child(2)');
const THIRD_COLUMN_TITLE = By.css('div .data table thead tr > ' +
    'th:nth-child(3)');
const FOURTH_COLUMN_TITLE = By.css('div .data table thead tr > ' +
    'th:nth-child(4)');
const FIFTH_COLUMN_TITLE = By.css('div .data table thead tr > ' +
    'th:nth-child(5)');
const SIXTH_COLUMN_TITLE = By.css('div .data table thead tr > ' +
    'th:nth-child(6)');
const SEVENTH_COLUMN_TITLE = By.css('div .data table thead tr > ' +
    'th:nth-child(7)');
const EIGHTH_COLUMN_TITLE = By.css('div .data table thead tr > ' +
    'th:nth-child(8)');

function DashboardPage(webdriver) {
    this.driver = webdriver;
}

DashboardPage.prototype = Object.create(BasePage.prototype);
DashboardPage.prototype.constructor = DashboardPage;

DashboardPage.prototype.getSearchField = function() {
    return this.getElement(SEARCH_ENTITY);
};

DashboardPage.prototype.getCreatePublisherButton = function() {
    return this.getElement(CREATE_PUB_BTN);
};

DashboardPage.prototype.getFirstColumnTitle = function() {
    return this.getElement(FIRST_COLUMN_TITLE);
};

DashboardPage.prototype.getSecondColumnTitle = function() {
    return this.getElement(SECOND_COLUMN_TITLE);
};

DashboardPage.prototype.getThirdColumnTitle = function() {
    return this.getElement(THIRD_COLUMN_TITLE);
};

DashboardPage.prototype.getFourthColumnTitle = function() {
    return this.getElement(FOURTH_COLUMN_TITLE);
};

DashboardPage.prototype.getFifthColumnTitle = function() {
    return this.getElement(FIFTH_COLUMN_TITLE);
};

DashboardPage.prototype.getSixthColumnTitle = function() {
    return this.getElement(SIXTH_COLUMN_TITLE);
};

DashboardPage.prototype.getSeventhColumnTitle = function() {
    return this.getElement(SEVENTH_COLUMN_TITLE);
};

DashboardPage.prototype.getEighthColumnTitle = function() {
    return this.getElement(EIGHTH_COLUMN_TITLE);
};

BasePage.prototype.getInventoryTitle = function(elementText) {
    return this.getElement(By
        .xpath("//h1[contains(text(),'" + elementText + "')]"));
};

DashboardPage.prototype.getViewAllButton = function() {
    return this.getElement(VIEW_ALL_BUTTON);
};

DashboardPage.prototype.getFromButton = function() {
    return this.getElement(FROM_BUTTON);
};

DashboardPage.prototype.getFirstTableName = function() {
    return this.getElement(TABLE_FIRST_NAME);
};

DashboardPage.prototype.getRemoveFilterOption = function(){
    return this.getElement(FILTER_OPTION_REMOVE);
};

DashboardPage.prototype.noRemoveFilterOptionDisplayed = function() {
    return this.elementNotLocated(FILTER_OPTION_REMOVE);
};

DashboardPage.prototype.getFirstControlButton = function(){
    return this.getElement(FIRST_CONTROL_BUTTON);
};

DashboardPage.prototype.waitUntilFirstControlButtonEnabled = function(){
    return this.waitUntilEnabled(FIRST_CONTROL_BUTTON);
};

DashboardPage.prototype.waitUntilFirstControlButtonDisabled = function(){
    return this.waitUntilDisabled(FIRST_CONTROL_BUTTON);
};

DashboardPage.prototype.getPreviousControlButton = function(){
    return this.getElement(PREVIOUS_CONTROL_BUTTON);
};

DashboardPage.prototype.waitUntilPreviousControlButtonEnabled =
    function(){
        return this.waitUntilEnabled(PREVIOUS_CONTROL_BUTTON);
    };

DashboardPage.prototype.waitUntilPreviousControlButtonDisabled =
    function(){
        return this.waitUntilDisabled(PREVIOUS_CONTROL_BUTTON);
    };

DashboardPage.prototype.getNextControlButton = function(){
    return this.getElement(NEXT_CONTROL_BUTTON);
};

DashboardPage.prototype.waitUntilNextControlButtonEnabled = function(){
    return this.waitUntilEnabled(NEXT_CONTROL_BUTTON);
};

DashboardPage.prototype.waitUntilNextControlButtonDisabled = function(){
    return this.waitUntilDisabled(NEXT_CONTROL_BUTTON);
};

DashboardPage.prototype.getLastControlButton = function(){
    return this.getElement(LAST_CONTROL_BUTTON);
};

DashboardPage.prototype.waitUntilLastControlButtonEnabled = function(){
    return this.waitUntilEnabled(LAST_CONTROL_BUTTON);
};

DashboardPage.prototype.waitUntilLastControlButtonDisabled = function(){
    return this.waitUntilDisabled(LAST_CONTROL_BUTTON);
};

DashboardPage.prototype.getFirstTableRow = function(){
    return this.getElement(FIRST_TABLE_ROW);
};

DashboardPage.prototype.clickPubCreateBtn = function() {
    this.waitUntilVisible(CREATE_PUB_BTN);
    return this.findElement(CREATE_PUB_BTN).click();
};

DashboardPage.prototype.openFirstEntity = function(name) {
    this.waitUntilVisible(ENTITY_LINK(name));
    return this.findElement(ENTITY_LINK(name)).click();
};

DashboardPage.prototype.setSearchField = function(value) {
    this.waitUntilVisible(SEARCH_ENTITY);
    this.clear(SEARCH_ENTITY);
    this.sendKeys(SEARCH_ENTITY, value);
    this.sendKeys(SEARCH_ENTITY, key.ENTER);
    this.getElement(SEARCH_ENTITY);
    return this.waitUntilOverlayNotVisible();
};

DashboardPage.prototype.removeFilterOption = function(){
    return this.waitAndClick(FILTER_OPTION_REMOVE);
};

DashboardPage.prototype.clickFirstPageTableControl = function(){
    return this.waitAndClick(FIRST_CONTROL_BUTTON);
};

DashboardPage.prototype.clickPreviousPageTableControl = function(){
    return this.waitAndClick(PREVIOUS_CONTROL_BUTTON);
};

DashboardPage.prototype.clickNextPageTableControl = function(){
    return this.waitAndClick(NEXT_CONTROL_BUTTON);
};

DashboardPage.prototype.clickLastPageTableControl = function(){
    return this.waitAndClick(LAST_CONTROL_BUTTON);
};

DashboardPage.prototype.clickViewAllButton = function(){
    return this.waitAndClick(VIEW_ALL_BUTTON);
};

DashboardPage.prototype.clickFromButton = function(){
    return this.waitAndClick(FROM_BUTTON);
};

DashboardPage.prototype.selectNewsletterView = function(){
    this.clickViewAllButton();
    return this.waitAndClick(NEWSLETTER_SPAN);
};

DashboardPage.prototype.selectMediaGroupView = function(){
    this.clickViewAllButton();
    return this.waitAndClick(MEDIAGROUP_SPAN);
};

DashboardPage.prototype.selectAdSlotsView = function(){
    this.clickViewAllButton();
    return this.waitAndClick(AD_SLOTS_SPAN);
};

DashboardPage.prototype.selectFromSelectedAccounts = function(){
    this.clickFromButton();
    return this.waitAndClick(SELECTED_ACCOUNTS);
};

DashboardPage.prototype.sortByCreatedDate = function() {
    return this.waitAndClick(FOURTH_COLUMN_TITLE);
}

module.exports = DashboardPage;
