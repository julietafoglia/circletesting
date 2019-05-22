'use strict';

// vendor dependencies
const chance = require('chance').Chance();
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
const requestTimeOut = 15000;

// fixture(s)
const setupFixture =
    require(rootPath + '/fixtures/common/agency/create002');

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

describe('{{MERLIN}} /search/agency @ADMIN >>> ' +
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

    before('create agency - agency', function(done) {

        // create request send body
        sendBody001 = {};
        Object.assign(
            sendBody001,
            setupFixture
        );

        sendBody001.name = 'ghostAgency - agency';

        // assign random string to salesforce id
        sendBody001.salesforceId = chance.string({length: 18});

        // send agency create request
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
                expect(validator.isInt(resOutput001.refId + '')).to.be.true;
                expect(resOutput001.type).to.equal('Advertiser Agency');
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('search agency - body - valid', function(done) {
        sendBody002 = {};
        sendBody002.version = resOutput001.version;

        key002 = 'id';
        value002 = resOutput001.id;

        // create url request parameters
        const urlParameters002 = encodeURIComponent(key002 + '/' + value002);

        request(targetServer)
            .get(util.format(
                targetEndpoint.searchAgencyParameters, urlParameters002
            )
            )
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

    it('notices and errors should not exist', function() {
        expect(resText002.notices).to.not.exist;
        expect(resText002.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput002[0].id)).to.be.true;
        expect(validator.isInt(resOutput002[0].refId + '')).to.be.true;
        expect(validator.isInt(resOutput002[0].version + '')).to.be.true;
        expect(resOutput002[0].status).to.be.oneOf([
            'active', 'inactive', 'pending', 'deleted'
        ]);
        expect(resOutput002[0].type).to.be.oneOf([
            'Advertiser Agency', 'Trading Desk', 'Direct Advertiser'
        ]);
        expect(resOutput002[0].name).to.have.length.of.at.most(32);
        // created and modified
        expect(validator.isISO8601(resOutput002[0].created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput002[0].createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput002[0].modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput002[0].modifiedBy)).to.be.true;
    });

    it('response object key values should match test object', function() {
        expect(resOutput002[0].id)
            .to.equal(resOutput001.id);
        expect(resOutput002[0].refId)
            .to.equal(resOutput001.refId);
        expect(resOutput002[0].status)
            .to.equal(resOutput001.status);
        expect(resOutput002[0].type)
            .to.equal(resOutput001.type);
        expect(resOutput002[0].name)
            .to.equal(resOutput001.name);
        expect(resOutput002[0].manager)
            .to.equal(resOutput001.manager);
        expect(resOutput002[0].managerName)
            .to.equal(resOutput001.managerName);
        expect(resOutput002[0].managerEmail)
            .to.equal(resOutput001.managerEmail);
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

