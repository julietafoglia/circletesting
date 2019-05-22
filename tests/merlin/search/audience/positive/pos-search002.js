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

// fixture(s)
const setupFixture =
    require(rootPath + '/fixtures/common/search/advanced-parameters001');
const setupFixture001 =
    require(rootPath + '/fixtures/common/agency/create002');
const setupFixture002 =
    require(rootPath + '/fixtures/common/advertiser/create002');
const setupFixture003 =
    require(rootPath + '/fixtures/common/audience/create001');

// shared test variable(s)
let authHeaders;
let res005;
let resText001;
let resText002;
let resText003;
let resText004;
let resText005;
let resOutput001;
let resOutput002;
let resOutput003;
let resOutput004;
let resOutput005;
let sendBody001;
let sendBody002;
let sendBody003;
let sendBody004;

let key004;
let value004;

describe('{{MERLIN}} /search/audience @ADMIN >>> ' +
    '(+) url - ref-id - agency advertiser audience >>>', function() {

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
        sendBody001 = {};
        Object.assign(
            sendBody001,
            setupFixture001
        );

        sendBody001.name = 'ghostSearchAgency002 - agency';

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

    before('create advertiser', function(done) {
        sendBody002 = {};
        Object.assign(
            sendBody002,
            setupFixture002
        );

        // assign owner
        sendBody002.owner.type =
            'Agency';
        sendBody002.owner.id =
            resOutput001.id;

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

    before('search data-provider - ' +
        'order by id - desc - number 5 - page 1', function(done) {

        sendBody003 = {};
        setupFixture.sort = 'desc';
        Object.assign(
            sendBody003,
            setupFixture
        );

        request(targetServer)
            .post(util.format(
                targetEndpoint.searchDataProvider
            )
            )
            .set(authHeaders)
            .send(sendBody003)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                resText003 = JSON.parse(res.text);
                resOutput003 = resText003.output;

                // spot check
                expect(resText003.notices).to.not.exist;
                expect(resText003.errors).to.not.exist;

                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create audience', function(done) {
        sendBody004 = {};
        Object.assign(
            sendBody004,
            setupFixture003
        );

        // assign advertiser
        sendBody004.advertiser = resOutput002.id;
        sendBody004.dataProviderId = resOutput003[0].id;

        request(targetServer)
            .post(util.format(targetEndpoint.audienceCreate))
            .set(authHeaders)
            .send(sendBody004)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText004 = JSON.parse(res.text);
                resOutput004 = resText004.output;

                // spot check response
                expect(/^[a-f0-9]{32}$/.test(resOutput004.id)).to.be.true;
                expect(validator.isInt(resOutput004.refId + '')).to.be.true;
                expect(validator.isInt(resOutput004.version + '')).to.be.true;
                expect(/^[a-f0-9]{32}$/.test(resOutput004.advertiser))
                    .to.be.true;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('search audience - ref-id - ' +
        'agency advertiser audience', function(done) {

        key004 = 'ref-id';
        value004 = resOutput004.refId;

        // create url request parameters
        const urlParameters004 = encodeURIComponent(key004 + '/' + value004);

        request(targetServer)
            .get(util.format(
                targetEndpoint.searchAudienceParameters,
                urlParameters004
            )
            )
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res005 = res;
                resText005 = JSON.parse(res.text);
                resOutput005 = resText005.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 200', function() {
        expect(res005.status).to.equal(200);
    });

    it('notices and errors should not exist', function() {
        expect(resText005.notices).to.not.exist;
        expect(resText005.errors).to.not.exist;
    });

    it('array first object ref-id should match search ref-id', function() {
        expect(resOutput005[0].refId).to.equal(resOutput004.refId);
    });

    it('response object property types should match spec', function() {
        if (resOutput005 !== null && resOutput001 !== undefined) {
            expect(resOutput005).to.be.an('array');
            resOutput005.forEach(function(val) {
                expect(val).to.be.an('object');
            });
        }
        expect(/^[a-f0-9]{32}$/.test(resOutput005[0].id)).to.be.true;
        expect(validator.isInt(resOutput005[0].refId + '')).to.be.true;
        expect(validator.isInt(resOutput005[0].version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005[0].advertiser)).to.be.true;
        expect(resOutput005[0].status).to.be.oneOf([
            'active', 'inactive', 'pending', 'deleted'
        ]);
        expect(resOutput005[0].name).to.have.length.of.at.most(128);
        if (resOutput005[0].records !== null) {
            expect(validator.isInt(resOutput005[0].records + '')).to.be.true;
        }
        expect(resOutput005[0].isShared).to.be.a('boolean');
        // created and modified
        expect(validator.isISO8601(resOutput005[0].created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005[0].createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput005[0].modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005[0].modifiedBy)).to.be.true;
    });

    it('response object key values should match test object', function() {
        expect(resOutput005[0].id).to.equal(resOutput004.id);
        expect(resOutput005[0].refId).to.equal(resOutput004.refId);
        expect(resOutput005[0].version).to.equal(resOutput004.version);
        expect(resOutput005[0].advertiser).to.equal(resOutput004.advertiser);
        expect(resOutput005[0].name).to.equal(resOutput004.name);
        expect(resOutput005[0].records).to.equal(resOutput004.records);
        expect(resOutput005[0].isShared).to.equal(resOutput004.isShared);
        // created and modified
        // expect(resOutput004[0].created).to.equal(resOutput003.created);
        expect(resOutput005[0].createdBy).to.equal(resOutput004.createdBy);
        // expect(resOutput004[0].modified).to.equal(resOutput003.modified);
        expect(resOutput005[0].modifiedBy).to.equal(resOutput004.modifiedBy);
    });

    after('delete audience', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.audienceDelete, resOutput004.id))
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

