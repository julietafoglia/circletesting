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
const requestTimeOut = 10000;

// shared test variables
let authHeaders;
let res001;
let resText001;
let sendBody001;

describe('{{MERLIN}} /search/ssp-control/publisher {advanced} @ADMIN >>> ' +
    '(-) body - non-searchable - ' +
    'rtbFloor, demandAllocationHouse, demandAllocationDirect >>>', function() {

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

    before('search ssp-control-publisher', function(done) {

        sendBody001 = {};

        sendBody001.conditions = [
            {'field': 'rtbFloor', 'value': 90.3},
            {'field': 'demandAllocationHouse', 'value': 5},
            {'field': 'demandAllocationDirect', 'value': 8}
        ];

        request(targetServer)
            .post(util.format(targetEndpoint.searchSspControlPublisherAdvanced))
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

    it('should return an error for each unsupported field', function() {
        expect(resText001.errors).to.deep.include.members([
            {'id': 'E1002', 'code': 'UNS',
                'details': 'condition:rtbFloor'},
            {'id': 'E1002', 'code': 'UNS',
                'details': 'condition:demandAllocationHouse'},
            {'id': 'E1002', 'code': 'UNS',
                'details': 'condition:demandAllocationDirect'}
        ]);
    });

});
