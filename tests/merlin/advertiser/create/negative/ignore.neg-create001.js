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
const testFixture =
    require(rootPath + '/fixtures/common/advertiser/create001');

// shared test variable(s)
let authHeaders;
let res002;
let resText001;
let resText002;
let resOutput001;
let sendBody001;
let sendBody002;

describe('{{MERLIN}} /advertiser {create} @ADMIN >>> ' +
    '(-) body - missing required - admin >>>', function() {

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
            setupFixture001
        );
        sendBody001.name += timeStamp;
        sendBody001.description = chance.sentence({words: 10});

        // assign random string to salesforce id
        sendBody001.salesforceId =
            chance.string({length: 18, pool: characterPool});

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

    before('create advertiser - missing required - admin', function(done) {
        sendBody002 = {};
        Object.assign(
            sendBody002,
            testFixture
        );
        sendBody002.name += timeStamp;
        sendBody002.description = chance.sentence({words: 10});

        // assign owner
        sendBody002.owner.type = 'Agency';
        sendBody002.owner.id = resOutput001.id;

        // remove admin
        delete sendBody002.admin;

        request(targetServer)
            .post(util.format(targetEndpoint.advertiserCreate))
            .set(authHeaders)
            .send(sendBody002)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(400);

                // assign shared test variable(s)
                res002 = res;
                resText002 = JSON.parse(res.text);
                resOutput002 = resText002.output;

                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response have status of 400', function() {
        expect(res002.status).to.equal(400);
    });

    it('errors should include required admin', function() {
        expect(resText002.errors).to.deep.include.members([
            {'id': 'E1001', 'code':'REQ', 'details': 'admin'}
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
