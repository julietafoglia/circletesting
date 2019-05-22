'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const moment = require('moment');
const request = require('supertest-as-promised');
const util = require('util');
const validator = require('validator');

// runtime variables
const rootPath =
    process.env.ROOT_PATH;
const targetEndpoint =
    require(rootPath + '/config/merlin/endpoints');
const targetEnvironment =
    require(rootPath + '/config/merlin/' + process.env.NODE_ENV);
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetServer =
    targetEnvironment.server;
const targetUser =
    usersTargetEnvironment.admin;
const merlinAuthHeaders =
    require(rootPath + '/helpers/merlin-auth-headers');
const requestTimeOut = 10000;
const timeStamp =
    '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');
const timeToday =
    moment().format('YYYY-MM-DD HH:mm:ss');


// fixture(s)
const setupFixture001 =
    require(rootPath + '/fixtures/common/media-group/create001');
const setupFixture002 =
    require(rootPath + '/fixtures/common/advertiser/create001');
const setupFixture003 =
    require(rootPath + '/fixtures/common/insertion-order/create001');
const testFixture =
    require(rootPath + '/fixtures/common/campaign/create001');
const verifyFixture =
    require(rootPath + '/fixtures/common/campaign/create001-verify');

// shared test variable(s)
let authHeaders;
let res004;
let resText001;
let resText002;
let resText003;
let resText004;
let resOutput001;
let resOutput002;
let resOutput003;
let resOutput004;
let sendBody001;
let sendBody002;
let sendBody003;
let sendBody004;

describe('{{MERLIN}} /campaign {create} @ADMIN >>> ' +
    '(+) body - minimum required - media group >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('generate auth headers', function(done) {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('create media group - minimum required fields', function(done) {

        sendBody001 = Object.assign({}, setupFixture001);

        sendBody001.name += timeStamp;

        request(targetServer)
            .post(util.format(targetEndpoint.mediaGroupCreate))
            .set(authHeaders)
            .send(sendBody001)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText001 = JSON.parse(res.text);
                resOutput001 = resText001.output;

                // spot check response
                expect(/^[a-f0-9]{32}$/.test(resOutput001.id)).to.be.true;
                expect(resOutput001.name).to.have.length.of.at.most(128);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create advertiser', function(done) {
        sendBody002 = {};
        Object.assign(
            sendBody002,
            setupFixture002
        );

        // assign owner
        sendBody002.owner.type =
            'Media Group';
        sendBody002.owner.id =
            resOutput001.id;

        request(targetServer)
            .post(util.format(targetEndpoint.advertiserCreate))
            .set(authHeaders)
            .send(sendBody002)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText002 = JSON.parse(res.text);
                resOutput002 = resText002.output;

                // spot check response
                expect(/^[a-f0-9]{32}$/.test(resOutput002.id)).to.be.true;
                expect(resOutput002.name).to.have.length.of.at.most(255);
                expect(/^[a-f0-9]{32}$/.test(resOutput002.admin)).to.be.false;
                expect(resOutput002.owner.id).to.equal(sendBody002.owner.id);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create insertion order', function(done) {
        sendBody003 = {};
        Object.assign(
            sendBody003,
            setupFixture003
        );

        // assign advertiser
        sendBody003.advertiser = resOutput002.id;
        sendBody003.startDate = timeToday;
        sendBody003.endDate = moment().add(30, 'days');

        request(targetServer)
            .post(util.format(targetEndpoint.insertionOrderCreate))
            .set(authHeaders)
            .send(sendBody003)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText003 = JSON.parse(res.text);
                resOutput003 = resText003.output;

                // spot check response
                expect(validator.isInt(resOutput003.id + '')).to.be.true;
                expect(resOutput003.name).to.have.length.of.at.most(128);
                expect(/^[a-f0-9]{32}$/.test(resOutput003.admin.hash))
                    .to.be.true;
                expect(resOutput003.advertiser)
                    .to.equal(sendBody003.advertiser);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create campaign - ' +
        'minimum required - agency', function(done) {

        sendBody004 = {};
        Object.assign(
            sendBody004,
            testFixture
        );

        // assign insertion order
        sendBody004.insertionOrder = resOutput003.id;

        request(targetServer)
            .post(util.format(targetEndpoint.campaignCreate))
            .set(authHeaders)
            .send(sendBody004)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                res004 = res;
                resText004 = JSON.parse(res.text);
                resOutput004 = resText004.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response have status of 201', function() {
        expect(res004.status).to.equal(201);
    });

    it('notices and errors should not exist', function() {
        expect(resText004.notices).to.not.exist;
        expect(resText004.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput004.id)).to.be.true;
        expect(validator.isInt(resOutput004.version + '')).to.be.true;
        expect(validator.isInt(resOutput004.refId + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.advertiser)).to.be.true;
        expect(validator.isInt(resOutput004.insertionOrder + '')).to.be.true;
        expect(validator.isInt(resOutput004.category + '')).to.be.true;
        if (resOutput004.secondaryCategories !== null) {
            expect(resOutput004.secondaryCategories).to.be.an('array');
        }
        if (resOutput004.externalId !== null) {
            expect(resOutput004.externalId)
                .to.have.length.of.at.most(128);
        }
        if (resOutput004.conversionPixel !== null) {
            expect(/^[a-f0-9]{32}$/.test(resOutput004.conversionPixel))
                .to.be.true;
        }
        expect(resOutput004.name).to.have.length.of.at.most(255);
        if (resOutput004.demandType !== null) {
            expect(resOutput004.demandType).to.be.oneOf([
                'house', 'direct', 'exchange'
            ]);
        }
        expect(resOutput004.status)
            .to.be.oneOf(['active', 'inactive', 'pending']);
        expect(resOutput004.type).to.be.oneOf([
            'dedicated', 'display', 'newsletter', 'takeover', 'roadblock'
        ]);
        expect(resOutput004.system).to.be.oneOf(['ssp', 'dsp']);
        expect(resOutput004.budgetType)
            .to.be.oneOf(['currency', 'impressions']);
        expect(resOutput004.pricingModel).to.be.oneOf(['CPM', 'CPC', 'CPA']);
        expect(resOutput004.clearingMethod)
            .to.be.oneOf(['1stPrice', '2ndPrice']);
        expect(resOutput004.bidAmount).to.be.a('number');
        if (resOutput004.goal !== null) {
            expect(resOutput004.goal).to.be.oneOf([
                'MaxCTR', 'MaxConversionRate', 'CPM', 'CPC', 'CPA'
            ]);
        }
        expect(resOutput004.ecpm).to.be.a('number');
        expect(resOutput004.minCpm).to.be.a('number');
        expect(resOutput004.maxCpm).to.be.a('number');
        expect(resOutput004.guaranteed).to.be.a('boolean');
        expect(resOutput004.clickDecision).to.be.a('boolean');
        if (resOutput004.dspFee !== null) {
            expect(validator.isInt(resOutput004.dspFee + '', {'max': 99}))
                .to.be.true;
        }
        if (resOutput004.sspFee !== null) {
            expect(validator.isInt(resOutput004.sspFee + '', {'max': 99}))
                .to.be.true;
        }
        expect(validator.isInt(resOutput004.shareOfVoice + '', {'max': 999}))
            .to.be.true;
        if (resOutput004.frequencyCapCount !== null) {
            expect(validator.isInt(resOutput004.frequencyCapCount + ''))
                .to.be.true;
        }
        if (resOutput004.frequencyCapPeriod !== null) {
            expect(resOutput004.frequencyCapPeriod).to.be.oneOf([
                'minute', 'hourly', 'daily', 'weekly', 'monthly'
            ]);
        }
        expect(resOutput004.budget).to.be.a('number');
        expect(resOutput004.failed).to.be.a('boolean');
        expect(resOutput004.special).to.be.a('boolean');
        expect(resOutput004.spend).to.be.a('number');
        expect(validator.isInt(resOutput004.impressions + '')).to.be.true;
        expect(validator.isInt(resOutput004.clicks + '')).to.be.true;
        expect(validator.isInt(resOutput004.conversions + '')).to.be.true;
        expect(resOutput004.pace).to.be.a('number');
        expect(validator.isDate(resOutput004.insertionOrderStartDate))
            .to.be.true;
        expect(validator.isDate(resOutput004.insertionOrderEndDate))
            .to.be.true;
        if (resOutput004.description !== null) {
            expect(resOutput004.description).to.have.length.of.at.most(255);
        }
        expect(resOutput004.hasStats).to.be.a('boolean');
        // created and modified
        expect(validator.isISO8601(resOutput004.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput004.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.modifiedBy)).to.be.true;
    });

    it('response object key values ' +
        'should match verify object(s)', function() {
        expect(resOutput004.version)
            .to.equal(verifyFixture.version);
        expect(resOutput004.advertiser)
            .to.equal(resOutput002.id);
        expect(resOutput004.insertionOrder)
            .to.equal(resOutput003.id);
        expect(resOutput004.category)
            .to.equal(verifyFixture.category);
        expect(resOutput004.secondaryCategories)
            .to.eql(verifyFixture.secondaryCategories);
        expect(resOutput004.externalId)
            .to.equal(verifyFixture.externalId);
        expect(resOutput004.conversionPixel)
            .to.equal(verifyFixture.conversionPixel);
        expect(resOutput004.name)
            .to.equal(verifyFixture.name);
        expect(resOutput004.status)
            .to.equal(verifyFixture.status);
        expect(resOutput004.type)
            .to.equal(verifyFixture.type);
        expect(resOutput004.system)
            .to.equal(verifyFixture.system);
        expect(resOutput004.budgetType)
            .to.equal(verifyFixture.budgetType);
        expect(resOutput004.pricingModel)
            .to.equal(verifyFixture.pricingModel);
        expect(resOutput004.clearingMethod)
            .to.equal(verifyFixture.clearingMethod);
        expect(resOutput004.bidAmount)
            .to.equal(verifyFixture.bidAmount);
        expect(resOutput004.bidAmount)
            .to.equal(verifyFixture.bidAmount);
        expect(resOutput004.goal)
            .to.equal(verifyFixture.goal);
        expect(resOutput004.ecpm)
            .to.equal(verifyFixture.ecpm);
        expect(resOutput004.minCpm)
            .to.equal(verifyFixture.minCpm);
        expect(resOutput004.maxCpm)
            .to.equal(verifyFixture.maxCpm);
        expect(resOutput004.guaranteed)
            .to.equal(verifyFixture.guaranteed);
        expect(resOutput004.clickDecision)
            .to.equal(verifyFixture.clickDecision);
        expect(resOutput004.dspFee)
            .to.equal(verifyFixture.dspFee);
        expect(resOutput004.sspFee)
            .to.equal(verifyFixture.sspFee);
        expect(resOutput004.shareOfVoice)
            .to.equal(verifyFixture.shareOfVoice);
        expect(resOutput004.frequencyCapCount)
            .to.equal(verifyFixture.frequencyCapCount);
        expect(resOutput004.frequencyCapPeriod)
            .to.equal(verifyFixture.frequencyCapPeriod);
        expect(resOutput004.budget)
            .to.equal(verifyFixture.budget);
        expect(resOutput004.failed)
            .to.equal(verifyFixture.failed);
        expect(resOutput004.special)
            .to.equal(verifyFixture.special);
        expect(resOutput004.spend)
            .to.equal(verifyFixture.spend);
        expect(resOutput004.impressions)
            .to.equal(verifyFixture.impressions);
        expect(resOutput004.clicks)
            .to.equal(verifyFixture.clicks);
        expect(resOutput004.conversions)
            .to.equal(verifyFixture.conversions);
        expect(resOutput004.pace)
            .to.equal(verifyFixture.pace);
        expect(resOutput004.insertionOrderStartDate)
            .to.equal(resOutput003.startDate);
        expect(resOutput004.insertionOrderEndDate)
            .to.equal(resOutput003.endDate);
        expect(resOutput004.description)
            .to.equal(verifyFixture.description);
        expect(resOutput004.hasStats)
            .to.equal(verifyFixture.hasStats);
    });

    after('delete campaign', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.campaignDelete, resOutput004.id))
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

    after('delete insertion order', function(done) {
        request(targetServer)
            .del(util.format(
                targetEndpoint.insertionOrderDelete, resOutput003.id
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

    after('delete advertiser', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.advertiserDelete, resOutput002.id))
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

    after('delete agency', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.agencyDelete, resOutput001.id))
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
