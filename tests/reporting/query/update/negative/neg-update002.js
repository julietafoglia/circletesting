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
let queryOutput1;
let basicReportBody;
let authHeaders;
let invalidIDErr1;
let invalidIDErr2;

describe('{{REPORTING}} <SMOKE> /query {update} report @ADMIN >>> ' +
    '(-) check errors updating query with invalid id >>>', function() {

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

    before('Try to update query with non existing id', function(done) {
        basicReportBody = Object.assign({}, basicReportFixture);

        request(targetServer)
            .put(util.format(targetEndpoint.queryUpdate,'-1'))
            .set(authHeaders)
            .send(basicReportBody)
            .then( function(response) {
                invalidIDErr1 = (JSON.parse(response.text));
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    before('Try to get query with invalid id type', function(done) {
        basicReportBody = Object.assign({}, basicReportFixture);

        request(targetServer)
            .put(util.format(targetEndpoint.queryUpdate,'test'))
            .set(authHeaders)
            .send(basicReportBody)
            .then( function(response) {
                // basic response verification
                expect(response.body).to.exist;
                expect(response.status).to.equal(400);

                // assign shared test variable(s)
                invalidIDErr2 = (JSON.parse(response.text));
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    it('query with non existing id should have status of 404 ',
        function(done) {
            expect(invalidIDErr1.statusCode).to.equal(404);
            expect(invalidIDErr1.error).to.equal('Not Found');
            expect(invalidIDErr1.message)
                .to.equal('Query -1 not found. Zero rows updated');
            done();
        });

    it('query with invalid id type should have status of 404', function(done) {
        expect(invalidIDErr2.statusCode).to.equal(400);
        expect(invalidIDErr2.error).to.equal('Bad Request');
        expect(invalidIDErr2.message).to.equal('child "id" fails ' +
            'because ["id" must be a number]');
        expect(invalidIDErr2.validation.source).to.equal('params');
        expect(invalidIDErr2.validation.keys[0]).to.equal('id');
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
