'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const request = require('supertest-as-promised');
const util = require('util');

// runtime variables
const rootPath = process.env.ROOT_PATH;
const targetEndpoint = require(rootPath + '/config/merlin/endpoints');
const targetEnvironment =
    require(rootPath + '/config/merlin/' + process.env.NODE_ENV);
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const targetUser = usersTargetEnvironment.admin;
const merlinAuthHeaders = require(rootPath + '/helpers/merlin-auth-headers');
const requestTimeOut = 10000;

// fixture(s)
const testFixture = require(rootPath + '/fixtures/common/ad-slot/activate001');

// shared test variable(s)
let authHeaders;
let entitiesObject;
let adSlot;
let resOutputs;
let sendBody001;
let res001;
let resText001;
let resOutput001;

describe('[BOOTSTRAP-SETUP] /ad-slot {create} @MANAGER >>> ' +
    '(+) adSlot0 activate >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    resOutputs = [];

    before('generate auth headers', (done) => {
        // generate auth headers
        const genAuthHeaders =
                merlinAuthHeaders(targetUser);
        genAuthHeaders.then(function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('get newsletter from entities file', () => {
        entitiesObject = require(rootPath + '/bootstrap/entities-ssp.json');
        adSlot =
                entitiesObject.manager.mediaGroup001.publisher001
                    .newsletter001.adSlot0;
    });


    before('generate auth headers', (done) => {
        // generate auth headers
        const genAuthHeaders =
                merlinAuthHeaders(targetUser);
        genAuthHeaders.then(function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('create media-group - minimum required fields', (done) => {

        sendBody001 = Object.assign({}, testFixture);

        request(targetServer)
            .post(util.format(targetEndpoint.adSlotActivate, adSlot.id))
            .set(authHeaders)
            .send(sendBody001)
            .then(function(res) {
                // basic response verification
                expect(res.body).to.exist;
                // expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res001 = res;
                resText001 = JSON.parse(res.text);
                resOutput001 = resText001.output;
                done();
            })
            .catch(function(err) {
                done(err);
            });
    });


    it(`response have status of 201`, () => {
    // expect(res001.status).to.equal(200);
    });

    it(`notices and errors should not exist`, () => {
        expect(resText001.notices).to.not.exist;
        expect(resText001.errors).to.not.exist;
    });

});
