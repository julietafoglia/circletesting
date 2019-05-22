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
    '(-) body - multiple invalid fields >>>', function() {

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

        // assign name, description and type to advertiser
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

    before('create advertiser - multiple invalid', function(done) {

        sendBody002 = Object.assign({}, testFixture);

        // assign owner to  advertiser
        sendBody002.owner.type = 'Agency';
        sendBody002.owner.id = resOutput001.id;

        // assign invalid values to advertiser fields
        sendBody002.category =
            chance.string({length: 5, pool: characterPool});
        sendBody002.categories =
            [chance.string({length: 5, pool: characterPool})];
        sendBody002.admin =
            'ghost' + chance.hash({length: 27});
        sendBody002.executive =
            'ghost' + chance.hash({length: 27});
        sendBody002.name =
            chance.string({length: 256, pool: characterPool});
        sendBody002.externalId =
            chance.string({length: 129, pool: characterPool});
        sendBody002.liveramp =
            chance.string({length: 129, pool: characterPool});
        sendBody002.domain =
            chance.string({length: 129, pool: characterPool});
        sendBody002.targetingType =
            chance.string({length: 5, pool: characterPool});
        sendBody002.targetedPublishers =
            ['ghost' + chance.hash({length: 27})];
        sendBody002.targetedDomains =
            [chance.string({length: 129, pool: characterPool})];
        sendBody002.suppressCompetitive =
            chance.string({length: 5, pool: characterPool});
        sendBody002.contract = {};
        sendBody002.contract.dspFee =
            chance.string({length: 5, pool: characterPool});

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

                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response have status of 400', function() {
        expect(res002.status).to.equal(400);
    });

    it('response should include an error for each invalid field', function() {
        expect(resText002.errors).to.deep.include.members([
            {'id': 'E1000', 'code':'INV', 'details': 'category'},
            {'id': 'E1000', 'code':'INV', 'details': 'categories'},
            {'id': 'E1000', 'code':'INV', 'details': 'name'},
            {'id': 'E1000', 'code':'INV', 'details': 'externalId'},
            {'id': 'E1000', 'code':'INV', 'details': 'liveramp'},
            {'id': 'E1000', 'code':'INV', 'details': 'domain'},
            {'id': 'E1000', 'code':'INV', 'details': 'targetingType'},
            {'id': 'E1000', 'code':'INV', 'details': 'targetedPublishers'},
            {'id': 'E1000', 'code':'INV', 'details': 'targetedDomains'},
            {'id': 'E1000', 'code':'INV', 'details': 'suppressCompetitive'},
            {'id': 'E1000', 'code':'INV', 'details': 'contract:dspFee'}
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
