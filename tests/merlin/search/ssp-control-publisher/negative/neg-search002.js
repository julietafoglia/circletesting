'use strict';

// vendor dependencies
const chance = require('chance').Chance();
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

describe('{{MERLIN}} /search/ssp-control/publisher @ADMIN >>> ' +
    '(-) url - multiple invalid query parameter values >>>', function() {

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

    before('search ssp-control-publisher - multiple invalid', function(done) {

        // invalid search parameters values
        const urlParams = [
            'targetingType', chance.word({length: 10}),
            'applyBlocklists', chance.word({length: 10}),
            'rtbAllow', chance.word({length: 10}),
            'rtbFloor', chance.word({length: 10}),
            'uniqueAds', chance.word({length: 10}),
            'userMatchAllow', chance.word({length: 10}),
            'directoryExpose', chance.word({length: 10}),
            'directoryExposePublic', chance.word({length: 10}),
            'demandAllocationHouse', chance.word({length: 10}),
            'demandAllocationDirect', chance.word({length: 10})
        ].join('/');

        request(targetServer)
            .get(util.format(
                targetEndpoint.searchSspControlPublisherParams, urlParams
            )
            )
            .set(authHeaders)
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

    it('response should contain an error for each invalid field', function() {
        expect(resText001.errors).to.deep.include.members([
            {'id': 'E1000', 'code': 'INV', 'details': 'targetingType'},
            {'id': 'E1000', 'code': 'INV', 'details': 'applyBlocklists'},
            {'id': 'E1000', 'code': 'INV', 'details': 'rtbAllow'},
            {'id': 'E1000', 'code': 'INV', 'details': 'rtbFloor'},
            {'id': 'E1000', 'code': 'INV', 'details': 'uniqueAds'},
            {'id': 'E1000', 'code': 'INV', 'details': 'userMatchAllow'},
            {'id': 'E1000', 'code': 'INV',
                'details': 'directoryExpose'},
            {'id': 'E1000', 'code': 'INV',
                'details':'directoryExposePublic'},
            {'id': 'E1000', 'code': 'INV',
                'details': 'demandAllocationHouse'},
            {'id': 'E1000', 'code': 'INV', 'details':
                'demandAllocationDirect'}
        ]);
    });

});
