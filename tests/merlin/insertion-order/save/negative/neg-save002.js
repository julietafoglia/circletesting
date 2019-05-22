'use strict';

// vendor dependencies
const chance = require('chance').Chance();
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const moment = require('moment');
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
const timeStamp =
    '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');
const timeToday =
    moment().format('YYYY-MM-DD HH:mm:ss');

// fixture(s)
const setupFixture001 =
    require(rootPath + '/fixtures/common/agency/create001');
const setupFixture002 =
    require(rootPath + '/fixtures/common/advertiser/create001');
const setupFixture003 =
    require(rootPath + '/fixtures/common/insertion-order/create001');

// shared test variable(s)
let authHeaders;
let res004;
let resText001;
let resText002;
let resText003;
let resText004;
let resOutput001;
let resOutput002;
let resOutput003;
let sendBody001;
let sendBody002;
let sendBody003;
let sendBody004;

describe('{{MERLIN}} /insertion-order {id save} @ADMIN >>> ' +
    '(-) body - invalid dates >>>', function() {

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

    before('create insertion order', function(done) {
        sendBody003 = Object.assign({}, setupFixture003);

        // assign advertiser, name and flight dates
        sendBody003.advertiser = resOutput002.id;
        sendBody003.name += timeStamp;
        sendBody003.startDate = timeToday;
        sendBody003.endDate =
            moment().add(30, 'days').format('YYYY-MM-DD HH:mm:ss');

        request(targetServer)
            .post(util.format(targetEndpoint.insertionOrderCreate))
            .set(authHeaders)
            .send(sendBody003)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText003 = JSON.parse(res.text);
                resOutput003 = resText003.output;

                // spot check response
                expect(validator.isInt(resOutput003.id + '')).to.be.true;
                expect(resOutput003.name).to.have.length.of.at.most(128);
                expect(/^[a-f0-9]{32}$/.test(resOutput003.admin.hash))
                    .to.be.true;
                expect(resOutput003.advertiser)
                    .to.equal(sendBody003.advertiser);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('save insertion order - invalid fields - dates', function(done) {

        sendBody004 = {};
        sendBody004.version = resOutput003.version;

        // assign invalid dates
        sendBody004.startDate = moment().format('MM-DD-YYYY');
        sendBody004.endDate = moment().add(30, 'days').format('MM-DD-YYYY');

        request(targetServer)
            .post(util.format(
                targetEndpoint.insertionOrderSave, resOutput003.id
            )
            )
            .set(authHeaders)
            .send(sendBody004)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(400);

                // assign shared test variable(s)
                res004 = res;
                resText004 = JSON.parse(res.text);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response have status of 400', function() {
        expect(res004.status).to.equal(400);
    });

    it('response should include invalid dates error', function() {
        expect(resText004.errors).to.deep.include.members([
            {'id': 'E1000', 'code':'INV', 'details': 'startDate'},
            {'id': 'E1000', 'code':'INV', 'details': 'endDate'}
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
