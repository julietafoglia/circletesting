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
const testFixture =
    require(rootPath + '/fixtures/common/bundle/create001');

// shared test variable(s)
let authHeaders;
let res002;
let resOutput001;
let resOutput002;
let resText001;
let resText002;
let sendBody001;

describe('{{MERLIN}} /bundle {id details} >>> ' +
    '(+) request - minimum required fields verification >>>', function() {

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

    before('create bundle - minimum required fields', function(done) {

        sendBody001 = Object.assign({}, testFixture);

        // assign name to bundle
        sendBody001.name += timeStamp;

        request(targetServer)
            .post(util.format(targetEndpoint.bundleCreate))
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
                expect(resOutput001.name).to.have.length.of.at.most(255);
                expect(resOutput001.name).to.equal(sendBody001.name);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('get bundle - minimum required fields', function(done) {

        request(targetServer)
            .get(util.format(targetEndpoint.bundleDetails, resOutput001.id))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

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

    it('response should have status of 200', function() {
        expect(res002.status).to.equal(200);
    });

    it('notices and errors should not exist', function() {
        expect(resText002.notices).to.not.exist;
        expect(resText002.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput002.id)).to.be.true;
        expect(validator.isInt(resOutput002.refId + '')).to.be.true;
        expect(validator.isInt(resOutput002.version + '')).to.be.true;
        expect(resOutput002.name).to.be.a('string');
        expect(resOutput002.name).to.have.length.of.at.most(32);
        if (resOutput002.description !== null) {
            expect(resOutput002.description).to.be.a('string');
            expect(resOutput002.description).to.have.length.of.at.most(255);
        }
        if (resOutput002.publisher !== null) {
            expect(/^[a-f0-9]{32}$/.test(resOutput002.publisher)).to.be.true;
        }
        if (resOutput002.adSlots !== null) {
            expect(resOutput002.adSlots).to.be.an('array');
            resOutput002.adSlots.forEach(function(val) {
                expect(/^[a-f0-9]{32}$/.test(val)).to.be.true;
            });
        }
        if (resOutput002.strategies !== null) {
            expect(resOutput002.strategies).to.be.an('array');
            resOutput001.strategies.forEach(function(val) {
                expect(/^[a-f0-9]{32}$/.test(val)).to.be.true;
            });
        }
        if (resOutput002.isRoadblock !== null) {
            expect(resOutput002.isRoadblock).to.be.a('boolean');
        }
        // created and modified
        expect(validator.isISO8601(resOutput002.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput002.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput002.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput002.modifiedBy)).to.be.true;
    });

    it('response object should match created object', function() {
        expect(resOutput002.id).to.equal(resOutput001.id);
        expect(resOutput002.refId).to.equal(resOutput001.refId);
        expect(resOutput002.version).to.equal(resOutput001.version);
        expect(resOutput002.name).to.equal(resOutput001.name);
        expect(resOutput002.description).to.equal(resOutput001.description);
        expect(resOutput002.publisher).to.equal(resOutput001.publisher);
        expect(resOutput002.adSlots).to.eql(resOutput001.adSlots);
        expect(resOutput002.strategies).to.eql(resOutput001.strategies);
        expect(resOutput002.isRoadblock).to.equal(resOutput001.isRoadblock);
        expect(resOutput002.created).to.equal(resOutput001.created);
        expect(resOutput002.createdBy).to.eql(resOutput001.createdBy);
        expect(resOutput002.modified).to.eql(resOutput001.modified);
        expect(resOutput002.modifiedBy).to.equal(resOutput001.modifiedBy);
    });

    after('delete bundle', function(done) {

        request(targetServer)
            .del(util.format(targetEndpoint.bundleDelete, resOutput002.id))
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
