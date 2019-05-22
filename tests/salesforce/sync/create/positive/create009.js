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
const merlinTimeout = 5000;

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
let InsertionOrderEditPage =
    require(rootPath + '/pages/salesforce/insertion-order-edit');
let InsertionOrderDetailPage =
    require(rootPath + '/pages/salesforce/insertion-order-detail');
let ProductEditPage =
    require(rootPath + '/pages/salesforce/product-edit');

// salesforce runtime variables
const targetEnvironment =
    require(rootPath + '/config/salesforce/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const targetUser = targetEnvironment.user;

describe('{{SALESFORCE}} agency - agency {create} >>> ' +
    '(+) with sf insertion order >>>', function() {

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
    let resText001;
    let resText002;
    let resText003;
    let resText004;
    let resText005;
    let resText006;

    // salesforce shared test variable(s)
    let driver;
    let opportunityUrl;
    let insertionOrderNumber;

    // fixture(s)
    let agencyFixture;
    let accountFixture;
    let opportunityFixture;
    let productFixture;
    let ioFixture;

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
                .then( function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(201);

                    // assign shared test variable(s)
                    resText001 = JSON.parse(res.text);
                    resOutput001 = resText001.output;
                    done();
                })
                .catch( function(err) {
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
            {}, require(rootPath + '/fixtures/salesforce/account-create002')
        );
        opportunityFixture = Object.assign(
            {}, require(rootPath + '/fixtures/salesforce/opportunity-create002')
        );
        productFixture = Object.assign(
            {}, require(rootPath + '/fixtures/salesforce/product-create002')
        );
        ioFixture = Object.assign(
            {}, require(rootPath + '/fixtures/salesforce/io-create001')
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
                .enterWebsite(accountFixture.website)
                .enterLfmAgencyIdAgency(accountFixture.lfmAgencyId)
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
                .enterBrand(opportunityFixture.brand)
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

        it('should get the url for the created opportunity', function(done) {
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
                .enterFrequencyCap(productFixture.frequencyCap)
                .selectTimesPer(productFixture.timesPer)
                .selectPrimaryIABCat(productFixture.primaryIabCategory)
                .selectSecondaryIABCats(productFixture.secondaryIabCategories)
                .saveProduct()
                .then((res) => {
                    done();
                }, (err) => {

                    done(err);
                });
        });

        it('should initiate new insertion order creation', function(done) {
            let opportunitiesDetailPage = new OpportunitiesDetailPage(driver);
            opportunitiesDetailPage
                .navigate(opportunityUrl)
                .clickNewIOButton()
                .then((res) => {
                    done();
                }, (err) => {

                    done(err);
                });
        });

        it('should create a new insertion order', function(done) {
            let insertionOrderEditPage = new InsertionOrderEditPage(driver);
            // populate fixture fields
            ioFixture.flightStart = moment().format('MM/DD/YYYY');
            ioFixture.flightEnd = moment().endOf('week').format('MM/DD/YYYY');

            insertionOrderEditPage
                .enterCompanyName(ioFixture.companyName)
                .selectPaymentTerms(ioFixture.paymentTerms)
                .enterFlightStart(ioFixture.flightStart)
                .enterFlightEnd(ioFixture.flightEnd)
                .selectTrademarkUsage(ioFixture.trademarkUsage)
                .selectExclusivityClause(ioFixture.clause)
                .selectIOType(ioFixture.ioType)
                .isNonStandardIO(ioFixture.isNonStandard)
                .enterPrimaryContact(ioFixture.primaryContact)
                .enterBillingStreet(ioFixture.street)
                .enterBillingCity(ioFixture.city)
                .enterBillingState(ioFixture.state)
                .enterBillingZipCode(ioFixture.zipCode)
                .enterBillingCountry(ioFixture.country)
                .enterBillingContact(ioFixture.billingContact)
                .saveInsertionOrder()
                .then((res) => {
                    done();
                }, (err) => {

                    done(err);
                });
        });

        it('should get the created insertion order number', function(done) {
            let insertionOrderDetailPage = new InsertionOrderDetailPage(driver);
            insertionOrderDetailPage
                .getInsertionOrderNumber()
                .then((res) => {
                    insertionOrderNumber = res;
                    done();
                }, (err) => {

                    done(err);
                });
        });

        it('should sync opportunity to liveintent', function(done) {
            let opportunitiesDetailPage = new OpportunitiesDetailPage(driver);
            opportunitiesDetailPage
                .navigate(opportunityUrl)
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
                .then( function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(200);

                    // assign shared test variable(s)
                    resText002 = JSON.parse(res.text);
                    resOutput002 = resText002.output;
                    done();
                })
                .catch( function(err) {
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
                .to.equal(opportunityFixture.brand);
            expect(resOutput002[0].ownerName)
                .to.equal(resOutput001.name);
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
                .then( function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(200);

                    // assign shared test variable(s)
                    resText003 = JSON.parse(res.text);
                    resOutput003 = resText003.output;

                    // spot check response
                    expect(resOutput003).to.have.lengthOf(1);
                    done();
                })
                .catch( function(err) {
                    done(err);
                });
        });

        before('get insertion order details', function(done) {
            request(merlinTargetServer)
                .get(util.format(
                    merlinTargetEndpoint.insertionOrderDetails,
                    resOutput003[0].id
                )
                )
                .set(authHeaders)
                .then( function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(200);

                    // assign shared test variable(s)
                    resText004 = JSON.parse(res.text);
                    resOutput004 = resText004.output;
                    done();
                })
                .catch( function(err) {
                    done(err);
                });
        });

        it('notices and errors should not exist', function() {
            expect(resText004.notices).to.not.exist;
            expect(resText004.errors).to.not.exist;
        });

        it('response should match opportunity created on sf', function() {
            expect(resOutput004.name.includes(accountFixture.name))
                .to.be.true;
            expect(parseFloat(resOutput004.budget))
                .to.equal(productFixture.budget);
            expect(resOutput004.advertiser)
                .to.equal(resOutput002[0].id);
            expect(resOutput004.adServer)
                .to.equal(opportunityFixture.adServer);
            if (opportunityFixture.liNumbers === 'Yes') {
                expect(resOutput004.isLiBilling).to.be.true;
            } else {
                expect(resOutput004.isLiBilling).to.be.false;
            }
            expect(sfHelper.parseDate(resOutput004.startDate))
                .to.equal(opportunityFixture.liveDate);
            expect(sfHelper.parseDate(resOutput004.endDate))
                .to.equal(opportunityFixture.endDate);
            expect(resOutput004.admin.firstName)
                .to.equal(opportunityFixture.accountManager.firstName);
            expect(resOutput004.admin.lastName)
                .to.equal(opportunityFixture.accountManager.lastName);
            expect(resOutput004.executive.firstName)
                .to.equal(opportunityFixture.accountExecutive.firstName);
            expect(resOutput004.executive.lastName)
                .to.equal(opportunityFixture.accountExecutive.lastName);
        });

        it('response reference number should match sf io number', function() {
            expect(resOutput004.referenceNumber).to.equal(insertionOrderNumber);
        });
    });

    describe('merlin - verify campaign was created', function() {

        this.timeout(merlinTimeout);

        before('advanced search - campaign', function(done) {
            let payload = {
                'conditions': [
                    {'field': 'insertionOrder', 'value': resOutput004.id}
                ]
            };

            request(merlinTargetServer)
                .post(util.format(
                    merlinTargetEndpoint.searchCampaignAdvanced
                )
                )
                .set(authHeaders)
                .send(payload)
                .then( function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(200);

                    // assign shared test variable(s)
                    resText005 = JSON.parse(res.text);
                    resOutput005 = resText005.output;

                    // spot check response
                    expect(resOutput005).to.have.lengthOf(1);
                    done();
                })
                .catch( function(err) {
                    done(err);
                });
        });

        before('get campaign details', function(done) {
            request(merlinTargetServer)
                .get(util.format(
                    merlinTargetEndpoint.campaignDetails, resOutput005[0].id
                )
                )
                .set(authHeaders)
                .then( function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(200);

                    // assign shared test variable(s)
                    resText006 = JSON.parse(res.text);
                    resOutput006 = resText006.output;
                    done();
                })
                .catch( function(err) {
                    done(err);
                });
        });

        it('notices and errors should not exist', function() {
            expect(resText006.notices).to.not.exist;
            expect(resText006.errors).to.not.exist;
        });

        it('response should match product created on sf', function() {
            expect(resOutput006.name)
                .to.equal(productFixture.name);
            expect(resOutput006.insertionOrder)
                .to.equal(resOutput004.id);
            expect(resOutput006.category)
                .to.equal(productFixture.primaryIabCategory);
            expect(resOutput006.secondaryCategories)
                .to.eql(productFixture.secondaryIabCategories);
            expect(parseFloat(resOutput006.budget))
                .to.equal(productFixture.budget);
            expect(resOutput006.bidAmount)
                .to.equal(productFixture.cpmBidAmount);
            expect(resOutput006.pricingModel)
                .to.equal(productFixture.campaignGoal.pricingModel);
            expect(resOutput006.clearingMethod)
                .to.equal(productFixture.campaignGoal.clearingMethod);
            expect(resOutput006.goal)
                .to.equal(productFixture.campaignGoal.goal);
            expect(resOutput006.demandType)
                .to.equal('exchange');
            expect(resOutput006.type)
                .to.equal('newsletter');
            expect(resOutput006.frequencyCapCount)
                .to.equal(productFixture.frequencyCap);
            expect(sfHelper.parseFreqCapPeriod(resOutput006.frequencyCapPeriod))
                .to.equal(productFixture.timesPer);
            expect(sfHelper.parseDate(resOutput006.insertionOrderStartDate))
                .to.equal(opportunityFixture.liveDate);
            expect(sfHelper.parseDate(resOutput006.insertionOrderEndDate))
                .to.equal(opportunityFixture.endDate);
            expect(sfHelper.parseComment(resOutput006.comment))
                .to.eql({
                    'startDate': productFixture.liveDate,
                    'endDate': productFixture.endDate
                });
            if (productFixture.campaignGoal.index === 2 ||
                productFixture.campaignGoal.index === 3 ) {
                expect(resOutput006.system).to.equal('dsp');
            } else {
                expect(resOutput006.system).to.equal('ssp');
            }
        });
    });

    after('merlin - delete agency', function(done) {
        request(merlinTargetServer)
            .del(util.format(
                merlinTargetEndpoint.agencyDelete, resOutput001.id
            )
            )
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

});
