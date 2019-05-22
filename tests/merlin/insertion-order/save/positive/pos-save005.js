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
    require(rootPath + '/fixtures/common/publisher/create001');
const setupFixture003 =
    require(rootPath + '/fixtures/common/advertiser/create002');
const setupFixture004 =
    require(rootPath + '/fixtures/common/insertion-order/create001');

// shared test variable(s)
let authHeaders;
let res005;
let resText001;
let resText002;
let resText003;
let resText004;
let resText005;
let resOutput001;
let resOutput002;
let resOutput003;
let resOutput004;
let resOutput005;
let sendBody001;
let sendBody002;
let sendBody003;
let sendBody004;
let sendBody005;

describe('{{MERLIN}} <SMOKE> /insertion-order {id save} @ADMIN >>> ' +
    '(+) body - basic verification - publisher >>>', function() {

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

    before('create media group', function(done) {
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

    before('create publisher', function(done) {
        sendBody002 = Object.assign({}, setupFixture002);

        // assign media-group and name
        sendBody002.mediaGroup = resOutput001.id;
        sendBody002.name += timeStamp;

        request(targetServer)
            .post(util.format(targetEndpoint.publisherCreate))
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
                expect(resOutput002.mediaGroup)
                    .to.equal(sendBody002.mediaGroup);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create advertiser', function(done) {
        sendBody003 = Object.assign({}, setupFixture003);

        // assign name and owner
        sendBody003.name += timeStamp;
        sendBody003.owner.type = 'Publisher';
        sendBody003.owner.id = resOutput002.id;

        request(targetServer)
            .post(util.format(targetEndpoint.advertiserCreate))
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
                expect(/^[a-f0-9]{32}$/.test(resOutput003.id)).to.be.true;
                expect(resOutput003.name).to.have.length.of.at.most(255);
                expect(resOutput003.owner.id).to.equal(sendBody003.owner.id);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create insertion order', function(done) {
        sendBody004 = Object.assign({}, setupFixture004);

        // assign advertiser, name and flight dates
        sendBody004.advertiser = resOutput003.id;
        sendBody004.name += timeStamp;
        sendBody004.startDate = timeToday;
        sendBody004.endDate =
            moment().add(30, 'days').format('YYYY-MM-DD HH:mm:ss');

        request(targetServer)
            .post(util.format(targetEndpoint.insertionOrderCreate))
            .set(authHeaders)
            .send(sendBody004)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText004 = JSON.parse(res.text);
                resOutput004 = resText004.output;

                // spot check response
                expect(validator.isInt(resOutput004.id + '')).to.be.true;
                expect(resOutput004.name).to.have.length.of.at.most(128);
                expect(/^[a-f0-9]{32}$/.test(resOutput004.admin.hash))
                    .to.be.true;
                expect(resOutput004.advertiser)
                    .to.equal(sendBody004.advertiser);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('save insertion order', function(done) {

        sendBody005 = {};

        // assign name and version
        sendBody005.name = resOutput004.name + '@v2';
        sendBody005.version = resOutput004.version;

        request(targetServer)
            .post(util.format(
                targetEndpoint.insertionOrderDetails, resOutput004.id
            )
            )
            .set(authHeaders)
            .send(sendBody005)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res005 = res;
                resText005 = JSON.parse(res.text);
                resOutput005 = resText005.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response have status of 2002', function() {
        expect(res005.status).to.equal(200);
    });

    it('version should be request object version + 1', function() {
        expect(resOutput005.version).to.equal(
            resOutput004.version + 1
        );
    });

    it('notices and errors should not exist', function() {
        expect(resText005.notices).to.not.exist;
        expect(resText005.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(validator.isInt(resOutput005.id + '')).to.be.true;
        expect(validator.isInt(resOutput005.version + '')).to.be.true;
        expect(resOutput005.status).to.be.oneOf([
            'pending', 'inactive', 'active'
        ]);
        expect(/^[a-f0-9]{32}$/.test(resOutput005.advertiser)).to.be.true;
        expect(resOutput005.isFallback).to.be.a('boolean');
        expect(resOutput005.name).to.have.length.of.at.most(128);
        if (resOutput005.budget !== null) {
            expect(resOutput005.budget).to.be.a('number');
        }
        expect(resOutput005.isUnlimitedBudget).to.be.a('boolean');
        expect(resOutput005.budgetAllocated).to.be.a('number');
        expect(resOutput005.spend).to.be.a('number');
        if (resOutput005.impressions !== null) {
            expect(validator.isInt(resOutput005.impressions + '',
                {'max': 99999999999})).to.be.true;
        }
        expect(validator.isDate(resOutput005.startDate)).to.be.true;
        expect(validator.isDate(resOutput005.endDate)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005.admin.hash)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005.executive.hash)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005.trafficker.hash)).to.be.true;
        if (resOutput005.referenceNumber !== null) {
            expect(resOutput005.referenceNumber)
                .to.have.length.of.at.most(256);
        }
        if (resOutput005.externalId !== null) {
            expect(resOutput005.externalId)
                .to.have.length.of.at.most(128);
        }
        if (resOutput005.agencyCampaign !== null) {
            expect(resOutput005.agencyCampaign)
                .to.have.length.of.at.most(256);
        }
        if (resOutput005.adServer !== null) {
            expect(resOutput005.adServer).to.be.oneOf([
                'LiveIntent', 'DART', 'MediaMind',
                'Atlas', 'MediaPlex', 'Other'
            ]);
        }
        if (resOutput005.paymentTerms !== null) {
            expect(resOutput005.paymentTerms).to.be.oneOf([
                'Prepay', 'Net 15', 'Net 30', 'Net 45', 'Net 60'
            ]);
        }
        expect(resOutput005.isFallback).to.be.a('boolean');
        // created and modified
        expect(validator.isISO8601(resOutput005.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput005.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005.modifiedBy)).to.be.true;
    });

    it('response object key values should match test object', function() {
        expect(resOutput005.status)
            .to.equal(resOutput004.status);
        expect(resOutput005.advertiser)
            .to.equal(resOutput004.advertiser);
        expect(resOutput005.isFallback)
            .to.equal(resOutput004.isFallback);
        expect(resOutput005.name)
            .to.equal(sendBody005.name); // check updated
        expect(resOutput005.budget)
            .to.equal(resOutput004.budget);
        expect(resOutput005.isUnlimitedBudget)
            .to.equal(resOutput004.isUnlimitedBudget);
        expect(resOutput005.budgetAllocated)
            .to.equal(resOutput004.budgetAllocated);
        expect(resOutput005.spend)
            .to.equal(resOutput004.spend);
        expect(resOutput005.impressions)
            .to.equal(resOutput004.impressions);
        expect(resOutput005.startDate)
            .to.equal(resOutput004.startDate);
        expect(resOutput005.endDate)
            .to.equal(resOutput004.endDate);
        expect(resOutput005.admin.hash)
            .to.equal(resOutput004.admin.hash);
        expect(resOutput005.executive.hash)
            .to.equal(resOutput004.executive.hash);
        expect(resOutput005.trafficker.hash)
            .to.equal(resOutput004.trafficker.hash);
        expect(resOutput005.referenceNumber)
            .to.equal(resOutput004.referenceNumber);
        expect(resOutput005.externalId)
            .to.equal(resOutput004.externalId);
        expect(resOutput005.agencyCampaign)
            .to.equal(resOutput004.agencyCampaign);
        expect(resOutput005.adServer)
            .to.equal(resOutput004.adServer);
        expect(resOutput005.paymentTerms)
            .to.equal(resOutput004.paymentTerms);
    });

    after('delete insertion order', function(done) {
        request(targetServer)
            .del(util.format(
                targetEndpoint.insertionOrderDelete, resOutput004.id
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

    // house advertisers cannot be deleted directly,
    // since they are used for fallback ads

    after('delete publisher', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.publisherDelete, resOutput002.id))
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

    after('delete media group', function(done) {
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
