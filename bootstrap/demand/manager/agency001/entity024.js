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
const requestTimeOut = 10000;

// bootstrap variable(s)
let entitiesObj;
let targetAgency;
let targetAdvertiser;
let targetBootstrapUser;

// fixture(s)
const setupFixture001 =
    require(rootPath + '/fixtures/common/user/create/create001');
const setupFixture002 =
    require(rootPath + '/fixtures/common/rbac/save/save003');
const testFixture =
    require(rootPath + '/fixtures/common/user/save-meta/save-meta001');

// shared test variable(s)
let authHeaders;
let res003;
let resOutput001;
let resOutput003;
let resText001;
let resText003;
let sendBody001;
let sendBody002;
let sendBody003;

describe('{{BOOTSTRAP}} <SETUP> [[AGENCY]] 024 >>> ' +
    'agency001 - adOpsUser >>> ', function() {

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

    before('create user - minimum required', function(done) {
        sendBody001 = Object.assign({}, setupFixture001);

        sendBody001.email = 'adOps001-'
            + moment().format('YYYY-MM-DDTHH.mm') + '@example.com';

        request(targetServer)
            .post(util.format(targetEndpoint.userCreate))
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
                expect(validator.isInt(resOutput001.version + '')).to.be.true;
                expect(/^[a-f0-9]{32}$/.test(resOutput001.id)).to.be.true;
                expect(validator.isInt(resOutput001.refId + '')).to.be.true;
                expect(resOutput001.email).to.have.length.of.at.most(128);
                expect(resOutput001.firstName).to.have.length.of.at.most(32);
                expect(resOutput001.email).to.equal(sendBody001.email);
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    before('save rbac user - ad ops', function(done) {

        targetBootstrapUser = resOutput001.id;

        sendBody002 = Object.assign({}, setupFixture002);
        sendBody002.Agency[0].id = targetAgency.id;

        request(targetServer)
            .post(util.format(targetEndpoint.rbacUserSave, targetBootstrapUser))
            .set(authHeaders)
            .send(sendBody002)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    before('save meta data - self-service advertiser', function(done) {

        sendBody003 = Object.assign({}, testFixture);

        sendBody003.version = resOutput001.version + 1;
        sendBody003.meta.advertiserIds[0] = targetAdvertiser.id;

        request(targetServer)
            .post(util.format(targetEndpoint.userMetaSave, targetBootstrapUser))
            .set(authHeaders)
            .send(sendBody003)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res003 = res;
                resText003 = JSON.parse(res.text);
                resOutput003 = resText003.output;

                // spot check response
                expect(validator.isInt(resOutput003.version + '')).to.be.true;
                expect(/^[a-f0-9]{32}$/.test(resOutput003.id)).to.be.true;
                expect(validator.isInt(resOutput003.refId + '')).to.be.true;
                expect(resOutput003.email).to.have.length.of.at.most(128);
                expect(resOutput003.firstName).to.have.length.of.at.most(32);
                expect(resOutput003.email).to.equal(sendBody001.email);
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    it('response should have status of 200', function(done) {
        expect(res003.status).to.equal(200);
        done();
    });

    it('notices and errors should not exist', function(done) {
        expect(resText003.notices).to.not.exist;
        expect(resText003.errors).to.not.exist;
        done();
    });

    it('response object property types should match spec', function(done) {
        expect(validator.isInt(resOutput003.version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.id)).to.be.true;
        expect(validator.isInt(resOutput003.refId + '')).to.be.true;
        expect(resOutput003.email).to.have.length.of.at.most(128);
        expect(resOutput003.firstName).to.have.length.of.at.most(32);
        expect(resOutput003.lastName).to.have.length.of.at.most(32);
        // meta object
        if (resOutput003.meta !== null) {
            expect(resOutput003.meta).to.be.an('object');
            if (resOutput003.meta.advertiserIds !== null) {
                expect(resOutput003.meta.advertiserIds).to.be.instanceof(Array);
            }
            if (resOutput003.meta.watchedLineItemIds !== null) {
                expect(resOutput003
                    .meta.watchedLineItemIds).to.be.instanceof(Array);
            }
        }
        // created modified lastlogin and lastactivity
        expect(validator.isISO8601(resOutput003.lastLogin)).to.be.true;
        expect(validator.isISO8601(resOutput003.lastActivity)).to.be.true;
        expect(validator.isISO8601(resOutput003.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput003.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.modifiedBy)).to.be.true;
        done();
    });

    it('response object key values should match test object', function(done) {
        expect(resOutput003.version)
            .to.equal(resOutput001.version + 2);
        expect(resOutput003.email)
            .to.equal(sendBody001.email);
        expect(resOutput003.firstName)
            .to.equal(sendBody001.firstName);
        expect(resOutput003.lastName)
            .to.equal(sendBody001.lastName);
        done();
    });

    after('write entity to json file', function(done) {

        let baseEntityObj = targetAgency;

        const createdEntity = {
            type: 'user',
            permission: 'liveintent-adops',
            apiPermissions: 'liveintent-adops',
            username: resOutput003.email,
            name: resOutput003.firstName + ' ' + resOutput001.lastName,
            password: sendBody001.password,
            id: resOutput003.id,
            refId: resOutput003.refId,
            grantedEntities: [
                {
                    type: 'agency',
                    name: targetAgency.name,
                    id: targetAgency.id,
                    refId: targetAgency.refId
                }
            ]
        };

        // write entity details to object
        if (!baseEntityObj.children) {
            baseEntityObj.children = {};
        }
        baseEntityObj.children.agencyUser001 = {};
        baseEntityObj.children.agencyUser001 = createdEntity;

        // save object to file
        const writeEntitiesObjToFile = jsonWriteFile(
            rootPath + '/bootstrap/entities-dsp.json',
            entitiesObj
        );
        writeEntitiesObjToFile.then(() => done());
    });
});
