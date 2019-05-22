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
let sendBody001;

describe('{{MERLIN}} /search/ssp-control/publisher {advanced} @ADMIN >>> ' +
    '(-) body - invalid values for field names >>>', function() {

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

        sendBody001 = {};

        sendBody001.conditions = [
            {'field': 'publisherId',
                'value': 'ghost' + chance.hash({length: 27})},
            {'field': 'targetingType',
                'value': chance.word({length: 10})},
            {'field': 'applyBlocklists',
                'value': chance.word({length: 10})},
            {'field': 'rtbAllow',
                'value': chance.word({length: 10})},
            {'field': 'rtbFloor',
                'value': chance.word({length: 10})},
            {'field': 'uniqueAds',
                'value': chance.word({length: 10})},
            {'field': 'userMatchAllow',
                'value': chance.word({length: 10})},
            {'field': 'directoryExpose',
                'value': chance.word({length: 10})},
            {'field': 'directoryExposePublic',
                'value': chance.word({length: 10})},
            {'field': 'demandAllocationHouse',
                'value': chance.word({length: 10})},
            {'field': 'demandAllocationDirect',
                'value': chance.word({length: 10})}
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

    it('response should contain an error for each invalid field', function() {
        expect(resText001.errors).to.deep.include.members([
            {'id': 'E1000', 'code': 'INV', 'details': 'condition:publisherId'},
            {'id': 'E1000', 'code': 'INV',
                'details': 'condition:targetingType'},
            {'id': 'E1000', 'code': 'INV',
                'details': 'condition:applyBlocklists'},
            {'id': 'E1000', 'code': 'INV', 'details': 'condition:rtbAllow'},
            {'id': 'E1002', 'code': 'UNS', 'details': 'condition:rtbFloor'},
            {'id': 'E1000', 'code': 'INV', 'details': 'condition:uniqueAds'},
            {'id': 'E1000', 'code': 'INV',
                'details': 'condition:userMatchAllow'},
            {'id': 'E1000', 'code': 'INV',
                'details': 'condition:directoryExpose'},
            {'id': 'E1000', 'code': 'INV',
                'details': 'condition:directoryExposePublic'},
            {'id': 'E1002', 'code': 'UNS',
                'details': 'condition:demandAllocationHouse'},
            {'id': 'E1002', 'code': 'UNS',
                'details': 'condition:demandAllocationDirect'}
        ]);
    });

});
