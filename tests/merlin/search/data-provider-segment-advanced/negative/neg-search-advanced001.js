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
    require(rootPath + '/config/merlin/endpoints');
const targetEnvironment =
    require(rootPath + '/config/merlin/' + process.env.NODE_ENV);
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetServer =
    targetEnvironment.server;
const targetUser =
    usersTargetEnvironment.admin;
const merlinAuthHeaders =
    require(rootPath + '/helpers/merlin-auth-headers');
const requestTimeOut = 15000;

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/search/advanced-parameters002');

// shared test variable(s)
let authHeaders;
let res001;
let resText001;
let sendBody001;

describe('{{MERLIN}} /search/data-provider/segment {advanced} @ADMIN >>> ' +
   '(-) body - invalid fields - conditions - operator >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('generate auth login headers', function(done) {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('search data-provider segment - ' +
        'invalid fields - conditions - operator', function(done) {

        sendBody001 = Object.assign(testFixture);
        sendBody001.sort = 'desc';
        sendBody001.number = 50;
        sendBody001.return = ['id', 'name', 'source'];
        sendBody001.returnMode = 'only';
        sendBody001.conditions = [
            {'field': 'source', 'operator': '==', 'value': 'rapleaf'}
        ];

        request(targetServer)
            .post(util.format(
                targetEndpoint.searchDataProviderSegmentAdvanced
            )
            )
            .set(authHeaders)
            .send(sendBody001)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(400);

                // assign shared test variable(s)
                res001 = res;
                resText001 = JSON.parse(res.text);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 400', function() {
        expect(res001.status).to.equal(400);
    });

    it('errors should include invalid operator', function() {
        expect(resText001.errors).to.exist;
        expect(resText001.errors).to.deep.include.members([
            {'id': 'E1000', 'code': 'INV', 'details': 'operator:source'}
        ]);
    });
});
