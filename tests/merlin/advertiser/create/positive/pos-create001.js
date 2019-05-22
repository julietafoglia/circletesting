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
const characterPool =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// fixture(s)
const setupFixture001 =
    require(rootPath + '/fixtures/common/agency/create001');
const testFixture =
    require(rootPath + '/fixtures/common/advertiser/create001');
const verifyFixture =
    require(rootPath + '/fixtures/common/advertiser/create001-verify');

// shared test variable(s)
let authHeaders;
let res002;
let resText001;
let resText002;
let resOutput001;
let resOutput002;
let sendBody001;
let sendBody002;

describe('{{MERLIN}} <SMOKE> /advertiser {create} @ADMIN >>> ' +
    '(+) body - minimum required - agency >>>', function() {

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

    before('create agency', function(done) {
        sendBody001 = {};
        Object.assign(
            sendBody001,
            setupFixture001
        );
        sendBody001.name += timeStamp;
        sendBody001.description = chance.sentence({words: 10});

        // assign random string to salesforce id
        sendBody001.salesforceId =
            chance.string({length: 18, pool: characterPool});

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

    before('create advertiser - minimum required', function(done) {
        sendBody002 = {};
        Object.assign(
            sendBody002,
            testFixture
        );
        sendBody002.name += timeStamp;

        // assign owner
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
                res002 = res;
                resText002 = JSON.parse(res.text);
                resOutput002 = resText002.output;

                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response have status of 201', function() {
        expect(res002.status).to.equal(201);
    });

    it('notices and errors should not exist', function() {
        expect(resText002.notices).to.not.exist;
        expect(resText002.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput002.id)).to.be.true;
        expect(validator.isInt(resOutput002.refId + '')).to.be.true;
        expect(validator.isInt(resOutput002.version + '')).to.be.true;
        expect(resOutput002.status).to.be.oneOf([
            'pending', 'inactive', 'active'
        ]);
        expect(resOutput002.owner.type).to.be.oneOf([
            'Agency', 'Media Group', 'Publisher'
        ]);
        expect(/^[a-f0-9]{32}$/.test(resOutput002.owner.id)).to.be.true;
        expect(validator.isInt(resOutput002.category + '')).to.be.true;
        expect(resOutput002.categoryName).to.have.length.of.at.most(32);
        expect(resOutput002.categories).to.be.an('array');
        if (resOutput002.executive !== null) {
            expect(/^[a-f0-9]{32}$/.test(resOutput002.executive))
                .to.be.true;
        }
        expect(resOutput002.name).to.have.length.of.at.most(255);
        if (resOutput002.description !== null) {
            expect(resOutput002.description).to.be.an('string');
        }
        if (resOutput002.externalId !== null) {
            expect(resOutput002.externalId).to.have.length.of.at.most(128);
        }
        if (resOutput002.liveramp !== null) {
            expect(resOutput002.liveramp).to.have.length.of.at.most(128);
        }
        expect(resOutput002.domain).to.have.length.of.at.most(128);
        expect(resOutput002.hasExchange).to.be.a('boolean');
        if (resOutput002.targetingType !== null) {
            expect(resOutput002.targetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput002.targetedPublishers !== null) {
            expect(resOutput002.targetedPublishers).to.be.an('array');
        }
        if (resOutput002.targetedDomains !== null) {
            expect(resOutput002.targetedDomains).to.be.an('array');
        }
        expect(resOutput002.suppressCompetitive).to.be.a('boolean');
        expect(resOutput002.houseAd).to.be.a('boolean');
        // contract object
        expect(resOutput002.contract).to.be.an('object');
        expect(resOutput002.contract.status).to.be.oneOf([
            'created', 'pending', 'inactive', 'active', 'in progress',
            'in review', 'paused', 'cancelled', 'rejected'
        ]);
        if (resOutput002.contract.dspFee !== null) {
            expect(validator.isInt(resOutput002.contract.dspFee + '',
                {'max': 99})).to.be.true;
        }
        // created and modified
        expect(validator.isISO8601(resOutput002.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput002.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput002.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput002.modifiedBy)).to.be.true;
    });

    it('response object key values should match verify object(s)', function() {
        expect(resOutput002.owner.type)
            .to.equal(sendBody002.owner.type);
        expect(resOutput002.owner.id)
            .to.equal(sendBody002.owner.id);
        expect(resOutput002.category)
            .to.equal(sendBody002.category);
        expect(resOutput002.categoryName)
            .to.equal(verifyFixture.categoryName);
        expect(resOutput002.categories)
            .to.eql(verifyFixture.categories);
        expect(resOutput002.admin)
            .to.equal(null);
        expect(resOutput002.executive)
            .to.equal(verifyFixture.executive);
        expect(resOutput002.name)
            .to.equal(sendBody002.name);
        expect(resOutput002.description)
            .to.equal(verifyFixture.description);
        expect(resOutput002.externalId)
            .to.equal(verifyFixture.externalId);
        expect(resOutput002.liveramp)
            .to.equal(verifyFixture.liveramp);
        expect(resOutput002.domain)
            .to.equal(sendBody002.domain);
        expect(resOutput002.hasExchange)
            .to.equal(verifyFixture.hasExchange);
        expect(resOutput002.targetingType)
            .to.equal(verifyFixture.targetingType);
        expect(resOutput002.targetedPublishers)
            .to.eql(verifyFixture.targetedPublishers);
        expect(resOutput002.targetedDomains)
            .to.eql(verifyFixture.targetedDomains);
        expect(resOutput002.suppressCompetitive)
            .to.equal(verifyFixture.suppressCompetitive);
        expect(resOutput002.houseAd)
            .to.equal(verifyFixture.houseAd);
        // contract object
        expect(resOutput002.contract.status)
            .to.equal(verifyFixture.contract.status);
        expect(resOutput002.contract.dspFee)
            .to.equal(verifyFixture.contract.dspFee);
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
