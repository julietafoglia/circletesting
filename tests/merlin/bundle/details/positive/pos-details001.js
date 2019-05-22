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

// fixture(s)
const setupFixture001 =
    require(rootPath + '/fixtures/common/media-group/create001');
const setupFixture002 =
    require(rootPath + '/fixtures/common/publisher/create001');
const setupFixture003 =
    require(rootPath + '/fixtures/common/bundle/create002');

// shared test variable(s)
let authHeaders;
let res004;
let resOutput001;
let resOutput002;
let resOutput003;
let resOutput004;
let resText001;
let resText002;
let resText003;
let resText004;
let sendBody001;
let sendBody002;
let sendBody003;

describe('{{MERLIN}} <SMOKE> /bundle {id details} >>> ' +
    '(+) request - all valid fields verification >>>', function() {

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

    before('create media-group - minimum required fields', function(done) {

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

    before('create a publisher - minimum required fields', function(done) {

        sendBody002 = Object.assign({}, setupFixture002);

        // assign name and media-group to publisher
        sendBody002.name += timeStamp;
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
                expect(resOutput002.name)
                    .to.equal(sendBody002.name);
                expect(resOutput002.mediaGroup)
                    .to.equal(sendBody002.mediaGroup);
                expect(resOutput002.category)
                    .to.equal(sendBody002.category);
                expect(resOutput002.domain)
                    .to.equal(sendBody002.domain);
                expect(resOutput002.tagsUrlPrefix)
                    .to.equal(sendBody002.tagsUrlPrefix);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create bundle - all valid fields', function(done) {

        sendBody003 = Object.assign({}, setupFixture003);

        // assign name and publisher to bundle
        sendBody003.name += timeStamp;
        sendBody003.publisher = resOutput002.id;

        request(targetServer)
            .post(util.format(targetEndpoint.bundleCreate))
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
                expect(resOutput003.name).to.equal(sendBody003.name);
                expect(resOutput003.publisher).to.equal(sendBody003.publisher);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('get bundle - all valid fields', function(done) {
        request(targetServer)
            .get(util.format(targetEndpoint.bundleDetails, resOutput003.id))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res004 = res;
                resText004 = JSON.parse(res.text);
                resOutput004 = resText003.output;
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

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput003.id)).to.be.true;
        expect(validator.isInt(resOutput003.refId + '')).to.be.true;
        expect(validator.isInt(resOutput003.version + '')).to.be.true;
        expect(resOutput003.name).to.be.a('string');
        expect(resOutput003.name).to.have.length.of.at.most(32);
        expect(resOutput003.description).to.be.a('string');
        expect(resOutput003.description).to.have.length.of.at.most(255);
        expect(/^[a-f0-9]{32}$/.test(resOutput003.publisher)).to.be.true;
        if (resOutput003.adSlots !== null) {
            expect(resOutput003.adSlots).to.be.an('array');
            resOutput003.adSlots.forEach(function(val) {
                expect(/^[a-f0-9]{32}$/.test(val)).to.be.true;
            });
        }
        if (resOutput003.strategies !== null) {
            expect(resOutput003.strategies).to.be.an('array');
            resOutput003.strategies.forEach(function(val) {
                expect(/^[a-f0-9]{32}$/.test(val)).to.be.true;
            });
        }
        if (resOutput003.isRoadblock !== null) {
            expect(resOutput003.isRoadblock).to.be.a('boolean');
        }
        // created and modified
        expect(validator.isISO8601(resOutput003.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput003.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.modifiedBy)).to.be.true;
    });

    it('response object should match created object', function() {
        expect(resOutput004.id).to.equal(resOutput003.id);
        expect(resOutput004.refId).to.equal(resOutput003.refId);
        expect(resOutput004.version).to.equal(resOutput003.version);
        expect(resOutput004.name).to.equal(resOutput003.name);
        expect(resOutput004.description).to.equal(resOutput003.description);
        expect(resOutput004.publisher).to.equal(resOutput003.publisher);
        expect(resOutput004.adSlots).to.eql(resOutput003.adSlots);
        expect(resOutput004.strategies).to.eql(resOutput003.strategies);
        expect(resOutput004.isRoadblock).to.equal(resOutput003.isRoadblock);
        expect(resOutput004.created).to.equal(resOutput003.created);
        expect(resOutput004.createdBy).to.eql(resOutput003.createdBy);
        expect(resOutput004.modified).to.eql(resOutput003.modified);
        expect(resOutput004.modifiedBy).to.equal(resOutput003.modifiedBy);
    });

    after('delete bundle', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.bundleDelete, resOutput003.id))
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
