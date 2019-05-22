'use strict';

// vendor dependencies
const chai = require('chai');


const expect = chai.expect; // use bdd chai

const request = require('supertest-as-promised');
const util = require('util');

// runtime variables
const rootPath =
    process.env.ROOT_PATH;
const targetEndpoint =
    require(rootPath + '/config/reporting/endpoints');
const targetEnvironment =
    require(rootPath + '/config/merlin/' + process.env.NODE_ENV);
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser =
    usersTargetEnvironment.admin;
const merlinAuthHeaders =
    require(rootPath + '/helpers/merlin-auth-headers');
const targetServer =
    targetEnvironment.server;
const requestTimeOut = 8000;

const basicReportFixture =
    require(rootPath + '/fixtures/reporting/schedule/basicreportdata.json');

// shared test variable(s)
let basicReportBody;
let authHeaders;
let res001;
let res002;
let queryOutput1;

describe('{{REPORTING}} <SMOKE> /query {execute-saved} @ADMIN >>> ' +
    '(-) execute saved query with invalid id >>>', function() {

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

    before('create basic query', function(done) {
        basicReportBody = Object.assign({}, basicReportFixture);

        request(targetServer)
            .post(util.format(targetEndpoint.queryList))
            .set(authHeaders)
            .send(basicReportBody)
            .then( function(response) {
                // basic response verification
                expect(response.body).to.exist;
                expect(response.status).to.equal(200);
                // assign shared test variable(s)
                queryOutput1 = (JSON.parse(response.text)).data;
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    before('Execute saved query with invalid id value', function(done) {
        request(targetServer)
            .post(util.format(targetEndpoint.queryExecute, '-1'))
            .set(authHeaders)
            .then( function(res) {
                expect(res.body).to.exist;
                expect(res.status).to.equal(404);
                res001 = (JSON.parse(res.text));
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    before('Execute saved query with invalid id type', function(done) {
        request(targetServer)
            .post(util.format(targetEndpoint.queryExecute, 'test'))
            .set(authHeaders)
            .then( function(res) {
                expect(res.body).to.exist;
                expect(res.status).to.equal(400);
                expect(res.body).to.exist;
                expect(res.status).to.equal(400);
                res002 = (JSON.parse(res.text));
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    it('query with non existing id should have status of 404 ',
        function(done) {
            expect(res001.statusCode).to.equal(404);
            expect(res001.error).to.equal('Not Found');
            expect(res001.message)
                .to.equal('Query Not Found: -1');
            done();
        });

    it('query with invalid id type should have status of 404', function(done) {
        expect(res002.statusCode).to.equal(400);
        expect(res002.error).to.equal('Bad Request');
        expect(res002.message).to.equal('child "id" fails ' +
            'because ["id" must be a number]');
        expect(res002.validation.source).to.equal('params');
        expect(res002.validation.keys[0]).to.equal('id');
        done();
    });

    after('delete query', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.queryDelete, queryOutput1.id))
            .set(authHeaders)
            .then( function(response) {
                // basic response verification
                expect(response.status).to.equal(200);
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

});
