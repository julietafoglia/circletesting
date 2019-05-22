'use strict';

// vendor dependencies
const chance = require('chance').Chance();
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
    require(rootPath + '/fixtures/common/agency/create001');
const setupFixture002 =
    require(rootPath + '/fixtures/common/advertiser/create001');
const setupFixture003 =
    require(rootPath + '/fixtures/common/insertion-order/create003');
const testFixture =
    require(rootPath + '/fixtures/common/insertion-order/save002');

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

describe('{{MERLIN}} /insertion-order {id save} @ADMIN >>> ' +
    '(+) body - null non-required fields >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('generate auth headers', function(done) {
        // generate auth headers
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('create agency', function(done) {
        sendBody001 = Object.assign({}, setupFixture001);

        sendBody001.name += timeStamp;

        // assign random string to salesforce id
        sendBody001.salesforceId = chance.string({length: 18});

        request(targetServer)
            .post(util.format(targetEndpoint.agencyCreate))
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
                expect(resOutput001.name).to.have.length.of.at.most(32);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create advertiser', function(done) {
        sendBody002 = Object.assign({}, setupFixture002);

        // assign name and owner
        sendBody002.name += timeStamp;
        sendBody002.owner.type = 'Agency';
        sendBody002.owner.id = resOutput001.id;

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
                expect(resOutput002.owner.id).to.equal(sendBody002.owner.id);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create insertion order', function(done) {
        sendBody003 = Object.assign({}, setupFixture003);

        // assign advertiser, name and flight dates
        sendBody003.advertiser = resOutput002.id;
        sendBody003.name += timeStamp;
        sendBody003.startDate = timeToday;
        sendBody003.endDate =
            moment().add(30, 'days').format('YYYY-MM-DD HH:mm:ss');

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

    before('save insertion order - null non-required', function(done) {

        sendBody004 = Object.assign({}, testFixture);

        // assign name and version
        sendBody004.name = resOutput003.name + '@v2';
        sendBody004.version = resOutput003.version;

        request(targetServer)
            .post(util.format(
                targetEndpoint.insertionOrderSave, resOutput003.id
            )
            )
            .set(authHeaders)
            .send(sendBody004)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

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

    it('response have status of 200', function() {
        expect(res004.status).to.equal(200);
    });

    it('version should be request object version + 1', function() {
        expect(resOutput004.version).to.equal(
            resOutput003.version + 1
        );
    });

    it('notices and errors should not exist', function() {
        expect(resText004.notices).to.not.exist;
        expect(resText004.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(validator.isInt(resOutput004.id + '')).to.be.true;
        expect(validator.isInt(resOutput004.version + '')).to.be.true;
        expect(resOutput004.status).to.be.oneOf([
            'pending', 'inactive', 'active'
        ]);
        expect(/^[a-f0-9]{32}$/.test(resOutput004.advertiser)).to.be.true;
        expect(resOutput004.isFallback).to.be.a('boolean');
        expect(resOutput004.name).to.have.length.of.at.most(128);
        if (resOutput004.budget !== null) {
            expect(resOutput004.budget).to.be.a('number');
        }
        expect(resOutput004.isUnlimitedBudget).to.be.a('boolean');
        expect(resOutput004.budgetAllocated).to.be.a('number');
        expect(resOutput004.spend).to.be.a('number');
        if (resOutput004.impressions !== null) {
            expect(validator.isInt(resOutput004.impressions + '',
                {'max': 99999999999})).to.be.true;
        }
        if (resOutput004.startDate !== null) {
            expect(validator.isDate(resOutput004.startDate)).to.be.true;
        }
        if (resOutput004.endDate !== null) {
            expect(validator.isDate(resOutput004.endDate)).to.be.true;
        }
        expect(/^[a-f0-9]{32}$/.test(resOutput004.admin.hash)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.executive.hash)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.trafficker.hash)).to.be.true;
        if (resOutput004.referenceNumber !== null) {
            expect(resOutput004.referenceNumber)
                .to.have.length.of.at.most(256);
        }
        if (resOutput004.externalId !== null) {
            expect(resOutput004.externalId)
                .to.have.length.of.at.most(128);
        }
        if (resOutput004.agencyCampaign !== null) {
            expect(resOutput004.agencyCampaign)
                .to.have.length.of.at.most(256);
        }
        if (resOutput004.adServer !== null) {
            expect(resOutput004.adServer).to.be.oneOf([
                'LiveIntent', 'DART', 'MediaMind',
                'Atlas', 'MediaPlex', 'Other'
            ]);
        }
        if (resOutput004.paymentTerms !== null) {
            expect(resOutput004.paymentTerms).to.be.oneOf([
                'Prepay', 'Net 15', 'Net 30', 'Net 45', 'Net 60'
            ]);
        }
        expect(resOutput004.isFallback).to.be.a('boolean');
        // created and modified
        expect(validator.isISO8601(resOutput004.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput004.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.modifiedBy)).to.be.true;
    });

    it('response object key values should match test object', function() {
        expect(resOutput004.status)
            .to.equal(resOutput003.status);
        expect(resOutput004.advertiser)
            .to.equal(resOutput003.advertiser);
        expect(resOutput004.isFallback)
            .to.equal(resOutput003.isFallback);
        expect(resOutput004.name)
            .to.equal(sendBody004.name); // check updated
        expect(resOutput004.budget)
            .to.equal(sendBody004.budget); // check updated
        expect(resOutput004.isUnlimitedBudget)
            .to.equal(sendBody004.isUnlimitedBudget);
        expect(resOutput004.budgetAllocated)
            .to.equal(resOutput003.budgetAllocated);
        expect(resOutput004.spend)
            .to.equal(resOutput003.spend);
        expect(resOutput004.impressions)
            .to.equal(resOutput003.impressions);
        expect(resOutput004.startDate)
            .to.equal(sendBody003.startDate); // check updated
        expect(resOutput004.endDate)
            .to.equal(sendBody003.endDate); // check updated
        expect(resOutput004.admin.hash)
            .to.equal(resOutput003.admin.hash);
        expect(resOutput004.executive.hash)
            .to.equal(resOutput003.executive.hash);
        expect(resOutput004.trafficker.hash)
            .to.equal(resOutput003.trafficker.hash);
        expect(resOutput004.referenceNumber)
            .to.equal(sendBody004.referenceNumber); // check updated
        expect(resOutput004.externalId)
            .to.equal(sendBody004.externalId); // check updated
        expect(resOutput004.agencyCampaign)
            .to.equal(sendBody004.agencyCampaign); // check updated
        expect(resOutput004.adServer)
            .to.equal(sendBody004.adServer); // check updated
        expect(resOutput004.paymentTerms)
            .to.equal(sendBody004.paymentTerms); // check updated
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
