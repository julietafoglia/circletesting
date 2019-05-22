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

const invalidBodyFixture =
    require(rootPath + '/fixtures/reporting/query/invalidBody.json');

// shared test variable(s)
let authHeaders;
let invalidBody;

let invalidBodyErr;

describe('{{REPORTING}} <SMOKE> /query {canned-save} report @ADMIN >>> ' +
    '(-) check errors saving canned query with invalid body >>>', function() {

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

    before('Try to save canned query with invalid body',
        function(done) {
            invalidBody = Object.assign({},invalidBodyFixture);

            request(targetServer)
                .post(util.format(targetEndpoint.queryCannedSave))
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

    it('Check errors saving canned query with invalid body',
        function(done) {
            expect(invalidBodyErr.statusCode).to.equal(400);
            expect(invalidBodyErr.error).to.equal('Bad Request');
            expect(invalidBodyErr.validation.source).to.equal('payload');
            expect(invalidBodyErr.validation.keys[0])
                .to.equal('intervals.0.start');
            expect(invalidBodyErr.validation.keys[1])
                .to.equal('intervals.0.end');
            expect(invalidBodyErr.validation.keys[2])
                .to.equal('filter.dimension');
            expect(invalidBodyErr.validation.keys[3])
                .to.equal('filter.value');
            expect(invalidBodyErr.message)
                .to.equal('child "intervals" fails because ' +
                    '["intervals" at position 0 fails because ' +
                    '[child "start" fails because ["start" is ' +
                    'required], child "end" fails because ["end" ' +
                    'is required]]]. child "filter" fails because ' +
                    '[child "dimension" fails because ["dimension" ' +
                    'is required], child "value" fails because ' +
                    '["value" is required]]');
            done();
        });

});
