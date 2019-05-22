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
const jsonWriteFile =
    require(rootPath + '/helpers/json-write-file');
const merlinAuthHeaders =
    require(rootPath + '/helpers/merlin-auth-headers');
const requestTimeOut = 15000;
const timeStampLong =
    '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');

// bootstrap variable(s)
let entitiesObj;
let targetAgency;
let targetAdvertiser;

// fixture(s)
const setupFixture =
    require(rootPath + '/fixtures/common/search/advanced-parameters001');
const testFixture =
    require(rootPath + '/fixtures/common/audience/create001');
const verifyFixture =
    require(rootPath + '/fixtures/common/audience/create001-verify');

// shared test variable(s)
let authHeaders;
let res001;
let resOutput001;
let resText001;
let sendBody001;
let sendBody002;

describe('{{BOOTSTRAP}} <SETUP> [[AGENCY]] 012 >>> ' +
    'agency001 - advertiser001 - audience001 >>> ', function() {

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

    before('search data-provider - ' +
        'order by id - asc - number 10 - page 1', function(done) {

        sendBody001 = {};
        Object.assign(
            sendBody001,
            setupFixture
        );
        sendBody001.number = 10;

        request(targetServer)
            .post(util.format(
                targetEndpoint.searchDataProvider
            )
            )
            .set(authHeaders)
            .send(sendBody001)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                resText001 = JSON.parse(res.text);
                resOutput001 = resText001.output;

                // spot check
                expect(resText001.notices).to.not.exist;
                expect(resText001.errors).to.not.exist;

                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create audience - minimum required fields', function(done) {
        sendBody002 = Object.assign({}, testFixture);

        sendBody002.name += '001' + timeStampLong;
        sendBody002.advertiser = targetAdvertiser.id;
        sendBody002.dataProviderId = resOutput001[7].id;

        request(targetServer)
            .post(util.format(targetEndpoint.audienceCreate))
            .set(authHeaders)
            .send(sendBody002)
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
                throw(err);
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
        expect(/^[a-f0-9]{32}$/.test(resOutput001.id)).to.be.true;
        expect(validator.isInt(resOutput001.refId + '')).to.be.true;
        expect(validator.isInt(resOutput001.version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.advertiser)).to.be.true;
        expect(resOutput001.name).to.have.length.of.at.most(255);
        if (resOutput001.records !== null) {
            expect(resOutput001.externalId).to.have.length.of.at.most(128);
        }
        if (resOutput001.externalId !== null) {
            expect(resOutput001.externalId).to.have.length.of.at.most(128);
        }
        if (resOutput001.isShared !== null) {
            expect(resOutput001.externalId).to.be.a.boolean;
        }
        if (resOutput001.isDds !== null) {
            expect(resOutput001.externalId).to.be.a.boolean;
        }
        if (resOutput001.uploaded !== null) {
            expect(resOutput001.externalId).to.have.length.of.at.most(128);
        }
        expect(validator.isISO8601(resOutput001.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput001.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.modifiedBy)).to.be.true;
        done();
    });

    it('response object key values should match test object', function(done) {
        expect(resOutput001.version)
            .to.equal(verifyFixture.version);
        expect(resOutput001.advertiser)
            .to.equal(targetAdvertiser.id);
        expect(resOutput001.name)
            .to.equal(sendBody002.name);
        expect(resOutput001.externalId)
            .to.equal(verifyFixture.externalId);
        expect(resOutput001.priority)
            .to.equal(verifyFixture.priority);
        expect(resOutput001.isShared)
            .to.equal(verifyFixture.isShared);
        expect(resOutput001.isDds)
            .to.equal(verifyFixture.isDds);
        done();
    });

    after('write entity to json file', function(done) {

        let baseEntityObj = targetAdvertiser;

        const createdEntity = {
            type: 'ad',
            permission: 'admin/manager',
            name: resOutput001.name,
            id: resOutput001.id,
            refId: resOutput001.refId
        };

        // write entity details to object
        if (!baseEntityObj.children) {
            baseEntityObj.children = {};
        }
        baseEntityObj.children.audience001 = {};
        baseEntityObj.children.audience001 = createdEntity;

        // save object to file
        const writeEntitiesObjToFile = jsonWriteFile(
            rootPath + '/bootstrap/entities-dsp.json',
            entitiesObj
        );
        writeEntitiesObjToFile.then(() => done());
    });
});
