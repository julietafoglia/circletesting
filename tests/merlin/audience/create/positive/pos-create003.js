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
const setupFixture =
    require(rootPath + '/fixtures/common/search/advanced-parameters001');
const setupFixture001 =
    require(rootPath + '/fixtures/common/media-group/create002');
const setupFixture002 =
    require(rootPath + '/fixtures/common/advertiser/create001');
const testFixture =
    require(rootPath + '/fixtures/common/audience/create003');
const verifyFixture =
    require(rootPath + '/fixtures/common/audience/create001-verify');

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

describe('{{MERLIN}} /audience {create} >>> ' +
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

    before('create advertiser - minimum required fields', function(done) {

        sendBody002 = Object.assign({}, setupFixture002);

        // assign name and owner to advertiser
        sendBody002.name += timeStamp;
        sendBody002.owner.type = 'Media Group';
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

    before('search data-provider - ' +
        'order by id - desc - number 5 - page 1', function(done) {

        sendBody003 = {};
        setupFixture.sort = 'desc';
        Object.assign(
            sendBody003,
            setupFixture
        );

        request(targetServer)
            .post(util.format(
                targetEndpoint.searchDataProvider
            )
            )
            .set(authHeaders)
            .send(sendBody003)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                resText003 = JSON.parse(res.text);
                resOutput003 = resText003.output;

                // spot check
                expect(resText003.notices).to.not.exist;
                expect(resText003.errors).to.not.exist;

                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create audience - null non-required fields', function(done) {

        sendBody004 = Object.assign({}, testFixture);

        // assign name and advertiser to audience
        sendBody004.name += timeStamp;
        sendBody004.advertiser = resOutput002.id;
        sendBody004.dataProviderId = resOutput003[0].id;

        request(targetServer)
            .post(util.format(targetEndpoint.audienceCreate))
            .set(authHeaders)
            .send(sendBody004)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                // expect(res.status).to.equal(201);

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

    it('response have status of 201', function() {
        expect(res004.status).to.equal(201);
    });

    it('notices and errors should not exist', function() {
        expect(resText004.notices).to.not.exist;
        expect(resText004.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput004.id)).to.be.true;
        expect(validator.isInt(resOutput004.refId + '')).to.be.true;
        expect(validator.isInt(resOutput004.version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.advertiser)).to.be.true;
        expect(resOutput004.name).to.have.length.of.at.most(128);
        if (resOutput004.records !== null) {
            expect(validator.isInt(resOutput004.records + '')).to.be.true;
        }
        if (resOutput004.externalId !== null) {
            expect(resOutput004.externalId).to.have.length.of.at.most(256);
        }
        expect(resOutput004.isShared).to.be.a('boolean');
        expect(resOutput004.isDds).to.be.a('boolean');
        if (resOutput004.uploaded !== null) {
            expect(validator.isISO8601(resOutput004.uploaded + ''))
                .to.be.true;
        }
        // created and modified
        expect(validator.isISO8601(resOutput004.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput004.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.modifiedBy)).to.be.true;
    });

    it('response object key values should match test object', function() {
        expect(resOutput004.advertiser).to.equal(resOutput002.id);
        expect(resOutput004.name).to.equal(sendBody004.name);
        expect(resOutput004.records).to.equal(verifyFixture.records);
        expect(resOutput004.externalId).to.equal(verifyFixture.externalId);
        expect(resOutput004.isShared).to.equal(verifyFixture.isShared);
        expect(resOutput004.isDds).to.equal(verifyFixture.isDds);
        expect(resOutput004.uploaded).to.equal(verifyFixture.uploaded);
    });

    after('delete audience', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.audienceDelete, resOutput004.id))
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
