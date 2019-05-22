'use strict';

// vendor dependencies
const chance = require('chance').Chance();
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const moment = require('moment');
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

// shared test variable(s)
let authHeaders;
let res001;
let resText001;
let sendBody001;

describe('{{MERLIN}} /insertion-order {create} @ADMIN >>> ' +
    '(-) body - invalid required fields >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('generate auth headers', function(done) {
        // generate auth headers
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('create insertion order - invalid required', function(done) {

        sendBody001 = {};

        // assign invalid values to required fields
        sendBody001.advertiser = 'ghost' + chance.hash({length: 27});
        sendBody001.name += chance.sentence({words: 129});
        sendBody001.startDate = moment().format('MM-DD-YYYY');
        sendBody001.endDate = moment().endOf('month').format('MM-DD-YYYY');
        sendBody001.admin = 'ghost' + chance.hash({length: 27});
        sendBody001.executive = 'ghost' + chance.hash({length: 27});
        sendBody001.trafficker = 'ghost' + chance.hash({length: 27});

        request(targetServer)
            .post(util.format(targetEndpoint.insertionOrderCreate))
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

    it('response have status of 400', function() {
        expect(res001.status).to.equal(400);
    });

    it('response should include an error for each invalid field', function() {
        expect(resText001.errors).to.deep.include.members([
            {'id': 'E1000', 'code':'INV', 'details': 'advertiser'},
            {'id': 'E1000', 'code':'INV', 'details': 'name'},
            {'id': 'E1000', 'code':'INV', 'details': 'startDate'},
            {'id': 'E1000', 'code':'INV', 'details': 'endDate'},
            {'id': 'E1000', 'code':'INV', 'details': 'admin'},
            {'id': 'E1000', 'code':'INV', 'details': 'executive'},
            {'id': 'E1000', 'code':'INV', 'details': 'trafficker'}
        ]);
    });

});
