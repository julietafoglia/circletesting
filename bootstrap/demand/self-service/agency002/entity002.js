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
    require(rootPath + '/fixtures/common/advertiser/create001');
const verifyFixture =
    require(rootPath + '/fixtures/common/advertiser/create001-verify');

// shared test variable(s)
let authHeaders;
let res001;
let resOutput001;
let resText001;
let sendBody001;

describe('{{BOOTSTRAP}} <SETUP> [[SS-AGENCY]] 002 >>> ' +
    'agency002 - advertiser001 >>> ' +
    'minimum required fields >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('get bootstrap object(s)', function() {
        entitiesObj = require(rootPath + '/bootstrap/entities-dsp.json');
        targetAgency = entitiesObj.agency002;
    });

    before('generate auth headers', function(done) {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('create advertiser - minimum required', function(done) {
        sendBody001 = Object.assign({}, testFixture);

        sendBody001.name += '001' + timeStampLong;
        sendBody001.owner.type = 'Agency';
        sendBody001.owner.id = targetAgency.id;
        sendBody001.salesforceId = chance.string({length: 32});

        request(targetServer)
            .post(util.format(targetEndpoint.advertiserCreate))
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
                throw(err);
            });
    });

    it('response have status of 201', function(done) {
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
        expect(resOutput001.status).to.be.oneOf([
            'pending', 'inactive', 'active'
        ]);
        expect(resOutput001.owner.type).to.be.oneOf([
            'Agency', 'Media Group', 'Publisher'
        ]);
        expect(/^[a-f0-9]{32}$/.test(resOutput001.owner.id)).to.be.true;
        expect(validator.isInt(resOutput001.category + '')).to.be.true;
        expect(resOutput001.categoryName).to.have.length.of.at.most(32);
        expect(resOutput001.categories).to.be.an('array');
        if (resOutput001.executive !== null) {
            expect(/^[a-f0-9]{32}$/.test(resOutput001.executive))
                .to.be.true;
        }
        expect(resOutput001.name).to.have.length.of.at.most(255);
        if (resOutput001.description !== null) {
            expect(resOutput001.description).to.be.an('string');
        }
        if (resOutput001.externalId !== null) {
            expect(resOutput001.externalId).to.have.length.of.at.most(128);
        }
        expect(resOutput001.domain).to.have.length.of.at.most(128);
        expect(resOutput001.hasExchange).to.be.a('boolean');
        if (resOutput001.targetingType !== null) {
            expect(resOutput001.targetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput001.targetedPublishers !== null) {
            expect(resOutput001.targetedPublishers).to.be.an('array');
        }
        if (resOutput001.targetedDomains !== null) {
            expect(resOutput001.targetedDomains).to.be.an('array');
        }
        expect(resOutput001.suppressCompetitive).to.be.a('boolean');
        expect(resOutput001.houseAd).to.be.a('boolean');
        // contract object
        expect(resOutput001.contract).to.be.an('object');
        expect(resOutput001.contract.status).to.be.oneOf([
            'created', 'pending', 'inactive', 'active', 'in progress',
            'in review', 'paused', 'cancelled', 'rejected'
        ]);
        if (resOutput001.contract.dspFee !== null) {
            expect(validator.isInt(resOutput001.contract.dspFee + '',
                {'max': 99})).to.be.true;
        }
        // created and modified
        expect(validator.isISO8601(resOutput001.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput001.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.modifiedBy)).to.be.true;
        done();
    });

    it('response object key values should ' +
        'match verify object(s)', function(done) {

        expect(resOutput001.owner.type)
            .to.equal(sendBody001.owner.type);
        expect(resOutput001.owner.id)
            .to.equal(sendBody001.owner.id);
        expect(resOutput001.category)
            .to.equal(sendBody001.category);
        expect(resOutput001.categoryName)
            .to.equal(verifyFixture.categoryName);
        expect(resOutput001.categories)
            .to.eql(verifyFixture.categories);
        expect(resOutput001.executive)
            .to.equal(verifyFixture.executive);
        expect(resOutput001.name)
            .to.equal(sendBody001.name);
        expect(resOutput001.description)
            .to.equal(verifyFixture.description);
        expect(resOutput001.externalId)
            .to.equal(verifyFixture.externalId);
        expect(resOutput001.domain)
            .to.equal(sendBody001.domain);
        expect(resOutput001.hasExchange)
            .to.equal(verifyFixture.hasExchange);
        expect(resOutput001.targetingType)
            .to.equal(verifyFixture.targetingType);
        expect(resOutput001.targetedPublishers)
            .to.eql(verifyFixture.targetedPublishers);
        expect(resOutput001.targetedDomains)
            .to.eql(verifyFixture.targetedDomains);
        expect(resOutput001.suppressCompetitive)
            .to.equal(verifyFixture.suppressCompetitive);
        expect(resOutput001.houseAd)
            .to.equal(verifyFixture.houseAd);
        // contract object
        expect(resOutput001.contract.status)
            .to.equal(verifyFixture.contract.status);
        expect(resOutput001.contract.dspFee)
            .to.equal(verifyFixture.contract.dspFee);
        done();
    });

    after('write entity to json file', function(done) {

        let baseEntityObj = targetAgency;

        const createdEntity = {
            type: 'advertiser',
            permission: 'client/self-service',
            name: resOutput001.name,
            id: resOutput001.id,
            refId: resOutput001.refId
        };

        // write entity details to object
        if (!baseEntityObj.children) {
            baseEntityObj.children = {};
        }
        baseEntityObj.children.advertiser001 = {};
        baseEntityObj.children.advertiser001 = createdEntity;

        // save object to file
        const writeEntitiesObjToFile = jsonWriteFile(
            rootPath + '/bootstrap/entities-dsp.json',
            entitiesObj
        );
        writeEntitiesObjToFile.then(() => done());
    });
});
