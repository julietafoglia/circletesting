'use strict';

// vendor dependencies
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

// fixture(s)
const setupFixture001 =
    require(rootPath + '/fixtures/common/media-group/create002');
const setupFixture002 =
    require(rootPath + '/fixtures/common/publisher/create001');
const setupFixture003 =
    require(rootPath + '/fixtures/common/advertiser/create001');
const setupFixture004 =
    require(rootPath + '/fixtures/common/pixel/create002');

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

describe('{{MERLIN}} /pixel {id details} @ADMIN >>> ' +
    '(+) url - ends in a trailing slash - publisher >>>', function() {

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

    before('create media group', function(done) {
        sendBody001 = Object.assign({}, setupFixture001);

        // assign name
        sendBody001.name += timeStamp;

        request(targetServer)
            .post(util.format(targetEndpoint.mediaGroupCreate))
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
                expect(resOutput001.name).to.have.length.of.at.most(128);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });


    before('create publisher', function(done) {
        sendBody002 = Object.assign({}, setupFixture002);

        // assign media group and name
        sendBody002.mediaGroup = resOutput001.id;
        sendBody002.name += timeStamp;

        request(targetServer)
            .post(util.format(targetEndpoint.publisherCreate))
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
                expect(resOutput002.mediaGroup)
                    .to.equal(sendBody002.mediaGroup);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create advertiser', function(done) {
        sendBody003 = Object.assign({}, setupFixture003);

        // assign name and owner
        sendBody003.name += timeStamp;
        sendBody003.owner.type = 'Publisher';
        sendBody003.owner.id = resOutput002.id;

        request(targetServer)
            .post(util.format(targetEndpoint.advertiserCreate))
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
                expect(/^[a-f0-9]{32}$/.test(resOutput003.id)).to.be.true;
                expect(resOutput003.name).to.have.length.of.at.most(255);
                expect(resOutput003.owner.id).to.equal(sendBody003.owner.id);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create pixel - all valid fields', function(done) {
        sendBody004 = Object.assign({}, setupFixture004);

        // assign advertiser and name
        sendBody004.advertiser = resOutput003.id;
        sendBody004.name += timeStamp;

        request(targetServer)
            .post(util.format(targetEndpoint.pixelCreate))
            .set(authHeaders)
            .send(sendBody004)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText004 = JSON.parse(res.text);
                resOutput004 = resText004.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('get pixel details - url end trailing slash', function(done) {
        request(targetServer)
            .get(util.format(
                targetEndpoint.pixelDetails, resOutput004.id + '/'
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

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput005.id)).to.be.true;
        expect(validator.isInt(resOutput005.refId + '')).to.be.true;
        expect(validator.isInt(resOutput005.version + '')).to.be.true;
        expect(resOutput005.status).to.be.oneOf(
            ['active', 'inactive', 'pending', 'incomplete', 'created']
        );
        expect(resOutput005.type).to.be.oneOf(['ssp', 'dsp']);
        expect(resOutput005.name).to.have.length.of.at.most(48);
        expect(/^[a-f0-9]{32}$/.test(resOutput005.advertiser.id)).to.be.true;
        expect(resOutput005.advertiser.name).to.be.a('string');
        if (resOutput005.campaigns !== null) {
            expect(resOutput005.campaigns).to.be.an('array');
            resOutput005.campaigns.forEach( (value) => {
                expect(value.name).to.be.a('string');
                expect(/^[a-f0-9]{32}$/.test(value.id)).to.be.true;
            });
        }
        expect(validator.isInt(resOutput005.expiration + '')).to.be.true;
        expect(resOutput005.dspConversionType).to.be.oneOf(
            ['post_view', 'post_click', 'hybrid']
        );
        expect(resOutput005.url).to.have.length.of.at.most(64);
        expect(resOutput005.secureUrl).to.have.length.of.at.most(64);
        expect(validator.isISO8601(resOutput005.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput005.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005.modifiedBy)).to.be.true;
    });

    it('response object key values should match created object', function() {
        expect(resOutput005.id).to.equal(resOutput004.id);
        expect(resOutput005.refId).to.equal(resOutput004.refId);
        expect(resOutput005.version).to.equal(resOutput004.version);
        expect(resOutput005.status).to.equal(resOutput004.status);
        expect(resOutput005.type).to.equal(resOutput004.type);
        expect(resOutput005.name).to.equal(resOutput004.name);
        expect(resOutput005.advertiser).to.eql(resOutput004.advertiser);
        expect(resOutput005.campaigns).to.eql(resOutput004.campaigns);
        expect(resOutput005.expirations).to.equal(resOutput004.expirations);
        expect(resOutput005.dspConversionType)
            .to.equal(resOutput004.dspConversionType);
        expect(resOutput005.url).to.equal(resOutput004.url);
        expect(resOutput005.secureUrl).to.equal(resOutput004.secureUrl);
        expect(resOutput005.created).to.equal(resOutput004.created);
        expect(resOutput005.createdBy).to.equal(resOutput004.createdBy);
        expect(resOutput005.modified).to.equal(resOutput004.modified);
        expect(resOutput005.modifiedBy).to.equal(resOutput004.modifiedBy);
    });

    after('delete pixel', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.pixelDelete, resOutput004.id))
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

    // house advertisers cannot be deleted directly,
    // since they are used for fallback ads

    after('delete publisher', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.publisherDelete, resOutput002.id))
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

    after('delete media group', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.mediaGroupDelete, resOutput001.id))
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
