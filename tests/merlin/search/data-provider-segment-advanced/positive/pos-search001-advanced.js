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

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/search/advanced-parameters001');

// shared test variable(s)
let authHeaders;
let res001;
let resText001;
let resOutput001;
let sendBody001;

describe('{{MERLIN}} /search/data-provider/segment {advanced} @ADMIN >>> ' +
    '(+) order by id - asc - number 5 - page 1 >>>', function() {

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

    before('search data-provider segment - ' +
        'order by id - asc - number 5 - page 1', function(done) {

        sendBody001 = {};
        Object.assign(
            sendBody001,
            testFixture
        );

        request(targetServer)
            .post(util.format(
                targetEndpoint.searchDataProviderSegmentAdvanced
            )
            )
            .set(authHeaders)
            .send(sendBody001)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res001 = res;
                resText001 = JSON.parse(res.text);
                resOutput001 = resText001.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 200', function() {
        expect(res001.status).to.equal(200);
    });

    it('notices and errors should not exist', function() {
        expect(resText001.notices).to.not.exist;
        expect(resText001.errors).to.not.exist;
    });

    it('response should have status of 200', function() {
        expect(res001.status).to.equal(200);
    });

    it('array second object id should be ' +
        'larger than second object id', function() {
        expect(resOutput001[1].id)
            .to.be.above(resOutput001[0].id);
    });

    it('array should have 5 or less objects', function() {
        expect(resOutput001).to.have.length.of.at.most(5);
    });

    it('response object property types should match spec', function() {
        if (resOutput001 !== null && resOutput001 !== undefined) {
            expect(resOutput001).to.be.an('array');
            resOutput001.forEach(function(val) {
                expect(val).to.be.an('object');
            });
        }
        expect(validator.isInt(resOutput001[0].id + '')).to.be.true;
        expect(resOutput001[0].status).to.be.oneOf([
            'active', 'inactive', 'pending', 'deleted'
        ]);
        expect(resOutput001[0].name).to.have.length.of.at.most(128);
        expect(resOutput001[0].source).to.be.oneOf([
            'Liveramp', 'Rapleaf', 'Bizo'
        ]);
        expect(resOutput001[0].system).to.be.oneOf(['ssp', 'dsp']);
        expect(resOutput001[0].provider).to.have.length.of.at.most(64);
        if (resOutput001[0].externalId !== null) {
            expect(resOutput001[0].externalId).to.have.length.of.at.most(64);
        }
        expect(resOutput001[0].category).to.have.length.of.at.most(128);
        expect(/^(\d{1,7}\.?(\d{0,3})?)$/
            .test(resOutput001[0].cost)).to.be.true;
        if (resOutput001[0].code !== null) {
            expect(resOutput001[0].code).to.have.length.of.at.most(16);
        }
        if (resOutput001[0].description !== null) {
            expect(resOutput001[0].description).to.have.length.of.at.most(128);
        }
    });
});
