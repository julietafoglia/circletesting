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

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/user/create/create001');
const verifyFixture =
    require(rootPath + '/fixtures/common/user/create/create001-verify');

// shared test variable(s)
let authHeaders;
let res001;
let resOutput001;
let resText001;
let sendBody001;

describe('{{MERLIN}} <SMOKE> /user {create} @ADMIN >>> ' +
    '(+) body - all valid fields >>>', function() {

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

    before('create user - minimum required', function(done) {

        sendBody001 = Object.assign({}, testFixture);

        sendBody001.email = 'usr-at'
            + moment().format('YYYY-MM-DDTHH:mm') + '@example.com';

        request(targetServer)
            .post(util.format(targetEndpoint.userCreate))
            .set(authHeaders)
            .send(sendBody001)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                res001 = res;
                resText001 = JSON.parse(res.text);
                resOutput001 = resText001.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 201', function(done) {
        expect(res001.status).to.equal(201);
        done();
    });

    it('notices and errors should not exist', function(done) {
        expect(resText001.notices).to.not.exist;
        expect(resText001.errors).to.not.exist;
        done();
    });

    it('response object property types should match spec', function(done) {
        expect(validator.isInt(resOutput001.version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.id)).to.be.true;
        expect(validator.isInt(resOutput001.refId + '')).to.be.true;
        expect(resOutput001.email).to.have.length.of.at.most(128);
        expect(resOutput001.firstName).to.have.length.of.at.most(32);
        expect(resOutput001.lastName).to.have.length.of.at.most(32);
        // meta object
        if (resOutput001.meta !== null) {
            expect(resOutput001.meta).to.be.an('object');
            if (resOutput001.meta.advertiserIds !== null) {
                expect(resOutput001.meta.advertiserIds).to.be.instanceof(Array);
            }
            if (resOutput001.meta.watchedLineItemIds !== null) {
                expect(resOutput001
                    .meta.watchedLineItemIds).to.be.instanceof(Array);
            }
        }
        // created modified lastlogin and lastactivity
        expect(validator.isISO8601(resOutput001.lastLogin)).to.be.true;
        expect(validator.isISO8601(resOutput001.lastActivity)).to.be.true;
        expect(validator.isISO8601(resOutput001.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput001.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.modifiedBy)).to.be.true;
        done();
    });

    it('response object key values should match test object', function(done) {
        expect(resOutput001.version)
            .to.equal(verifyFixture.version);
        expect(resOutput001.email)
            .to.equal(sendBody001.email);
        expect(resOutput001.firstName)
            .to.equal(sendBody001.firstName);
        expect(resOutput001.lastName)
            .to.equal(sendBody001.lastName);
        done();
    });
});
