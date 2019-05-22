'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;
const oneSecTO = 1000;

// Landing page elements
const PAGE_TITLE = By.xpath('//span[text() = "Reports"]');
const CREATE_BUTTON = By.xpath('//button[text() = "Create New Report"]');
const MY_REPORTS_TAB = By.xpath('//h4[text() = "My Reports"]');
const ALL_REPORTS_TAB = By.xpath('//h4[text() = "All Reports"]');
const SEARCH_REPORTS_INPUT = By.css('input[placeholder="Search"]');
const ADD_FILTER_BUTTON = By.xpath('//data-table//button');
const SAVE_REPORT_BUTTON = By.xpath('//button[contains(text(),"Save Report")]');
const NAME_TABLE_HEADER = By.xpath('//data-table//h5[text() = "Name"]');
const TABLE_FIRST_NAME = By.css('.row-actions .overflow');
const REPORT_TYPE_TABLE_HEADER
    = By.xpath('//data-table//h5[text() = "Report Type"]');
const QUERY_RANGE_TABLE_HEADER
    = By.xpath('//data-table//h5[text() = "Query Range"]');
const SCHEDULE_TABLE_HEADER
    = By.xpath('//data-table//h5[text() = "Schedule"]');
const CREATED_TABLE_HEADER
    = By.xpath('//data-table//h5[text() = "Created"]');
const UPDATED_TABLE_HEADER
    = By.xpath('//data-table//h5[text() = "Updated"]');

const LOADING_INDICATOR = By.xpath('//overlay-loading-indicator');

// Report create elements
const CREATE_HEADER_TITLE = By.xpath('//h4[text() = "Create Report"]');
const EXIT_BUTTON = By.css('button i');
const REPORT_TYPE_TEXT = By.xpath('//label[text() = "Report Type"]');
const REPORT_TYPE_DROPDOWN = By.css('select-dropdown[name="presets"]' +
    ' div button span');
const CUSTOM_OPTION = By.xpath('//span[text() = "Custom"]');
const NATIVE_OPTION = By.xpath('//span[text() = "Native"]');
const LA_360_OPTION = By.xpath('//span[text() = "LiveAudience 360 Report"]');
const ADD_A_SCHEDULE_LINK = By
    .xpath('//section//a[text() = "+ Add a Schedule"]');
const DELIVERY_FREQUENCY_DROPDOWN =
    By.css('select-dropdown[name="scheduleFrequency"] div button span');
const CLOSE_SCHEDULE_BUTTON = By.xpath('//section/div/div/div/button/i');
const START_DELIVERY_DURATION
    = By.xpath('//section//div[2]//div[2]/div[1]/date-picker//input');
const END_DELIVERY_DURATION
    = By.xpath('//section//div[2]//div[2]/div[2]/date-picker//input');
const DELIVERY_TIME_DROPDOWN =
    By.css('select-dropdown[name="scheduleTime"] div button span');
const WARNING_ALERT = By.css('.warning div div');

// basic details section
const REPORT_NAME_TEXT = By.xpath('//label[text() = "Report Name"]');
const REPORT_NAME_TEXTBOX = By.name('reportName');

// publishers
const PUBLISHER_TEXT = By.xpath('//label[text() = "Publishers"]');
const PUBLISHER_FILTER_DROPDOWN =
    By.xpath('//publishers-filter//select-dropdown//button');
const BY_TEMPLATE = By.xpath('//span[text() = "By Template"]');
const BY_SECTION = By.xpath('//span[text() = "By Section"]');
const ADD_ALL_MY_PUBLISHERS_LINK =
    By.xpath('//a[text() = "Add All My Publishers"]');
const SELECT_PUBLISHERS_LINK =
    By.xpath('//a[text() = "Select Publishers"]');
const FILTER_BY_INVENTORY_LINK =
    By.xpath('//a[text() = "+ Filter by Inventory"]');
const SELECT_TEMPLATES_LINK = By.xpath('//a[text() = "Select Templates"]');
const ADD_ALL_TEMPLATES_LINK =
    By.xpath('//a[contains(text(),"Add All Templates")]');
const SELECT_SECTIONS_LINK = By.xpath('//a[text() = "Select Sections"]');
const ADD_ALL_SECTIONS_LINK =
    By.xpath('//a[contains(text(),"Add All Sections")]');
const SELECTED_PULISHERS_TEXT =
    By.xpath('//publishers-filter//div[2]/div[2]//span[text() = "Selected"]');
const CLEAR_ALL_LINK =
    By.xpath('//publishers-filter//div[2]/div[2]//a[text() = "Clear All"]');
const CHOOSE_PUBLISHERS_HEADER =
    By.xpath('//h4[text() = "Choose Publishers"]');
const EXIT_CHOOSE_PUBLISHERS_BUTTON =
    By.xpath('//publishers-filter/reports-entity-filter/' +
    '/div[2]//div[1]/button/i');
const CANCEL_CHOOSE_PUBLISHERS_LINK =
    By.xpath('//publishers-filter/reports-entity-filter/' +
    '/div[2]/div/div/div[3]//a');
const ADD_PUBLISHERS_BUTTON =
    By.xpath('//publishers-filter/reports-entity-filter/' +
    '/div[2]/div/div/div[3]//button');
const FIRST_OPTION_LISTED = By.css(
    'tr[class="ng-star-inserted"] td span');
const CLEAR_ALL_POPUP_LINK =
    By.xpath('//publishers-filter//div[2]//div[2]//div[2]//a');

// advertisers
const ADVERTISER_TEXT = By.xpath('//label[text() = "Advertisers"]');
const ADD_ALL_MY_ADVERTISERS_LINK =
    By.xpath('//a[text() = "Add All My Advertisers"]');
const SELECT_ADVERTISERS_LINK =
    By.xpath('//a[contains(text(),"Select Advertisers")]');
const SELECT_ADVERTISERS_PUB_LINK = By.xpath(
    '//ssp-advertisers-filter//a[contains(text(),"Select Advertisers")]');
const ADVERTISER_FILTER_DROPDOWN =
    By.xpath('//ssp-advertisers-filter//select-dropdown//button');
const BY_CAMPAIGN_OPTION = By.xpath('//a/span[text() = "By Campaign"]');
const BY_LINE_ITEM_OPTION = By.xpath('//a/span[text() = "By Line Item"]');
const FILTER_BY_ADVERTISERS_LINK =
    By.xpath('//a[text() = "+ Filter by Advertisers"]');
const ADD_ALL_ADVERTISERS =
    By.xpath('//a[contains(text(),"Add All Advertisers")]');
const FILTER_BY_CAMPAIGNS_LINK =
    By.xpath('//a[contains(text(),"+ Filter by Campaigns")]');
const SELECT_CAMPAIGNS_LINK =
    By.xpath('//a[contains(text(),"Select Campaigns")]');
const ADD_ALL_CAMPAIGNS_LINK = By.xpath('//a[text() = "Add All Campaigns"]');
const SELECT_LINE_ITEMS_LINK =
    By.xpath('//a[contains(text(),"Select Line Items")]');
const ADD_ALL_LINE_ITEMS_LINK = By.xpath('//a[text() = "Add All Line Items"]');
const CHOOSE_ADVERTISERS_HEADER =
    By.xpath('//h4[text() = "Choose Advertisers"]');
const EXIT_ADVERTISER_POPUP = By.xpath('//h4[contains(text(),' +
    '"Choose Advertisers")]/parent::div/button');
const CANCEL_CHOOSE_ADVERTISER_BTN = By.xpath('//a[contains(text(),"Cancel")]');
const ADD_ADVERTISERS_BTN = By.xpath('//button[contains(text(),' +
    '"Add Advertisers")]');
const CLEAR_ALL_LINK_ADV = By.xpath('//a[contains(text(),"Clear All")]');
const SELECTED_ADVERTISERS_TEXT = By.xpath('//span[text() = "Selected"]');
const CAMPAIGN_TYPE_DROPDOWN = By.css('select-dropdown[name="campaignType"]');
const DSP_CAMPAIGN_TYPE = By.xpath('//span[text() = "DSP"]');
const SSP_CAMPAIGN_TYPE = By.xpath('//span[text() = "SSP"]');
const SPLITS_DROPDOWN = By.css('multi-select[name="reportExactSplits"]' +
    ' div button span');
const DEMAND_TYPE_OPT = By.xpath('//span[text() = "Demand Type"]');
const ADVERTISER_ID_OPT = By.xpath('//span[text() = "Advertiser ID"]');
const ADVERTISER_NAME_OPT = By.xpath('//span[text() = "Advertiser Name"]');
const CAMPAIGN_ID_OPT = By.xpath('//span[text() = "Campaign ID"]');
const CAMPAIGN_NAME_OPT = By.xpath('//span[text() = "Campaign Name"]');
const LINE_ITEM_ID_OPT = By.xpath('//span[text() = "Line Item ID"]');
const LINE_ITEM_NAME_OPT = By.xpath('//span[text() = "Line Item Name"]');
const CREATIVE_ID_OPT = By.xpath('//span[text() = "Creative ID"]');
const CREATIVE_NAME_OPT = By.xpath('//span[text() = "Creative Name"]');
const CREATIVE_SIZE_OPT = By.xpath('//span[text() = "Creative Size"]');
const PUBLISHER_ID_OPT = By.xpath('//span[text() = "Publisher ID"]');
const PUBLISHER_DOMAIN_OPT = By.xpath('//span[text() = "Publisher Domain"]');
const PUBLISHER_NAME_OPT = By.xpath('//span[text() = "Publisher Name"]');
const DEVICE_TYPE_OPT = By.xpath('//span[text() = "Device Type"]');
const OS_OPT = By.xpath('//span[text() = "OS"]');
const ORDER_ID_OPT = By.xpath('//span[text() = "Order ID"]');
const UPA_OPT = By.xpath('//span[text() = "UPA"]');
const CLEAR_SELECTION_LINK =
    By.xpath('//a[contains(text(),"Clear All")]');
const SELECT_ALL_LINK =
    By.xpath('//a[contains(text(),"Select All")]');
const IMPRESSIONS_CHK_BOX = By.xpath('//span[contains(text(),"Impressions")]' +
    '/parent::label');
const CLICKS_CHK_BOX = By.xpath('//span[contains(text(),' +
    '"Clicks")]/parent::label');
const CONVERSIONS_CHK_BOX = By.xpath('//span[contains(text(),' +
    '"Conversions")]/parent::label');
const ADD_INEXACT_SPLITS = By.xpath('//a[contains(text(),' +
    '"Add Inexact Splits")]');
const ADD_A_FILTER = By.xpath('//a[contains(text(),"Add a Filter")]');
const INEXACT_SPLITS_DROPDOWN = By.xpath('//multi-select[@name=' +
    '"reportInexactSplits"]/parent::div');
const CLOSE_INEXACT_BTN = By.xpath('//multi-select[@name=' +
    '"reportInexactSplits"]/parent::div/following-sibling::div/a/i');
const AGE_OPT = By.xpath('//span[text() = "Age"]');
const GENDER_OPT = By.xpath('//span[text() = "Gender"]');
const COUNTRY_OPT = By.xpath('//span[text() = "Country"]');
const REGION_OPT = By.xpath('//span[text() = "Region"]');
const METRO_OPT = By.xpath('//span[text() = "Metro"]');
const BROWSER_OPT = By.xpath('//span[text() = "Browser"]');
const OTHER_FILTER_BUTTON = By.xpath('//multi-select[@name=' +
    '"otherFiltersMultiSelect"]/parent::div');
const CLOSE_OTHER_FILTER_BTN = By.xpath('//multi-select[@name=' +
    '"otherFiltersMultiSelect"]/parent::div/following-sibling::div/a/span');
const METRO_COUNTRY_REGION_OPT = By.xpath('//span[text() = ' +
    '"Metro/Country/Region"]');
const DSP_FEE_CHK_BOX = By.xpath('//span[contains(text(),' +
    '"DSP Fee")]/parent::label');
const ADV_SPEND_CHK_BOX = By.xpath('//span[contains(text(),' +
    '"Advertiser Spend")]/parent::label');
const PVC_CHK_BOX = By.xpath('//span[contains(text(),' +
    '"Post view conversions")]/parent::label');
const GROSS_ECPM_CHK_BOX = By.xpath('//span[contains(text(),' +
    '"Gross eCPM")]/parent::label');
const CTR_CHK_BOX = By.xpath('//span[contains(text(),' +
    '"CTR")]/parent::label');
const CCR_CHK_BOX = By.xpath('//span[contains(text(),' +
    '"CCR")]/parent::label');
const ECPA_CHK_BOX = By.xpath('//span[contains(text(),' +
    '"eCPA")]/parent::label');
const ECPC_CHK_BOX = By.xpath('//span[contains(text(),' +
    '"eCPC")]/parent::label');

// native report fields
const QUERY_RANGE_TEXT =
    By.xpath('//section-card//label[text() = "Query Range"]');
const QUERY_RANGE_DROPDOWN = By.css('select-dropdown[name="reportInterval"]' +
    ' div button span');
const WEEK_TO_DATE_OPTION = By.xpath('//span[text() = "Week to Date"]');
const MONTH_TO_DATE_OPTION = By.xpath('//span[text() = "Month to Date"]');
const QARTER_TO_DATE_OPTION = By.xpath('//span[text() = "Quarter to Date"]');
const YEAR_TO_DATE_OPTION = By.xpath('//span[text() = "Year to Date"]');
const YESTERDAY_OPTION = By.xpath('//span[text() = "Yesterday"]');
const PAST_7_DAYS_OPTION = By.xpath('//span[text() = "Past 7 Days"]');
const PAST_30_DAYS_OPTION = By.xpath('//span[text() = "Past 30 Days"]');
const PAST_90_DAYS_OPTION = By.xpath('//span[text() = "Past 90 Days"]');
const LAST_MONTH_OPTION = By.xpath('//span[text() = "Last Month"]');
const DATE_RANGE_OPTION = By.xpath('//span[text() = "Date Range"]');
const START_DATE_INPUT
    = By.css('date-picker[name="startDate"] div input');
const END_DATE_INPUT
    = By.css('date-picker[name="endDate"] div input');
const GRANULARITY_TEXT = By.xpath('//label[text() = "Time Granularity"]');
const GRANULARITY_DROPDOWN = By.css('select-dropdown[name=' +
    '"reportGranularity"] div button span');
const DAY_OPTION = By.xpath('//span[text() = "Day"]');
const WEEK_OPTION = By.xpath('//span[text() = "Week"]');
const MONTH_OPTION = By.xpath('//span[text() = "Month"]');
const ALL_OPTION = By.xpath('//span[text() = "All"]');

const FIRST_LI_DROPDOWN_OPT = By.xpath(
    '//div[contains(@class,"dropdown--container ng-star-inserted")]' +
    '/ul/li/a/span');

// reports page funcion
function ReportsPage(webdriver) {
    BasePage.call(this, webdriver);
}

ReportsPage.prototype = Object.create(BasePage.prototype);
ReportsPage.prototype.constructor = ReportsPage;

ReportsPage.prototype.waitUntilSpinnerNotPresent = function() {
    this.findElement(LOADING_INDICATOR);
    return this.waitUntilStale(LOADING_INDICATOR);
};

// Gets
// landing page
ReportsPage.prototype.getCreateButton = function() {
    this.waitUntilVisible(CREATE_BUTTON);
    return this.findElement(CREATE_BUTTON);
};

ReportsPage.prototype.getCreateHeaderTitle = function() {
    this.waitUntilVisible(CREATE_HEADER_TITLE);
    return this.findElement(CREATE_HEADER_TITLE);
};

ReportsPage.prototype.getReportsHeader = function() {
    this.waitUntilVisible(PAGE_TITLE);
    return this.findElement(PAGE_TITLE);
};

ReportsPage.prototype.getReportExitButton = function() {
    this.waitUntilVisible(EXIT_BUTTON);
    return this.findElement(EXIT_BUTTON);
};

ReportsPage.prototype.getMyReportsTab = function() {
    this.waitUntilVisible(MY_REPORTS_TAB);
    return this.findElement(MY_REPORTS_TAB);
};

ReportsPage.prototype.getAllReportsTab = function() {
    this.waitUntilVisible(ALL_REPORTS_TAB);
    return this.findElement(ALL_REPORTS_TAB);
};

ReportsPage.prototype.getSearchReportsInput = function() {
    this.waitUntilVisible(SEARCH_REPORTS_INPUT);
    return this.findElement(SEARCH_REPORTS_INPUT);
};

ReportsPage.prototype.getAddFilterButton = function() {
    this.waitUntilVisible(ADD_FILTER_BUTTON);
    return this.findElement(ADD_FILTER_BUTTON);
};

ReportsPage.prototype.getNameTableHeader = function() {
    this.waitUntilVisible(NAME_TABLE_HEADER);
    return this.findElement(NAME_TABLE_HEADER);
};

ReportsPage.prototype.getReportTypeTableHeader = function() {
    this.waitUntilVisible(REPORT_TYPE_TABLE_HEADER);
    return this.findElement(REPORT_TYPE_TABLE_HEADER);
};

ReportsPage.prototype.getQueryRangeTableHeader = function() {
    this.waitUntilVisible(QUERY_RANGE_TABLE_HEADER);
    return this.findElement(QUERY_RANGE_TABLE_HEADER);
};

ReportsPage.prototype.getScheduleTableHeader = function() {
    this.waitUntilVisible(SCHEDULE_TABLE_HEADER);
    return this.findElement(SCHEDULE_TABLE_HEADER);
};

ReportsPage.prototype.getCreatedTableHeader = function() {
    this.waitUntilVisible(CREATED_TABLE_HEADER);
    return this.findElement(CREATED_TABLE_HEADER);
};

ReportsPage.prototype.getUpdatedTableHeader = function() {
    this.waitUntilVisible(UPDATED_TABLE_HEADER);
    return this.findElement(UPDATED_TABLE_HEADER);
};

ReportsPage.prototype.getSaveReporButton = function() {
    this.waitUntilVisible(SAVE_REPORT_BUTTON);
    return this.findElement(SAVE_REPORT_BUTTON);
};

// basic detail section
ReportsPage.prototype.getReportNameText = function() {
    this.waitUntilVisible(REPORT_NAME_TEXT);
    return this.findElement(REPORT_NAME_TEXT);
};

ReportsPage.prototype.getReportNameTextbox = function() {
    this.waitUntilVisible(REPORT_NAME_TEXTBOX);
    return this.findElement(REPORT_NAME_TEXTBOX);
};

// publishers
ReportsPage.prototype.getPublisherText = function() {
    this.waitUntilVisible(PUBLISHER_TEXT);
    return this.findElement(PUBLISHER_TEXT);
};

ReportsPage.prototype.getPublisherFilterDropdown = function() {
    this.waitUntilVisible(PUBLISHER_FILTER_DROPDOWN);
    return this.findElement(PUBLISHER_FILTER_DROPDOWN);
};

ReportsPage.prototype.getByTemplateOption = function() {
    this.waitUntilVisible(BY_TEMPLATE);
    return this.findElement(BY_TEMPLATE);
};

ReportsPage.prototype.getBySectionOption = function() {
    this.waitUntilVisible(BY_SECTION);
    return this.findElement(BY_SECTION);
};

ReportsPage.prototype.getAllMyPublishersLink = function() {
    this.waitUntilVisible(ADD_ALL_MY_PUBLISHERS_LINK);
    return this.findElement(ADD_ALL_MY_PUBLISHERS_LINK);
};

ReportsPage.prototype.getSelectPublishersLink = function() {
    this.waitUntilVisible(SELECT_PUBLISHERS_LINK);
    return this.findElement(SELECT_PUBLISHERS_LINK);
};

ReportsPage.prototype.getFilterByInventoryLink = function() {
    this.waitUntilVisible(FILTER_BY_INVENTORY_LINK);
    return this.findElement(FILTER_BY_INVENTORY_LINK);
};

ReportsPage.prototype.getFilterByAdvertisersLink = function() {
    this.waitUntilVisible(FILTER_BY_ADVERTISERS_LINK);
    return this.findElement(FILTER_BY_ADVERTISERS_LINK);
};

ReportsPage.prototype.getSelectTemplatesLink = function() {
    this.waitUntilVisible(SELECT_TEMPLATES_LINK);
    return this.findElement(SELECT_TEMPLATES_LINK);
};

ReportsPage.prototype.getAddAllTemplatesLink = function() {
    this.waitUntilVisible(ADD_ALL_TEMPLATES_LINK);
    return this.findElement(ADD_ALL_TEMPLATES_LINK);
};

ReportsPage.prototype.getSelectSectionsLink = function() {
    this.waitUntilVisible(SELECT_SECTIONS_LINK);
    return this.findElement(SELECT_SECTIONS_LINK);
};

ReportsPage.prototype.getAddAllSectionsLink = function() {
    this.waitUntilVisible(ADD_ALL_SECTIONS_LINK);
    return this.findElement(ADD_ALL_SECTIONS_LINK);
};

ReportsPage.prototype.getChoosePublisherHeader = function() {
    this.waitUntilVisible(CHOOSE_PUBLISHERS_HEADER);
    return this.findElement(CHOOSE_PUBLISHERS_HEADER);
};

ReportsPage.prototype.getExitChoosePublishersButton = function() {
    this.waitUntilVisible(EXIT_CHOOSE_PUBLISHERS_BUTTON);
    return this.findElement(EXIT_CHOOSE_PUBLISHERS_BUTTON);
};

ReportsPage.prototype.getCancelChoosePublishersLink = function() {
    this.waitUntilVisible(CANCEL_CHOOSE_PUBLISHERS_LINK);
    return this.findElement(CANCEL_CHOOSE_PUBLISHERS_LINK);
};

ReportsPage.prototype.getAddPublishersButton = function() {
    this.waitUntilVisible(ADD_PUBLISHERS_BUTTON);
    return this.findElement(ADD_PUBLISHERS_BUTTON);
};

ReportsPage.prototype.getFirstOptionListed = function() {
    this.waitUntilVisible(FIRST_OPTION_LISTED);
    return this.findElement(FIRST_OPTION_LISTED);
};

ReportsPage.prototype.getClearAllPopUpLink = function() {
    this.waitUntilVisible(CLEAR_ALL_POPUP_LINK);
    return this.findElement(CLEAR_ALL_POPUP_LINK);
};

ReportsPage.prototype.getSelectedPublishersText = function() {
    this.waitUntilVisible(SELECTED_PULISHERS_TEXT);
    return this.findElement(SELECTED_PULISHERS_TEXT);
};

ReportsPage.prototype.getClearAllLink = function() {
    this.waitUntilVisible(CLEAR_ALL_LINK);
    return this.findElement(CLEAR_ALL_LINK);
};

// advertisers
ReportsPage.prototype.getAdvertiserText = function() {
    return this.getElement(ADVERTISER_TEXT);
};

ReportsPage.prototype.getAllMyAdvertisersLink = function() {
    return this.getElement(ADD_ALL_MY_ADVERTISERS_LINK);
};

ReportsPage.prototype.getSelectAdvertisersLink = function() {
    return this.getElement(SELECT_ADVERTISERS_LINK);
};

ReportsPage.prototype.getSelectAdvertisersPublisher = function() {
    return this.getElement(SELECT_ADVERTISERS_PUB_LINK);
};

ReportsPage.prototype.getAdvertiserFilterDropdown = function() {
    return this.getElement(ADVERTISER_FILTER_DROPDOWN);
};

ReportsPage.prototype.getByCampaignOption = function() {
    return this.getElement(BY_CAMPAIGN_OPTION);
};

ReportsPage.prototype.getByLineItemOption = function() {
    return this.getElement(BY_LINE_ITEM_OPTION);
};

ReportsPage.prototype.getAddAllAdvertisersLink = function() {
    return this.getElement(ADD_ALL_ADVERTISERS);
};

ReportsPage.prototype.getFilterByCampaignsLink = function() {
    return this.getElement(FILTER_BY_CAMPAIGNS_LINK);
};

ReportsPage.prototype.getSelectCampaignsLink = function() {
    return this.getElement(SELECT_CAMPAIGNS_LINK);
};

ReportsPage.prototype.getAddAllCampaignsLink = function() {
    return this.getElement(ADD_ALL_CAMPAIGNS_LINK);
};

ReportsPage.prototype.getSelectLineItemsLink = function() {
    return this.getElement(SELECT_LINE_ITEMS_LINK);
};

ReportsPage.prototype.getAddAllLineItemsLink = function() {
    return this.getElement(ADD_ALL_LINE_ITEMS_LINK);
};

ReportsPage.prototype.getChooseAdvertiserHeader = function() {
    return this.getElement(CHOOSE_ADVERTISERS_HEADER);
};

ReportsPage.prototype.getExitChooseAdvertiser = function() {
    return this.getElement(EXIT_ADVERTISER_POPUP);
};

ReportsPage.prototype.getCancelChooseAdvertiser = function() {
    return this.getElement(CANCEL_CHOOSE_ADVERTISER_BTN);
};

ReportsPage.prototype.getAddAdvertisersButton = function() {
    return this.getElement(ADD_ADVERTISERS_BTN);
};

ReportsPage.prototype.getClearAllLinkAdv = function() {
    return this.getElement(CLEAR_ALL_LINK_ADV);
};

ReportsPage.prototype.getSelectedAdvertisersText = function() {
    return this.getElement(SELECTED_ADVERTISERS_TEXT);
};

ReportsPage.prototype.getLA360ReportOption = function() {
    return this.getElement(LA_360_OPTION);
};

ReportsPage.prototype.getCampaignType = function() {
    return this.getElement(CAMPAIGN_TYPE_DROPDOWN);
};

ReportsPage.prototype.getDSPCampaignType = function() {
    return this.getElement(DSP_CAMPAIGN_TYPE);
};

ReportsPage.prototype.getSSPCampaignType = function() {
    return this.getElement(SSP_CAMPAIGN_TYPE);
};

ReportsPage.prototype.getSplitsDropDown = function() {
    return this.getElement(SPLITS_DROPDOWN);
};

ReportsPage.prototype.getCampaignIdOpt = function() {
    return this.getElement(CAMPAIGN_ID_OPT);
};

ReportsPage.prototype.getLineItemIdOpt = function() {
    return this.getElement(LINE_ITEM_ID_OPT);
};

ReportsPage.prototype.getDemandTypeOpt = function() {
    return this.getElement(DEMAND_TYPE_OPT);
};

ReportsPage.prototype.getAdvertiserIdOpt = function() {
    return this.getElement(ADVERTISER_ID_OPT);
};

ReportsPage.prototype.getAdvertiserNameOpt = function() {
    return this.getElement(ADVERTISER_NAME_OPT);
};

ReportsPage.prototype.getCampaignNameOpt = function() {
    return this.getElement(CAMPAIGN_NAME_OPT);
};

ReportsPage.prototype.getLineItemNameOpt = function() {
    return this.getElement(LINE_ITEM_NAME_OPT);
};

ReportsPage.prototype.getCreativeIdOpt = function() {
    return this.getElement(CREATIVE_ID_OPT);
};

ReportsPage.prototype.getCreativeNameOpt = function() {
    return this.getElement(CREATIVE_NAME_OPT);
};

ReportsPage.prototype.getPublisherIdOpt = function() {
    return this.getElement(PUBLISHER_ID_OPT);
};

ReportsPage.prototype.getPublisherDomainOpt = function() {
    return this.getElement(PUBLISHER_DOMAIN_OPT);
};

ReportsPage.prototype.getPublisherNameOpt = function() {
    return this.getElement(PUBLISHER_NAME_OPT);
};

ReportsPage.prototype.getDeviceTypeOpt = function() {
    return this.getElement(DEVICE_TYPE_OPT);
};

ReportsPage.prototype.getOSOpt = function() {
    return this.getElement(OS_OPT);
};

ReportsPage.prototype.getOrderIdOpt = function() {
    return this.getElement(ORDER_ID_OPT);
};

ReportsPage.prototype.getUPAOpt = function() {
    return this.getElement(UPA_OPT);
};

ReportsPage.prototype.getClearSelectionLink = function() {
    return this.getLastElement(CLEAR_SELECTION_LINK);
};

ReportsPage.prototype.getSelectAllLink = function() {
    return this.getElement(SELECT_ALL_LINK);
};

ReportsPage.prototype.getImpressionsCheckBox = function() {
    return this.getElement(IMPRESSIONS_CHK_BOX);
};

ReportsPage.prototype.getClicksCheckBox = function() {
    return this.getElement(CLICKS_CHK_BOX);
};

ReportsPage.prototype.getConversionsCheckBox = function() {
    return this.getElement(CONVERSIONS_CHK_BOX);
};

ReportsPage.prototype.getAddInexactSplitsLink = function() {
    return this.getElement(ADD_INEXACT_SPLITS);
};

ReportsPage.prototype.getAddInexactSplitsButton = function() {
    return this.getElement(INEXACT_SPLITS_DROPDOWN);
};

ReportsPage.prototype.getAddAFilterLink = function() {
    return this.getElement(ADD_A_FILTER);
};

ReportsPage.prototype.getAgeOpt = function() {
    return this.getElement(AGE_OPT);
};

ReportsPage.prototype.getGenderOpt = function() {
    return this.getElement(GENDER_OPT);
};

ReportsPage.prototype.getCountryOpt = function() {
    return this.getElement(COUNTRY_OPT);
};

ReportsPage.prototype.getRegionOpt = function() {
    return this.getElement(REGION_OPT);
};

ReportsPage.prototype.getMetroOpt = function() {
    return this.getElement(METRO_OPT);
};

ReportsPage.prototype.getBrowserOpt = function() {
    return this.getElement(BROWSER_OPT);
};

ReportsPage.prototype.getWarningMessage = function() {
    return this.getElement(WARNING_ALERT);
};

ReportsPage.prototype.getAddOtherFilterButton = function() {
    return this.getElement(OTHER_FILTER_BUTTON);
};

ReportsPage.prototype.getCreativeSizeOpt = function() {
    return this.getElement(CREATIVE_SIZE_OPT);
};

ReportsPage.prototype.getMetroCountryRegionOpt = function() {
    return this.getElement(METRO_COUNTRY_REGION_OPT);
};

ReportsPage.prototype.getDSPFeeCheckBox = function() {
    return this.getElement(DSP_FEE_CHK_BOX);
};

ReportsPage.prototype.getAdvertiserSpendCheckBox = function() {
    return this.getElement(ADV_SPEND_CHK_BOX);
};

ReportsPage.prototype.getPostViewConvCheckBox = function() {
    return this.getElement(PVC_CHK_BOX);
};

ReportsPage.prototype.getGrossECPMCheckBox = function() {
    return this.getElement(GROSS_ECPM_CHK_BOX);
};

ReportsPage.prototype.getCTRCheckBox = function() {
    return this.getElement(CTR_CHK_BOX);
};

ReportsPage.prototype.getCCRCheckBox = function() {
    return this.getElement(CCR_CHK_BOX);
};

ReportsPage.prototype.getECPACheckBox = function() {
    return this.getElement(ECPA_CHK_BOX);
};

ReportsPage.prototype.getECPCCheckBox = function() {
    return this.getElement(ECPC_CHK_BOX);
};

// native report
ReportsPage.prototype.getReportTypeText = function() {
    this.waitUntilVisible(REPORT_TYPE_TEXT);
    return this.findElement(REPORT_TYPE_TEXT);
};

ReportsPage.prototype.getRerportTypeDropdown = function() {
    this.waitUntilVisible(REPORT_TYPE_DROPDOWN);
    return this.findElement(REPORT_TYPE_DROPDOWN);
};

ReportsPage.prototype.getNativeOption = function() {
    this.waitUntilVisible(NATIVE_OPTION);
    return this.findElement(NATIVE_OPTION);
};

ReportsPage.prototype.getCustomOption = function() {
    this.waitUntilVisible(CUSTOM_OPTION);
    return this.findElement(CUSTOM_OPTION);
};

ReportsPage.prototype.getQueryRangeText = function() {
    this.waitUntilVisible(QUERY_RANGE_TEXT);
    return this.findElement(QUERY_RANGE_TEXT);
};

ReportsPage.prototype.getQueryRangeDropdown = function() {
    this.waitUntilVisible(QUERY_RANGE_DROPDOWN);
    return this.findElement(QUERY_RANGE_DROPDOWN);
};

ReportsPage.prototype.getGranularityText = function() {
    this.waitUntilVisible(GRANULARITY_TEXT);
    return this.findElement(GRANULARITY_TEXT);
};

ReportsPage.prototype.getGranularityDropdown = function() {
    this.waitUntilVisible(GRANULARITY_DROPDOWN);
    return this.findElement(GRANULARITY_DROPDOWN);
};

ReportsPage.prototype.getWeekToDateOption = function() {
    this.waitUntilVisible(WEEK_TO_DATE_OPTION);
    return this.findElement(WEEK_TO_DATE_OPTION);
};

ReportsPage.prototype.getMonthToDateOption = function() {
    this.waitUntilVisible(MONTH_TO_DATE_OPTION);
    return this.findElement(MONTH_TO_DATE_OPTION);
};

ReportsPage.prototype.getQarterToDateOption = function() {
    this.waitUntilVisible(QARTER_TO_DATE_OPTION);
    return this.findElement(QARTER_TO_DATE_OPTION);
};

ReportsPage.prototype.getYearToDateOption = function() {
    this.waitUntilVisible(YEAR_TO_DATE_OPTION);
    return this.findElement(YEAR_TO_DATE_OPTION);
};

ReportsPage.prototype.getYesterdayOption = function() {
    this.waitUntilVisible(YESTERDAY_OPTION);
    return this.findElement(YESTERDAY_OPTION);
};

ReportsPage.prototype.getPast7DaysOption = function() {
    this.waitUntilVisible(PAST_7_DAYS_OPTION);
    return this.findElement(PAST_7_DAYS_OPTION);
};

ReportsPage.prototype.getPast30DaysOption = function() {
    this.waitUntilVisible(PAST_30_DAYS_OPTION);
    return this.findElement(PAST_30_DAYS_OPTION);
};

ReportsPage.prototype.getPast90DaysOption = function() {
    this.waitUntilVisible(PAST_90_DAYS_OPTION);
    return this.findElement(PAST_90_DAYS_OPTION);
};

ReportsPage.prototype.getLastMonthOption = function() {
    this.waitUntilVisible(LAST_MONTH_OPTION);
    return this.findElement(LAST_MONTH_OPTION);
};

ReportsPage.prototype.getDateRangeOption = function() {
    this.waitUntilVisible(DATE_RANGE_OPTION);
    return this.findElement(DATE_RANGE_OPTION);
};

ReportsPage.prototype.getDayOption = function() {
    this.waitUntilVisible(DAY_OPTION);
    return this.findElement(DAY_OPTION);
};

ReportsPage.prototype.getWeekOption = function() {
    this.waitUntilVisible(WEEK_OPTION);
    return this.findElement(WEEK_OPTION);
};

ReportsPage.prototype.getMonthOption = function() {
    this.waitUntilVisible(MONTH_OPTION);
    return this.findElement(MONTH_OPTION);
};

ReportsPage.prototype.getAllOption = function() {
    this.waitUntilVisible(ALL_OPTION);
    return this.findElement(ALL_OPTION);
};

ReportsPage.prototype.getStartDateInput = function() {
    this.waitUntilVisible(START_DATE_INPUT);
    return this.findElement(START_DATE_INPUT);
};

ReportsPage.prototype.getEndDateInput = function() {
    this.waitUntilVisible(END_DATE_INPUT);
    return this.findElement(END_DATE_INPUT);
};

ReportsPage.prototype.getAddScheduleLink = function() {
    this.waitUntilVisible(ADD_A_SCHEDULE_LINK);
    return this.findElement(ADD_A_SCHEDULE_LINK);
};

ReportsPage.prototype.getCloseScheduleButton = function() {
    this.waitUntilVisible(CLOSE_SCHEDULE_BUTTON);
    return this.findElement(CLOSE_SCHEDULE_BUTTON);
};

ReportsPage.prototype.getDeliveryFrequencyDropdown = function() {
    this.waitUntilVisible(DELIVERY_FREQUENCY_DROPDOWN);
    return this.findElement(DELIVERY_FREQUENCY_DROPDOWN);
};

ReportsPage.prototype.getStartDeliveryDurationInput = function() {
    this.waitUntilVisible(START_DELIVERY_DURATION);
    return this.findElement(START_DELIVERY_DURATION);
};

ReportsPage.prototype.getEndDeliveryDurationInput = function() {
    this.waitUntilVisible(END_DELIVERY_DURATION);
    return this.findElement(END_DELIVERY_DURATION);
};

ReportsPage.prototype.getDeliveryTimeDropdown = function() {
    this.waitUntilVisible(DELIVERY_TIME_DROPDOWN);
    return this.findElement(DELIVERY_TIME_DROPDOWN);
};

ReportsPage.prototype.getReportFromTable = function() {
    return this.getElement(TABLE_FIRST_NAME);
};

ReportsPage.prototype.waitUntilSaveButtonEnabled = function() {
    return this.waitUntilEnabled(SAVE_REPORT_BUTTON);
};

ReportsPage.prototype.waitUntilSaveButtonDisabled = function() {
    return this.waitUntilDisabled(SAVE_REPORT_BUTTON);
};

// Clicks
ReportsPage.prototype.setReportName = function(name){
    this.getElement(REPORT_NAME_TEXTBOX).clear();
    return this.getElement(REPORT_NAME_TEXTBOX).sendKeys(name);
};

ReportsPage.prototype.clickNewReport = function() {
    this.waitUntilVisible(CREATE_BUTTON);
    return this.click(CREATE_BUTTON);
};

ReportsPage.prototype.clickExitReportModal = function() {
    this.waitUntilVisible(EXIT_BUTTON);
    return this.click(EXIT_BUTTON);
};

ReportsPage.prototype.clickMyReportsTab = function() {
    this.waitUntilVisible(MY_REPORTS_TAB);
    return this.click(MY_REPORTS_TAB);
};

ReportsPage.prototype.clickAllReportsTab = function() {
    this.waitUntilVisible(ALL_REPORTS_TAB);
    return this.click(ALL_REPORTS_TAB);
};

ReportsPage.prototype.clickSaveReportButton = function() {
    this.waitUntilVisible(SAVE_REPORT_BUTTON);
    return this.click(SAVE_REPORT_BUTTON);
};

// publishers
ReportsPage.prototype.clickPublisherFilterDropdown = function() {
    this.waitUntilVisible(PUBLISHER_FILTER_DROPDOWN);
    return this.click(PUBLISHER_FILTER_DROPDOWN);
};

ReportsPage.prototype.clickByTemplateOption = function() {
    this.waitUntilVisible(BY_TEMPLATE);
    return this.click(BY_TEMPLATE);
};

ReportsPage.prototype.clickBySectionOption = function() {
    this.waitUntilVisible(BY_SECTION);
    return this.click(BY_SECTION);
};

ReportsPage.prototype.clickAddAllMyPublishersLink = function() {
    this.waitUntilVisible(ADD_ALL_MY_PUBLISHERS_LINK);
    return this.click(ADD_ALL_MY_PUBLISHERS_LINK);
};

ReportsPage.prototype.clickSelectPublishersLink = function() {
    this.waitUntilVisible(SELECT_PUBLISHERS_LINK);
    return this.click(SELECT_PUBLISHERS_LINK);
};

ReportsPage.prototype.clickFilterByInventoryLink = function() {
    this.waitUntilVisible(FILTER_BY_INVENTORY_LINK);
    return this.click(FILTER_BY_INVENTORY_LINK);
};

ReportsPage.prototype.clickExitChoosePublishersButton = function() {
    this.waitUntilVisible(EXIT_CHOOSE_PUBLISHERS_BUTTON);
    return this.click(EXIT_CHOOSE_PUBLISHERS_BUTTON);
};

ReportsPage.prototype.clickCancelChoosePublishersLink = function() {
    this.waitUntilVisible(CANCEL_CHOOSE_PUBLISHERS_LINK);
    return this.click(CANCEL_CHOOSE_PUBLISHERS_LINK);
};

ReportsPage.prototype.clickAddPublishersButton = function() {
    this.waitUntilVisible(ADD_PUBLISHERS_BUTTON);
    this.click(ADD_PUBLISHERS_BUTTON);
    return this.driver.sleep(oneSecTO);
};

ReportsPage.prototype.clickFirstOptionListed = function() {
    this.waitUntilVisible(FIRST_OPTION_LISTED);
    return this.click(FIRST_OPTION_LISTED);
};

ReportsPage.prototype.clickClearAllPopUpLink = function() {
    this.waitUntilVisible(CLEAR_ALL_POPUP_LINK);
    return this.click(CLEAR_ALL_POPUP_LINK);
};

ReportsPage.prototype.clickClearAllLink = function() {
    this.waitUntilVisible(CLEAR_ALL_LINK);
    return this.click(CLEAR_ALL_LINK);
};

// advertisers
ReportsPage.prototype.clickAdvertiserFilterDropdown = function() {
    this.waitUntilVisible(ADVERTISER_FILTER_DROPDOWN);
    return this.click(ADVERTISER_FILTER_DROPDOWN);
};

ReportsPage.prototype.clickSelectAdvertisersLink = function() {
    return this.waitAndClick(SELECT_ADVERTISERS_LINK);
};

ReportsPage.prototype.clickByCampaignOption = function() {
    this.waitUntilVisible(BY_CAMPAIGN_OPTION);
    return this.click(BY_CAMPAIGN_OPTION);
};

ReportsPage.prototype.clickByLineItemOption = function() {
    this.waitUntilVisible(BY_LINE_ITEM_OPTION);
    return this.click(BY_LINE_ITEM_OPTION);
};

ReportsPage.prototype.clickFilterByAdvertisersLink = function() {
    this.waitUntilVisible(FILTER_BY_ADVERTISERS_LINK);
    return this.click(FILTER_BY_ADVERTISERS_LINK);
};

ReportsPage.prototype.clickFilterByCampaignsLink = function() {
    this.waitUntilVisible(FILTER_BY_CAMPAIGNS_LINK);
    return this.click(FILTER_BY_CAMPAIGNS_LINK);
};

ReportsPage.prototype.clickAddAllMyAdvertisersLink = function() {
    return this.waitAndClick(ADD_ALL_MY_ADVERTISERS_LINK);
};

ReportsPage.prototype.clickAddAdvertisersButton = function() {
    this.getAddAdvertisersButton().click();
    return this.driver.sleep(1000);
};

ReportsPage.prototype.clickLA360ReportOption = function() {
    return this.waitAndClick(LA_360_OPTION);
};

ReportsPage.prototype.clickDSPCampaignType = function() {
    return this.getDSPCampaignType().click();
};

ReportsPage.prototype.clickSplitsDropDown = function() {
    return this.waitAndClick(SPLITS_DROPDOWN);
};

ReportsPage.prototype.clickAddInexactSplitsLink = function() {
    return this.waitAndClick(ADD_INEXACT_SPLITS);
};

ReportsPage.prototype.clickAddAFilterLink = function() {
    return this.waitAndClick(ADD_A_FILTER);
};

ReportsPage.prototype.clickInexactSplitsButton = function() {
    return this.waitAndClick(INEXACT_SPLITS_DROPDOWN);
};

ReportsPage.prototype.clickCloseInexactSplitsButton = function() {
    return this.waitAndClick(CLOSE_INEXACT_BTN);
};

ReportsPage.prototype.clickAgeOpt = function() {
    return this.waitAndClick(AGE_OPT);
};

ReportsPage.prototype.clickGenderOpt = function() {
    return this.waitAndClick(GENDER_OPT);
};

ReportsPage.prototype.clickAddOtherFilterButton = function() {
    return this.waitAndClick(OTHER_FILTER_BUTTON);
};

ReportsPage.prototype.clickCreativeSizeOpt = function() {
    return this.waitAndClick(CREATIVE_SIZE_OPT);
};

ReportsPage.prototype.clickMetroCountryRegionOpt = function() {
    return this.waitAndClick(METRO_COUNTRY_REGION_OPT);
};

ReportsPage.prototype.clickOSOpt = function() {
    return this.waitAndClick(OS_OPT);
};

ReportsPage.prototype.clickBrowserOpt = function() {
    return this.waitAndClick(BROWSER_OPT);
};

ReportsPage.prototype.clickDeviceTypeOpt = function() {
    return this.waitAndClick(DEVICE_TYPE_OPT);
};

// native report
ReportsPage.prototype.clickReportTypeDropdown = function() {
    this.waitUntilVisible(REPORT_TYPE_DROPDOWN);
    return this.click(REPORT_TYPE_DROPDOWN);
};

ReportsPage.prototype.clickNativeOption = function() {
    this.waitUntilVisible(NATIVE_OPTION);
    return this.click(NATIVE_OPTION);
};

ReportsPage.prototype.clickQueryRangeDropdown = function() {
    this.waitUntilVisible(QUERY_RANGE_DROPDOWN);
    return this.click(QUERY_RANGE_DROPDOWN);
};

ReportsPage.prototype.clickGranularityDropdown = function() {
    this.waitUntilVisible(GRANULARITY_DROPDOWN);
    return this.click(GRANULARITY_DROPDOWN);
};

ReportsPage.prototype.clickCustomOption = function() {
    this.waitUntilVisible(CUSTOM_OPTION);
    return this.click(CUSTOM_OPTION);
};

ReportsPage.prototype.clickDateRangeOption = function() {
    this.waitUntilVisible(DATE_RANGE_OPTION);
    return this.click(DATE_RANGE_OPTION);
};

ReportsPage.prototype.clickAddScheduleLink = function() {
    this.waitUntilVisible(ADD_A_SCHEDULE_LINK);
    return this.click(ADD_A_SCHEDULE_LINK);
};

ReportsPage.prototype.clickCloseScheduleButton = function() {
    this.waitUntilVisible(CLOSE_SCHEDULE_BUTTON);
    return this.click(CLOSE_SCHEDULE_BUTTON);
};

ReportsPage.prototype.clickDeliveryFrequencyDropdown = function() {
    this.waitUntilVisible(DELIVERY_FREQUENCY_DROPDOWN);
    return this.click(DELIVERY_FREQUENCY_DROPDOWN);
};

ReportsPage.prototype.clickDeliveryTimeDropdown = function() {
    this.waitUntilVisible(DELIVERY_TIME_DROPDOWN);
    return this.click(DELIVERY_TIME_DROPDOWN);
};

ReportsPage.prototype.clickFirstVisibleOption = function(){
    return this.waitAndClick(FIRST_LI_DROPDOWN_OPT);
};

ReportsPage.prototype.setStartDate = function(date){
    this.waitAndClick(START_DATE_INPUT);
    this.getElement(START_DATE_INPUT).clear();
    this.getElement(START_DATE_INPUT).sendKeys(date);
    return this;
};

ReportsPage.prototype.setEndDate = function(date){
    this.waitAndClick(END_DATE_INPUT);
    this.getElement(END_DATE_INPUT).clear();
    this.getElement(END_DATE_INPUT).sendKeys(date);
    return this;
};

ReportsPage.prototype.clickDemandType = function(){
    return this.waitAndClick(DEMAND_TYPE_OPT);
};

ReportsPage.prototype.clickImpressionsCheckBox = function(){
    return this.waitAndClick(IMPRESSIONS_CHK_BOX);
};

ReportsPage.prototype.searchReport = function(value) {
    this.waitUntilVisible(SEARCH_REPORTS_INPUT);
    this.clear(SEARCH_REPORTS_INPUT);
    this.sendKeys(SEARCH_REPORTS_INPUT, value);
    this.sendKeys(SEARCH_REPORTS_INPUT, key.ENTER);
    return this.driver.sleep(2000);
};

module.exports = ReportsPage;
