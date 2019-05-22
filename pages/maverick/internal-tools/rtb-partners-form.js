'use strict';

// Common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const key = webdriver.Key;


// elements
// title and cards titles

const CREATE_TITLE = By.css('div.column--8 > h4');
const SUBTITLE_BASIC_DETAILS = By.xpath('//h3[text() = "Basic Details"]');
const SUBTITLE_TECH_SPECS = By.xpath('//h3[text() = "Technical Specs"]');
const SUBTITLE_DEVICE_BROWSER = By.xpath('//h3[text() = "Device & Browser"]');
const SUBTITLE_BUSINESS_SETTINGS = By.xpath('//h3[text() = ' +
    '"Business Settings"]');
const SUBTITLE_DATA_CENTER = By.xpath('//h3[text() = "Data Centers"]');

// basic details card

const NAME_LABEL = By.css('section-card:nth-child(1) div > div > ' +
    'div:nth-child(1) div > div._form--label > label');
const NAME_INPUT = By.css('section-card:nth-child(1) div:nth-child(1) ' +
    'div._form--control > input');
const STATUS_LABEL = By.css('section-card:nth-child(1) div:nth-child(3) > ' +
    'div._form--label > label');
const STATUS_BUTTON_DROPDOWN = By.css('div:nth-child(3) > ' +
    'div._form--control > select-dropdown button');
const STATUS_DROPDOWN_ACTIVE = By.xpath('//span[text() = "Active"]');
const STATUS_DROPDOWN_ACTIVE_CONST = 'Active';
const STATUS_DROPDOWN_INACTIVE = By.xpath('//span[text() = "Inactive"]');
const STATUS_DROPDOWN_INACTIVE_CONST = 'Inactive';
const BID_TYPE_LABEL = By.css(' section-card:nth-child(1) > ' +
    'div div:nth-child(5) > div._form--label > label');
const BID_TYPE_BUTTON_DROPDOWN = By.css('multi-select[name="bidTypes"] ' +
    'div button div span');
const BID_TYPE_DROPDOWN_DISPLAY_INPUT = By.css('div:nth-child(5) ' +
    'li:nth-child(1) > label');
const BID_TYPE_DROPDOWN_DISPLAY_TEXT = By.xpath('//span[text() = "Display"]');
const STATUS_DROPDOWN_DISPLAY_CONST = 'Display';
const BID_TYPE_DROPDOWN_NATIVE_INPUT = By.css('div:nth-child(5) ' +
    'li:nth-child(2) > label');
const BID_TYPE_DROPDOWN_NATIVE_TEXT = By.xpath('//span[text() = "Native"]');
const STATUS_DROPDOWN_NATIVE_CONST = 'Native';
const PARENT_DSP_LABEL = By.css('div:nth-child(7) > div._form--label > label');
const PARENT_DSP_INPUT = By.css('searchable-select-single input');
const MATCH_URL_LABEL = By.xpath('//label[contains(text(),"Match URL")]');
const MATCH_URL_INPUT = By.css('textarea[name="matchUrl"]');
const MD5_CHECKBOX_INPUT = By.css('div:nth-child(11) label');
const MD5_CHECKBOX_INPUT_CHECK = By.css('input[name="md5uuid"]');
const MD5_CHECKBOX_TEXT = By.xpath('//span[text() = "MD5 as UUID"]');
const MATCHED_USERS_CHECKBOX_INPUT = By.xpath(
    '//input[contains(@name,"matchedUsersOnly")]/..');
const MATCHED_USERS_CHECKBOX_INPUT_CHECK = By.css('input' +
    '[name="matchedUsersOnly"]');
const MATCHED_USERS_CHECKBOX_TEXT = By.xpath('//span[text() = ' +
    '"Matched Users Only"]');
const CREATIVE_SIZE_LABEL = By.xpath(
    '//tags-input[contains(@name,"iabSizes")]/../../div/label');
const CREATIVE_SIZE_INPUT = By.xpath(
    '//tags-input[contains(@name,"iabSizes")]/search-input/div/input');
const CREATIVE_SIZE_SELECTED_OPTION = By.css('div:nth-child(11) button');
const CREATIVE_SIZE_SELECTED_OPTION_CLOSE = By.css('div:nth-child(11) i');
const PROTOCOL_LABEL = By.css('div:nth-child(15) label');
const PROTOCOL_BUTTON_DROPDOWN = By.css(
    'select-dropdown[name="protocol"] div button span');
const PROTOCOL_DROPDOWN_OPEN_RTB_DISPLAY = By.xpath('//span[text() = ' +
    '"OpenRTB Display"]');
const PROTOCOL_DROPDOWN_CRITEO = By.xpath('//span[text() = "Criteo"]');
const PROTOCOL_DROPDOWN_OPEN_RTB_NATIVE_ENC = By.xpath('//span[text() = ' +
    '"OpenRTB Native Enc v1.1"]');
const PROTOCOL_DROPDOWN_OPEN_RTB_NATIVE_ENC_2 = By.xpath('//span[text() = ' +
    '"OpenRTB Native Enc v1.2"]');
const PROTOCOL_DROPDOWN_OPEN_RTB_NATIVE = By.xpath('//span[text() = ' +
    '"OpenRTB Native v1.1"]');
const PROTOCOL_DROPDOWN_RTB_DISPLAY_CONST = 'OpenRTB Display';
const PROTOCOL_DROPDOWN_CRITEO_CONST = 'Criteo';
const PROTOCOL_DROPDOWN_RTB_NATIVE_ENC_CONST = 'OpenRTB Native Enc v1.1';
const PROTOCOL_DROPDOWN_RTB_NATIVE_ENC_CONST2 = 'OpenRTB Native Enc v1.2';
const PROTOCOL_DROPDOWN_RTB_NATIVE_CONST = 'OpenRTB Native v1.1';
const OPEN_RTB_HEADER_LABEL = By.xpath(
    '//label[contains(text(),"OpenRTB Header")]');
const OPEN_RTB_HEADER_BUTTON_DROPDOWN = By.css('div:nth-child(16) ' +
    'select-dropdown > div > button');
const EXTRA_OFFER_LABEL = By.css('div:nth-child(17) label');
const EXTRA_OFFER_BUTTON = By.css('select-dropdown[name="extraOfferMax"]' +
    ' div button span');
const PARENT_DSP_SEARCH = 'initest';
const PARENT_DSP_FIRST_ROW = By.css('li:nth-child(1) > span > a');
const PARENT_DSP_FILTER = By.
    css('div.input-field--cover > span:nth-child(2)');
const PARENT_DSP_FILTER_CLOSE = By.
    css('span.pull-right.icon.icon--exit.icon-exit');
let ROWS_NUMBER = By.css('.dropdown--container > ul > li');
const DROPBOX_FIRST_ROW = By.css('ul > li:nth-child(1) > label > span');
const DROPBOX_SECOND_ROW = By.css('ul > li:nth-child(2) > label > span');

// technical specs

const SEND_SENSITIVE_CHECKBOX_INPUT = By.css('section > div > div > ' +
    'div:nth-child(1) > div._form--control > label');
const SEND_SENSITIVE_CHECKBOX_CHECK = By.css('section > div > div > ' +
    'div:nth-child(1) > div._form--control > label input');
const SEND_SENSITIVE_CHECKBOX_TEXT = By.xpath('//span[text() = ' +
    '"Send Sensitive Details"]');
const ALLOW_REDIRECTS_IN = By.xpath('//input[@name="allowRedirects"]/../input');
const ALLOW_REDIRECTS_TXT = By.xpath('//input[@name="allowRedirects"]/../span');
const ALLOW_REDIRECTS_BOX = By.xpath('//input[@name="allowRedirects"]/..');
const HTTP_REQUEST_LABEL = By.css('div:nth-child(3) > ._form--label > label');
const HTTP_REQUEST_INPUT = By.css('div:nth-child(2) ' +
    '._form--control--small > input');
const TRACKING_TIME_INPUT = By.css('input[name=trackingType]');
const TRACKING_TIME_LABEL = By.xpath('//label[contains(text(),"Tracking")]');
const TRACKING_EXT_SSP_INPUT = By.css('input[name=extSsp]');
const TRACKING_EXT_SSP_LABEL = By.xpath('//label[contains(text(),"Ext SSP")]');
const AUCTION_TYPE_BUTTON = By.css('select-dropdown[name=auctionType]' +
    ' > div > button');
const AUCTION_TYPE_LABEL = By.xpath('//label[contains(text(),"Auction Type")]');
const AUCTION_TYPE_1 = By.css('div > div > ul > li:nth-child(1) > a');
const AUCTION_TYPE_2 = By.css('div > div > ul > li:nth-child(2) > a');
const AUCTION_TYPE_3 = By.css('div > div > ul > li:nth-child(3) > a');
const AUCTION_LOST_NOTIFICACTION_INPUT = By.css(
    'input[name=lossNotificationUrl]');
const AUCTION_LOST_NOTIFICATION_LABEL = By.xpath('//label[contains(text(),' +
    '"Loss Notification URL")]');
const IFAAS_URL_ONE_LABEL = By.xpath('//label[contains(text(),' +
    '"IFaaS URL One")]');
const IFAAS_URL_ONE_INPUT = By.css('textarea[name=ifaasUrlOne]');
const IFAAS_URL_TWO_LABEL = By.xpath('//label[contains(text(),' +
    '"IFaaS URL Two")]');
const IFAAS_URL_TWO_INPUT = By.css('textarea[name=ifaasUrlTwo]');

// device and browser

const DEVICE_LABEL = By.css(' section-card:nth-child(5) > ' +
    'div div:nth-child(1) > div._form--label > label');
const DEVICE_BUTTON_DROPDOWN = By.css('multi-select[name="device"] ' +
    'div button div span');
const DEVICE_DROPDOWN_PC_INPUT = By.css('section-card:nth-child(5) ' +
    'div:nth-child(1) li:nth-child(1) > label');
const DEVICE_DROPDOWN_PC_TEXT = By.xpath('//span[text() = "PC"]');
const DEVICE_DROPDOWN_PHONE_INPUT = By.css('section-card:nth-child(5) ' +
    'div:nth-child(1) li:nth-child(2) > label');
const DEVICE_DROPDOWN_PHONE_TEXT = By.xpath('//span[text() = "Phone"]');
const DEVICE_DROPDOWN_TABLET_INPUT = By.css('section-card:nth-child(5) ' +
    'div:nth-child(1) li:nth-child(3) > label');
const DEVICE_DROPDOWN_TABLET_TEXT = By.xpath('//span[text() = "Tablet"]');
const DEVICE_MAKER_LABEL = By.css('section-card:nth-child(5) ' +
    'div:nth-child(3) > div._form--label > label');
const DEVICE_MAKER_BUTTON_DROPDOWN = By.css('multi-select[name="deviceMaker"]' +
    ' div button div span');
const BROWSER_LABEL = By.css('section-card:nth-child(5) ' +
    'div:nth-child(5) label');
const BROWSER_BUTTON_DROPDOWN = By.css('multi-select[name="browser"]' +
    ' div button div span');
const OS_LABEL = By.css('section-card:nth-child(5) ' +
    'div:nth-child(7) label');
const OS_BUTTON_DROPDOWN = By.css('multi-select[name="os"]' +
    ' div button div span');
const GEO_TARGETING_LABEL = By.xpath('//location-targeting/parent::div' +
    '/parent::div/div/label');
const GEO_TARGETING_CONTAINER = By.css('location-targeting open-book div div');
const GEO_TARGETING_SEARCH = By.css('search[placeholder="Search Locations"] ' +
    'div input');
const GEO_TARGETING_DROPBOX = By.css('div:nth-child(2) > div > div > div > ' +
    'select-dropdown > div > button');
const GEO_TARGETING_FIRST_COUNTRY = By.css('div:nth-child(2) > div > ' +
    'div > list > div > ul > li:nth-child(1)');
const GEO_TARGETING_SECOND_COUNTRY = By.css('div:nth-child(2) > div > ' +
    'div > list > div > ul > li:nth-child(1)');
const GEO_TARGETING_DROPBOX_CLEAR = By.css('div:nth-child(2) > ' +
    'div:nth-child(2) > div > div > a');
const GEO_TARGETING_DROPBOX_SELECTED_ITEMS = By.css('div:nth-child(2) > ' +
    'div > div > span');

// business settings

const PROGRAMATIC_FEE_LABEL = By.css('section-card:nth-child(7) ' +
    'div:nth-child(1) > div._form--label > label');
const PROGRAMATIC_FEE_INPUT = By.css('section-card:nth-child(7) ' +
    'div:nth-child(1) > ._form--control--small > input');
const BUDGET_LABEL = By.css('section-card:nth-child(7) ' +
    'div:nth-child(3) > div._form--label > label');
const BUDGET_INPUT = By.css('section-card:nth-child(7) ' +
    'div:nth-child(3) > ._form--control--small > input');
const BUDGET_DAILY_CAP_LABEL = By.css('section-card:nth-child(7) ' +
    'div:nth-child(5) > div._form--label > label');
const BUDGET_DAILY_CAP_INPUT = By.css('section-card:nth-child(7) ' +
    'div:nth-child(5) > ._form--control--small > input');
const DEAL_DIRECT_FEE_LABEL = By.css('section-card:nth-child(7) ' +
    'div:nth-child(7) > div._form--label > label');
const DEAL_DIRECT_FEE_INPUT = By.css('section-card:nth-child(7) ' +
    'div:nth-child(7) > ._form--control--small > input');
const REDUCE_BID_INPUT = By.xpath('//input[@name="reduceBid"]/parent::label');
const REDUCE_BID_TEXT = By.xpath('//span[text() = "Reduce Bid"]');

// data centers

const DATA_CENTER_TO_ADD = By.css('div.padding-large > section > ' +
    'div.relative > div:nth-child(1) > div > h4');
const DATA_CENTER_TO_ADD_CLOSE = By.id('grant-close');
const DATA_CENTER_LABEL = By.css('div:nth-child(2) > div > ' +
    'div:nth-child(1) > div > div._form--label > label');
const US_EAST_SELECTION = By.css('div._form--control > div:nth-child(1) > ' +
    'label');
const US_EAST_INPUT = By.css('div._form--control > div:nth-child(1) > ' +
    'label > input');
const US_EAST_TEXT = By.xpath('//span[text() = "US-East"]');
const US_WEST_SELECTION = By.css('div._form--control > div:nth-child(2) > ' +
    'label');
const US_WEST_TEXT = By.xpath('//span[text() = "US-West"]');
const US_EMEA_SELECTION = By.css('div._form--control > div:nth-child(3) > ' +
    'label');
const US_EMEA_TEXT = By.xpath('//span[text() = "EMEA (Frankfurt)"]');
const US_APAC_SELECTION = By.css('div._form--control > div:nth-child(4) > ' +
    'label');
const US_APAC_TEXT = By.xpath('//span[text() = "APAC (Singapore)"]');
const US_LATAM_SELECTION = By.css('div._form--control > div:nth-child(5) > ' +
    'label');
const US_LATAM_TEXT = By.xpath('//span[text() = "LATAM"]');
const QPS_LABEL = By.css('div:nth-child(2) > div > ' +
    'div:nth-child(1) > div > div._form--label > label');
const QPS_INPUT = By.css('section-card:nth-child(9) div:nth-child(2) ' +
    'div:nth-child(3) > div._form--control._form--control--small > input');
const BID_URL_LABEL = By.css('section-card:nth-child(9) div:nth-child(2) > ' +
    'div > div:nth-child(5) > div > div._form--label > label');
const BID_URL_INPUT = By.css('div.relative > div:nth-child(2) > div > ' +
    'div:nth-child(5) > div > div._form--control > input');
const ADD_DATA_CENTER_LINK = By.css('section > div._form--group > div > ' +
    'div > div > button');


// buttons

const CREATE_RTB_PARTNER_BUTTON = By.css('div.modal---footer > div > ' +
    'footer > div > button');
const EDIT_RTB_PARTNER_BUTTON = By.css('div.modal---footer > div > ' +
    'footer > div > button');
const CLOSE_WITHOUT_SAVING_BUTTON = By.css('div.modal---header > div > ' +
    'div > div.column--4 > button');


function RtbPartnersFormPage(webdriver){
    BasePage.call(this, webdriver);
}
RtbPartnersFormPage.prototype = Object.create(BasePage.prototype);
RtbPartnersFormPage.prototype.constructor = RtbPartnersFormPage;

// getters
// title and cards titles

RtbPartnersFormPage.prototype.getCreateTitle = function(){
    return this.getElement(CREATE_TITLE);
};
RtbPartnersFormPage.prototype.getBasicDetailsTitle = function(){
    return this.getElement(SUBTITLE_BASIC_DETAILS);
};
RtbPartnersFormPage.prototype.getTechSpecsTitle = function(){
    return this.getElement(SUBTITLE_TECH_SPECS);
};
RtbPartnersFormPage.prototype.getDeviceBrowserTitle = function(){
    return this.getElement(SUBTITLE_DEVICE_BROWSER);
};
RtbPartnersFormPage.prototype.getBusinessSettingsTitle = function(){
    return this.getElement(SUBTITLE_BUSINESS_SETTINGS);
};
RtbPartnersFormPage.prototype.getDataCenterTitle = function(){
    return this.getElement(SUBTITLE_DATA_CENTER);
};

// basic details cards

RtbPartnersFormPage.prototype.getNameLabel = function(){
    return this.getElement(NAME_LABEL);
};
RtbPartnersFormPage.prototype.getNameInput = function(){
    return this.getElement(NAME_INPUT);
};
RtbPartnersFormPage.prototype.getStatusLabel = function(){
    return this.getElement(STATUS_LABEL);
};
RtbPartnersFormPage.prototype.getStatusButtonDropdown = function(){
    return this.getElement(STATUS_BUTTON_DROPDOWN);
};
RtbPartnersFormPage.prototype.getStatusDropdownActive = function(){
    return this.getElement(STATUS_DROPDOWN_ACTIVE);
};
RtbPartnersFormPage.prototype.getStatusActive = function(){
    return STATUS_DROPDOWN_ACTIVE_CONST;
};
RtbPartnersFormPage.prototype.getStatusInactive = function(){
    return STATUS_DROPDOWN_INACTIVE_CONST;
};
RtbPartnersFormPage.prototype.getStatusDropdownInactive = function(){
    return this.getElement(STATUS_DROPDOWN_INACTIVE);
};
RtbPartnersFormPage.prototype.getBidTypeLabel = function(){
    return this.getElement(BID_TYPE_LABEL);
};
RtbPartnersFormPage.prototype.getBidTypeDropdownButton = function(){
    return this.getElement(BID_TYPE_BUTTON_DROPDOWN);
};
RtbPartnersFormPage.prototype.getBidTypeDropdownDisplayInput = function(){
    return this.getElement(BID_TYPE_DROPDOWN_DISPLAY_INPUT);
};
RtbPartnersFormPage.prototype.getBidTypeDropdownDisplayText = function(){
    return this.getElement(BID_TYPE_DROPDOWN_DISPLAY_TEXT);
};
RtbPartnersFormPage.prototype.getBidTypeDropdownNativeInput = function(){
    return this.getElement(BID_TYPE_DROPDOWN_NATIVE_INPUT);
};
RtbPartnersFormPage.prototype.getBidTypeDropdownNativeText = function(){
    return this.getElement(BID_TYPE_DROPDOWN_NATIVE_TEXT);
};
RtbPartnersFormPage.prototype.getBidTypeDisplay = function(){
    return STATUS_DROPDOWN_DISPLAY_CONST;
};
RtbPartnersFormPage.prototype.getBidTypeNative = function(){
    return STATUS_DROPDOWN_NATIVE_CONST;
};
RtbPartnersFormPage.prototype.getParentDspLabel = function(){
    return this.getElement(PARENT_DSP_LABEL);
};
RtbPartnersFormPage.prototype.getParentDspInput = function(){
    return this.getElement(PARENT_DSP_INPUT);
};
RtbPartnersFormPage.prototype.getMatchUrlLabel = function(){
    return this.getElement(MATCH_URL_LABEL);
};
RtbPartnersFormPage.prototype.getMatchUrlInput = function(){
    return this.getElement(MATCH_URL_INPUT);
};
RtbPartnersFormPage.prototype.getMd5CheckboxInput = function(){
    return this.getElement(MD5_CHECKBOX_INPUT);
};
RtbPartnersFormPage.prototype.getMd5CheckboxCheck = function(){
    return this.findElement(MD5_CHECKBOX_INPUT_CHECK);
};
RtbPartnersFormPage.prototype.getMd5CheckboxText = function(){
    return this.getElement(MD5_CHECKBOX_TEXT);
};
RtbPartnersFormPage.prototype.getMatchedUsersCheckboxInput = function(){
    return this.getElement(MATCHED_USERS_CHECKBOX_INPUT);
};
RtbPartnersFormPage.prototype.getMatchedUsersCheckboxInputCheck = function(){
    return this.findElement(MATCHED_USERS_CHECKBOX_INPUT_CHECK);
};
RtbPartnersFormPage.prototype.getMatchedUsersCheckboxText = function(){
    return this.getElement(MATCHED_USERS_CHECKBOX_TEXT);
};
RtbPartnersFormPage.prototype.getCreativeSizeLabel = function(){
    return this.getElement(CREATIVE_SIZE_LABEL);
};
RtbPartnersFormPage.prototype.getCreativeSizeInput = function(){
    return this.getElement(CREATIVE_SIZE_INPUT);
};
RtbPartnersFormPage.prototype.getCreativeSizeSelectedOption = function(){
    return this.getElement(CREATIVE_SIZE_SELECTED_OPTION);
};
RtbPartnersFormPage.prototype.getCreativeSizeSelectedOptionClose = function(){
    return this.getElement(CREATIVE_SIZE_SELECTED_OPTION_CLOSE);
};
RtbPartnersFormPage.prototype.getProtocolLabel = function(){
    return this.getElement(PROTOCOL_LABEL);
};
RtbPartnersFormPage.prototype.getProtocolDropdownButton = function(){
    return this.getElement(PROTOCOL_BUTTON_DROPDOWN);
};
RtbPartnersFormPage.prototype.getProtocolDropdownOpenRtbDisplay = function(){
    return this.getElement(PROTOCOL_DROPDOWN_OPEN_RTB_DISPLAY);
};
RtbPartnersFormPage.prototype.getProtocolDropdownCriteo = function(){
    return this.getElement(PROTOCOL_DROPDOWN_CRITEO);
};
RtbPartnersFormPage.prototype.getProtocolDropdownOpenRtbNativeEnc = function(){
    return this.getElement(PROTOCOL_DROPDOWN_OPEN_RTB_NATIVE_ENC);
};
RtbPartnersFormPage.prototype.getProtocolDropdownOpenRtbNativeEnc2 = function(){
    return this.getElement(PROTOCOL_DROPDOWN_OPEN_RTB_NATIVE_ENC_2);
};
RtbPartnersFormPage.prototype.getProtocolDropdownOpenRtbNative = function(){
    return this.getElement(PROTOCOL_DROPDOWN_OPEN_RTB_NATIVE);
};
RtbPartnersFormPage.prototype.getProtocolRtbDisplay = function(){
    return PROTOCOL_DROPDOWN_RTB_DISPLAY_CONST;
};
RtbPartnersFormPage.prototype.getProtocolCriteo = function(){
    return PROTOCOL_DROPDOWN_CRITEO_CONST;
};
RtbPartnersFormPage.prototype.getProtocolRtbNativeEnc = function(){
    return PROTOCOL_DROPDOWN_RTB_NATIVE_ENC_CONST;
};
RtbPartnersFormPage.prototype.getProtocolRtbNativeEnc2 = function(){
    return PROTOCOL_DROPDOWN_RTB_NATIVE_ENC_CONST2;
};
RtbPartnersFormPage.prototype.getProtocolRtbNative = function(){
    return PROTOCOL_DROPDOWN_RTB_NATIVE_CONST;
};
RtbPartnersFormPage.prototype.getOpenRtbHeaderVersionLabel = function(){
    return this.getElement(OPEN_RTB_HEADER_LABEL);
};
RtbPartnersFormPage.prototype.getRtbHeaderVersionDropdownButton = function(){
    return this.getElement(OPEN_RTB_HEADER_BUTTON_DROPDOWN);
};

RtbPartnersFormPage.prototype.getExtraOfferLabel = function(){
    return this.getElement(EXTRA_OFFER_LABEL);
};
RtbPartnersFormPage.prototype.getExtraDropDownButton = function(){
    return this.getElement(EXTRA_OFFER_BUTTON);
};
RtbPartnersFormPage.prototype.getParentDspSearch = function() {
    return PARENT_DSP_SEARCH;
};

// technical specs

RtbPartnersFormPage.prototype.getSendSensitiveCheckboxInput = function(){
    return this.getElement(SEND_SENSITIVE_CHECKBOX_INPUT);
};
RtbPartnersFormPage.prototype.getSendSensitiveCheckboxCheck = function(){
    return this.findElement(SEND_SENSITIVE_CHECKBOX_CHECK);
};
RtbPartnersFormPage.prototype.getSendSensitiveCheckboxText = function(){
    return this.getElement(SEND_SENSITIVE_CHECKBOX_TEXT);
};
RtbPartnersFormPage.prototype.getSupportRedirectsCheckboxInput = function(){
    return this.getElement(ALLOW_REDIRECTS_IN);
};
RtbPartnersFormPage.prototype.getSupportRedirectsCheckboxText = function(){
    return this.getElement(ALLOW_REDIRECTS_TXT);
};
RtbPartnersFormPage.prototype.getSupportRedirectsCheckboxCheck = function(){
    return this.findElement(ALLOW_REDIRECTS_BOX);
};
RtbPartnersFormPage.prototype.getSendHttpRequestLabel = function(){
    return this.getElement(HTTP_REQUEST_LABEL);
};
RtbPartnersFormPage.prototype.getSendHttpRequestInput = function(){
    return this.getElement(HTTP_REQUEST_INPUT);
};
RtbPartnersFormPage.prototype.getTrackingTimeLabel = function(){
    return this.getElement(TRACKING_TIME_LABEL);
};
RtbPartnersFormPage.prototype.getTrackingTimeInput = function(){
    return this.getElement(TRACKING_TIME_INPUT);
};
RtbPartnersFormPage.prototype.getTrackingExtSspLabel = function(){
    return this.getElement(TRACKING_EXT_SSP_LABEL);
};
RtbPartnersFormPage.prototype.getTrackingExtSspInput = function(){
    return this.getElement(TRACKING_EXT_SSP_INPUT);
};
RtbPartnersFormPage.prototype.getAuctionTypeLabel = function(){
    return this.getElement(AUCTION_TYPE_LABEL);
};
RtbPartnersFormPage.prototype.getAuctionTypeDropbox = function(){
    return this.getElement(AUCTION_TYPE_BUTTON);
};
RtbPartnersFormPage.prototype.getAuctionType1 = function(){
    return this.getElement(AUCTION_TYPE_1);
};
RtbPartnersFormPage.prototype.getAuctionType2 = function(){
    return this.getElement(AUCTION_TYPE_2);
};
RtbPartnersFormPage.prototype.getAuctionLostNotifLabel = function(){
    return this.getElement(AUCTION_LOST_NOTIFICATION_LABEL);
};
RtbPartnersFormPage.prototype.getAuctionLostNotifInput = function(){
    return this.getElement(AUCTION_LOST_NOTIFICACTION_INPUT);
};
RtbPartnersFormPage.prototype.getIfaasUrlOneLabel = function(){
    return this.getElement(IFAAS_URL_ONE_LABEL);
};
RtbPartnersFormPage.prototype.getIfaasUrlOneInput = function(){
    return this.getElement(IFAAS_URL_ONE_INPUT);
};
RtbPartnersFormPage.prototype.getIfaasTwoLabel = function(){
    return this.getElement(IFAAS_URL_TWO_LABEL);
};
RtbPartnersFormPage.prototype.getIfaasTwoInput = function(){
    return this.getElement(IFAAS_URL_TWO_INPUT);
};

// device and browser

RtbPartnersFormPage.prototype.getDeviceLabel = function(){
    return this.getElement(DEVICE_LABEL);
};
RtbPartnersFormPage.prototype.getDeviceDropdownButton = function(){
    return this.getElement(DEVICE_BUTTON_DROPDOWN);
};
RtbPartnersFormPage.prototype.getDeviceDropdownPcInput = function(){
    return this.getElement(DEVICE_DROPDOWN_PC_INPUT);
};
RtbPartnersFormPage.prototype.getDeviceDropdownPcText = function(){
    return this.getElement(DEVICE_DROPDOWN_PC_TEXT);
};
RtbPartnersFormPage.prototype.getDeviceDropdownPhoneInput = function(){
    return this.getElement(DEVICE_DROPDOWN_PHONE_INPUT);
};
RtbPartnersFormPage.prototype.getDeviceDropdownPhoneText = function(){
    return this.getElement(DEVICE_DROPDOWN_PHONE_TEXT);
};
RtbPartnersFormPage.prototype.getDeviceDropdownTabletInput = function(){
    return this.getElement(DEVICE_DROPDOWN_TABLET_INPUT);
};
RtbPartnersFormPage.prototype.getDeviceDropdownTabletText = function(){
    return this.getElement(DEVICE_DROPDOWN_TABLET_TEXT);
};
RtbPartnersFormPage.prototype.getDeviceMarkerLabel = function(){
    return this.getElement(DEVICE_MAKER_LABEL);
};
RtbPartnersFormPage.prototype.getDeviceMarkerButtonDropdown = function(){
    return this.getElement(DEVICE_MAKER_BUTTON_DROPDOWN);
};
RtbPartnersFormPage.prototype.getDeviceBrowserLabel = function(){
    return this.getElement(BROWSER_LABEL);
};
RtbPartnersFormPage.prototype.getDeviceBrowserButtonDropdown = function(){
    return this.getElement(BROWSER_BUTTON_DROPDOWN);
};
RtbPartnersFormPage.prototype.getOsLabel = function(){
    return this.getElement(OS_LABEL);
};
RtbPartnersFormPage.prototype.getOsButtonDropdown = function(){
    return this.getElement(OS_BUTTON_DROPDOWN);
};
RtbPartnersFormPage.prototype.getGeoTargetingLabel = function(){
    return this.getElement(GEO_TARGETING_LABEL);
};
RtbPartnersFormPage.prototype.getGeoTargetingContainer = function(){
    return this.getElement(GEO_TARGETING_CONTAINER);
};
RtbPartnersFormPage.prototype.getGeoTargetingSearch = function(){
    return this.getElement(GEO_TARGETING_SEARCH);
};
RtbPartnersFormPage.prototype.getGeoTargetingDropbox = function(){
    return this.getElement(GEO_TARGETING_DROPBOX);
};
RtbPartnersFormPage.prototype.getGeoTargetingFirstCountry = function(){
    return this.getElement(GEO_TARGETING_FIRST_COUNTRY);
};
RtbPartnersFormPage.prototype.getGeoTargetingSecondCountry = function(){
    return this.getElement(GEO_TARGETING_SECOND_COUNTRY);
};
RtbPartnersFormPage.prototype.getGeoTargetingDropboxClear = function(){
    return this.getElement(GEO_TARGETING_DROPBOX_CLEAR);
};
RtbPartnersFormPage.prototype.getGeoTargetingDropboxSelectedItems = function(){
    return this.getElement(GEO_TARGETING_DROPBOX_SELECTED_ITEMS);
};

// business settings

RtbPartnersFormPage.prototype.getProgramaticFeeLabel = function(){
    return this.getElement(PROGRAMATIC_FEE_LABEL);
};
RtbPartnersFormPage.prototype.getProgramaticFeeInput = function(){
    return this.getElement(PROGRAMATIC_FEE_INPUT);
};
RtbPartnersFormPage.prototype.getBudgetLabel = function(){
    return this.getElement(BUDGET_LABEL);
};
RtbPartnersFormPage.prototype.getBudgetInput = function(){
    return this.getElement(BUDGET_INPUT);
};
RtbPartnersFormPage.prototype.getBudgetDailyCapLabel = function(){
    return this.getElement(BUDGET_DAILY_CAP_LABEL);
};
RtbPartnersFormPage.prototype.getBudgetDailyCapInput = function(){
    return this.getElement(BUDGET_DAILY_CAP_INPUT);
};
RtbPartnersFormPage.prototype.getDealDirectFeeLabel = function(){
    return this.getElement(DEAL_DIRECT_FEE_LABEL);
};
RtbPartnersFormPage.prototype.getDealDirectFeeInput = function(){
    return this.getElement(DEAL_DIRECT_FEE_INPUT);
};
RtbPartnersFormPage.prototype.getReduceBidInput = function(){
    return this.getElement(REDUCE_BID_INPUT);
};
RtbPartnersFormPage.prototype.getReduceBidText = function(){
    return this.getElement(REDUCE_BID_TEXT);
};

// data Centers

RtbPartnersFormPage.prototype.getDataCenterToAdd = function(){
    return this.getElement(DATA_CENTER_TO_ADD);
};
RtbPartnersFormPage.prototype.getDataCenterToAddClose = function(){
    return this.getElement(DATA_CENTER_TO_ADD_CLOSE);
};
RtbPartnersFormPage.prototype.getDataCenterLabel = function(){
    return this.getElement(DATA_CENTER_LABEL);
};
RtbPartnersFormPage.prototype.getUsEastSelection = function(){
    return this.getElement(US_EAST_SELECTION);
};
RtbPartnersFormPage.prototype.getUsEastInput = function(){
    return this.findElement(US_EAST_INPUT);
};
RtbPartnersFormPage.prototype.getUsEastText = function(){
    return this.getElement(US_EAST_TEXT);
};
RtbPartnersFormPage.prototype.getUsWestSelection = function(){
    return this.getElement(US_WEST_SELECTION);
};
RtbPartnersFormPage.prototype.getUsWestText = function(){
    return this.getElement(US_WEST_TEXT);
};
RtbPartnersFormPage.prototype.getUsEmeaSelection = function(){
    return this.getElement(US_EMEA_SELECTION);
};
RtbPartnersFormPage.prototype.getUsEmeaText = function(){
    return this.getElement(US_EMEA_TEXT);
};
RtbPartnersFormPage.prototype.getUsApacSelection = function(){
    return this.getElement(US_APAC_SELECTION);
};
RtbPartnersFormPage.prototype.getUsApactext = function(){
    return this.getElement(US_APAC_TEXT);
};
RtbPartnersFormPage.prototype.getUsLatamSelection = function(){
    return this.getElement(US_LATAM_SELECTION);
};
RtbPartnersFormPage.prototype.getUsLatamText = function(){
    return this.getElement(US_LATAM_TEXT);
};
RtbPartnersFormPage.prototype.getQpsLabel = function(){
    return this.getElement(QPS_LABEL);
};
RtbPartnersFormPage.prototype.getQpsInput = function(){
    return this.getElement(QPS_INPUT);
};
RtbPartnersFormPage.prototype.getBidUrlLabel = function(){
    return this.getElement(BID_URL_LABEL);
};
RtbPartnersFormPage.prototype.getBidUrlInput = function(){
    return this.getElement(BID_URL_INPUT);
};
RtbPartnersFormPage.prototype.getAddDataCenterLink = function(){
    return this.getElement(ADD_DATA_CENTER_LINK);
};

// buttons

RtbPartnersFormPage.prototype.getCreateRtbPartnerButton = function(){
    return this.getElement(CREATE_RTB_PARTNER_BUTTON);
};
RtbPartnersFormPage.prototype.getCloseWithoutSaving = function(){
    return this.getElement(CLOSE_WITHOUT_SAVING_BUTTON);
};


// setters
// basic details card

RtbPartnersFormPage.prototype.setName = function(value) {
    this.waitUntilVisible(NAME_INPUT);
    this.getNameInput().click();
    this.clear(NAME_INPUT);
    return this.sendKeys(NAME_INPUT, value);
};

RtbPartnersFormPage.prototype.setMatchUrl = function(value) {
    this.waitUntilVisible(MATCH_URL_INPUT);
    this.getMatchUrlInput().click();
    this.clear(MATCH_URL_INPUT);
    return this.sendKeys(MATCH_URL_INPUT, value);
};

RtbPartnersFormPage.prototype.setHttpRequestTimeOut = function(value) {
    this.waitUntilVisible(HTTP_REQUEST_INPUT);
    this.getSendHttpRequestInput().click();
    this.clear(HTTP_REQUEST_INPUT);
    return this.sendKeys(HTTP_REQUEST_INPUT, value);
};

RtbPartnersFormPage.prototype.setCreativeSizes = function() {
    this.clickCreativeSizes();
    this.sendKeys(CREATIVE_SIZE_INPUT, key.DOWN);
    this.sendKeys(CREATIVE_SIZE_INPUT, key.ENTER);
    return this.sendKeys(CREATIVE_SIZE_INPUT, key.TAB);
};

RtbPartnersFormPage.prototype.setIfaasUrlOne = function(value) {
    this.waitUntilVisible(IFAAS_URL_ONE_INPUT);
    this.getIfaasUrlOneInput().click();
    this.clear(IFAAS_URL_ONE_INPUT);
    return this.sendKeys(IFAAS_URL_ONE_INPUT, value);
};

RtbPartnersFormPage.prototype.setIfaasUrlTwo = function(value) {
    this.waitUntilVisible(IFAAS_URL_TWO_INPUT);
    this.getIfaasTwoInput().click();
    this.clear(IFAAS_URL_TWO_INPUT);
    return this.sendKeys(IFAAS_URL_TWO_INPUT, value);
};

RtbPartnersFormPage.prototype.setProgramaticFee = function(value) {
    this.waitUntilVisible(PROGRAMATIC_FEE_INPUT);
    this.getProgramaticFeeInput().click();
    this.clear(PROGRAMATIC_FEE_INPUT);
    return this.sendKeys(PROGRAMATIC_FEE_INPUT, value);
};

RtbPartnersFormPage.prototype.setBudget = function(value) {
    this.waitUntilVisible(BUDGET_INPUT);
    this.getBudgetInput().click();
    this.clear(BUDGET_INPUT);
    return this.sendKeys(BUDGET_INPUT, value);
};

RtbPartnersFormPage.prototype.setDailyCap = function(value) {
    this.waitUntilVisible(BUDGET_DAILY_CAP_INPUT);
    this.getBudgetDailyCapInput().click();
    this.clear(BUDGET_DAILY_CAP_INPUT);
    return this.sendKeys(BUDGET_DAILY_CAP_INPUT, value);
};

RtbPartnersFormPage.prototype.setDealDirectFee = function(value) {
    this.waitUntilVisible(DEAL_DIRECT_FEE_INPUT);
    this.getDealDirectFeeLabel().click();
    this.clear(DEAL_DIRECT_FEE_INPUT);
    return this.sendKeys(DEAL_DIRECT_FEE_INPUT, value);
};

RtbPartnersFormPage.prototype.setQps = function(value) {
    this.waitUntilVisible(QPS_INPUT);
    this.getQpsInput().click();
    this.clear(QPS_INPUT);
    return this.sendKeys(QPS_INPUT, value);
};

// device & browsers

RtbPartnersFormPage.prototype.setGeoTarCountries = function(value) {
    this.waitAndClick(GEO_TARGETING_SEARCH);
    this.clear(GEO_TARGETING_SEARCH);
    this.sendKeys(GEO_TARGETING_SEARCH, value);
    this.sendKeys(GEO_TARGETING_SEARCH, key.DOWN);
    this.sendKeys(GEO_TARGETING_SEARCH, key.ENTER);
    return this.sendKeys(GEO_TARGETING_SEARCH, key.TAB);
};

// data centers

RtbPartnersFormPage.prototype.setBidUrl = function(value) {
    this.waitUntilVisible(BID_URL_INPUT);
    this.getBidUrlInput().click();
    this.clear(BID_URL_INPUT);
    return this.sendKeys(BID_URL_INPUT, value);
};

// clicks
// basic details card

RtbPartnersFormPage.prototype.clickStatusDropdownButton = function(){
    return this.waitAndClick(STATUS_BUTTON_DROPDOWN);
};
RtbPartnersFormPage.prototype.clickStatusActive = function(){
    return this.waitAndClick(STATUS_DROPDOWN_ACTIVE);
};
RtbPartnersFormPage.prototype.clickStatusInactive = function(){
    return this.waitAndClick(STATUS_DROPDOWN_INACTIVE);
};
RtbPartnersFormPage.prototype.clickBidTypeDropdownButton = function(){
    return this.waitAndClick(BID_TYPE_BUTTON_DROPDOWN);
};
RtbPartnersFormPage.prototype.clickBidTypeDisplay = function(){
    return this.waitAndClick(BID_TYPE_DROPDOWN_DISPLAY_INPUT);
};
RtbPartnersFormPage.prototype.clickBidTypeNative = function(){
    return this.waitAndClick(BID_TYPE_DROPDOWN_NATIVE_INPUT);
};
RtbPartnersFormPage.prototype.clickMd5CheckboxInput = function(){
    return this.waitAndClick(MD5_CHECKBOX_INPUT);
};
RtbPartnersFormPage.prototype.clickMatchedUsersInput = function(){
    return this.waitAndClick(MATCHED_USERS_CHECKBOX_INPUT);
};
RtbPartnersFormPage.prototype.clickCreativeSizes = function(){
    return this.waitAndClick(CREATIVE_SIZE_INPUT);
};
RtbPartnersFormPage.prototype.clickProtocolDropdownButton = function(){
    return this.waitAndClick(PROTOCOL_BUTTON_DROPDOWN);
};
RtbPartnersFormPage.prototype.clickProtocolOpenRtbDisplay = function(){
    return this.waitAndClick(PROTOCOL_DROPDOWN_OPEN_RTB_DISPLAY);
};
RtbPartnersFormPage.prototype.clickProtocolCriteo = function(){
    return this.waitAndClick(PROTOCOL_DROPDOWN_CRITEO);
};
RtbPartnersFormPage.prototype.clickProtocolOpenRtbNativeEnc = function(){
    return this.waitAndClick(PROTOCOL_DROPDOWN_OPEN_RTB_NATIVE_ENC);
};
RtbPartnersFormPage.prototype.clickProtocolOpenRtbNativeEnc2 = function(){
    return this.waitAndClick(PROTOCOL_DROPDOWN_OPEN_RTB_NATIVE_ENC_2);
};
RtbPartnersFormPage.prototype.clickProtocolOpenRtbNative = function(){
    return this.waitAndClick(PROTOCOL_DROPDOWN_OPEN_RTB_NATIVE);
};
RtbPartnersFormPage.prototype.clickExtraOfferDropdownButton = function(){
    return this.waitAndClick(EXTRA_OFFER_BUTTON);
};

// technical specs

RtbPartnersFormPage.prototype.clickSensitiveCheckboxButton = function(){
    return this.waitAndClick(SEND_SENSITIVE_CHECKBOX_INPUT);
};
RtbPartnersFormPage.prototype.clickAuctionTypeButton = function(){
    return this.waitAndClick(AUCTION_TYPE_BUTTON);
};
RtbPartnersFormPage.prototype.clickAuctionTypeDefault = function() {
    return this.waitAndClick(AUCTION_TYPE_1);
};
RtbPartnersFormPage.prototype.clickAuctionTypeOne = function(){
    return this.waitAndClick(AUCTION_TYPE_2);
};
RtbPartnersFormPage.prototype.clickAuctionTypeTwo = function(){
    return this.waitAndClick(AUCTION_TYPE_3);
};

// device and browsers

RtbPartnersFormPage.prototype.clickDeviceDropdownButton = function(){
    return this.waitAndClick(DEVICE_BUTTON_DROPDOWN);
};
RtbPartnersFormPage.prototype.clickDeviceMarkerDropdownButton = function(){
    return this.waitAndClick(DEVICE_MAKER_BUTTON_DROPDOWN);
};
RtbPartnersFormPage.prototype.clickBrowserDropdownButton = function(){
    return this.waitAndClick(BROWSER_BUTTON_DROPDOWN);
};
RtbPartnersFormPage.prototype.clickOsDropdownButton = function(){
    return this.waitAndClick(OS_BUTTON_DROPDOWN);
};
RtbPartnersFormPage.prototype.clickGeoTargetingDropdownButton = function(){
    return this.waitAndClick(GEO_TARGETING_DROPBOX);
};
RtbPartnersFormPage.prototype.clickGeoTargetingDropdownClear = function(){
    return this.waitAndClick(GEO_TARGETING_DROPBOX_CLEAR);
};
RtbPartnersFormPage.prototype.clickDropboxFirstRow = function(){
    return this.waitAndClick(DROPBOX_FIRST_ROW);
};
RtbPartnersFormPage.prototype.clickDropboxSecondRow = function(){
    return this.waitAndClick(DROPBOX_SECOND_ROW);
};

// data centers

RtbPartnersFormPage.prototype.clickUsEast = function(){
    return this.waitAndClick(US_EAST_SELECTION);
};
RtbPartnersFormPage.prototype.clickUsWest = function(){
    return this.waitAndClick(US_WEST_SELECTION);
};
RtbPartnersFormPage.prototype.clickEmea = function(){
    return this.waitAndClick(US_EMEA_SELECTION);
};
RtbPartnersFormPage.prototype.clickApac = function(){
    return this.waitAndClick(US_APAC_SELECTION);
};

// others

RtbPartnersFormPage.prototype.findParentDsp = function(value){
    this.waitUntilVisible(PARENT_DSP_INPUT);
    this.getParentDspInput().click();
    this.clear(PARENT_DSP_INPUT);
    return this.sendKeys(PARENT_DSP_INPUT, value);
};

RtbPartnersFormPage.prototype.getParentDspInput = function() {
    this.waitUntilVisible(PARENT_DSP_INPUT);
    return this.findElement(PARENT_DSP_INPUT);
};

RtbPartnersFormPage.prototype.getParentDspOptions = function() {
    return this.getElement(PARENT_DSP_FIRST_ROW);
};

RtbPartnersFormPage.prototype.setInputParentDspSearch = function(value) {
    this.waitUntilVisible(PARENT_DSP_INPUT);
    this.clear(PARENT_DSP_INPUT);
    this.driver.sleep(500);
    this.sendKeys(PARENT_DSP_INPUT, value);
    this.getParentDspInput().click();
    return this.findElement(PARENT_DSP_FIRST_ROW).click();
};

RtbPartnersFormPage.prototype.getParentDspSelected = function() {
    this.waitUntilVisible(PARENT_DSP_FILTER);
    return this.findElement(PARENT_DSP_FILTER);
};

RtbPartnersFormPage.prototype.getRemoveRtbPartner = function() {
    this.waitUntilVisible(PARENT_DSP_FILTER_CLOSE);
    return this.findElement(PARENT_DSP_FILTER_CLOSE);
};

RtbPartnersFormPage.prototype.getRowsNumber = function(){
    return this.getElements(ROWS_NUMBER);
};

RtbPartnersFormPage.prototype.getDropboxFirstRow = function(){
    return this.getElement(DROPBOX_FIRST_ROW);
};

RtbPartnersFormPage.prototype.getDropboxSecondRow = function(){
    return this.getElement(DROPBOX_SECOND_ROW);
};

RtbPartnersFormPage.prototype.clickCreateRtbPartner = function(){
    return this.waitAndClick(CREATE_RTB_PARTNER_BUTTON);
};
RtbPartnersFormPage.prototype.clickEditRtbPartner = function(){
    return this.waitAndClick(EDIT_RTB_PARTNER_BUTTON);
};

module.exports = RtbPartnersFormPage;
