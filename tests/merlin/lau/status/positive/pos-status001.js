'use strict';

// vendor dependencies
const chai = require('chai');

const expect = chai.expect; // use bdd chai

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

// shared test variable(s)
let authHeaders;
let res001;
let resOutput001;
let resText001;

describe('{{MERLIN}} <SMOKE> /lau/status @ADMIN >>> ' +
    '(+) basic verification >>>', function() {

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

    before('get lau status', function(done) {
        request(targetServer)
            .get(util.format(targetEndpoint.lauStatus))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res001 = res;
                resText001 = JSON.parse(res001.text);
                resOutput001 = resText001.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response has status of 200', function() {
        expect(res001.status).to.equal(200);
    });

    it('response object property types should match spec', function() {
        expect(resOutput001[0].percentLoaded).to.be.a('string');
        expect(resOutput001[0].url).to.be.a('string');
        expect(resOutput001[0].uniqueFileName).to.be.a('string');
        expect(resOutput001[0].errorFileName).to.be.a('string');
        expect(resOutput001[0].isComplete).to.be.a('boolean');
        expect(validator.isInt(resOutput001[0].id + ''))
            .to.be.true;
        expect(resOutput001[0].fileName).to.be.a('string');
        expect(resOutput001[0].bucketName).to.be.a('string');
        expect(validator.isInt(resOutput001[0].segmentID + ''))
            .to.be.true;
        expect(resOutput001[0].action).to.be.a('string');
        expect(resOutput001[0].type).to.be.a('string');
        expect(resOutput001[0].state).to.be.a('string');
        expect(validator.isInt(resOutput001[0].hashes + ''))
            .to.be.true;
        expect(validator.isInt(resOutput001[0].uniqueHashes + ''))
            .to.be.true;
        expect(validator.isInt(resOutput001[0].uploadedHashes + ''))
            .to.be.true;
        expect(validator.isInt(resOutput001[0].failedHashes + ''))
            .to.be.true;
        expect(resOutput001[0].rate).to.be.a('number');
        if (resOutput001[0].message !== null) {
            expect(resOutput001[0].message).to.be.a('string');
        }
        expect(validator.isISO8601(resOutput001[0].created))
            .to.be.true;
        expect(validator.isISO8601(resOutput001[0].updated))
            .to.be.true;
    });
});
