'use strict';

// vendor dependencies
const chance = require('chance').Chance();
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const request = require('supertest-as-promised');
const util = require('util');
const validator = require('validator');

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
const characterPool =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// fixture(s)
const setupFixture =
    require(rootPath + '/fixtures/common/agency/create002');

// shared test variable(s)
let authHeaders;
let res002;
let resText001;
let resText002;
let resOutput001;
let sendBody001;

let key002;
let value002;

describe('{{MERLIN}} /search/agency @ADMIN >>> ' +
    '(-) url - string end - random characters >>>', function() {

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

    before('create agency - agency', function(done) {

        // create request send body
        sendBody001 = {};
        Object.assign(
            sendBody001,
            setupFixture
        );

        sendBody001.name = 'ghostAgency - agency';

        // assign random string to salesforce id
        sendBody001.salesforceId = chance.string({length: 18});

        // send agency create request
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
                expect(validator.isInt(resOutput001.refId + '')).to.be.true;
                expect(resOutput001.type).to.equal('Advertiser Agency');
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('search agency - string end - random characters', function(done) {
        key002 = 'id';
        value002 = resOutput001.id;

        // create url request parameters
        const urlParameters002 = encodeURIComponent(key002 + '/' + value002);

        request(targetServer)
            .get(util.format(
                targetEndpoint.searchAgencyParameters, urlParameters002 +
                    chance.string({length: 8, pool: characterPool})
            )
            )
            .set(authHeaders)
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

    it('errors should include invalid id', function() {
        expect(resText002.errors).to.deep.include.members([
            {'id': 'E1000', 'code': 'INV', 'details': 'id'}
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

