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
const errors = require(rootPath + '/fixtures/salesforce/errors');

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

describe('{{SALESFORCE}} client direct - direct advertiser - {create} >>> ' +
    '(-) linked to lfm pixel from different advertiser >>>', function() {

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
    let resText001;
    let resText002;
    let resText003;
    let resText004;
    let resText005;
    let resText006;
    let resText007;
    let resText008;

    // fixture(s)
    let agencyFixture001;
    let agencyFixture002;
    let advertiserFixture;
    let pixelFixture;
    let accountFixture;
    let opportunityFixture;
    let productFixture;

    // disable mocha time outs
    this.timeout(0);

    describe('merlin - create agency and pixel', function() {

        this.timeout(merlinTimeout);

        before('generate auth headers', function(done) {
            const genAuthHeaders = merlinAuthHeaders(merlinTargetUser);
            genAuthHeaders.then(function(headers) {
                authHeaders = headers;
                done();
            });
        });

        before('create agency 001 - minimum required', function(done) {
            agencyFixture001 = Object.assign(
                {}, require(rootPath + '/fixtures/common/agency/create002')
            );

            agencyFixture001.name += timeStamp;
            agencyFixture001.type = 'Agency';

            request(merlinTargetServer)
                .post(util.format(merlinTargetEndpoint.agencyCreate))
                .set(authHeaders)
                .send(agencyFixture001)
                .then(function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(201);

                    // assign shared test variable(s)
                    resText001 = JSON.parse(res.text);
                    resOutput001 = resText001.output;

                    // spot check response
                    expect(resText001.notices).to.not.exist;
                    expect(resText001.errors).to.not.exist;
                    expect(resOutput001.name).to.equal(agencyFixture001.name);
                    expect(resOutput001.manager)
                        .to.equal(agencyFixture001.manager);
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        before('create agency 002 - minimum required', function(done) {
            agencyFixture002 = Object.assign(
                {}, require(rootPath + '/fixtures/common/agency/create002')
            );

            agencyFixture002.name += timeStamp;
            agencyFixture002.type = 'Agency';

            request(merlinTargetServer)
                .post(util.format(merlinTargetEndpoint.agencyCreate))
                .set(authHeaders)
                .send(agencyFixture002)
                .then(function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(201);

                    // assign shared test variable(s)
                    resText002 = JSON.parse(res.text);
                    resOutput002 = resText002.output;

                    // spot check response
                    expect(resText002.notices).to.not.exist;
                    expect(resText002.errors).to.not.exist;
                    expect(resOutput002.name).to.equal(agencyFixture002.name);
                    expect(resOutput002.manager)
                        .to.equal(agencyFixture002.manager);
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        before('create advertiser - minimum required', function(done) {
            advertiserFixture = Object.assign(
                {}, require(rootPath + '/fixtures/common/advertiser/create001')
            );

            advertiserFixture.name += timeStamp;
            advertiserFixture.owner = {'type': 'Agency', 'id': resOutput002.id};

            request(merlinTargetServer)
                .post(util.format(merlinTargetEndpoint.advertiserCreate))
                .set(authHeaders)
                .send(advertiserFixture)
                .then(function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(201);

                    // assign shared test variable(s)
                    resText003 = JSON.parse(res.text);
                    resOutput003 = resText003.output;

                    // spot check response
                    expect(resText003.notices).to.not.exist;
                    expect(resText003.errors).to.not.exist;
                    expect(resOutput003.name).to.equal(advertiserFixture.name);
                    expect(resOutput003.admin)
                        .to.equal(advertiserFixture.admin);
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        before('create pixel - minimum required', function(done) {
            pixelFixture = Object.assign(
                {}, require(rootPath + '/fixtures/common/pixel/create001')
            );

            pixelFixture.name += timeStamp;
            pixelFixture.advertiser = resOutput003.id;

            request(merlinTargetServer)
                .post(util.format(merlinTargetEndpoint.pixelCreate))
                .set(authHeaders)
                .send(pixelFixture)
                .then(function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(201);

                    // assign shared test variable(s)
                    resText004 = JSON.parse(res.text);
                    resOutput004 = resText004.output;
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        it('notices and errors should not exist', function() {
            expect(resText004.notices).to.not.exist;
            expect(resText004.errors).to.not.exist;
        });

        it('response should match test object', function() {
            expect(resOutput004.name)
                .to.equal(pixelFixture.name);
            expect(resOutput004.advertiser.id)
                .to.equal(pixelFixture.advertiser);
            expect(resOutput004.advertiser.name)
                .to.equal(advertiserFixture.name);
        });

    });

    describe('salesforce - create a direct advertiser opp >>>', function() {

        let driver;
        accountFixture = Object.assign(
            {}, require(rootPath + '/fixtures/salesforce/account-create001')
        );
        opportunityFixture = Object.assign(
            {}, require(rootPath + '/fixtures/salesforce/opportunity-create001')
        );
        productFixture = Object.assign(
            {}, require(rootPath + '/fixtures/salesforce/product-create003')
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

        it('should create a new product', function(done) {
            let productEditPage = new ProductEditPage(driver);
            // populate fixture fields
            productFixture.name += timeStamp;
            productFixture.lfmPixelId = resOutput004.refId;
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
                .checkPixelRadioBtn()
                .enterLfmPixelId(productFixture.lfmPixelId)
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

        it('should fail to sync to liveintent', function(done) {
            let opportunitiesDetailPage = new OpportunitiesDetailPage(driver);
            opportunitiesDetailPage
                .getChatterFeed(errors.campaignSyncError)
                .then((res) => {
                    expect(res).to.be.true;
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

        it('only one advertiser should be created', function() {
            expect(resOutput005).to.have.lengthOf(1);
        });

        it('response should match advertiser created on lsd', function() {
            expect(resOutput005[0].name)
                .to.equal(accountFixture.name);
            expect(resOutput005[0].ownerName)
                .to.equal(resOutput001.name);
            expect(resOutput005[0].agency)
                .to.equal(resOutput001.id);
            expect(resOutput005[0].domain)
                .to.equal(opportunityFixture.domain);
            expect(resOutput005[0].category)
                .to.equal(opportunityFixture.iabCategory);
        });

    });

    describe('merlin - verify insertion order was created', function() {

        this.timeout(merlinTimeout);

        before('advanced search - insertion order', function(done) {
            let payload = {
                'conditions': [
                    {'field': 'advertiser', 'value': resOutput005[0].id}
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
                    resText006 = JSON.parse(res.text);
                    resOutput006 = resText006.output;

                    // spot check response
                    expect(resOutput006).to.have.lengthOf(1);
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
                    resOutput006[0].id
                )
                )
                .set(authHeaders)
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

        it('notices and errors should not exist', function() {
            expect(resText007.notices).to.not.exist;
            expect(resText007.errors).to.not.exist;
        });

        it('response should match opportunity created on sf', function() {
            expect(resOutput007.name.includes(accountFixture.name))
                .to.be.true;
            expect(parseFloat(resOutput007.budget))
                .to.equal(productFixture.budget);
            expect(resOutput007.advertiser)
                .to.equal(resOutput005[0].id);
            expect(resOutput007.adServer)
                .to.equal(opportunityFixture.adServer);
            expect(sfHelper.parseDate(resOutput007.startDate))
                .to.equal(opportunityFixture.liveDate);
            expect(sfHelper.parseDate(resOutput007.endDate))
                .to.equal(opportunityFixture.endDate);
            expect(resOutput007.admin.firstName)
                .to.equal(opportunityFixture.accountManager.firstName);
            expect(resOutput007.admin.lastName)
                .to.equal(opportunityFixture.accountManager.lastName);
            expect(resOutput007.executive.firstName)
                .to.equal(opportunityFixture.accountExecutive.firstName);
            expect(resOutput007.executive.lastName)
                .to.equal(opportunityFixture.accountExecutive.lastName);
        });
    });

    describe('merlin - verify no campaign was created', function() {

        this.timeout(merlinTimeout);

        before('advanced search - campaign', function(done) {
            let payload = {
                'conditions': [
                    {'field': 'insertionOrder', 'value': resOutput007.id}
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
                    resText008 = JSON.parse(res.text);
                    resOutput008 = resText008.output;

                    // spot check response
                    expect(resOutput008).to.have.lengthOf(0);
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        it('should not create any campaigns', function() {
            expect(resOutput008).to.have.lengthOf(0);
        });

    });

    after('merlin - delete agency 001', function(done) {
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

    after('merlin - delete agency 002', function(done) {
        request(merlinTargetServer)
            .del(util.format(
                merlinTargetEndpoint.agencyDelete, resOutput002.id
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
