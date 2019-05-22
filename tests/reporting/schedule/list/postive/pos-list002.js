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


// shared test variable(s)
let authHeaders;
let queryOutput1;

describe('{{REPORTING}} <SMOKE> /schedule report @ADMIN >>> ' +
    '(+) get all scheduled reports with queries >>>', function() {

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

    before('Get existing scheduled reports with queries', function(done) {

        request(targetServer)
            .get(util.format(targetEndpoint.scheduleGetWithQueries))
            .set(authHeaders)
            .then( function(response) {
                // basic response verification
                expect(response.body).to.exist;
                expect(response.status).to.equal(200);
                // assign shared test variable(s)
                queryOutput1 = response;
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    it('response should have status of 200', function() {
        expect(queryOutput1.status).to.equal(200);
    });

});
