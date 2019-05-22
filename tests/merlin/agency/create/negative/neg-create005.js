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

// fixture(s)
const testFixture = require(rootPath + '/fixtures/common/agency/create003');

// shared test variable(s)
let authHeaders;
let res001;
let resText001;
let sendBody001;

describe('{{MERLIN}} /agency {create} @ADMIN >>> ' +
    '(-) body - string fields - too long >>>', function() {

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

    before('create agency - string fields - too long', function(done) {
        sendBody001 = {};
        Object.assign(
            sendBody001,
            testFixture
        );

        // create random string key values to max length allowed +1
        sendBody001.salesforceId = chance.string({length: 33});
        sendBody001.name = chance.string({length: 33});
        sendBody001.description = chance.string({length: 256});
        sendBody001.contact = {}; // add contact object to send body
        sendBody001.contact.company =
            chance.string({length: 129, alpha: true});
        sendBody001.contact.firstName =
            chance.string({length: 33, alpha: true});
        sendBody001.contact.lastName =
            chance.string({length: 33, alpha: true});
        sendBody001.contact.phone =
            chance.string({length: 33, pool: '0123456789'});
        sendBody001.contact.address1 =
            chance.string({length: 129, alpha: true});
        sendBody001.contact.address2 =
            chance.string({length: 129, alpha: true});
        sendBody001.contact.email =
            chance.string({length: 129, alpha: true});
        sendBody001.contact.city =
            chance.string({length: 65, alpha: true});
        sendBody001.contact.state =
            chance.string({length: 33, alpha: true});
        sendBody001.contact.postalCode =
            chance.string({length: 33});
        sendBody001.contact.country =
            chance.string({length: 33, alpha: true});

        request(targetServer)
            .post(util.format(targetEndpoint.agencyCreate))
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

    it('errors should include invalid string key values', function() {
        expect(resText001.errors).to.exist;
        expect(resText001.errors).to.deep.include.members([
            {'id': 'E1000', 'code': 'INV', 'details': 'salesforceId'},
            {'id': 'E1000', 'code': 'INV', 'details': 'name'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:company'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:firstName'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:lastName'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:emailAddress'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:phone'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:address1'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:address2'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:city'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:state'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:postalCode'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:country'}
        ]);
    });

});
