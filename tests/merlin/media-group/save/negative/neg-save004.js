'use strict';

// vendor dependencies
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
const setupFixture =
    require(rootPath + '/fixtures/common/media-group/create002');

// shared test variable(s)
let authHeaders;
let res003;
let resOutput001;
let resText001;
let resText002;
let sendBody001;
let sendBody002;
let sendBody003;

describe('{{MERLIN}} /media-group {id save} @ADMIN >>> ' +
    '(-) body - invalid previously updated version >>>', function() {

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

    before('create media-group - minimum required', function(done) {

        sendBody001 = Object.assign({}, setupFixture);

        // assign name
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

    before('save media-group - name and version', function(done) {

        sendBody002 = {};

        // assign name and version
        sendBody002.name = resOutput001.name + '@2';
        sendBody002.version = resOutput001.version;

        request(targetServer)
            .post(util.format(targetEndpoint.mediaGroupSave, resOutput001.id))
            .set(authHeaders)
            .send(sendBody002)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                resText002 = JSON.parse(res.text);

                // spot check response
                expect(resText002.notices).to.not.exist;
                expect(resText002.errors).to.not.exist;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('save media-group - previously updated version', function(done) {

        sendBody003 = {};

        // assign version
        sendBody003.version = resOutput001.version;

        request(targetServer)
            .post(util.format(targetEndpoint.mediaGroupSave, resOutput001.id))
            .set(authHeaders)
            .send(sendBody003)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(409);

                // assign shared test variable(s)
                res003 = res;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 409', function() {
        expect(res003.status).to.equal(409);
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
