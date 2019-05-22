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
let mediaGroup001;

// shared test variable(s)
let authHeaders;
let resOutput001;
let resOutput002;
let resOutput003;
let resText001;
let resText002;
let resText003;

describe('[BOOTSTRAP-TEARDOWN] inventory >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('get bootstrap object(s)', () => {
        entitiesObject = require(rootPath + '/bootstrap/entities-ssp.json');
        mediaGroup001 = entitiesObject.manager.mediaGroup001;
    });

    before('generate auth headers', (done) => {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then((headers) => {
            authHeaders = headers;
            done();
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

    before('get ssp mediaGroup001 details', (done) => {
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
                resText001 = JSON.parse(res.text);
                resOutput001 = resText001.output;
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
                resText002 = JSON.parse(res.text);
                resOutput002 = resText002.output;

                // spot check response
                expect(validator.isInt(resOutput002.version + '')).to.be.true;
                expect(/^[a-f0-9]{32}$/.test(resOutput002.id)).to.be.true;
                expect(validator.isInt(resOutput002.refId + '')).to.be.true;
                expect(resOutput002.email).to.have.length.of.at.most(128);
                expect(resOutput002.firstName).to.have.length.of.at.most(30);
                expect(resOutput002.email).to.equal(targetUser.username);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    before('qa-all@liveintent.com - reset media-groups metadata', (done) => {

        let payload = {};
        payload.meta = resOutput002.meta;
        payload.meta.mediaGroupIds = [];
        payload.version = resOutput002.version;

        request(targetServer)
            .post(util.format(targetEndpoint.userMetaSave, targetUser.id))
            .set(authHeaders)
            .send(payload)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                resText003 = JSON.parse(res.text);
                resOutput003 = resText003.output;

                // spot check response
                expect(validator.isInt(resOutput003.version + '')).to.be.true;
                expect(/^[a-f0-9]{32}$/.test(resOutput003.id)).to.be.true;
                expect(validator.isInt(resOutput003.refId + '')).to.be.true;
                expect(resOutput003.email).to.have.length.of.at.most(128);
                expect(resOutput003.firstName).to.have.length.of.at.most(30);
                expect(resOutput003.email).to.equal(targetUser.username);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('mediaGroup001 status should be deleted', () => {
        expect(resOutput001.status).to.equal('deleted');
    });

    it('qa-all media-group metadata should be reset', () => {
        expect(resOutput003.meta.mediaGroupIds).to.have.lengthOf(0);
    });

    after('remove entities objects file', (done) => {
        exec(`rm ${rootPath}/bootstrap/entities-ssp.json`, (err) => {
            if (err) {
                done(err);
                return;
            }
            done();
        });
    });
});
