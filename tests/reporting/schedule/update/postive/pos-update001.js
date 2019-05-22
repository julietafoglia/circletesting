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

const updateReportBodyFixture =
    require(rootPath + '/fixtures/reporting/schedule/weeklyscheduledata.json');

// shared test variable(s)
let authHeaders;
let updateReportBody;
let queryOutput1;
let queryOutput2;

describe('{{REPORTING}} <SMOKE> /schedule report @ADMIN >>> ' +
    '(+) update an existing scheduled report >>>', function() {

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

    before('Get existing user scheduled report', function(done) {
        request(targetServer)
            .get(util.format(targetEndpoint.scheduleGetUserCollection))
            .set(authHeaders)
            .then( function(response) {
                // basic response verification
                expect(response.body).to.exist;
                expect(response.status).to.equal(200);
                // assign shared test variable(s)
                queryOutput1 = (JSON.parse(response.text)[0]);
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    before('update the scheduled report for a given id', function(done) {
        updateReportBody = Object.assign({}, updateReportBodyFixture);
        request(targetServer)
            .put(util.format(targetEndpoint.scheduleUpdate,
                queryOutput1.data.id))
            .set(authHeaders)
            .send(updateReportBody)
            .then( function(response) {
                // basic response verification
                expect(response.body).to.exist;
                expect(response.status).to.equal(200);
                // assign shared test variable(s)
                queryOutput2 = response;
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    it('response should have status of 200', function() {
        expect(queryOutput2.status).to.equal(200);
    });

});
