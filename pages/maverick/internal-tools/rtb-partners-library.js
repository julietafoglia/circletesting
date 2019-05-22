'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;

// elements page
const TITLE_RTB_PARTNER = By.xpath('//h1[text() = "RTB Partner Manager"]');
const INPUT_SEARCH = By.css('input[placeholder="Search"]');
const FILTER_OPTION_REMOVE = (text) =>
    By.xpath(`//span[contains(text(),"${text}")]`);
const FIRST_CONTROL_BUTTON = By.xpath('//button[text() = "First"]');
const PREVIOUS_CONTROL_BUTTON = By.xpath('//button[text() = "Previous"]');
const NEXT_CONTROL_BUTTON = By.xpath('//button[text() = "Next"]');
const LAST_CONTROL_BUTTON = By.xpath('//button[text() = "Last"]');
const ADD_RTB_PARTNER_BUTTON = By.
    xpath('//button[text() = "Add RTB Partner"]');
const SEARCH_BUTTON = By.css('span.icon--add-create');
const ROWS_SELECT = By.css('select-dropdown > div > button');

const TABLE = By.css('div .data > table');
const FIRST_TABLE_ROW = By.css('div .data table tbody > tr');
const RTB_PARTNER_NAME = By.css('div .data table thead tr > ' +
    'th:nth-child(1)');
const STATUS = By.css('div .data table thead tr > ' +
    'th:nth-child(2)');
const BUDGET = By.css('div .data table thead tr > ' +
    'th:nth-child(3)');
const SPENT = By.css('div .data table thead tr > ' +
    'th:nth-child(4)');
const DAILY_CAP = By.css('div .data table thead tr > ' +
    'th:nth-child(5)');
const CREATED = By.css('div .data table thead tr > ' +
    'th:nth-child(6)');
const UPDATED = By.css('div .data table thead tr > ' +
    'th:nth-child(7)');
const SHOWING = By.css('div .column--3 > span.supporting');
const PAGE = By.css('div .column--2 > span.supporting');
const TABLE_RTB_PARTNER_NAME_FIRST = By.css('tr:nth-child(1) ' +
    'div > div > div span');
const TABLE_RTB_PARTNER_NAME_SECOND = By.css('tr:nth-child(2) ' +
    'div > div > div span');
const TABLE_STATUS_FIRST = By.css('tbody > tr:nth-child(1) > td:nth-child(2)');
const TABLE_BUDGET_FIRST = By.css('tbody > tr:nth-child(1) > td:nth-child(3)');
const TABLE_DAILY_CAP_FIRST = By.css('tbody > tr:nth-child(1) > ' +
    'td:nth-child(4)');
const LINK_EDIT_LIST = By.xpath('//a[text() = "Edit"]');
const LINK_DELETE_LIST = By.xpath('//a[text() = "Delete"]');
const SPINNER = By.css('div .spinner--small');
const ROWS_SELECTED_NUMBER = By.css('.align-right > select-dropdown > ' +
    'div > button > span:nth-child(1)');
const FIVE_ROWS = By.xpath('//span[text() = "5 Rows"]');
const TWENTY_FIVE_ROWS = By.xpath('//span[text() = "25 Rows"]');
let ROWS_NUMBER = By.xpath('//tbody//tr');

function RtbPartnersLibraryPage(webdriver){
    BasePage.call(this, webdriver);
}

RtbPartnersLibraryPage.prototype = Object.create(BasePage.prototype);
RtbPartnersLibraryPage.prototype.constructor = RtbPartnersLibraryPage;

RtbPartnersLibraryPage.prototype.getTitleRtbPartner = function() {
    this.waitUntilVisible(TITLE_RTB_PARTNER);
    return this.findElement(TITLE_RTB_PARTNER);
};


RtbPartnersLibraryPage.prototype.getAddRtbPartnerButton = function(){
    this.waitUntilVisible(ADD_RTB_PARTNER_BUTTON);
    return this.findElement(ADD_RTB_PARTNER_BUTTON);
};

RtbPartnersLibraryPage.prototype.getShowingView = function(){
    this.waitUntilVisible(SHOWING);
    return this.findElement(SHOWING);
};

RtbPartnersLibraryPage.prototype.getPageView = function(){
    this.waitUntilVisible(PAGE);
    return this.findElement(PAGE);
};

RtbPartnersLibraryPage.prototype.getInputSearch = function(){
    this.waitUntilVisible(INPUT_SEARCH);
    return this.findElement(INPUT_SEARCH);
};

RtbPartnersLibraryPage.prototype.getRemoveFilterOption = function(text){
    this.waitUntilVisible(FILTER_OPTION_REMOVE(text));
    return this.findElement(FILTER_OPTION_REMOVE(text));
};

// navigations buttons

RtbPartnersLibraryPage.prototype.getFirstControlButton = function(){
    this.waitUntilVisible(FIRST_CONTROL_BUTTON);
    return this.findElement(FIRST_CONTROL_BUTTON);
};

RtbPartnersLibraryPage.prototype.
    waitUntilFirstControlButtonEnabled = function(){
        return this.waitUntilEnabled(FIRST_CONTROL_BUTTON);
    };

RtbPartnersLibraryPage.prototype.
    waitUntilFirstControlButtonDisabled = function(){
        return this.waitUntilDisabled(FIRST_CONTROL_BUTTON);
    };

RtbPartnersLibraryPage.prototype.getPreviousControlButton = function(){
    this.waitUntilVisible(PREVIOUS_CONTROL_BUTTON);
    return this.findElement(PREVIOUS_CONTROL_BUTTON);
};

RtbPartnersLibraryPage.prototype.
    waitUntilPreviousControlButtonEnabled = function(){
        return this.waitUntilEnabled(PREVIOUS_CONTROL_BUTTON);
    };

RtbPartnersLibraryPage.prototype.
    waitUntilPreviousControlButtonDisabled = function(){
        return this.waitUntilDisabled(PREVIOUS_CONTROL_BUTTON);
    };

RtbPartnersLibraryPage.prototype.getNextControlButton = function(){
    this.waitUntilVisible(NEXT_CONTROL_BUTTON);
    return this.findElement(NEXT_CONTROL_BUTTON);
};

RtbPartnersLibraryPage.prototype.
    waitUntilNextControlButtonEnabled = function(){
        return this.waitUntilEnabled(NEXT_CONTROL_BUTTON);
    };

RtbPartnersLibraryPage.prototype.
    waitUntilNextControlButtonDisabled = function(){
        return this.waitUntilDisabled(NEXT_CONTROL_BUTTON);
    };

RtbPartnersLibraryPage.prototype.getLastControlButton = function(){
    this.waitUntilVisible(LAST_CONTROL_BUTTON);
    return this.findElement(LAST_CONTROL_BUTTON);
};

RtbPartnersLibraryPage.prototype.
    waitUntilLastControlButtonEnabled = function(){
        return this.waitUntilEnabled(LAST_CONTROL_BUTTON);
    };

RtbPartnersLibraryPage.prototype.
    waitUntilLastControlButtonDisabled = function(){
        return this.waitUntilDisabled(LAST_CONTROL_BUTTON);
    };


RtbPartnersLibraryPage.prototype.getSearchButton = function(){
    this.waitUntilVisible(SEARCH_BUTTON);
    return this.findElement(SEARCH_BUTTON);
};


RtbPartnersLibraryPage.prototype.getTable = function(){
    this.waitUntilVisible(TABLE);
    return this.findElement(TABLE);
};

RtbPartnersLibraryPage.prototype.getFirstTableRow = function(){
    this.waitUntilVisible(FIRST_TABLE_ROW);
    return this.findElement(FIRST_TABLE_ROW);
};

RtbPartnersLibraryPage.prototype.waitUntilSpinnerDissapear = function(){
    return this.waitUntilStale(SPINNER);
};

RtbPartnersLibraryPage.prototype.getRowsSelect = function(){
    this.waitUntilVisible(ROWS_SELECT);
    return this.findElement(ROWS_SELECT);
};

// Table Columns

RtbPartnersLibraryPage.prototype.getRtbPartnerName = function(){
    this.waitUntilVisible(RTB_PARTNER_NAME);
    return this.findElement(RTB_PARTNER_NAME);
};

RtbPartnersLibraryPage.prototype.getColumnStatus = function(){
    this.waitUntilVisible(STATUS);
    return this.findElement(STATUS);
};

RtbPartnersLibraryPage.prototype.getColumnBudget = function(){
    this.waitUntilVisible(BUDGET);
    return this.findElement(BUDGET);
};

RtbPartnersLibraryPage.prototype.getColumnSpent = function(){
    this.waitUntilVisible(SPENT);
    return this.findElement(SPENT);
};

RtbPartnersLibraryPage.prototype.getColumnDailyCap = function(){
    this.waitUntilVisible(DAILY_CAP);
    return this.findElement(DAILY_CAP);
};

RtbPartnersLibraryPage.prototype.getColumnCreated = function(){
    this.waitUntilVisible(CREATED);
    return this.findElement(CREATED);
};

RtbPartnersLibraryPage.prototype.getColumnUpdated = function(){
    this.waitUntilVisible(UPDATED);
    return this.findElement(UPDATED);
};

RtbPartnersLibraryPage.prototype.getRowsSelectNumber = function(){
    this.waitUntilVisible(ROWS_SELECTED_NUMBER);
    return this.findElement(ROWS_SELECTED_NUMBER);
};

RtbPartnersLibraryPage.prototype.noRemoveFilterOptionDisplayed = function(text){
    return this.elementNotLocated(FILTER_OPTION_REMOVE(text));
};

RtbPartnersLibraryPage.prototype.getFirstRtbPartnerNameOnTable = function(){
    this.waitUntilVisible(TABLE_RTB_PARTNER_NAME_FIRST);
    return this.findElement(TABLE_RTB_PARTNER_NAME_FIRST);
};

RtbPartnersLibraryPage.prototype.getSecondRtbPartnerNameOnTable = function(){
    this.waitUntilVisible(TABLE_RTB_PARTNER_NAME_SECOND);
    return this.findElement(TABLE_RTB_PARTNER_NAME_SECOND);
};

RtbPartnersLibraryPage.prototype.getFirstStatusTable = function(){
    this.waitUntilVisible(TABLE_STATUS_FIRST);
    return this.findElement(TABLE_STATUS_FIRST);
};

RtbPartnersLibraryPage.prototype.getFirstStatusTable = function(){
    this.waitUntilVisible(TABLE_BUDGET_FIRST);
    return this.findElement(TABLE_BUDGET_FIRST);
};

RtbPartnersLibraryPage.prototype.getFirstDailyCapTable = function(){
    this.waitUntilVisible(TABLE_DAILY_CAP_FIRST);
    return this.findElement(TABLE_DAILY_CAP_FIRST);
};

RtbPartnersLibraryPage.prototype.getLinkEditList = function(){
    return this.findElement(LINK_EDIT_LIST);
};

RtbPartnersLibraryPage.prototype.getLinkDeleteList = function(){
    return this.findElement(LINK_DELETE_LIST);
};

RtbPartnersLibraryPage.prototype.getRowsNumber = function(){
    return this.getElements(ROWS_NUMBER);
};


// Clicks


RtbPartnersLibraryPage.prototype.setInputSearch = function(value) {
    this.waitUntilVisible(INPUT_SEARCH);
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.sendKeys(INPUT_SEARCH, key.ENTER);
    return this.waitUntilDisabled(NEXT_CONTROL_BUTTON);
};

RtbPartnersLibraryPage.prototype.removeFilterOption = function(text){
    return this.waitAndClick(FILTER_OPTION_REMOVE(text));
};

RtbPartnersLibraryPage.prototype.clickFirstPageTableControl = function(){
    return this.waitAndClick(FIRST_CONTROL_BUTTON);
};

RtbPartnersLibraryPage.prototype.clickPreviousPageTableControl = function(){
    return this.waitAndClick(PREVIOUS_CONTROL_BUTTON);
};

RtbPartnersLibraryPage.prototype.clickNextPageTableControl = function(){
    return this.waitAndClick(NEXT_CONTROL_BUTTON);
};

RtbPartnersLibraryPage.prototype.clickLastPageTableControl = function(){
    return this.waitAndClick(LAST_CONTROL_BUTTON);
};

RtbPartnersLibraryPage.prototype.clickAddRtbPartner = function(){
    return this.waitAndClick(ADD_RTB_PARTNER_BUTTON);
};

RtbPartnersLibraryPage.prototype.selectFiveRows = function(){
    return this.waitAndClick(FIVE_ROWS);
};

RtbPartnersLibraryPage.prototype.selectTwentyFiveRows = function(){
    return this.waitAndClick(TWENTY_FIVE_ROWS);
};

RtbPartnersLibraryPage.prototype.clickGetRowsSelect = function(){
    return this.waitAndClick(ROWS_SELECT);
};

RtbPartnersLibraryPage.prototype.clickEditRtbPartner = function() {
    this.waitUntilVisible(TABLE_RTB_PARTNER_NAME_FIRST);
    this.elementHover(TABLE_RTB_PARTNER_NAME_FIRST);
    this.waitUntilVisible(LINK_EDIT_LIST);
    return this.click(LINK_EDIT_LIST);
};

module.exports = RtbPartnersLibraryPage;

