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

const cannedQueryBodyFixture =
    require(rootPath + '/fixtures/reporting/query/cannedQueryBody.json');

// shared test variable(s)
let authHeaders;
let validBody;

let cannedQueryBodyOut;

describe('{{REPORTING}} <SMOKE> /query {canned-save} report @ADMIN >>> ' +
    '(+) create canned query >>>', function() {

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

    before('Get saved cannned query',
        function(done) {
            request(targetServer)
                .get(util.format(targetEndpoint.queryCanned))
                .set(authHeaders)
                .then( function(response) {
                    cannedQueryBodyOut = (JSON.parse(response.text)[0]);
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('Post a cannned query',
        function(done) {
            validBody = Object.assign({},cannedQueryBodyFixture);
            validBody.name = cannedQueryBodyOut.data.attributes.name;

            request(targetServer)
                .post(util.format(targetEndpoint.queryCannedSave))
                .set(authHeaders)
                .send(validBody)
                .then( function(response) {
                    cannedQueryBodyOut = response;
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    it('Updated query response should have status of 200', function(done) {
        expect(cannedQueryBodyOut.status).to.equal(200);
        done();
    });

    after('delete query', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.queryDelete,
                JSON.parse(cannedQueryBodyOut.text).data.id))
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
