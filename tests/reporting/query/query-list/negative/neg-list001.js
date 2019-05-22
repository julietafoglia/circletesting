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
let res001;
let res002;

describe('{{REPORTING}} <SMOKE> /query {list-id} @ADMIN >>> ' +
    '(-) id - invalid values of id >>>', function() {

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

    before('Try to get query with non existing id', function(done) {
        request(targetServer)
            .get(util.format(targetEndpoint.queryGet,'-1'))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(404);

                // assign shared test variable(s)
                res001 = (JSON.parse(res.text));
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    before('Try to get query with invalid id type', function(done) {
        request(targetServer)
            .get(util.format(targetEndpoint.queryGet,'Anvi'))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(400);

                // assign shared test variable(s)
                res002 = (JSON.parse(res.text));
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    it('query with non existing id should have status of 404', function(done) {
        expect(res001.statusCode).to.equal(404);
        expect(res001.error).to.equal('Not Found');
        expect(res001.message).to.equal('Query -1 not found');
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
});

