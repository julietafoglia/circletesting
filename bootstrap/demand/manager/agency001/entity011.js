'use strict';

// vendor dependencies
const chance = require('chance').Chance();
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const fs = require('fs');
const jsonfile = require('jsonfile');
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
const jsonReadFile =
    require(rootPath + '/helpers/json-read-file');
const jsonWriteFile =
    require(rootPath + '/helpers/json-write-file');
const merlinAuthHeaders =
    require(rootPath + '/helpers/merlin-auth-headers');
const requestTimeOut = 10000;
const timeStampShort =
    '@' + moment().format('YYYY-MM-DDTHH:mm');
const timeStampLong =
    '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');
const timeToday =
    moment().format('YYYY-MM-DD');
const characterPool =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// bootstrap variable(s)
let entitiesFile;
let entitiesObj;
let targetAgency;
let targetMediaGroup;
let targetAdvertiser;
let targetInsertionOrder;
let targetCampaign;
let targetBootstrapUser;

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/user/save-meta/save-meta001');
const verifyFixture =
    require(rootPath + '/fixtures/common/user/save-meta/save-meta001-verify');

// shared test variable(s)
let authHeaders;
let res001;
let res002;
let res003;
let resOutput001;
let resOutput002;
let resOutput003;
let resText001;
let resText002;
let resText003;
let sendBody001;
let sendBody002;
let sendBody003;

describe('{{BOOTSTRAP}} <SETUP> [AGENCY]] 011 >>> ' +
    'agency001 - qa-all@liveintent.com - advertiser001 >>> ', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('get bootstrap object(s)', function() {
        entitiesObj = require(rootPath + '/bootstrap/entities-dsp.json');
        targetAgency = entitiesObj.agency001;
        targetAdvertiser = targetAgency.children.advertiser001;
    });

    before('generate auth headers', function(done) {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('get user details - qa-all@liveintent.com', function(done) {

        request(targetServer)
            .get(util.format(targetEndpoint.userDetails, targetUser.id))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res001 = res;
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
            .catch( function(err) {
                throw(err);
            });
    });

    before('save user meta - qa-all@liveintent.com - ' +
        'add adveriser001', function(done) {

        let payload = {};
        payload.version = resOutput001.version;
        payload.meta = resOutput001.meta;
        if (!payload.meta) {
            payload.meta = {advertiserIds: [targetAdvertiser.id]};
        } else if (!payload.meta.advertiserIds) {
            payload.meta.advertiserIds = [targetAdvertiser.id];
        } else {
            payload.meta.advertiserIds.push(targetAdvertiser.id);
        }

        request(targetServer)
            .post(util.format(targetEndpoint.userMetaSave, targetUser.id))
            .set(authHeaders)
            .send(payload)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res002 = res;
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
            .catch( function(err) {
                throw(err);
            });
    });

    it('response should have status of 200', function(done) {
        expect(res002.status).to.equal(200);
        done();
    });

    it('notices and errors should not exist', function(done) {
        expect(resText002.notices).to.not.exist;
        expect(resText002.errors).to.not.exist;
        done();
    });

    it('response object property types should match spec', function(done) {
        expect(validator.isInt(resOutput002.version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput002.id)).to.be.true;
        expect(validator.isInt(resOutput002.refId + '')).to.be.true;
        expect(resOutput002.email).to.have.length.of.at.most(128);
        expect(resOutput002.firstName).to.have.length.of.at.most(32);
        expect(resOutput002.lastName).to.have.length.of.at.most(32);
        // meta object
        if (resOutput002.meta !== null) {
            expect(resOutput002.meta).to.be.an('object');
            if (resOutput002.meta.advertiserIds !== null) {
                expect(resOutput002.meta.advertiserIds).to.be.instanceof(Array);
            }
            if (resOutput002.meta.watchedLineItemIds) {
                expect(resOutput002
                    .meta.watchedLineItemIds).to.be.instanceof(Array);
            }
        }
        // created modified lastlogin and lastactivity
        expect(validator.isISO8601(resOutput002.lastLogin)).to.be.true;
        expect(validator.isISO8601(resOutput002.lastActivity)).to.be.true;
        expect(validator.isISO8601(resOutput002.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput002.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput002.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput002.modifiedBy)).to.be.true;
        done();
    });
});
