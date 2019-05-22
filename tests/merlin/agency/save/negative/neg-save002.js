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
const timeStamp =
    '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');

// fixture(s)
const setupFixture = require(rootPath + '/fixtures/common/agency/create003');

// shared test variable(s)
let authHeaders;
let res002;
let resOutput001;
let resText001;
let resText002;
let sendBody001;
let sendBody002;

describe('{{MERLIN}} /agency/{id save} @ADMIN >>> ' +
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

    before('create agency', function(done) {
        sendBody001 = {};
        Object.assign(
            sendBody001,
            setupFixture
        );

        sendBody001.name += timeStamp;

        // assign random string to salesforce id
        sendBody001.salesforceId = chance.string({length: 18});

        request(targetServer)
            .post(util.format(targetEndpoint.agencyCreate))
            .set(authHeaders)
            .send(sendBody001)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText001 = JSON.parse(res.text);
                resOutput001 = resText001.output;

                // spot check response
                expect(/^[a-f0-9]{32}$/.test(resOutput001.id)).to.be.true;
                expect(resOutput001.name).to.have.length.of.at.most(32);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('save agency - string fields - too long', function(done) {
        sendBody002 = {};
        sendBody002.version = resOutput001.version;
        sendBody002.name = chance.string({length: 33});

        // create invalid key values
        // one character more than spec allows
        sendBody002.salesforceId =
            chance.string({length: 33, alpha: true});
        sendBody002.name =
            chance.string({length: 33, alpha: true});
        sendBody002.description =
            chance.string({length: 256, alpha: true});
        // contact object
        sendBody002.contact = {};
        sendBody002.contact.company =
            chance.string({length: 129, alpha: true});
        sendBody002.contact.firstName =
            chance.string({length: 33, alpha: true});
        sendBody002.contact.lastName =
            chance.string({length: 33, alpha: true});
        sendBody002.contact.phone =
            chance.string({length: 33, alpha: true});
        sendBody002.contact.email =
            chance.string({length: 33, alpha: true});
        sendBody002.contact.address1 =
            chance.string({length: 129, alpha: true});
        sendBody002.contact.address2 =
            chance.string({length: 129, alpha: true});
        sendBody002.contact.city =
            chance.string({length: 65, alpha: true});
        sendBody002.contact.state =
            chance.string({length: 33, alpha: true});
        sendBody002.contact.postalCode =
            chance.string({length: 33, alpha: true});
        sendBody002.contact.country =
            chance.string({length: 33, alpha: true});

        request(targetServer)
            .post(util.format(targetEndpoint.agencySave, resOutput001.id))
            .set(authHeaders)
            .send(sendBody002)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(400);

                // assign shared test variable(s)
                res002 = res;
                resText002 = JSON.parse(res.text);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 400', function() {
        expect(res002.status).to.equal(400);
    });

    it('errors should include invalid key values', function() {
        expect(resText002.errors).to.deep.include.members([
            {'id': 'E1000', 'code': 'INV', 'details': 'salesforceId'},
            {'id': 'E1000', 'code': 'INV', 'details': 'name'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:company'},
            {'id': 'E1000', 'code': 'INV',
                'details': 'contact:firstName'},
            {'id': 'E1000', 'code': 'INV',
                'details': 'contact:lastName'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:emailAddress'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:phone'},
            {'id': 'E1000', 'code': 'INV',
                'details': 'contact:address1'},
            {'id': 'E1000', 'code': 'INV',
                'details': 'contact:address2'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:city'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:state'},
            {'id': 'E1000', 'code': 'INV',
                'details': 'contact:postalCode'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:country'}
        ]);
    });

    after('delete agency', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.agencyDelete, resOutput001.id))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });
});
