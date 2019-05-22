'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;

// elements page

const TITLE_THIRD_PARTY_DATA = By.xpath('//h1[text() = "3rd Party Data"]');
const INPUT_SEARCH = By.css('input[placeholder="Search"]');
const FILTER_OPTION_REMOVE = (text) =>
    By.xpath(`//span[contains(text(),"${text}")]`);
const FIRST_CONTROL_BUTTON = By.xpath('//button[text() = "First"]');
const PREVIOUS_CONTROL_BUTTON = By.xpath('//button[text() = "Previous"]');
const NEXT_CONTROL_BUTTON = By.xpath('//button[text() = "Next"]');
const LAST_CONTROL_BUTTON = By.xpath('//button[text() = "Last"]');
const DOWNLOAD_ALL_BUTTON =
By.xpath('//button[text() = "Download All as CSV"]');
const SEARCH_BUTTON = By.css('.icon--add-create');

const TABLE = By.css('div .data > table');
const FIRST_TABLE_ROW = By.css('div .data table tbody > tr');
const COLUMN_CHECKBOX = By.css('div .data table thead tr > ' +
    'th:nth-child(1)');
const COLUMN_SEGMENT_DESCRIPTION = By.css('div .data table thead tr > ' +
'th:nth-child(2)');
const COLUMN_COST = By.css('div .data table thead tr > ' +
'th:nth-child(3)');
const COLUMN_MATCH_COUNT = By.css('div .data table thead tr > ' +
'th:nth-child(4)');
const COLUMN_SEGMENT_SIZE = By.css('div .data table thead tr > ' +
'th:nth-child(5)');
const COLUMN_CATEGORY = By.css('div .data table thead tr > ' +
'th:nth-child(6)');
const COLUMN_PROVIDER = By.css('div .data table thead tr > ' +
'th:nth-child(7)');
const SHOWING = By.css('div .column--3 > span.supporting');
const PAGE = By.css('div .column--2 > span.supporting');
const TABLE_FIRST_SEGMENT_LIST = By.xpath('//span[text() = "IT QA"]');


function ThirdPartyDataLibraryPage(webdriver){
    BasePage.call(this, webdriver);
}

ThirdPartyDataLibraryPage.prototype = Object.create(BasePage.prototype);
ThirdPartyDataLibraryPage.prototype.constructor = ThirdPartyDataLibraryPage;

ThirdPartyDataLibraryPage.prototype.getTitleThirdPartyData = function() {
    this.waitUntilVisible(TITLE_THIRD_PARTY_DATA);
    return this.findElement(TITLE_THIRD_PARTY_DATA);
};


ThirdPartyDataLibraryPage.prototype.getDownloadAllButton = function(){
    this.waitUntilVisible(DOWNLOAD_ALL_BUTTON);
    return this.findElement(DOWNLOAD_ALL_BUTTON);
};

ThirdPartyDataLibraryPage.prototype.getShowingView = function(){
    this.waitUntilVisible(SHOWING);
    return this.findElement(SHOWING);
};

ThirdPartyDataLibraryPage.prototype.getPageView = function(){
    this.waitUntilVisible(PAGE);
    return this.findElement(PAGE);
};

ThirdPartyDataLibraryPage.prototype.getInputSearch = function(){
    this.waitUntilVisible(INPUT_SEARCH);
    return this.findElement(INPUT_SEARCH);
};

ThirdPartyDataLibraryPage.prototype.getRemoveFilterOption = function(text){
    this.waitUntilVisible(FILTER_OPTION_REMOVE(text));
    return this.findElement(FILTER_OPTION_REMOVE(text));
};

ThirdPartyDataLibraryPage.prototype.getFirstControlButton = function(){
    this.waitUntilVisible(FIRST_CONTROL_BUTTON);
    return this.findElement(FIRST_CONTROL_BUTTON);
};

ThirdPartyDataLibraryPage.prototype.
    waitUntilFirstControlButtonEnabled = function(){
        return this.waitUntilEnabled(FIRST_CONTROL_BUTTON);
    };

ThirdPartyDataLibraryPage.prototype.
    waitUntilFirstControlButtonDisabled = function(){
        return this.waitUntilDisabled(FIRST_CONTROL_BUTTON);
    };

ThirdPartyDataLibraryPage.prototype.getPreviousControlButton = function(){
    this.waitUntilVisible(PREVIOUS_CONTROL_BUTTON);
    return this.findElement(PREVIOUS_CONTROL_BUTTON);
};

ThirdPartyDataLibraryPage.prototype.
    waitUntilPreviousControlButtonEnabled = function(){
        return this.waitUntilEnabled(PREVIOUS_CONTROL_BUTTON);
    };

ThirdPartyDataLibraryPage.prototype.
    waitUntilPreviousControlButtonDisabled = function(){
        return this.waitUntilDisabled(PREVIOUS_CONTROL_BUTTON);
    };

ThirdPartyDataLibraryPage.prototype.getNextControlButton = function(){
    this.waitUntilVisible(NEXT_CONTROL_BUTTON);
    return this.findElement(NEXT_CONTROL_BUTTON);
};

ThirdPartyDataLibraryPage.prototype.
    waitUntilNextControlButtonEnabled = function(){
        return this.waitUntilEnabled(NEXT_CONTROL_BUTTON);
    };

ThirdPartyDataLibraryPage.prototype.
    waitUntilNextControlButtonDisabled = function(){
        return this.waitUntilDisabled(NEXT_CONTROL_BUTTON);
    };

ThirdPartyDataLibraryPage.prototype.getLastControlButton = function(){
    this.waitUntilVisible(LAST_CONTROL_BUTTON);
    return this.findElement(LAST_CONTROL_BUTTON);
};

ThirdPartyDataLibraryPage.prototype.
    waitUntilLastControlButtonEnabled = function(){
        return this.waitUntilEnabled(LAST_CONTROL_BUTTON);
    };

ThirdPartyDataLibraryPage.prototype.
    waitUntilLastControlButtonDisabled = function(){
        return this.waitUntilDisabled(LAST_CONTROL_BUTTON);
    };

ThirdPartyDataLibraryPage.prototype.getSearchButton = function(){
    this.waitUntilVisible(SEARCH_BUTTON);
    return this.findElement(SEARCH_BUTTON);
};


ThirdPartyDataLibraryPage.prototype.getTable = function(){
    this.waitUntilVisible(TABLE);
    return this.findElement(TABLE);
};

ThirdPartyDataLibraryPage.prototype.getFirstTableRow = function(){
    this.waitUntilVisible(FIRST_TABLE_ROW);
    return this.findElement(FIRST_TABLE_ROW);
};


ThirdPartyDataLibraryPage.prototype.getColumnCheckBox = function(){
    this.waitUntilVisible(COLUMN_CHECKBOX);
    return this.findElement(COLUMN_CHECKBOX);
};

ThirdPartyDataLibraryPage.prototype.getColumnSegmentDescription = function(){
    this.waitUntilVisible(COLUMN_SEGMENT_DESCRIPTION);
    return this.findElement(COLUMN_SEGMENT_DESCRIPTION);
};

ThirdPartyDataLibraryPage.prototype.getColumnCost = function(){
    this.waitUntilVisible(COLUMN_COST);
    return this.findElement(COLUMN_COST);
};

ThirdPartyDataLibraryPage.prototype.getColumnMatchCount = function(){
    this.waitUntilVisible(COLUMN_MATCH_COUNT);
    return this.findElement(COLUMN_MATCH_COUNT);
};

ThirdPartyDataLibraryPage.prototype.getColumnSegmentSize = function(){
    this.waitUntilVisible(COLUMN_SEGMENT_SIZE);
    return this.findElement(COLUMN_SEGMENT_SIZE);
};

ThirdPartyDataLibraryPage.prototype.getColumnCategory = function(){
    this.waitUntilVisible(COLUMN_CATEGORY);
    return this.findElement(COLUMN_CATEGORY);
};

ThirdPartyDataLibraryPage.prototype.getColumnProvider = function(){
    this.waitUntilVisible(COLUMN_PROVIDER);
    return this.findElement(COLUMN_PROVIDER);
};


ThirdPartyDataLibraryPage.prototype.noRemoveFilterOptionDisplayed =
function(text){
    return this.elementNotLocated(FILTER_OPTION_REMOVE(text));
};

ThirdPartyDataLibraryPage.prototype.getFirstSegmentOnTable = function(){
    this.waitUntilVisible(TABLE_FIRST_SEGMENT_LIST);
    return this.findElement(TABLE_FIRST_SEGMENT_LIST);
};

// // Clicks


ThirdPartyDataLibraryPage.prototype.setInputSearch = function(value) {
    this.waitUntilVisible(INPUT_SEARCH);
    this.clear(INPUT_SEARCH);
    this.sendKeys(INPUT_SEARCH, value);
    this.sendKeys(INPUT_SEARCH, key.ENTER);
    return this.driver.sleep(2000);
};

ThirdPartyDataLibraryPage.prototype.removeFilterOption = function(text){
    return this.waitAndClick(FILTER_OPTION_REMOVE(text));
};

ThirdPartyDataLibraryPage.prototype.clickFirstPageTableControl = function(){
    return this.waitAndClick(FIRST_CONTROL_BUTTON);
};

ThirdPartyDataLibraryPage.prototype.clickPreviousPageTableControl = function(){
    return this.waitAndClick(PREVIOUS_CONTROL_BUTTON);
};

ThirdPartyDataLibraryPage.prototype.clickNextPageTableControl = function(){
    return this.waitAndClick(NEXT_CONTROL_BUTTON);
};

ThirdPartyDataLibraryPage.prototype.clickLastPageTableControl = function(){
    return this.waitAndClick(LAST_CONTROL_BUTTON);
};

module.exports = ThirdPartyDataLibraryPage;
