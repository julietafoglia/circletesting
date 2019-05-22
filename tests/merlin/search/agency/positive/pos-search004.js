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
const requestTimeOut = 10000;

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

let key002;
let value002;
let pageCount002;
let page002;

describe('{{MERLIN}} <SMOKE> /search/agency @ADMIN >>> ' +
    '(+) url - search by - status page and number >>>', function() {

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

    before('search agency - search by - ' +
        'status page and number ', function(done) {

        key002 = 'status';
        value002 = 'active';
        pageCount002 = 5;
        page002 = 2;

        // create url request parameters
        const urlParameters002 = encodeURIComponent(
            key002 + '/' + value002 +
            '/n/' + pageCount002 +
            /p/ + page002
        );

        request(targetServer)
            .get(util.format(
                targetEndpoint.searchAgencyParameters, urlParameters002
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

    it('array objects status should match search status', function() {
        resOutput002.forEach(function(val) {
            expect(val.status).to.be.equal(value002);
        });
    });

    it('array objects count should match search count', function() {
        expect(resOutput002.length).to.be.at.most(pageCount002);
    });

    it('response object property types should match spec', function() {
        if (resOutput002 !== null && resOutput002 !== undefined) {
            expect(resOutput002).to.be.an('array');
            resOutput002.forEach(function(val) {
                expect(val).to.be.an('object');
            });
        }
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

