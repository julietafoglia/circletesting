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

// fixture(s)
const setupFixture001 =
    require(rootPath + '/fixtures/common/media-group/create002');
const setupFixture002 =
    require(rootPath + '/fixtures/common/publisher/create001');
const setupFixture003 =
    require(rootPath + '/fixtures/common/bundle/create001');

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
let key004;
let value004;

describe('{{MERLIN}} /search/bundle @ADMIN >>> ' +
    '(+) url - ref-id - publisher bundle >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('generate auth login headers', function(done) {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('create media-group', function(done) {

        // create request send body
        sendBody001 = {};
        Object.assign(
            sendBody001,
            setupFixture001
        );

        sendBody001.name = 'mda-grp@' +
            moment().format('YYYY-MM-DDTHH:mm:ss');

        // assign random string to salesforce id
        sendBody001.salesforceId = chance.string({length: 18});

        // send agency create request
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
                expect(validator.isInt(resOutput001.refId + '')).to.be.true;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create publisher', function(done) {

        sendBody002 = {};
        Object.assign(
            sendBody002,
            setupFixture002
        );
        sendBody002.name = 'publisher@' +
            moment().format('YYYY-MM-DDTHH:mm:ss');

        // assign test media group to publisher
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
                expect(/^[a-f0-9]{32}$/.test(resOutput002.id)).to.be.true;
                expect(resOutput002.name).to.have.length.of.at.most(255);
                expect(resOutput002.mediaGroup)
                    .to.equal(sendBody002.mediaGroup);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create bundle', function(done) {
        sendBody003 = {};
        Object.assign(
            sendBody003,
            setupFixture003
        );
        sendBody003.name = 'bundle@' +
            moment().format('YYYY-MM-DDTHH:mm:ss');

        // assign test publisher to bundle
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
                expect(validator.isInt(resOutput003.refId + '')).to.be.true;
                expect(validator.isInt(resOutput003.version + '')).to.be.true;
                expect(/^[a-f0-9]{32}$/.test(resOutput003.publisher))
                    .to.be.true;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('search bundle - ref-id - publisher bundle', function(done) {

        key004 = 'ref-id';
        value004 = resOutput003.refId;

        // create url request parameters
        const urlParameters004 = encodeURIComponent(key004 + '/' + value004);

        request(targetServer)
            .get(util.format(
                targetEndpoint.searchBundleParameters,
                urlParameters004
            )
            )
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

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

    it('response should have status of 200', function() {
        expect(res004.status).to.equal(200);
    });

    it('notices and errors should not exist', function() {
        expect(resText004.notices).to.not.exist;
        expect(resText004.errors).to.not.exist;
    });

    it('array first object ref-id should match search ref-id', function() {
        expect(resOutput004[0].refId).to.equal(resOutput003.refId);
    });

    it('response object property types should match spec', function() {
        if (resOutput004 !== null && resOutput001 !== undefined) {
            expect(resOutput004).to.be.an('array');
            resOutput004.forEach(function(val) {
                expect(val).to.be.an('object');
            });
        }
        expect(/^[a-f0-9]{32}$/.test(resOutput004[0].id)).to.be.true;
        expect(resOutput004[0].status).to.be.oneOf([
            'active', 'inactive', 'pending', 'deleted'
        ]);
        expect(resOutput004[0].name).to.have.length.of.at.most(32);
        if (resOutput004[0].publisher !== null) {
            expect(/^[a-f0-9]{32}$/.test(resOutput004[0].publisher))
                .to.be.true;
        }
        if (resOutput004[0].publisherName !== null) {
            expect(resOutput004[0].publisherName)
                .to.have.length.of.at.most(255);
        }
        // created and modified
        expect(validator.isISO8601(resOutput004[0].created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004[0].createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput004[0].modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004[0].modifiedBy)).to.be.true;
    });

    it('response object key values should match test object', function() {
        expect(resOutput004[0].id).to.equal(resOutput003.id);
        expect(resOutput004[0].refId).to.equal(resOutput003.refId);
        expect(resOutput004[0].version).to.equal(resOutput003.version);
        expect(resOutput004[0].advertiser).to.equal(resOutput003.advertiser);
        expect(resOutput004[0].name).to.equal(resOutput003.name);
        expect(resOutput004[0].records).to.equal(resOutput003.records);
        expect(resOutput004[0].isShared).to.equal(resOutput003.isShared);
        // created and modified
        // expect(resOutput004[0].created).to.equal(resOutput003.created);
        expect(resOutput004[0].createdBy).to.equal(resOutput003.createdBy);
        // expect(resOutput004[0].modified).to.equal(resOutput003.modified);
        expect(resOutput004[0].modifiedBy).to.equal(resOutput003.modifiedBy);
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

