'use strict';

// vendor dependencies
const chance = require('chance').Chance();
const chai = require('chai');


const expect = chai.expect; // use bdd chai
const moment = require('moment');
const request = require('supertest-as-promised');
const util = require('util');
const validator = require('validator');

// common runtime variables
const rootPath = process.env.ROOT_PATH;

// merlin runtime variables
const merlinTargetEnvironment =
    require(rootPath + '/config/merlin/' + process.env.NODE_ENV);
const merlinUsersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const merlinTargetEndpoint =
    require(rootPath + '/config/merlin/endpoints');
const merlinTargetServer = merlinTargetEnvironment.server;
const merlinTargetUser = merlinUsersTargetEnvironment.admin;
const merlinAuthHeaders =
    require(rootPath + '/helpers/merlin-auth-headers');
const merlinTimeout = 8000;

// helpers
const driverBuilder = require(rootPath + '/helpers/driver-builder');
const sfHelper = require(rootPath + '/helpers/salesforce');

//  Page object(s)
let LoginPage =
    require(rootPath + '/pages/salesforce/login');
let AccountsLandingPage =
    require(rootPath + '/pages/salesforce/accounts-landing');
let AccountsEditPage =
    require(rootPath + '/pages/salesforce/accounts-edit');
let AccountsDetailPage =
    require(rootPath + '/pages/salesforce/accounts-detail');
let OpportunitiesLandingPage =
    require(rootPath + '/pages/salesforce/opportunities-landing');
let OpportunitiesEditPage =
    require(rootPath + '/pages/salesforce/opportunities-edit');
let OpportunitiesDetailPage =
    require(rootPath + '/pages/salesforce/opportunities-detail');
let ProductEditPage =
    require(rootPath + '/pages/salesforce/product-edit');

// salesforce runtime variables
const targetEnvironment =
    require(rootPath + '/config/salesforce/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const targetUser = targetEnvironment.user;

describe('{{SALESFORCE}} client direct - direct-advertiser {update} >>> ' +
    '(+) with a pixel name >>>', function() {

    // shared test variable(s)
    const timeStamp = '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SSS');

    // merlin shared test variable(s)
    let authHeaders;
    let resOutput001;
    let resOutput002;
    let resOutput003;
    let resOutput004;
    let resOutput005;
    let resOutput006;
    let resOutput007;
    let resOutput008;
    let resOutput009;
    let resOutput010;
    let resOutput011;
    let resText001;
    let resText002;
    let resText003;
    let resText004;
    let resText005;
    let resText006;
    let resText007;
    let resText008;
    let resText009;
    let resText010;
    let resText011;

    // salesforce share variable(s)
    let driver;
    let opportunityUrl;

    // fixture(s)
    let agencyFixture;
    let accountFixture;
    let opportunityFixture;
    let opportunityUpdateFixture;
    let productFixture;
    let productUpdateFixture;

    // disable mocha time outs
    this.timeout(0);

    describe('merlin - create agency to link to salesforce acc', function() {

        this.timeout(merlinTimeout);

        before('generate auth headers', function(done) {
            const genAuthHeaders = merlinAuthHeaders(merlinTargetUser);
            genAuthHeaders.then(function(headers) {
                authHeaders = headers;
                done();
            });
        });

        before('create agency - minimum required', function(done) {
            agencyFixture = Object.assign(
                {}, require(rootPath + '/fixtures/common/agency/create002')
            );

            agencyFixture.name += timeStamp;
            agencyFixture.type = 'Direct Advertiser';

            request(merlinTargetServer)
                .post(util.format(merlinTargetEndpoint.agencyCreate))
                .set(authHeaders)
                .send(agencyFixture)
                .then(function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(201);

                    // assign shared test variable(s)
                    resText001 = JSON.parse(res.text);
                    resOutput001 = resText001.output;
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        it('notices and errors should not exist', function() {
            expect(resText001.notices).to.not.exist;
            expect(resText001.errors).to.not.exist;
        });

        it('response object key values should match test object', function() {
            expect(resOutput001.name).to.equal(agencyFixture.name);
            expect(resOutput001.manager).to.equal(agencyFixture.manager);
        });

    });

    describe('salesforce - create a direct advertiser opp >>>', function() {

        accountFixture = Object.assign(
            {}, require(rootPath + '/fixtures/salesforce/account-create001')
        );
        opportunityFixture = Object.assign(
            {}, require(rootPath + '/fixtures/salesforce/opportunity-create001')
        );
        productFixture = Object.assign(
            {}, require(rootPath + '/fixtures/salesforce/product-create001')
        );

        before('get webdriver and reset session', (done) => {
            driver = driverBuilder();
            driver.manage().deleteAllCookies().then(_ => {
                done();
            }, (err) => {
                done(err);
            });
        });

        it('should login into salesforce successfully', function(done) {
            let loginPage = new LoginPage(driver);
            loginPage
                .navigate(util.format(targetServer, ''))
                .enterUsername(targetUser.username)
                .enterPassword(targetUser.password)
                .clickLoginBtn()
                .then((res) => {
                    done();
                }, (err) => {

                    done(err);
                });
        });

        it('should set a new account\'s record type', function(done) {
            let accountsLandingPage = new AccountsLandingPage(driver);
            accountsLandingPage
                .navigate()
                .clickNewAccountBtn()
                .selectRecordType(accountFixture.type)
                .clickContinue()
                .then((res) => {
                    done();
                }, (err) => {

                    done(err);
                });
        });

        it('should create a new account', function(done) {
            let accountsEditPage = new AccountsEditPage(driver);
            // populate fixture fields
            accountFixture.name += timeStamp;
            accountFixture.lfmAgencyId = resOutput001.refId;

            accountsEditPage
                .enterAccountName(accountFixture.name)
                .enterLfmAgencyIdClientDirect(accountFixture.lfmAgencyId)
                .saveAccount()
                .then((res) => {
                    done();
                }, (err) => {

                    done(err);
                });
        });

        it('should set a new opportunity\'s record type', function(done) {
            let opportunitiesLandingPage = new OpportunitiesLandingPage(driver);
            opportunitiesLandingPage
                .navigate()
                .clickNewOppBtn()
                .selectRecordType(opportunityFixture.type)
                .clickContinue()
                .then((res) => {
                    done();
                }, (err) => {

                    done(err);
                });
        });

        it('should create a new opportunity', function(done) {
            let opportunitiesEditPage = new OpportunitiesEditPage(driver);
            // populate fixture fields
            opportunityFixture.name += timeStamp;
            opportunityFixture.liveDate = moment().format('MM/DD/YYYY');
            opportunityFixture.endDate =
                moment().endOf('month').format('MM/DD/YYYY');

            opportunitiesEditPage
                .enterAccountName(accountFixture.name)
                .enterOppName(opportunityFixture.name)
                .enterAccountManager(opportunityFixture.accountManager.sfName)
                .selectStage(opportunityFixture.stage)
                .enterLiveDate(opportunityFixture.liveDate)
                .enterEndDate(opportunityFixture.endDate)
                .selectAdServer(opportunityFixture.adServer)
                .useLiveIntentNumbers(opportunityFixture.liNumbers)
                .enterTotalBudget(opportunityFixture.totalBudget)
                .enterDomain(opportunityFixture.domain)
                .selectIABCategory(opportunityFixture.iabCategory)
                .saveOpp()
                .then((res) => {
                    done();
                }, (err) => {

                    done(err);
                });
        });

        it('should get the url of the created opportunity', function(done) {
            let opportunitiesDetailPage = new OpportunitiesDetailPage(driver);
            opportunitiesDetailPage
                .getOpportunityUrl()
                .then((res) => {
                    opportunityUrl = res;
                    done();
                }, (err) => {

                    done(err);
                });
        });

        it('should initiate new product creation', function(done) {
            let opportunitiesDetailPage = new OpportunitiesDetailPage(driver);
            opportunitiesDetailPage
                .clickAddProdButton()
                .then((res) => {
                    done();
                }, (err) => {

                    done(err);
                });
        });

        it('should create a new product', function(done) {
            let productEditPage = new ProductEditPage(driver);
            // populate fixture fields
            productFixture.name += timeStamp;
            productFixture.liveDate = moment().format('MM/DD/YYYY');
            productFixture.endDate =
                moment().endOf('week').format('MM/DD/YYYY');
            productEditPage
                .selectCampaignType(productFixture.type)
                .enterCampaignName(productFixture.name)
                .enterFlightStart(productFixture.liveDate)
                .enterEndDate(productFixture.endDate)
                .enterBudget(productFixture.budget)
                .selectCampaignGoal(productFixture.campaignGoal.index)
                .enterBidAmount(productFixture.cpmBidAmount)
                .selectPrimaryIABCat(productFixture.primaryIabCategory)
                .selectSecondaryIABCats(productFixture.secondaryIabCategories)
                .saveProduct()
                .then((res) => {
                    done();
                }, (err) => {

                    done(err);
                });
        });

        it('should sync opportunity to liveintent', function(done) {
            let opportunitiesDetailPage = new OpportunitiesDetailPage(driver);
            opportunitiesDetailPage
                .syncToLiveIntent()
                .then((res) => {
                    done();
                }, (err) => {

                    done(err);
                });
        });

    });

    describe('merlin - verify advertiser was created', function() {

        this.timeout(merlinTimeout);

        before('advanced search - advertiser', function(done) {
            let payload = {
                'conditions': [
                    {'field': 'name', 'value': accountFixture.name}
                ]
            };

            request(merlinTargetServer)
                .post(util.format(
                    merlinTargetEndpoint.searchAdvertiserAdvanced
                )
                )
                .set(authHeaders)
                .send(payload)
                .then(function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(200);

                    // assign shared test variable(s)
                    resText002 = JSON.parse(res.text);
                    resOutput002 = resText002.output;
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        it('notices and errors should not exist', function() {
            expect(resText002.notices).to.not.exist;
            expect(resText002.errors).to.not.exist;
        });

        it('only one advertiser should be created', function() {
            expect(resOutput002).to.have.lengthOf(1);
        });

        it('response should match advertiser created on sf', function() {
            expect(resOutput002[0].name)
                .to.equal(accountFixture.name);
            expect(resOutput002[0].ownerName)
                .to.equal(agencyFixture.name);
            expect(resOutput002[0].agency)
                .to.equal(resOutput001.id);
            expect(resOutput002[0].domain)
                .to.equal(opportunityFixture.domain);
            expect(resOutput002[0].category)
                .to.equal(opportunityFixture.iabCategory);
        });

    });

    describe('merlin - verify insertion order was created', function() {

        this.timeout(merlinTimeout);

        before('advanced search - insertion order', function(done) {
            let payload = {
                'conditions': [
                    {'field': 'advertiser', 'value': resOutput002[0].id}
                ]
            };

            request(merlinTargetServer)
                .post(util.format(
                    merlinTargetEndpoint.searchInsertionOrderAdvanced
                )
                )
                .set(authHeaders)
                .send(payload)
                .then(function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(200);

                    // assign shared test variable(s)
                    resText003 = JSON.parse(res.text);
                    resOutput003 = resText003.output;
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        it('notices and errors should not exist', function() {
            expect(resText003.notices).to.not.exist;
            expect(resText003.errors).to.not.exist;
        });

        it('only one insertion order should be created', function() {
            expect(resOutput003).to.have.lengthOf(1);
        });

        it('response should match opportunity created on sf', function() {
            expect(resOutput003[0].name.includes(accountFixture.name))
                .to.be.true;
            expect(parseFloat(resOutput003[0].budget))
                .to.equal(productFixture.budget);
            expect(resOutput003[0].advertiser)
                .to.equal(resOutput002[0].id);
            expect(sfHelper.parseDate(resOutput003[0].startDate))
                .to.equal(opportunityFixture.liveDate);
            expect(sfHelper.parseDate(resOutput003[0].endDate))
                .to.equal(opportunityFixture.endDate);
        });
    });

    describe('merlin - verify campaign was created', function() {

        this.timeout(merlinTimeout);

        before('advanced search - campaign', function(done) {
            let payload = {
                'conditions': [
                    {'field': 'insertionOrder', 'value': resOutput003[0].id}
                ]
            };

            request(merlinTargetServer)
                .post(util.format(
                    merlinTargetEndpoint.searchCampaignAdvanced
                )
                )
                .set(authHeaders)
                .send(payload)
                .then(function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(200);

                    // assign shared test variable(s)
                    resText004 = JSON.parse(res.text);
                    resOutput004 = resText004.output;

                    // spot check response
                    expect(resOutput004).to.have.lengthOf(1);
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        before('get campaign details', function(done) {
            request(merlinTargetServer)
                .get(util.format(
                    merlinTargetEndpoint.campaignDetails, resOutput004[0].id
                )
                )
                .set(authHeaders)
                .then(function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(200);

                    // assign shared test variable(s)
                    resText005 = JSON.parse(res.text);
                    resOutput005 = resText005.output;
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        it('notices and errors should not exist', function() {
            expect(resText005.notices).to.not.exist;
            expect(resText005.errors).to.not.exist;
        });

        it('response should match product created on sf', function() {
            expect(resOutput005.name)
                .to.equal(productFixture.name);
            expect(resOutput005.category)
                .to.equal(productFixture.primaryIabCategory);
            expect(resOutput005.secondaryCategories)
                .to.eql(productFixture.secondaryIabCategories);
            expect(parseFloat(resOutput005.budget))
                .to.equal(productFixture.budget);
            expect(resOutput005.bidAmount)
                .to.equal(productFixture.cpmBidAmount);
            expect(resOutput005.pricingModel)
                .to.equal(productFixture.campaignGoal.pricingModel);
            expect(resOutput005.clearingMethod)
                .to.equal(productFixture.campaignGoal.clearingMethod);
            expect(resOutput005.goal)
                .to.equal(productFixture.campaignGoal.goal);
            expect(resOutput005.demandType)
                .to.equal('exchange');
            expect(resOutput005.type)
                .to.equal('newsletter');
            expect(sfHelper.parseComment(resOutput005.comment))
                .to.eql({
                    'startDate': productFixture.liveDate,
                    'endDate': productFixture.endDate
                });
        });
    });

    describe('salesforce - update opportunity and product >>>', function() {

        opportunityUpdateFixture = Object.assign(
            {}, require(rootPath + '/fixtures/salesforce/opportunity-update001')
        );
        productUpdateFixture = Object.assign(
            {}, require(rootPath + '/fixtures/salesforce/product-update004')
        );

        it('should navigate to opportunity edit page', function(done) {
            let opportunitiesDetailPage = new OpportunitiesDetailPage(driver);
            opportunitiesDetailPage
                .clickOppEditButton()
                .then((res) => {
                    done();
                }, (err) => {

                    done(err);
                });
        });

        it('should edit an existing an opportunity', function(done) {
            let opportunitiesEditPage = new OpportunitiesEditPage(driver);
            // update fixture fields
            opportunityUpdateFixture.liveDate = moment().format('MM/DD/YYYY');
            opportunityUpdateFixture.endDate =
                moment().endOf('month').format('MM/DD/YYYY');

            opportunitiesEditPage
                .enterLiveDate(opportunityUpdateFixture.liveDate)
                .enterEndDate(opportunityUpdateFixture.endDate)
                .selectAdServer(opportunityUpdateFixture.adServer)
                .useLiveIntentNumbers(opportunityUpdateFixture.liNumbers)
                .enterDomain(opportunityUpdateFixture.domain)
                .selectIABCategory(opportunityUpdateFixture.iabCategory)
                .saveOpp()
                .then((res) => {
                    done();
                }, (err) => {

                    done(err);
                });
        });

        it('should navigate to product edit page', function(done) {
            let opportunitiesDetailPage = new OpportunitiesDetailPage(driver);
            opportunitiesDetailPage
                .clickAddProdButton()
                .then((res) => {
                    done();
                }, (err) => {

                    done(err);
                });
        });

        it('should update existing product', function(done) {
            let productEditPage = new ProductEditPage(driver);
            // update fixture fields
            productUpdateFixture.name += timeStamp;
            productUpdateFixture.pixelName += timeStamp;
            productUpdateFixture.liveDate = moment().format('MM/DD/YYYY');
            productUpdateFixture.endDate =
                moment().endOf('week').format('MM/DD/YYYY');
            productEditPage
                .enterCampaignName(productUpdateFixture.name)
                .enterFlightStart(productUpdateFixture.liveDate)
                .enterEndDate(productUpdateFixture.endDate)
                .enterBudget(productUpdateFixture.budget)
                .selectCampaignGoal(productUpdateFixture.campaignGoal.index)
                .enterBidAmount(productUpdateFixture.cpmBidAmount)
                .enterMaxCPMBid(productUpdateFixture.maxCpmBid)
                .selectPrimaryIABCat(productUpdateFixture.primaryIabCategory)
                .selectSecondaryIABCats(
                    productUpdateFixture.secondaryIabCategories
                )
                .checkPixelRadioBtn()
                .enterPixelName(productUpdateFixture.pixelName)
                .saveProduct()
                .then((res) => {
                    done();
                }, (err) => {

                    done(err);
                });
        });

        it('should sync opportunity to liveintent', function(done) {
            let opportunitiesDetailPage = new OpportunitiesDetailPage(driver);
            opportunitiesDetailPage
                .syncToLiveIntent()
                .then((res) => {
                    done();
                }, (err) => {

                    done(err);
                });
        });

    });

    describe('merlin - verify no new advertiser was created', function() {

        this.timeout(merlinTimeout);

        before('advanced search - advertiser', function(done) {
            let payload = {
                'conditions': [
                    {'field': 'agency', 'value': resOutput001.id}
                ]
            };

            request(merlinTargetServer)
                .post(util.format(
                    merlinTargetEndpoint.searchAdvertiserAdvanced
                )
                )
                .set(authHeaders)
                .send(payload)
                .then(function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(200);

                    // assign shared test variable(s)
                    resText006 = JSON.parse(res.text);
                    resOutput006 = resText006.output;
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        it('only previously created advertiser should exist', function() {
            expect(resOutput006).to.have.lengthOf(1);
        });

    });

    describe('merlin - verify insertion order was updated', function() {

        this.timeout(merlinTimeout);

        before('advanced search - insertion order', function(done) {
            let payload = {
                'conditions': [
                    {'field': 'advertiser', 'value': resOutput006[0].id}
                ]
            };

            request(merlinTargetServer)
                .post(util.format(
                    merlinTargetEndpoint.searchInsertionOrderAdvanced
                )
                )
                .set(authHeaders)
                .send(payload)
                .then(function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(200);

                    // assign shared test variable(s)
                    resText007 = JSON.parse(res.text);
                    resOutput007 = resText007.output;
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        before('get insertion order', function(done) {
            request(merlinTargetServer)
                .get(util.format(
                    merlinTargetEndpoint.insertionOrderDetails,
                    resOutput007[0].id
                )
                )
                .set(authHeaders)
                .then(function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(200);

                    // assign shared test variable(s)
                    resText008 = JSON.parse(res.text);
                    resOutput008 = resText008.output;
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        it('only previously created io should exist', function() {
            expect(resOutput007).to.have.lengthOf(1);
        });

        it('notices and errors should not exist', function() {
            expect(resText008.notices).to.not.exist;
            expect(resText008.errors).to.not.exist;
        });

        it('response should match updated opportunity', function() {
            expect(resOutput008.name.includes(accountFixture.name))
                .to.be.true;
            expect(parseFloat(resOutput008.budget))
                .to.equal(productUpdateFixture.budget);
            expect(resOutput008.advertiser)
                .to.equal(resOutput006[0].id);
            expect(sfHelper.parseDate(resOutput008.startDate))
                .to.equal(opportunityUpdateFixture.liveDate);
            expect(sfHelper.parseDate(resOutput008.endDate))
                .to.equal(opportunityUpdateFixture.endDate);
            expect(resOutput008.admin.firstName)
                .to.equal(opportunityFixture.accountManager.firstName);
            expect(resOutput008.admin.lastName)
                .to.equal(opportunityFixture.accountManager.lastName);
            expect(resOutput008.executive.firstName)
                .to.equal(opportunityFixture.accountExecutive.firstName);
            expect(resOutput008.executive.lastName)
                .to.equal(opportunityFixture.accountExecutive.lastName);
        });

    });

    describe('merlin - verify campaign was updated', function() {

        this.timeout(merlinTimeout);

        before('advanced search - campaign', function(done) {
            let payload = {
                'conditions': [
                    {'field': 'insertionOrder', 'value': resOutput008.id}
                ]
            };

            request(merlinTargetServer)
                .post(util.format(
                    merlinTargetEndpoint.searchCampaignAdvanced
                )
                )
                .set(authHeaders)
                .send(payload)
                .then(function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(200);

                    // assign shared test variable(s)
                    resText009 = JSON.parse(res.text);
                    resOutput009 = resText009.output;
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        before('get campaign details', function(done) {
            request(merlinTargetServer)
                .get(util.format(
                    merlinTargetEndpoint.campaignDetails, resOutput009[0].id
                )
                )
                .set(authHeaders)
                .then(function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(200);

                    // assign shared test variable(s)
                    resText010 = JSON.parse(res.text);
                    resOutput010 = resText010.output;
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        it('only previously created campaign should exist', function() {
            expect(resOutput009).to.have.lengthOf(1);
        });

        it('notices and errors should not exist', function() {
            expect(resText010.notices).to.not.exist;
            expect(resText010.errors).to.not.exist;
        });

        it('response should match updated product', function() {
            expect(resOutput010.name)
                .to.equal(productUpdateFixture.name);
            expect(resOutput010.category)
                .to.equal(productUpdateFixture.primaryIabCategory);
            expect(resOutput010.secondaryCategories).to.eql(
                productFixture.secondaryIabCategories.concat(
                    productUpdateFixture.secondaryIabCategories
                )
            );
            expect(parseFloat(resOutput010.budget))
                .to.equal(productUpdateFixture.budget);
            expect(resOutput010.bidAmount)
                .to.equal(productUpdateFixture.cpmBidAmount);
            expect(resOutput010.pricingModel)
                .to.equal(productUpdateFixture.campaignGoal.pricingModel);
            expect(resOutput010.clearingMethod)
                .to.equal(productUpdateFixture.campaignGoal.clearingMethod);
            expect(resOutput010.goal)
                .to.equal(productUpdateFixture.campaignGoal.goal);
            expect(resOutput010.demandType)
                .to.equal('exchange');
            expect(resOutput010.type)
                .to.equal('newsletter');
            expect(sfHelper.parseComment(resOutput010.comment))
                .to.eql({
                    'startDate': productUpdateFixture.liveDate,
                    'endDate': productUpdateFixture.endDate
                });
            if (productUpdateFixture.campaignGoal.index === 2 ||
                productUpdateFixture.campaignGoal.index === 3 ) {
                expect(resOutput010.system).to.equal('dsp');
            } else {
                expect(resOutput010.system).to.equal('ssp');
            }
        });
    });

    describe('merlin - verify added pixel was created', function() {

        this.timeout(merlinTimeout);

        before('advanced search - pixel', function(done) {
            let payload = {
                'conditions': [
                    {'field': 'name', 'value': productUpdateFixture.pixelName}
                ]
            };

            request(merlinTargetServer)
                .post(util.format(
                    merlinTargetEndpoint.searchPixelAdvanced
                )
                )
                .set(authHeaders)
                .send(payload)
                .then(function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(200);

                    // assign shared test variable(s)
                    resText011 = JSON.parse(res.text);
                    resOutput011 = resText011.output;
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        it('notices and errors should not exist', function() {
            expect(resText011.notices).to.not.exist;
            expect(resText011.errors).to.not.exist;
        });

        it('only one pixel should be created', function() {
            expect(resOutput011).to.have.lengthOf(1);
        });

        it('pixel should be linked to campaign', function() {
            expect(resOutput011[0].name)
                .to.equal(productUpdateFixture.pixelName);
            expect(resOutput011[0].advertiser)
                .to.equal(resOutput006[0].id);
            expect(resOutput011[0].advertiserName)
                .to.equal(resOutput006[0].name);
            expect(resOutput011[0].id)
                .to.equal(resOutput010.conversionPixel);
        });
    });

    after('merlin - delete agency', function(done) {
        request(merlinTargetServer)
            .del(util.format(
                merlinTargetEndpoint.agencyDelete, resOutput001.id
            )
            )
            .set(authHeaders)
            .then(function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch(function(err) {
                done(err);
            });
    });

});
