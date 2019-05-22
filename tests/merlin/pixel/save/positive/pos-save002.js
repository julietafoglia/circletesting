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
    require(rootPath + '/fixtures/common/agency/create001');
const setupFixture002 =
    require(rootPath + '/fixtures/common/advertiser/create001');
const setupFixture003 =
    require(rootPath + '/fixtures/common/pixel/create002');

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

describe('{{MERLIN}} /pixel {id save} @ADMIN >>> ' +
    '(+) body - all valid fields >>>', function() {

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

    before('create pixel - all valid fields', function(done) {
        sendBody003 = Object.assign({}, setupFixture003);

        // assign advertiser and name
        sendBody003.advertiser = resOutput002.id;
        sendBody003.name += timeStamp;

        request(targetServer)
            .post(util.format(targetEndpoint.pixelCreate))
            .set(authHeaders)
            .send(sendBody003)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText003 = JSON.parse(res.text);
                resOutput003 = resText003.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('update pixel - all valid fields', function(done) {
        sendBody004 = {};

        // assign name, version and dspConversionType
        sendBody004.name = resOutput003.name + '@v2';
        sendBody004.version = resOutput003.version;
        sendBody004.dspConversionType = 'post_view';

        request(targetServer)
            .post(util.format(targetEndpoint.pixelSave, resOutput003.id))
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

    it('response should have status of 200', function() {
        expect(res004.status).to.equal(200);
    });

    it('notices and errors should not exist', function() {
        expect(resText004.notices).to.not.exist;
        expect(resText004.errors).to.not.exist;
    });

    it('version should be incremented by 1', function() {
        expect(resOutput004.version).to.equal(resOutput003.version + 1);
    });

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput004.id)).to.be.true;
        expect(validator.isInt(resOutput004.refId + '')).to.be.true;
        expect(validator.isInt(resOutput004.version + '')).to.be.true;
        expect(resOutput004.status).to.be.oneOf(
            ['active', 'inactive', 'pending', 'incomplete', 'created']
        );
        expect(resOutput004.type).to.be.oneOf(['ssp', 'dsp']);
        expect(resOutput004.name).to.have.length.of.at.most(48);
        expect(/^[a-f0-9]{32}$/.test(resOutput004.advertiser.id)).to.be.true;
        expect(resOutput004.advertiser.name).to.be.a('string');
        if (resOutput004.campaigns !== null) {
            expect(resOutput004.campaigns).to.be.an('array');
            resOutput004.campaigns.forEach( (value) => {
                expect(value.name).to.be.a('string');
                expect(/^[a-f0-9]{32}$/.test(value.id)).to.be.true;
            });
        }
        expect(validator.isInt(resOutput004.expiration + '')).to.be.true;
        expect(resOutput004.dspConversionType).to.be.oneOf(
            ['post_view', 'post_click', 'hybrid']
        );
        expect(resOutput004.url).to.have.length.of.at.most(64);
        expect(resOutput004.secureUrl).to.have.length.of.at.most(64);
        expect(validator.isISO8601(resOutput004.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput004.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.modifiedBy)).to.be.true;
    });

    it('response object key values should match updated object', function() {
        expect(resOutput004.id).to.equal(resOutput003.id);
        expect(resOutput004.refId).to.equal(resOutput003.refId);
        expect(resOutput004.version).to.equal(resOutput003.version + 1);
        expect(resOutput004.status).to.equal(resOutput003.status);
        expect(resOutput004.type).to.equal(resOutput003.type);
        expect(resOutput004.name).to.equal(sendBody004.name); // updated
        expect(resOutput004.advertiser).to.eql(resOutput003.advertiser);
        expect(resOutput004.campaigns).to.eql(resOutput003.campaigns);
        expect(resOutput004.expirations).to.equal(resOutput003.expirations);
        expect(resOutput004.dspConversionType)
            .to.equal(sendBody004.dspConversionType); // updated
        expect(resOutput004.url).to.equal(resOutput003.url);
        expect(resOutput004.secureUrl).to.equal(resOutput003.secureUrl);
        expect(resOutput004.created).to.equal(resOutput003.created);
        expect(resOutput004.createdBy).to.equal(resOutput003.createdBy);
        expect(resOutput004.modifiedBy).to.equal(resOutput003.modifiedBy);
    });

    after('delete pixel', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.pixelDelete, resOutput003.id))
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
