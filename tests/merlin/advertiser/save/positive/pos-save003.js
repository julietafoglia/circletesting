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
const setupFixture003 =
    require(rootPath + '/fixtures/common/advertiser/create001');

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

describe('{{MERLIN}} <SMOKE> /advertiser {id save} @ADMIN >>> ' +
    '(+) body - basic verification - publisher >>>', function() {

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
        sendBody001 = Object.assign({}, setupFixture001);

        // assign name to media-group
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

    before('create publisher - minimum required', function(done) {
        sendBody002 = Object.assign({}, setupFixture002);

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
                expect(/^[a-f0-9]{32}$/.test(resOutput002.id))
                    .to.be.true;
                expect(resOutput002.name)
                    .to.have.length.of.at.most(255);
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

        // assign name, description and owner
        sendBody003.name += timeStamp;
        sendBody003.description = chance.sentence({words: 10});
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
                expect(resOutput003.owner.type).to.eql(sendBody003.owner.type);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('save advertiser - name and version', function(done) {
        sendBody004 = {};
        sendBody004.version = resOutput002.version;
        sendBody004.name = resOutput002.name + '@v2';

        // send request
        request(targetServer)
            .post(util.format(targetEndpoint.advertiserSave, resOutput003.id))
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

    it('notices and errors should not exist', function() {
        expect(resText004.notices).to.not.exist;
        expect(resText004.errors).to.not.exist;
    });

    it('version should be request object version + 1', function() {
        expect(resOutput004.version).to.equal(
            resOutput003.version + 1
        );
    });

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput004.id)).to.be.true;
        expect(validator.isInt(resOutput004.refId + '')).to.be.true;
        expect(validator.isInt(resOutput004.version + '')).to.be.true;
        expect(resOutput004.status).to.be.oneOf([
            'pending', 'inactive', 'active'
        ]);
        expect(resOutput004.owner.type).to.be.oneOf([
            'Agency', 'Media Group', 'Publisher'
        ]);
        expect(/^[a-f0-9]{32}$/.test(resOutput004.owner.id)).to.be.true;
        expect(validator.isInt(resOutput004.category + '')).to.be.true;
        expect(resOutput004.categoryName).to.have.length.of.at.most(32);
        expect(resOutput004.categories).to.be.an('array');
        if (resOutput004.executive !== null) {
            expect(/^[a-f0-9]{32}$/.test(resOutput004.executive))
                .to.be.true;
        }
        expect(resOutput004.name).to.have.length.of.at.most(255);
        if (resOutput004.description !== null) {
            expect(resOutput004.description).to.be.an('string');
        }
        if (resOutput004.externalId !== null) {
            expect(resOutput004.externalId).to.have.length.of.at.most(128);
        }
        if (resOutput004.liveramp !== null) {
            expect(resOutput004.liveramp).to.have.length.of.at.most(128);
        }
        expect(resOutput004.domain).to.have.length.of.at.most(128);
        expect(resOutput004.hasExchange).to.be.a('boolean');
        if (resOutput004.targetingType !== null) {
            expect(resOutput004.targetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput004.targetedPublishers !== null) {
            expect(resOutput004.targetedPublishers).to.be.an('array');
        }
        if (resOutput004.targetedDomains !== null) {
            expect(resOutput004.targetedDomains).to.be.an('array');
        }
        expect(resOutput004.suppressCompetitive).to.be.a('boolean');
        expect(resOutput004.houseAd).to.be.a('boolean');
        // contract object
        expect(resOutput004.contract).to.be.an('object');
        expect(resOutput004.contract.status).to.be.oneOf([
            'created', 'pending', 'inactive', 'active', 'in progress',
            'in review', 'paused', 'cancelled', 'rejected'
        ]);
        if (resOutput004.contract.dspFee !== null) {
            expect(validator.isInt(resOutput004.contract.dspFee + '',
                {'max': 99})).to.be.true;
        }
        // created and modified
        expect(validator.isISO8601(resOutput004.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput004.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.modifiedBy)).to.be.true;
    });

    it('response object key values should match create object', function() {
        expect(resOutput004.owner.type)
            .to.equal(resOutput003.owner.type);
        expect(resOutput004.owner.id)
            .to.equal(resOutput003.owner.id);
        expect(resOutput004.category)
            .to.equal(resOutput003.category);
        expect(resOutput004.categoryName)
            .to.equal(resOutput003.categoryName);
        expect(resOutput004.categories)
            .to.eql(resOutput003.categories);
        expect(resOutput004.admin)
            .to.equal(resOutput003.admin);
        expect(resOutput004.executive)
            .to.equal(resOutput003.executive);
        expect(resOutput004.name)
            .to.equal(sendBody004.name); // check updated
        expect(resOutput004.description)
            .to.equal(resOutput003.description);
        expect(resOutput004.externalId)
            .to.equal(resOutput003.externalId);
        expect(resOutput004.liveramp)
            .to.equal(resOutput003.liveramp);
        expect(resOutput004.domain)
            .to.equal(resOutput003.domain);
        expect(resOutput004.hasExchange)
            .to.equal(resOutput003.hasExchange);
        expect(resOutput004.targetingType)
            .to.equal(resOutput003.targetingType);
        expect(resOutput004.targetedPublishers)
            .to.eql(resOutput003.targetedPublishers);
        expect(resOutput004.targetedDomains)
            .to.eql(resOutput003.targetedDomains);
        expect(resOutput004.suppressCompetitive)
            .to.equal(resOutput003.suppressCompetitive);
        expect(resOutput004.houseAd)
            .to.equal(resOutput003.houseAd);
        // contract object
        expect(resOutput004.contract.status)
            .to.equal(resOutput003.contract.status);
        expect(resOutput004.contract.dspFee)
            .to.equal(resOutput003.contract.dspFee);
    });

    // house advertisers cannot be deleted directly,
    // since they are used for fallback ads

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
