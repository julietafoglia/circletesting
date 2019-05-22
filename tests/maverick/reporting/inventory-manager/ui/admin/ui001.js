'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.admin;
const driverTimeOut = 0;

// selenium runtime variables
let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let NavBar = require(rootPath + '/pages/maverick/platform/nav-bar');
let ReportsPage = require(rootPath + '/pages/maverick/reporting/reports');
let ReportsCardPage = require(
    rootPath + '/pages/maverick/reporting/reports-card');
let loginPage, navBar, reportsCard, reportsPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;

const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('<SMOKE-PROD> {{MAVERICK}} /reports {ui} @ADMIN >>> (+)' +
    ' IM table and create modal validation >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        navBar = new NavBar(driver);
        reportsPage = new ReportsPage(driver);
        reportsCard = new ReportsCardPage(driver);
        driver.manage().deleteAllCookies().then( () => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should login to maverick', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('should go to reports landing page', function(done) {
        navBar.closeLastOuterDiv();
        navBar.closeOuterDiv();
        navBar.clickReportingTab();
        reportsPage.waitUntilSpinnerNotPresent();
        navBar.closeOuterDiv();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should assert reports page elements', function(done) {
        expect(reportsPage.getReportsHeader()).to.exist;
        expect(reportsPage.getMyReportsTab()).to.exist;
        expect(reportsPage.getAllReportsTab()).to.exist;
        expect(reportsPage.getCreateButton()).to.exist;
        expect(reportsPage.getMyReportsTab()).to.exist;
        expect(reportsPage.getAllReportsTab()).to.exist;
        reportsPage.clickAllReportsTab();
        // table elements
        // expect(reportsPage.getSearchReportsInput()).to.exist;
        // expect(reportsPage.getAddFilterButton()).to.exist;
        // expect(reportsPage.getNameTableHeader()).to.exist;
        // expect(reportsPage.getReportTypeTableHeader()).to.exist;
        // expect(reportsPage.getQueryRangeTableHeader()).to.exist;
        // expect(reportsPage.getScheduleTableHeader()).to.exist;
        // expect(reportsPage.getCreatedTableHeader()).to.exist;
        // expect(reportsPage.getUpdatedTableHeader()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should open report create modal', function(done) {
        reportsPage.clickNewReport();
        reportsCard.selectIMReport();
        reportsPage.waitUntilLoaderNotVisible();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should assert create modal form', function(done) {
        expect(reportsPage.getCreateHeaderTitle()).to.exist;
        expect(reportsPage.getReportExitButton()).to.exist;
        expect(reportsPage.getSaveReporButton()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should assert create modal links', function(done) {
        expect(reportsPage.getPublisherText()).to.exist;
        expect(reportsPage.getAllMyPublishersLink()).to.exist;
        expect(reportsPage.getSelectPublishersLink()).to.exist;
        expect(reportsPage.getFilterByInventoryLink()).to.exist;
        expect(reportsPage.getFilterByAdvertisersLink()).to.exist;
        expect(reportsPage.getAddScheduleLink()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should verify publishers selections are added', function(done) {
        reportsPage.clickSelectPublishersLink();
        expect(reportsPage.getChoosePublisherHeader()).to.exist;
        expect(reportsPage.getExitChoosePublishersButton()).to.exist;
        expect(reportsPage.getCancelChoosePublishersLink()).to.exist;
        expect(reportsPage.getAddPublishersButton()).to.exist;
        expect(reportsPage.getFirstOptionListed()).to.exist;
        reportsPage.clickFirstOptionListed();
        expect(reportsPage.getClearAllPopUpLink()).to.exist;
        reportsPage.clickAddPublishersButton();
        expect(reportsPage.getSelectedPublishersText()).to.exist;
        expect(reportsPage.getClearAllLink()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should check publishers section', function(done) {
        reportsPage.clickFilterByInventoryLink();
        expect(reportsPage.getPublisherFilterDropdown()).to.exist;
        reportsPage.clickPublisherFilterDropdown();
        expect(reportsPage.getByTemplateOption()).to.exist;
        expect(reportsPage.getBySectionOption()).to.exist;
        reportsPage.clickByTemplateOption();
        expect(reportsPage.getSelectTemplatesLink()).to.exist;
        expect(reportsPage.getAddAllTemplatesLink()).to.exist;
        reportsPage.clickPublisherFilterDropdown();
        reportsPage.clickBySectionOption();
        expect(reportsPage.getSelectSectionsLink()).to.exist;
        expect(reportsPage.getAddAllSectionsLink()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should check advertisers section', function(done) {
        reportsPage.clickFilterByAdvertisersLink();
        expect(reportsPage.getAddAllAdvertisersLink()).to.exist;
        expect(reportsPage.getSelectAdvertisersPublisher()).to.exist;
        expect(reportsPage.getFilterByCampaignsLink()).to.exist;
        reportsPage.clickFilterByCampaignsLink();
        expect(reportsPage.getAdvertiserFilterDropdown()).to.exist;
        reportsPage.clickAdvertiserFilterDropdown();
        expect(reportsPage.getByCampaignOption()).to.exist;
        expect(reportsPage.getByLineItemOption()).to.exist;
        reportsPage.clickByCampaignOption();
        expect(reportsPage.getSelectCampaignsLink()).to.exist;
        expect(reportsPage.getAddAllCampaignsLink()).to.exist;
        reportsPage.clickAdvertiserFilterDropdown();
        reportsPage.clickByLineItemOption();
        expect(reportsPage.getSelectLineItemsLink()).to.exist;
        expect(reportsPage.getAddAllLineItemsLink()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should check disabled links are enabled after selecting' +
        ' publishers', function(done) {
        reportsPage.clickImpressionsCheckBox();
        reportsPage.clickAddAllMyPublishersLink();
        reportsPage.clickPublisherFilterDropdown();
        reportsPage.clickByTemplateOption();
        reportsPage.getSelectTemplatesLink().getAttribute('class')
            .then(function(text) {
                expect(text).to.not.include('disabled');
            });
        reportsPage.clickPublisherFilterDropdown();
        reportsPage.clickBySectionOption();
        reportsPage.getSelectSectionsLink().getAttribute('class')
            .then(function(text) {
                expect(text).to.not.include('disabled');
            });
        reportsPage.getAddAllAdvertisersLink().getAttribute('class')
            .then(function(text) {
                expect(text).to.not.include('disabled');
            });
        reportsPage.getSelectAdvertisersPublisher().getAttribute('class')
            .then(function(text) {
                expect(text).to.not.include('disabled');
            });
        reportsPage.clickAdvertiserFilterDropdown();
        reportsPage.clickByCampaignOption();
        reportsPage.getSelectCampaignsLink().getAttribute('class')
            .then(function(text) {
                expect(text).to.not.include('disabled');
            });
        reportsPage.clickAdvertiserFilterDropdown();
        reportsPage.clickByLineItemOption();
        reportsPage.getSelectLineItemsLink().getAttribute('class')
            .then(function(text) {
                expect(text).to.not.include('disabled');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should select the native option', function(done) {
        expect(reportsPage.getReportTypeText()).to.exist;
        expect(reportsPage.getRerportTypeDropdown()).to.exist;
        reportsPage.clickReportTypeDropdown();
        expect(reportsPage.getNativeOption()).to.exist;
        reportsPage.clickNativeOption();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should validate native report fields', function(done) {
        expect(reportsPage.getQueryRangeText()).to.exist;
        expect(reportsPage.getQueryRangeDropdown()).to.exist;
        reportsPage.clickQueryRangeDropdown();
        expect(reportsPage.getWeekToDateOption()).to.exist;
        expect(reportsPage.getMonthToDateOption()).to.exist;
        expect(reportsPage.getQarterToDateOption()).to.exist;
        expect(reportsPage.getYearToDateOption()).to.exist;
        expect(reportsPage.getYesterdayOption()).to.exist;
        expect(reportsPage.getPast7DaysOption()).to.exist;
        expect(reportsPage.getPast30DaysOption()).to.exist;
        expect(reportsPage.getPast90DaysOption()).to.exist;
        expect(reportsPage.getLastMonthOption()).to.exist;
        expect(reportsPage.getDateRangeOption()).to.exist;
        reportsPage.clickDateRangeOption();
        expect(reportsPage.getStartDateInput()).to.exist;
        expect(reportsPage.getEndDateInput()).to.exist;
        expect(reportsPage.getGranularityText()).to.exist;
        expect(reportsPage.getGranularityDropdown()).to.exist;
        reportsPage.clickGranularityDropdown();
        expect(reportsPage.getDayOption()).to.exist;
        expect(reportsPage.getWeekOption()).to.exist;
        expect(reportsPage.getMonthOption()).to.exist;
        expect(reportsPage.getAllOption()).to.exist;
        reportsPage.clickReportTypeDropdown();
        reportsPage.clickCustomOption();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should exit report create modal', function(done) {
        reportsPage.clickExitReportModal();
        driver.sleep(driverTimeOut).then(() => done());
    });
});
