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
const invalidBodyFixture =
    require(rootPath + '/fixtures/reporting/query/invalidBody.json');

// shared test variable(s)
let basicReportBody;
let authHeaders;
let invalidBody;
let invalidBodyErr;
let queryOutput1;

describe('{{REPORTING}} <SMOKE> /query {update} report @ADMIN >>> ' +
    '(-) check errors updating query with invalid body >>>', function() {

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


    before('Try to update query with invalid body',
        function(done) {
            invalidBody = Object.assign({},invalidBodyFixture);

            request(targetServer)
                .put(util.format(targetEndpoint.queryUpdate,queryOutput1.id))
                .set(authHeaders)
                .send(invalidBody)
                .then( function(response) {
                    invalidBodyErr = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    it('Check errors updating query with invalid body',
        function(done) {
            expect(invalidBodyErr.statusCode).to.equal(400);
            expect(invalidBodyErr.error).to.equal('Bad Request');
            expect(invalidBodyErr.validation.source).to.equal('payload');
            expect(invalidBodyErr.validation.keys[0])
                .to.equal('granularity');
            expect(invalidBodyErr.validation.keys[1])
                .to.equal('intervals');
            expect(invalidBodyErr.validation.keys[2])
                .to.equal('name');
            expect(invalidBodyErr.validation.keys[3])
                .to.equal('filter');
            expect(invalidBodyErr.message)
                .to.equal('"granularity" is not allowed. ' +
                    '"intervals" is not allowed. "name" is not ' +
                    'allowed. "filter" is not allowed');
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
