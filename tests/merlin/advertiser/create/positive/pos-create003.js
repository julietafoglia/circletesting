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

// fixture(s)
const setupFixture001 =
    require(rootPath + '/fixtures/common/media-group/create002');
const setupFixture002 =
    require(rootPath + '/fixtures/common/publisher/create001');
const testFixture =
    require(rootPath + '/fixtures/common/advertiser/create002');
const verifyFixture =
    require(rootPath + '/fixtures/common/advertiser/create002-verify');

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

describe('{{MERLIN}} <SMOKE> /advertiser {create} @ADMIN >>> ' +
    '(+) body - minimum required - publisher >>>', function() {

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

    before('create media-group', function(done) {
        sendBody001 = {};
        Object.assign(
            sendBody001,
            setupFixture001
        );
        sendBody001.name += timeStamp;
        sendBody001.description = chance.sentence({words: 10});

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

    before('create publisher - minimum required', function(done) {
        sendBody002 = {};
        Object.assign(
            sendBody002,
            setupFixture002
        );
        sendBody002.name += timeStamp;
        sendBody002.description = chance.sentence({words: 10});

        // assign media group to publisher
        sendBody002.mediaGroup = resOutput001.id;

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

    before('create advertiser - minimum required - publisher', function(done) {

        sendBody003 = {};
        Object.assign(
            sendBody003,
            testFixture
        );

        // assign name and owner to publisher
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
                res003 = res;
                resText003 = JSON.parse(res.text);
                resOutput003 = resText003.output;

                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 201', function() {
        expect(res003.status).to.equal(201);
    });

    it('notices and errors should not exist', function() {
        expect(resText003.notices).to.not.exist;
        expect(resText003.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput003.id)).to.be.true;
        expect(validator.isInt(resOutput003.refId + '')).to.be.true;
        expect(validator.isInt(resOutput003.version + '')).to.be.true;
        expect(resOutput003.status).to.be.oneOf([
            'pending', 'inactive', 'active'
        ]);
        expect(resOutput003.owner.type).to.be.oneOf([
            'Agency', 'Media Group', 'Publisher'
        ]);
        expect(/^[a-f0-9]{32}$/.test(resOutput003.owner.id)).to.be.true;
        expect(validator.isInt(resOutput003.category + '')).to.be.true;
        expect(resOutput003.categoryName).to.have.length.of.at.most(32);
        expect(resOutput003.categories).to.be.an('array');
        if (resOutput003.executive !== null) {
            expect(/^[a-f0-9]{32}$/.test(resOutput003.executive))
                .to.be.true;
        }
        expect(resOutput003.name).to.have.length.of.at.most(255);
        if (resOutput003.description !== null) {
            expect(resOutput003.description).to.be.an('string');
        }
        if (resOutput003.externalId !== null) {
            expect(resOutput003.externalId).to.have.length.of.at.most(128);
        }
        if (resOutput003.liveramp !== null) {
            expect(resOutput003.liveramp).to.have.length.of.at.most(128);
        }
        expect(resOutput003.domain).to.have.length.of.at.most(128);
        expect(resOutput003.hasExchange).to.be.a('boolean');
        if (resOutput003.targetingType !== null) {
            expect(resOutput003.targetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput003.targetedPublishers !== null) {
            expect(resOutput003.targetedPublishers).to.be.an('array');
        }
        if (resOutput003.targetedDomains !== null) {
            expect(resOutput003.targetedDomains).to.be.an('array');
        }
        expect(resOutput003.suppressCompetitive).to.be.a('boolean');
        expect(resOutput003.houseAd).to.be.a('boolean');
        // contract object
        expect(resOutput003.contract).to.be.an('object');
        expect(resOutput003.contract.status).to.be.oneOf([
            'created', 'pending', 'inactive', 'active', 'in progress',
            'in review', 'paused', 'cancelled', 'rejected'
        ]);
        if (resOutput003.contract.dspFee !== null) {
            expect(validator.isInt(resOutput003.contract.dspFee + '',
                {'max': 99})).to.be.true;
        }
        // created and modified
        expect(validator.isISO8601(resOutput003.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput003.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.modifiedBy)).to.be.true;
    });

    it('response object key values should match verify object(s)', function() {
        expect(resOutput003.owner.type)
            .to.equal(sendBody003.owner.type);
        expect(resOutput003.owner.id)
            .to.equal(sendBody003.owner.id);
        expect(resOutput003.category)
            .to.equal(sendBody003.category);
        expect(resOutput003.categoryName)
            .to.equal(verifyFixture.categoryName);
        expect(resOutput003.categories)
            .to.eql(verifyFixture.categories);
        expect(resOutput003.admin)
            .to.equal(null);
        expect(resOutput003.executive)
            .to.equal(verifyFixture.executive);
        expect(resOutput003.name)
            .to.equal(sendBody003.name);
        expect(resOutput003.description)
            .to.equal(verifyFixture.description);
        expect(resOutput003.externalId)
            .to.equal(verifyFixture.externalId);
        expect(resOutput003.liveramp)
            .to.equal(verifyFixture.liveramp);
        expect(resOutput003.domain)
            .to.equal(sendBody003.domain);
        expect(resOutput003.hasExchange)
            .to.equal(verifyFixture.hasExchange);
        expect(resOutput003.targetingType)
            .to.equal(verifyFixture.targetingType);
        expect(resOutput003.targetedPublishers)
            .to.eql(verifyFixture.targetedPublishers);
        expect(resOutput003.targetedDomains)
            .to.eql(verifyFixture.targetedDomains);
        expect(resOutput003.suppressCompetitive)
            .to.equal(verifyFixture.suppressCompetitive);
        expect(resOutput003.houseAd)
            .to.equal(verifyFixture.houseAd);
        // contract object
        expect(resOutput003.contract.status)
            .to.equal(verifyFixture.contract.status);
        expect(resOutput003.contract.dspFee)
            .to.equal(verifyFixture.contract.dspFee);
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
