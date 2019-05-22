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
const pubFixture =
    require(rootPath + '/fixtures/common/publisher/create002');
const mgFixture =
    require(rootPath + '/fixtures/common/media-group/create002');

// shared test variable(s)
let authHeaders;
let res003;
let resText001;
let resText002;
let resOutput001;
let resOutput002;
let resOutput003;
let sendBody001;
let sendBody002;
let sendBody003;

describe('{{MERLIN}} <SMOKE> /live connect tag {create} @ADMIN >>> ' +
    '(+) body - minimum required - publisher >>>', function() {

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

        sendBody001 = Object.assign({}, mgFixture);

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
                expect(resOutput001.name).to.have.length.of.at.most(32);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create publisher - all valid fields', function(done) {

        sendBody002 = Object.assign({}, pubFixture);

        // assign name media-group to publisher
        sendBody002.name += timeStamp;
        sendBody002.mediaGroup = resOutput001.id;

        // assign values to undefined fixture fields
        sendBody002.externalId = chance.word({length: 5});
        sendBody002.emailTagReplacement = chance.word({length: 10});
        sendBody002.placementTagReplacement = chance.word({length: 10});

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
                expect(/^[a-f0-9]{32}$/.test(resOutput002.id)).to.be.true;
                expect(resOutput002.name).to.have.length.of.at.most(32);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('create liveconnect tag using publisher', function(done) {
        sendBody003 = {};
        sendBody003.advertiserId = resOutput002.id;
        sendBody003.name = timeStamp + 'liveConnectTag';
        sendBody003.expiration = 3;

        request(targetServer)
            .post(util.format(targetEndpoint.liveconnectTag))
            .set(authHeaders)
            .send(sendBody003)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res003 = res;
                resOutput003 = JSON.parse(res003.text);

                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('notices and errors should not exist', function() {
        expect(resOutput003.notices).to.not.exist;
        expect(resOutput003.errors).to.not.exist;
        expect(resOutput003.error).to.not.exist;
        expect(resOutput003.validation).to.not.exist;
    });


    it('response object property types should match spec', function() {
        expect(validator.isInt(resOutput003.pageVisitorSegmentId + ''))
            .to.be.true;
        expect(validator.isInt(resOutput003.productRetargetingSegmentId + ''))
            .to.be.true;
        expect(validator.isInt(resOutput003.customerSegmentId + ''))
            .to.be.true;
        expect(validator.isInt(resOutput003.conversionId + ''))
            .to.be.true;
        expect(resOutput003.cookieSync).to.be.true;
        expect(resOutput003.name).to.have.length.of.at.most(255);
        expect(resOutput003.url).to.have.length.of.at.most(255);
        expect(resOutput003.liveConnectTagJs).to.have.length.of.at.most(255);
        expect(resOutput003.euNoSync).to.be.false;
        expect(resOutput003.ppid).to.be.false;
    });

    it('response object key values should match verify object(s)', function() {
        expect(resOutput003.name)
            .to.equal(sendBody003.name);
        expect("'" + resOutput003.advertiserId + "'")
            .to.equal("'" + resOutput002.refId + "'");
        expect("'" + resOutput003.publisherId + "'")
            .to.equal("'" + resOutput002.refId + "'");
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

    after('delete media group', function(done) {
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
