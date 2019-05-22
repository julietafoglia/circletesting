'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const request = require('supertest-as-promised');
const util = require('util');
const validator = require('validator');
const exec = require('child_process').exec;

// runtime variables
const rootPath = process.env.ROOT_PATH;
const targetEndpoint = require(rootPath + '/config/merlin/endpoints');
const targetEnvironment =
    require(rootPath + '/config/merlin/' + process.env.NODE_ENV);
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const targetUser = usersTargetEnvironment.admin;
const merlinAuthHeaders = require(rootPath + '/helpers/merlin-auth-headers');
const requestTimeOut = 20000;

// bootstrap variable(s)
let entitiesObject;
let agency001;
let agency002;
let mediaGroup001;

// shared test variable(s)
let authHeaders;
let resOutput001;
let resOutput002;
let resOutput003;
let resOutput004;
let resOutput005;
let resText001;
let resText002;
let resText003;
let resText004;
let resText005;

describe('[BOOTSTRAP-TEARDOWN] demand >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('get bootstrap object(s)', () => {
        entitiesObject = require(rootPath + '/bootstrap/entities-dsp.json');
        agency001 = entitiesObject.agency001;
        agency002 = entitiesObject.agency002;
        mediaGroup001 = entitiesObject.mediaGroup001;
    });

    before('generate auth headers', (done) => {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then((headers) => {
            authHeaders = headers;
            done();
        });
    });

    before('delete agency001', (done) => {
        request(targetServer)
            .del(util.format(
                targetEndpoint.agencyDelete, agency001.id
            ))
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    before('get agency001 details', (done) => {
        request(targetServer)
            .get(util.format(
                targetEndpoint.agencyDetails, agency001.id
            ))
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                resText001 = JSON.parse(res.text);
                resOutput001 = resText001.output;
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    before('delete agency002', (done) => {
        request(targetServer)
            .del(util.format(
                targetEndpoint.agencyDelete, agency002.id
            ))
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    before('get agency002 details', (done) => {
        request(targetServer)
            .get(util.format(
                targetEndpoint.agencyDetails, agency002.id
            ))
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                resText002 = JSON.parse(res.text);
                resOutput002 = resText002.output;
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    before('delete mediaGroup001', (done) => {
        request(targetServer)
            .del(util.format(
                targetEndpoint.mediaGroupDelete, mediaGroup001.id
            ))
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    before('get mediaGroup001 details', (done) => {
        request(targetServer)
            .get(util.format(
                targetEndpoint.mediaGroupDetails, mediaGroup001.id
            ))
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                resText003 = JSON.parse(res.text);
                resOutput003 = resText003.output;
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    before('get user details - qa-all@liveintent.com', (done) => {

        request(targetServer)
            .get(util.format(targetEndpoint.userDetails, targetUser.id))
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                resText004 = JSON.parse(res.text);
                resOutput004 = resText004.output;

                // spot check response
                expect(validator.isInt(resOutput004.version + '')).to.be.true;
                expect(/^[a-f0-9]{32}$/.test(resOutput004.id)).to.be.true;
                expect(validator.isInt(resOutput004.refId + '')).to.be.true;
                expect(resOutput004.email).to.have.length.of.at.most(128);
                expect(resOutput004.firstName).to.have.length.of.at.most(30);
                expect(resOutput004.email).to.equal(targetUser.username);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    before('qa-all@liveintent.com - reset advertiser metadata', (done) => {

        let payload = {};
        payload.meta = resOutput004.meta;
        payload.meta.advertiserIds = [];
        payload.meta.watchedLineItemIds = [];
        payload.version = resOutput004.version;

        request(targetServer)
            .post(util.format(targetEndpoint.userMetaSave, targetUser.id))
            .set(authHeaders)
            .send(payload)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                resText005 = JSON.parse(res.text);
                resOutput005 = resText005.output;

                // spot check response
                expect(validator.isInt(resOutput005.version + '')).to.be.true;
                expect(/^[a-f0-9]{32}$/.test(resOutput005.id)).to.be.true;
                expect(validator.isInt(resOutput005.refId + '')).to.be.true;
                expect(resOutput005.email).to.have.length.of.at.most(128);
                expect(resOutput005.firstName).to.have.length.of.at.most(30);
                expect(resOutput005.email).to.equal(targetUser.username);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('agency001 status should be deleted', () => {
        expect(resOutput001.status).to.equal('deleted');
    });

    it('agency002 status should be deleted', () => {
        expect(resOutput002.status).to.equal('deleted');
    });

    it('mediaGroup001 status should be deleted', () => {
        expect(resOutput003.status).to.equal('deleted');
    });

    it('qa-all advertiser metadata should be reset', () => {
        expect(resOutput005.meta.advertiserIds).to.have.lengthOf(0);
        expect(resOutput005.meta.watchedLineItemIds).to.have.lengthOf(0);
    });

    after('remove entities objects file', (done) => {
        exec(`rm ${rootPath}/bootstrap/entities-dsp.json`, (err) => {
            if (err) {
                done(err);
                return;
            }
            done();
        });
    });
});
