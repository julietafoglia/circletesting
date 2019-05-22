'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment = require(rootPath +
    '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002
    .children.advertiser001
    .children.advertiserUser001;
const driverTimeOut = 0;

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdvertiser = entitiesObj.agency002.children.advertiser001;
const targetIo = targetAdvertiser.children.insertionOrder001;
const targetCampaign = targetIo.children.campaign001;
const targetLineItem = targetCampaign.children.lineItem001;
const liStartDate = moment().format('MMM D, YYYY');
const liEndDate = moment().add(30, 'days').format('MMM D, YYYY');

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let IoDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/insertion-order-details');
let CampaignDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/campaign-details');
let loginPage;
let ioDetailsPage;
let campaignDetailsPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer =
    targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');


describe('{{MAVERICK}} /line-item {UI} @SS-AGENCY-ADVERTISER >>> ' +
    '(+) verify line item table elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        ioDetailsPage = new IoDetailsPage(driver);
        campaignDetailsPage = new CampaignDetailsPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('maverick - login', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('line item table should have all elements', function(done) {
        ioDetailsPage.navigate(targetServer, 'advertisers',
            targetAdvertiser.refId);
        ioDetailsPage.clickCampaign(targetCampaign.name);

        expect(campaignDetailsPage.getTableName(targetLineItem.name)).to.exist;
        expect(campaignDetailsPage.
            getLineItemTableId('ID: ' + targetLineItem.refId)).to.exist;
        expect(campaignDetailsPage.getTableStatus('Not Delivering')).to.exist;
        expect(campaignDetailsPage.getLineItemTableBudget('$0.00')).to.exist;
        expect(campaignDetailsPage.getLineItemTableSpent('—')).to.exist;
        expect(campaignDetailsPage.getTablePacing('—')).to.exist;
        expect(campaignDetailsPage.getLineItemTableDate(liStartDate)).to.exist;
        expect(campaignDetailsPage.getLineItemTableDate(liEndDate)).to.exist;
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should search line item by id', function(done) {
        campaignDetailsPage.setInputSearch(targetLineItem.refId);
        campaignDetailsPage.getLinkText(targetLineItem.name);
        campaignDetailsPage.getSpan('Showing 1 - 1 (1)');
        driver.sleep(0).then(() => done());
    });

});
