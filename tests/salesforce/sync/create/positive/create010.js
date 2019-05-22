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

describe('{{SALESFORCE}} client direct - direct-advertiser {create} >>> ' +
    '(+) advertiser relinking on error >>>', function() {

    // shared test variable(s)
    const timeStamp = '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SSS');

    // merlin shared test variable(s)
    let authHeaders;
    let resOutput001;
    let resOutput002;
    let resOutput003;
    let resOutput004;
    let resOutput005;
    let resText001;
    let resText002;
    let resText003;
    let resText004;
    let resText005;

    // salesforce shared test variable(s)
    let driver;

    // fixture(s)
    let agencyFixture;
    let accountFixture;
    let opportunityFixture;
    let productFixture;

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

    describe('salesforce - create opportunity that fails sync >>>', function() {

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

        it('should create a new product - no pixel', function(done) {
            let productEditPage = new ProductEditPage(driver);
            // populate fixture fields
            productFixture.name += timeStamp;
            productFixture.liveDate = moment().format('MM/DD/YYYY');
            productFixture.endDate =
                moment().endOf('week').format('MM/DD/YYYY');
            // CPA: Requires a pixel but none provided
            productFixture.invalidGoal = 5;
            productEditPage
                .selectCampaignType(productFixture.type)
                .enterCampaignName(productFixture.name)
                .enterFlightStart(productFixture.liveDate)
                .enterEndDate(productFixture.endDate)
                .enterBudget(productFixture.budget)
                .selectCampaignGoal(productFixture.invalidGoal)
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

        it('should attempt to sync opportunity to liveintent', function(done) {
            let opportunitiesDetailPage = new OpportunitiesDetailPage(driver);
            opportunitiesDetailPage
                .syncToLiveIntent()
                .then((res) => {
                    done();
                }, (err) => {

                    done(err);
                });
        });

        it('should fail to sync opportunity to liveintent', function(done) {
            let opportunitiesDetailPage = new OpportunitiesDetailPage(driver);
            opportunitiesDetailPage
                .getChatterFeed(
                    'LiveIntent.Campaign could not be created/updated in LSD'
                )
                .then((res) => {
                    expect(res).to.be.true;
                    done();
                }, (err) => {

                    done(err);
                });
        });

    });

    describe('salesforce - update opp for successful resync >>>', function() {

        it('should open product edit page', function(done) {
            let opportunitiesDetailPage = new OpportunitiesDetailPage(driver);
            opportunitiesDetailPage
                .clickAddProdButton()
                .then((res) => {
                    done();
                }, (err) => {

                    done(err);
                });
        });

        it('should update product campaign goal', function(done) {
            let productEditPage = new ProductEditPage(driver);
            productEditPage
                .selectCampaignGoal(productFixture.campaignGoal.index)
                .saveProduct()
                .then((res) => {
                    done();
                }, (err) => {

                    done(err);
                });
        });

        it('should resync opportunity to liveintent', function(done) {
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

    describe('merlin - verify an advertiser was created', function() {

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

        let resText;
        let resOutput;

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
                    resText = JSON.parse(res.text);
                    resOutput = resText.output;

                    // spot check response
                    expect(resOutput).to.have.lengthOf(1);
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        before('get insertion order details', function(done) {
            request(merlinTargetServer)
                .get(util.format(
                    merlinTargetEndpoint.insertionOrderDetails,
                    resOutput[0].id
                )
                )
                .set(authHeaders)
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

        it('response should match opportunity created on sf', function() {
            expect(resOutput003.name.includes(accountFixture.name))
                .to.be.true;
            expect(parseFloat(resOutput003.budget))
                .to.equal(productFixture.budget);
            expect(resOutput003.advertiser)
                .to.equal(resOutput002[0].id);
            expect(resOutput003.adServer).to.equal(opportunityFixture.adServer);
            if (opportunityFixture.liNumbers === 'Yes') {
                expect(resOutput003.isLiBilling).to.be.true;
            } else {
                expect(resOutput003.isLiBilling).to.be.false;
            }
            expect(sfHelper.parseDate(resOutput003.startDate))
                .to.equal(opportunityFixture.liveDate);
            expect(sfHelper.parseDate(resOutput003.endDate))
                .to.equal(opportunityFixture.endDate);
            expect(resOutput003.admin.firstName)
                .to.equal(opportunityFixture.accountManager.firstName);
            expect(resOutput003.admin.lastName)
                .to.equal(opportunityFixture.accountManager.lastName);
            expect(resOutput003.executive.firstName)
                .to.equal(opportunityFixture.accountExecutive.firstName);
            expect(resOutput003.executive.lastName)
                .to.equal(opportunityFixture.accountExecutive.lastName);
        });
    });

    describe('merlin - verify campaign was created', function() {

        this.timeout(merlinTimeout);

        before('advanced search - campaign', function(done) {
            let payload = {
                'conditions': [
                    {'field': 'insertionOrder', 'value': resOutput003.id}
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
