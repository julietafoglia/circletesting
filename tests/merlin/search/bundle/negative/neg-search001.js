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

// fixture(s)
const setupFixture001 =
    require(rootPath + '/fixtures/common/media-group/create002');

// shared test variable(s)
let authHeaders;
let res002;
let resText001;
let resText002;
let resOutput001;
let resOutput002;
let sendBody001;
let sendBody002;
let key002;
let value002;

describe('{{MERLIN}} /search/bundle @ADMIN >>> ' +
    '(-) body - valid >>>', function() {

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

    it('create bundle', function(done) {
        sendBody001 = {};
        Object.assign(
            sendBody001,
            setupFixture001
        );
        sendBody001.name = 'bundle @ ' +
            moment().format('YYYY-MM-DDTHH:mm:ss');

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
                expect(validator.isInt(resOutput001.refId + '')).to.be.true;
                expect(validator.isInt(resOutput001.version + '')).to.be.true;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('search bundle - ref-id - publisher bundle', function(done) {

        sendBody002 = {};
        sendBody002.version = resOutput001.version;

        key002 = 'ref-id';
        value002 = resOutput001.refId;

        // create url request parameters
        const urlParameters002 = encodeURIComponent(key002 + '=' + value002);

        request(targetServer)
            .get(util.format(
                targetEndpoint.searchBundleParameters,
                urlParameters002
            )
            )
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

    // it('array first object ref-id should match search ref-id', function() {
    //     expect(resOutput002[0].refId).to.equal(resOutput001.refId);
    // });

    it('response object property types should match spec', function() {
        if (resOutput002 !== null && resOutput002 !== undefined) {
            expect(resOutput002).to.be.an('array');
            resOutput002.forEach(function(val) {
                expect(val).to.be.an('object');
            });
        }
        expect(/^[a-f0-9]{32}$/.test(resOutput002[0].id)).to.be.true;
        expect(resOutput002[0].status).to.be.oneOf([
            'active', 'inactive', 'pending', 'deleted'
        ]);
        expect(resOutput002[0].name).to.have.length.of.at.most(32);
        if (resOutput002[0].publisher !== null) {
            expect(/^[a-f0-9]{32}$/.test(resOutput002[0].publisher))
                .to.be.true;
        }
        if (resOutput002[0].publisherName !== null) {
            expect(resOutput002[0].publisherName)
                .to.have.length.of.at.most(255);
        }
        // created and modified
        expect(validator.isISO8601(resOutput002[0].created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput002[0].createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput002[0].modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput002[0].modifiedBy)).to.be.true;
    });

    // it('response object key values should match test object', function() {
    //     expect(resOutput002[0].id).to.equal(resOutput001.id);
    //     expect(resOutput002[0].refId).to.equal(resOutput001.refId);
    //     expect(resOutput002[0].version).to.equal(resOutput001.version);
    //     expect(resOutput002[0].advertiser).to.equal(resOutput001.advertiser);
    //     expect(resOutput002[0].name).to.equal(resOutput001.name);
    //     expect(resOutput002[0].records).to.equal(resOutput001.records);
    //     expect(resOutput002[0].isShared).to.equal(resOutput001.isShared);
    //     // created and modified
    //     // expect(resOutput002[0].created).to.equal(resOutput001.created);
    //     expect(resOutput002[0].createdBy).to.equal(resOutput001.createdBy);
    //     // expect(resOutput002[0].modified).to.equal(resOutput001.modified);
    //     expect(resOutput002[0].modifiedBy).to.equal(resOutput001.modifiedBy);
    // });

    after('delete bundle', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.bundleDelete, resOutput001.id))
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

