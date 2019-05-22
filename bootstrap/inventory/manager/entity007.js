'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const request = require('supertest-as-promised');
const util = require('util');
const validator = require('validator');

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
const requestTimeOut = 10000;

// shared test variable(s)
let authHeaders;
let entitiesObject;
let mediaGroup001;
let resOutput001;
let resOutput002;
let resText001;
let resText002;

describe('[BOOTSTRAP-SETUP] add media-group to qa-all account >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('generate auth headers', (done) => {
        // generate auth headers
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('get newsletter from entities file', () => {
        entitiesObject = require(rootPath + '/bootstrap/entities-ssp.json');
        mediaGroup001 = entitiesObject.manager.mediaGroup001;
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
                resText001 = JSON.parse(res.text);
                resOutput001 = resText001.output;

                // spot check response
                expect(validator.isInt(resOutput001.version + '')).to.be.true;
                expect(/^[a-f0-9]{32}$/.test(resOutput001.id)).to.be.true;
                expect(validator.isInt(resOutput001.refId + '')).to.be.true;
                expect(resOutput001.email).to.have.length.of.at.most(128);
                expect(resOutput001.firstName).to.have.length.of.at.most(30);
                expect(resOutput001.email).to.equal(targetUser.username);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    before('qa-all@liveintent.com - update metadata', (done) => {

        let payload = {};
        payload.meta = resOutput001.meta;
        if (!payload.meta) {
            payload.meta = {mediaGroupIds: [mediaGroup001.id]};
        } else if (!payload.meta.mediaGroup001) {
            payload.meta.mediaGroupIds = [mediaGroup001.id];
        } else {
            payload.meta.mediaGroupIds.push(mediaGroup001.id);
        }
        payload.version = resOutput001.version;

        request(targetServer)
            .post(util.format(targetEndpoint.userMetaSave, targetUser.id))
            .set(authHeaders)
            .send(payload)
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

    it('should add mediaGroup001 to qa-all meta', () => {
        expect(resOutput002.meta.mediaGroupIds).to.include(mediaGroup001.id);
    });

});
