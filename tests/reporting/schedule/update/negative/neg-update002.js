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
let queryOutput1;
let queryOutput2;
let updateReportBody;

describe('{{REPORTING}} <SMOKE> /schedule report @ADMIN >>> ' +
    '(-) check errors updating scheduled report with ' +
        'invalid id value and type >>>', function() {

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

    before('check errors updating a scheduled report with invalid id value',
        function(done) {
            updateReportBody = Object.assign({}, updateReportBodyFixture);
            request(targetServer)
                .put(util.format(targetEndpoint.scheduleUpdate,'-1'))
                .set(authHeaders)
                .send(updateReportBody)
                .then( function(response) {
                    // assign shared test variable(s)
                    queryOutput1 = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('check errors updating a scheduled report with invalid id type',
        function(done) {
            updateReportBody = Object.assign({}, updateReportBodyFixture);
            request(targetServer)
                .put(util.format(targetEndpoint.scheduleUpdate,'test'))
                .set(authHeaders)
                .send(updateReportBody)
                .then( function(response) {
                    // assign shared test variable(s)
                    queryOutput2 = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });


    it('query with non existing id should have status of 404', function(done) {
        expect(queryOutput1.statusCode).to.equal(404);
        expect(queryOutput1.error).to.equal('Not Found');
        expect(queryOutput1.message).to
            .equal('Schedule -1 not found. Zero rows updated');
        done();
    });

    it('query with invalid id type should have status of 404', function(done) {
        expect(queryOutput2.statusCode).to.equal(400);
        expect(queryOutput2.error).to.equal('Bad Request');
        expect(queryOutput2.message).to.equal('child "id" fails ' +
            'because ["id" must be a number]');
        expect(queryOutput2.validation.source).to.equal('params');
        expect(queryOutput2.validation.keys[0]).to.equal('id');
        done();
    });

});
