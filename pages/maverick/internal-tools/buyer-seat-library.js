'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;

// elements page

const TITLE_BUYER_SEAT = By.xpath('//h1[text() = "Buyer Seat"]');
const INPUT_SEARCH = By.css('input[placeholder="Search"]');
const FILTER_OPTION_REMOVE = (text) =>
    By.xpath(`//span[contains(text(),"${text}")]`);
const FIRST_CONTROL_BUTTON = By.xpath('//button[text() = "First"]');
const PREVIOUS_CONTROL_BUTTON = By.xpath('//button[text() = "Previous"]');
const NEXT_CONTROL_BUTTON = By.xpath('//button[text() = "Next"]');
const LAST_CONTROL_BUTTON = By.xpath('//button[text() = "Last"]');
const CREATE_NEW_SEAT_BUTTON = By.
    xpath('//button[text() = "Create New Seat"]');
const SEARCH_BUTTON = By.css('span.icon--add-create');
const ROWS_SELECT = By.css('select-dropdown > div > button');

const TABLE = By.css('div .data > table');
const FIRST_TABLE_ROW = By.css('div .data table tbody > tr');
const COLUMN_BUYER_NAME = By.css('div .data table thead tr > ' +
    'th:nth-child(1)');
const COLUMN_DSP = By.css('div .data table thead tr > ' +
    'th:nth-child(2)');
const COLUMN_SEAT_ID = By.css('div .data table thead tr > ' +
    'th:nth-child(3)');
const COLUMN_CREATED = By.css('div .data table thead tr > ' +
    'th:nth-child(4)');
const COLUMN_MODIFIED = By.css('div .data table thead tr > ' +
    'th:nth-child(5)');
const SHOWING = By.css('div .column--3 > span.supporting');
const PAGE = By.css('div .column--2 > span.supporting');
const TABLE_BUYER_NAME_LIST = By.css('tbody > tr:nth-child(1) > ' +
    'td:nth-child(1)');
const TABLE_DSP_LIST = By.css('tbody > tr:nth-child(1) > td:nth-child(2)');
const TABLE_SEAT_ID_LIST = By.css('tbody > tr:nth-child(1) > td:nth-child(3)');
const LINK_EDIT_LIST = By.xpath('//a[text() = "Edit"]');
const SPINNER = By.css('div .spinner--small');

function BuyerSeatLibraryPage(webdriver){
    BasePage.call(this, webdriver);
}

BuyerSeatLibraryPage.prototype = Object.create(BasePage.prototype);
BuyerSeatLibraryPage.prototype.constructor = BuyerSeatLibraryPage;

BuyerSeatLibraryPage.prototype.getTitleBuyerSeat = function() {
    this.waitUntilVisible(TITLE_BUYER_SEAT);
    return this.findElement(TITLE_BUYER_SEAT);
};


BuyerSeatLibraryPage.prototype.getCreateNewButton = function(){
    this.waitUntilVisible(CREATE_NEW_SEAT_BUTTON);
    return this.findElement(CREATE_NEW_SEAT_BUTTON);
};

BuyerSeatLibraryPage.prototype.getShowingView = function(){
    this.waitUntilVisible(SHOWING);
    return this.findElement(SHOWING);
};

BuyerSeatLibraryPage.prototype.getPageView = function(){
    this.waitUntilVisible(PAGE);
    return this.findElement(PAGE);
};

BuyerSeatLibraryPage.prototype.getInputSearch = function(){
    this.waitUntilVisible(INPUT_SEARCH);
    return this.findElement(INPUT_SEARCH);
};

BuyerSeatLibraryPage.prototype.getRemoveFilterOption = function(text){
    this.waitUntilVisible(FILTER_OPTION_REMOVE(text));
    return this.findElement(FILTER_OPTION_REMOVE(text));
};

BuyerSeatLibraryPage.prototype.getFirstControlButton = function(){
    this.waitUntilVisible(FIRST_CONTROL_BUTTON);
    return this.findElement(FIRST_CONTROL_BUTTON);
};

BuyerSeatLibraryPage.prototype.
    waitUntilFirstControlButtonEnabled = function(){
        return this.waitUntilEnabled(FIRST_CONTROL_BUTTON);
    };

BuyerSeatLibraryPage.prototype.
    waitUntilFirstControlButtonDisabled = function(){
        return this.waitUntilDisabled(FIRST_CONTROL_BUTTON);
    };

BuyerSeatLibraryPage.prototype.getPreviousControlButton = function(){
    this.waitUntilVisible(PREVIOUS_CONTROL_BUTTON);
    return this.findElement(PREVIOUS_CONTROL_BUTTON);
};

BuyerSeatLibraryPage.prototype.
    waitUntilPreviousControlButtonEnabled = function(){
        return this.waitUntilEnabled(PREVIOUS_CONTROL_BUTTON);
    };

BuyerSeatLibraryPage.prototype.
    waitUntilPreviousControlButtonDisabled = function(){
        return this.waitUntilDisabled(PREVIOUS_CONTROL_BUTTON);
    };

BuyerSeatLibraryPage.prototype.getNextControlButton = function(){
    this.waitUntilVisible(NEXT_CONTROL_BUTTON);
    return this.findElement(NEXT_CONTROL_BUTTON);
};

BuyerSeatLibraryPage.prototype.
    waitUntilNextControlButtonEnabled = function(){
        return this.waitUntilEnabled(NEXT_CONTROL_BUTTON);
    };

BuyerSeatLibraryPage.prototype.
    waitUntilNextControlButtonDisabled = function(){
        return this.waitUntilDisabled(NEXT_CONTROL_BUTTON);
    };

BuyerSeatLibraryPage.prototype.getLastControlButton = function(){
    this.waitUntilVisible(LAST_CONTROL_BUTTON);
    return this.findElement(LAST_CONTROL_BUTTON);
};

BuyerSeatLibraryPage.prototype.
    waitUntilLastControlButtonEnabled = function(){
        return this.waitUntilEnabled(LAST_CONTROL_BUTTON);
    };

BuyerSeatLibraryPage.prototype.
    waitUntilLastControlButtonDisabled = function(){
        return this.waitUntilDisabled(LAST_CONTROL_BUTTON);
    };

BuyerSeatLibraryPage.prototype.getSearchButton = function(){
    this.waitUntilVisible(SEARCH_BUTTON);
    return this.findElement(SEARCH_BUTTON);
};


BuyerSeatLibraryPage.prototype.getTable = function(){
    this.waitUntilVisible(TABLE);
    return this.findElement(TABLE);
};

BuyerSeatLibraryPage.prototype.getFirstTableRow = function(){
    this.waitUntilVisible(FIRST_TABLE_ROW);
    return this.findElement(FIRST_TABLE_ROW);
};

BuyerSeatLibraryPage.prototype.waitUntilSpinnerDissapear = function(){
    return this.waitUntilStale(SPINNER);
};

BuyerSeatLibraryPage.prototype.getRowsSelect = function(){
    this.waitUntilVisible(ROWS_SELECT);
    return this.findElement(ROWS_SELECT);
};

// Table Columns

BuyerSeatLibraryPage.prototype.getColumnBuyerName = function(){
    this.waitUntilVisible(COLUMN_BUYER_NAME);
    return this.findElement(COLUMN_BUYER_NAME);
};

BuyerSeatLibraryPage.prototype.getColumnDsp = function(){
    this.waitUntilVisible(COLUMN_DSP);
    return this.findElement(COLUMN_DSP);
};

BuyerSeatLibraryPage.prototype.getColumnSeatId = function(){
    this.waitUntilVisible(COLUMN_SEAT_ID);
    return this.findElement(COLUMN_SEAT_ID);
};

BuyerSeatLibraryPage.prototype.getColumnCreated = function(){
    this.waitUntilVisible(COLUMN_CREATED);
    return this.findElement(COLUMN_CREATED);
};

BuyerSeatLibraryPage.prototype.getColumnModified = function(){
    this.waitUntilVisible(COLUMN_MODIFIED);
    return this.findElement(COLUMN_MODIFIED);
};


BuyerSeatLibraryPage.prototype.noRemoveFilterOptionDisplayed = function(text) {
    return this.elementNotLocated(FILTER_OPTION_REMOVE(text));
};

BuyerSeatLibraryPage.prototype.getFirstBuyerNameOnTable = function(){
    this.waitUntilVisible(TABLE_BUYER_NAME_LIST);
    return this.findElement(TABLE_BUYER_NAME_LIST);
};

BuyerSeatLibraryPage.prototype.getSeatIdOnTable = function(){
    this.waitUntilVisible(TABLE_SEAT_ID_LIST);
    return this.findElement(TABLE_SEAT_ID_LIST);
};

BuyerSeatLibraryPage.prototype.getDSPOnTable = function(){
    this.waitUntilVisible(TABLE_DSP_LIST);
    return this.findElement(TABLE_DSP_LIST);
};


BuyerSeatLibraryPage.prototype.getLinkEditList = function(){
    return this.findElement(LINK_EDIT_LIST);
};

// Clicks


BuyerSeatLibraryPage.prototype.setInputSearch = function(value) {
    this.waitUntilVisible(INPUT_SEARCH);
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.sendKeys(INPUT_SEARCH, key.ENTER);
    return this.waitUntilDisabled(NEXT_CONTROL_BUTTON);
};

BuyerSeatLibraryPage.prototype.removeFilterOption = function(text){
    return this.waitAndClick(FILTER_OPTION_REMOVE(text));
};

BuyerSeatLibraryPage.prototype.clickFirstPageTableControl = function(){
    return this.waitAndClick(FIRST_CONTROL_BUTTON);
};

BuyerSeatLibraryPage.prototype.clickPreviousPageTableControl = function(){
    return this.waitAndClick(PREVIOUS_CONTROL_BUTTON);
};

BuyerSeatLibraryPage.prototype.clickNextPageTableControl = function(){
    return this.waitAndClick(NEXT_CONTROL_BUTTON);
};

BuyerSeatLibraryPage.prototype.clickLastPageTableControl = function(){
    return this.waitAndClick(LAST_CONTROL_BUTTON);
};

BuyerSeatLibraryPage.prototype.clickCreateNewBuyerSeat = function(){
    return this.waitAndClick(CREATE_NEW_SEAT_BUTTON);
};

module.exports = BuyerSeatLibraryPage;
