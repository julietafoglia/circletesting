'use strict';

// vendor dependencies
const chance = require('chance').Chance();
const chai = require('chai');

const expect = chai.expect; // use bdd chai
const moment = require('moment');

const request = require('supertest-as-promised');
const util = require('util');

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
const setupFixture = require(rootPath + '/fixtures/common/agency/create003');
const testFixture = require(rootPath + '/fixtures/common/agency/save001');

// shared test variable(s)
let authHeaders;
let res002;
let resOutput001;
let resText001;
let resText002;
let sendBody001;
let sendBody002;

describe('{{MERLIN}} /agency/{id save} @ADMIN >>> ' +
    '(-) url - string end - random characters >>>', function() {

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

    before('save agency - string end - random characters', function(done) {
        sendBody002 = {};
        Object.assign(
            sendBody002,
            testFixture
        );
        sendBody002.version = resOutput001.version;
        sendBody002.name = resOutput001.name + ' A';

        // assign random string to salesforce id
        sendBody002.salesforceId = chance.string({length: 18});

        request(targetServer)
            .post(util.format(
                targetEndpoint.agencySave,
                resOutput001.id + chance.string({length: 5})
            )
            )
            .set(authHeaders)
            .send(sendBody002)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(400);

                // assign shared test variable(s)
                res002 = res;
                resText002 = JSON.parse(res.text);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 400', function() {
        expect(res002.status).to.equal(400);
    });

    it('error should equal not found', function() {
        expect(resText002.errors).to.deep.include.members([
            {'id': 'E1000', 'code': 'INV', 'details': 'id'}
        ]);
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
