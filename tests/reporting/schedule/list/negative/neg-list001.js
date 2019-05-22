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
let queryOutput2;

describe('{{REPORTING}} <SMOKE> /schedule report @ADMIN >>> ' +
    '(-) check errors getting scheduled report with ' +
        'invalid id and type >>>', function() {

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

    before('get a scheduled report with invalid id value', function(done) {

        request(targetServer)
            .get(util.format(targetEndpoint.scheduleRead, '-1'))
            .set(authHeaders)
            .then( function(response) {
                // basic response verification
                expect(response.body).to.exist;
                expect(response.status).to.equal(404);
                // assign shared test variable(s)
                queryOutput1 = (JSON.parse(response.text));
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    before('get a scheduled report with invalid id type', function(done) {

        request(targetServer)
            .get(util.format(targetEndpoint.scheduleRead, 'test'))
            .set(authHeaders)
            .then( function(response) {
                // basic response verification
                expect(response.body).to.exist;
                expect(response.status).to.equal(400);
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
        expect(queryOutput1.message).to.equal('Report -1 not found');
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
