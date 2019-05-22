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
const setupFixture =
    require(rootPath + '/fixtures/common/agency/create003');
const testFixture =
    require(rootPath + '/fixtures/common/agency/save001');

// shared test variable(s)
let authHeaders;
let res002;
let resOutput001;
let resOutput002;
let resText001;
let resText002;
let sendBody001;
let sendBody002;

describe('{{MERLIN}} /agency/{id save} @ADMIN >>> ' +
    '(+) body - null non-required fields >>>', function() {

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
            setupFixture
        );

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

    before('save agency - null non-required fields', function(done) {
        sendBody002 = {};
        Object.assign(
            sendBody002,
            testFixture
        );

        sendBody002.name = resOutput001.name + ' A';

        request(targetServer)
            .post(util.format(targetEndpoint.agencySave, resOutput001.id))
            .set(authHeaders)
            .send(sendBody002)
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

    it('version should be request object version + 1', function() {
        expect(resOutput002.version).to.equal(
            resOutput001.version + 1
        );
    });

    it('notices and errors should not exist', function() {
        expect(resText002.notices).to.not.exist;
        expect(resText002.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(validator.isInt(resOutput002.version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput002.id)).to.be.true;
        expect(validator.isInt(resOutput002.refId + '')).to.be.true;
        expect(resOutput002.status).to.be.oneOf([
            'active', 'inactive', 'pending', 'deleted'
        ]);
        expect(resOutput002.name).to.have.length.of.at.most(32);
    });

    it('response object key values should match test object', function() {
        expect(resOutput002.description).to.equal(null);
        expect(resOutput002.salesforceId).to.equal(null);
        // contact object
        expect(resOutput002.contact.company).to.equal(null);
        expect(resOutput002.contact.emailAddress).to.equal(null);
        expect(resOutput002.contact.firstName).to.equal(null);
        expect(resOutput002.contact.lastName).to.equal(null);
        expect(resOutput002.contact.phone).to.equal(null);
        expect(resOutput002.contact.address1).to.equal(null);
        expect(resOutput002.contact.address2).to.equal(null);
        expect(resOutput002.contact.city).to.equal(null);
        expect(resOutput002.contact.state).to.equal(null);
        expect(resOutput002.contact.postalCode).to.equal(null);
        expect(resOutput002.contact.country).to.equal(null);
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
