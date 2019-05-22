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
const setupFixture001 =
    require(rootPath + '/fixtures/common/media-group/create001');
const setupFixture002 =
    require(rootPath + '/fixtures/common/publisher/create001');

// shared test variable(s)
let authHeaders;
let res003;
let resOutput001;
let resOutput002;
let resOutput003;
let resText001;
let resText002;
let resText003;
let sendBody001;
let sendBody002;

describe('{{MERLIN}} /publisher {id delete} >>> ' +
    '(-) url - ends in a blank string >>>', function() {

    // set timeout for test suite
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

    before('create media group - minimum required fields', function(done) {

        sendBody001 = Object.assign({}, setupFixture001);

        // assign a name to media-group
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

    before('create publisher - minimum required fields', function(done) {

        sendBody002 = Object.assign({}, setupFixture002);

        // assign name and media-group to publisher
        sendBody002.name += timeStamp;
        sendBody002.mediaGroup = resOutput001.id;

        request(targetServer)
            .post(targetEndpoint.publisherCreate)
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
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('delete publisher - url end blank', function(done) {
        request(targetServer)
            .del(util.format(
                targetEndpoint.publisherDelete, resOutput002.id + '   '
            )
            )
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

    before('get deleted publisher', function(done) {
        request(targetServer)
            .get(util.format(targetEndpoint.publisherDetails, resOutput002.id))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

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

    it('response should have status of 200', function() {
        expect(res003.status).to.equal(200);
    });

    it('notices and errors should not exist', function() {
        expect(resText003.notices).to.not.exist;
        expect(resText003.errrors).to.not.exist;
    });

    it('response object should have a deleted status', function() {
        expect(resOutput003.status).to.equal('deleted');
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
