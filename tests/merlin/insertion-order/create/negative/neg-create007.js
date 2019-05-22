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
const characterPool =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// fixture(s)
const setupFixture001 =
    require(rootPath + '/fixtures/common/agency/create001');
const setupFixture002 =
    require(rootPath + '/fixtures/common/advertiser/create001');
const testFixture =
    require(rootPath + '/fixtures/common/insertion-order/create001');

// shared test variable(s)
let authHeaders;
let res003;
let resText001;
let resText002;
let resText003;
let resOutput001;
let resOutput002;
let sendBody001;
let sendBody002;
let sendBody003;

describe('{{MERLIN}} /insertion-order {create} @ADMIN >>> ' +
    '(-) body - invalid non-required fields >>>', function() {

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
        sendBody001 = Object.assign({}, setupFixture001);

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

    before('create advertiser', function(done) {
        sendBody002 = Object.assign({}, setupFixture002);

        // assign name and owner
        sendBody002.name += timeStamp;
        sendBody002.owner.type = 'Agency';
        sendBody002.owner.id = resOutput001.id;

        request(targetServer)
            .post(util.format(targetEndpoint.advertiserCreate))
            .set(authHeaders)
            .send(sendBody002)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText002 = JSON.parse(res.text);
                resOutput002 = resText002.output;

                // spot check response
                expect(/^[a-f0-9]{32}$/.test(resOutput002.id)).to.be.true;
                expect(resOutput002.name).to.have.length.of.at.most(255);
                expect(resOutput002.owner.id).to.equal(sendBody002.owner.id);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create insertion order - missing required - admin',
        function(done) {
            sendBody003 = Object.assign({}, testFixture);

            // assign advertiser and name
            sendBody003.advertiser = resOutput002.id;
            sendBody003.name += timeStamp;

            // assign invalid values to non-required fields
            sendBody003.budget = '10000000000000000001';
            sendBody003.referenceNumber =
                chance.string({length: 257, pool: characterPool});
            sendBody003.externalId =
                chance.string({length: 129, pool: characterPool});
            sendBody003.opportunityId =
                chance.string({length: 25, pool: characterPool});
            sendBody003.agencyCampaign =
                chance.string({length: 257, pool: characterPool});
            sendBody003.isUnlimitedBudget =
                chance.string({length: 5, pool: characterPool});
            sendBody003.adServer =
                chance.word({length: 10});
            sendBody003.paymentTerms =
                chance.word({length: 10});

            request(targetServer)
                .post(util.format(targetEndpoint.insertionOrderCreate))
                .set(authHeaders)
                .send(sendBody003)
                .then( function(res) {
                    // basic response verification
                    expect(res.body).to.exist;
                    expect(res.status).to.equal(400);

                    // assign shared test variable(s)
                    res003 = res;
                    resText003 = JSON.parse(res.text);
                    done();
                })
                .catch( function(err) {
                    done(err);
                });
        });

    it('response have status of 400', function() {
        expect(res003.status).to.equal(400);
    });

    it('response should include an error for each invalid field', function() {
        expect(resText003.errors).to.deep.include.members([
            {'id': 'E1000', 'code':'INV', 'details': 'budget'},
            {'id': 'E1000', 'code':'INV', 'details': 'referenceNumber'},
            {'id': 'E1000', 'code':'INV', 'details': 'externalId'},
            {'id': 'E1000', 'code':'INV', 'details': 'opportunityId'},
            {'id': 'E1000', 'code':'INV', 'details': 'agencyCampaign'},
            {'id': 'E1000', 'code':'INV', 'details': 'isUnlimitedBudget'},
            {'id': 'E1000', 'code':'INV', 'details': 'adServer'},
            {'id': 'E1000', 'code':'INV', 'details': 'paymentTerms'}
        ]);
    });

    after('delete advertiser', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.advertiserDelete, resOutput002.id))
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
