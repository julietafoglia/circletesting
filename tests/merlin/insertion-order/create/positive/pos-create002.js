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
    require(rootPath + '/fixtures/common/media-group/create002');
const setupFixture002 =
    require(rootPath + '/fixtures/common/advertiser/create001');
const testFixture =
    require(rootPath + '/fixtures/common/insertion-order/create001');
const verifyFixture =
    require(rootPath + '/fixtures/common/insertion-order/create001-verify');

// shared test variable(s)
let authHeaders;
let res003;
let resText001;
let resText002;
let resText003;
let resOutput001;
let resOutput002;
let resOutput003;
let sendBody001;
let sendBody002;
let sendBody003;

describe('{{MERLIN}} <SMOKE> /insertion-order {create} @ADMIN >>> ' +
    '(+) body - minimum required - media group >>>', function() {

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

    before('create media-group', function(done) {

        sendBody001 = Object.assign({}, setupFixture001);

        // assign name
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
        sendBody002 = Object.assign({}, setupFixture002);

        // assign name and owner
        sendBody002.name += timeStamp;
        sendBody002.owner.type = 'Media Group';
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

    before('create insertion order - minimum required', function(done) {

        sendBody003 = Object.assign({}, testFixture);

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
                res003 = res;
                resText003 = JSON.parse(res.text);
                resOutput003 = resText003.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response have status of 201', function() {
        expect(res003.status).to.equal(201);
    });

    it('notices and errors should not exist', function() {
        expect(resText003.notices).to.not.exist;
        expect(resText003.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(validator.isInt(resOutput003.id + '')).to.be.true;
        expect(validator.isInt(resOutput003.version + '')).to.be.true;
        expect(resOutput003.status).to.be.oneOf([
            'pending', 'inactive', 'active'
        ]);
        expect(/^[a-f0-9]{32}$/.test(resOutput003.advertiser)).to.be.true;
        expect(resOutput003.isFallback).to.be.a('boolean');
        expect(resOutput003.name).to.have.length.of.at.most(128);
        if (resOutput003.budget !== null) {
            expect(resOutput003.budget).to.be.a('number');
        }
        expect(resOutput003.isUnlimitedBudget).to.be.a('boolean');
        expect(resOutput003.budgetAllocated).to.be.a('number');
        expect(resOutput003.spend).to.be.a('number');
        if (resOutput003.impressions !== null) {
            expect(validator.isInt(resOutput003.impressions + '',
                {'max': 99999999999})).to.be.true;
        }
        expect(validator.isDate(resOutput003.startDate)).to.be.true;
        expect(validator.isDate(resOutput003.endDate)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.admin.hash)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.executive.hash)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.trafficker.hash)).to.be.true;
        if (resOutput003.referenceNumber !== null) {
            expect(resOutput003.referenceNumber)
                .to.have.length.of.at.most(256);
        }
        if (resOutput003.externalId !== null) {
            expect(resOutput003.externalId)
                .to.have.length.of.at.most(128);
        }
        if (resOutput003.agencyCampaign !== null) {
            expect(resOutput003.agencyCampaign)
                .to.have.length.of.at.most(256);
        }
        if (resOutput003.adServer !== null) {
            expect(resOutput003.adServer).to.be.oneOf([
                'LiveIntent', 'DART', 'MediaMind',
                'Atlas', 'MediaPlex', 'Other'
            ]);
        }
        if (resOutput003.paymentTerms !== null) {
            expect(resOutput003.paymentTerms).to.be.oneOf([
                'Prepay', 'Net 15', 'Net 30', 'Net 45', 'Net 60'
            ]);
        }
        expect(resOutput003.isFallback).to.be.a('boolean');
        // created and modified
        expect(validator.isISO8601(resOutput003.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput003.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.modifiedBy)).to.be.true;
    });

    it('response object key values should match verify object(s)', function() {
        expect(resOutput003.version)
            .to.equal(verifyFixture.version);
        expect(resOutput003.status)
            .to.equal(verifyFixture.status);
        expect(resOutput003.advertiser)
            .to.equal(resOutput002.id);
        expect(resOutput003.isFallback)
            .to.equal(verifyFixture.isFallback);
        expect(resOutput003.name)
            .to.equal(sendBody003.name);
        expect(resOutput003.budget)
            .to.equal(verifyFixture.budget);
        expect(resOutput003.isUnlimitedBudget)
            .to.equal(verifyFixture.isUnlimitedBudget);
        expect(resOutput003.budgetAllocated)
            .to.equal(verifyFixture.budgetAllocated);
        expect(resOutput003.spend)
            .to.equal(verifyFixture.spend);
        expect(resOutput003.impressions)
            .to.equal(verifyFixture.impressions);
        expect(resOutput003.startDate)
            .to.equal(sendBody003.startDate);
        expect(resOutput003.endDate)
            .to.equal(sendBody003.endDate);
        expect(resOutput003.admin.hash)
            .to.equal(verifyFixture.admin.hash);
        expect(resOutput003.executive.hash)
            .to.equal(verifyFixture.executive.hash);
        expect(resOutput003.trafficker.hash)
            .to.equal(verifyFixture.trafficker.hash);
        expect(resOutput003.referenceNumber)
            .to.equal(verifyFixture.referenceNumber);
        expect(resOutput003.externalId)
            .to.equal(verifyFixture.externalId);
        expect(resOutput003.agencyCampaign)
            .to.equal(verifyFixture.agencyCampaign);
        expect(resOutput003.adServer)
            .to.equal(verifyFixture.adServer);
        expect(resOutput003.paymentTerms)
            .to.equal(verifyFixture.paymentTerms);
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

    after('delete media-group', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.mediaGroupDelete, resOutput001.id))
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
