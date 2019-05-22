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
    moment().format('YYYY-MM-DD HH:mm:ss');
const characterPool =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// bootstrap variable(s)
let entitiesFileSSP;
let entitiesObject;
let entitiesFileDSP;
let entitiesObjDSP;
let targetAgency;
let targetMediaGroup;
let publisher;
let targetInsertionOrder;
let targetCampaign;
let targetBootstrapUser;

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/insertion-order/create001');
const verifyFixture =
    require(rootPath + '/fixtures/common/insertion-order/create001-verify');
const testFixture2 =
    require(rootPath + '/fixtures/common/campaign/create018');


// shared test variable(s)
let authHeaders;
let res001;
let resOutput001;
let resText001;
let sendBody001;
let res002;
let resOutput002;
let resText002;
let sendBody002;

describe('{{BOOTSTRAP}} <SETUP> [[MEDIA-GROUP]] 022 >>> ' +
    'mediaGroup001 - pubvertiser001 - insertionOrder001 >>> ' +
    'minimum required fields >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('get bootstrap object(s)', function() {
        entitiesObject = require(rootPath + '/bootstrap/entities-ssp.json');
        publisher = entitiesObject.manager.mediaGroup001.publisher001;
    });

    before('generate auth headers', function(done) {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('create insertion order - minimum required', function(done) {
        sendBody001 = Object.assign({}, testFixture);

        sendBody001.name += '001' + timeStampLong;

        sendBody001.advertiser = publisher.id;
        sendBody001.startDate = timeToday;
        sendBody001.endDate =
            moment().add(30, 'days').format('YYYY-MM-DD HH:mm:ss');

        request(targetServer)
            .post(util.format(targetEndpoint.insertionOrderCreate))
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
        expect(validator.isInt(resOutput001.id + '')).to.be.true;
        expect(validator.isInt(resOutput001.version + '')).to.be.true;
        expect(resOutput001.status).to.be.oneOf([
            'pending', 'inactive', 'active'
        ]);
        expect(/^[a-f0-9]{32}$/.test(resOutput001.advertiser)).to.be.true;
        expect(resOutput001.isFallback).to.be.a('boolean');
        expect(resOutput001.name).to.have.length.of.at.most(128);
        if (resOutput001.budget !== null) {
            expect(resOutput001.budget).to.be.a('number');
        }
        expect(resOutput001.isUnlimitedBudget).to.be.a('boolean');
        expect(resOutput001.budgetAllocated).to.be.a('number');
        expect(resOutput001.spend).to.be.a('number');
        if (resOutput001.impressions !== null) {
            expect(validator.isInt(resOutput001.impressions + '',
                {'max': 99999999999})).to.be.true;
        }
        expect(validator.isDate(resOutput001.startDate)).to.be.true;
        expect(validator.isDate(resOutput001.endDate)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.admin.hash)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.executive.hash)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.trafficker.hash)).to.be.true;
        if (resOutput001.referenceNumber !== null) {
            expect(resOutput001.referenceNumber)
                .to.have.length.of.at.most(256);
        }
        if (resOutput001.externalId !== null) {
            expect(resOutput001.externalId)
                .to.have.length.of.at.most(128);
        }
        if (resOutput001.agencyCampaign !== null) {
            expect(resOutput001.agencyCampaign)
                .to.have.length.of.at.most(256);
        }
        if (resOutput001.adServer !== null) {
            expect(resOutput001.adServer).to.be.oneOf([
                'LiveIntent', 'DART', 'MediaMind',
                'Atlas', 'MediaPlex', 'Other'
            ]);
        }
        if (resOutput001.paymentTerms !== null) {
            expect(resOutput001.paymentTerms).to.be.oneOf([
                'Prepay', 'Net 15', 'Net 30', 'Net 45', 'Net 60'
            ]);
        }
        expect(resOutput001.isFallback).to.be.a('boolean');
        // created and modified
        expect(validator.isISO8601(resOutput001.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput001.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.modifiedBy)).to.be.true;
        done();
    });

    it('response object key values should ' +
        'match verify object(s)', function(done) {

        expect(resOutput001.version)
            .to.equal(verifyFixture.version);
        expect(resOutput001.status)
            .to.equal(verifyFixture.status);
        expect(resOutput001.advertiser)
            .to.equal(publisher.id);
        expect(resOutput001.isFallback)
            .to.equal(verifyFixture.isFallback);
        expect(resOutput001.name)
            .to.equal(sendBody001.name);
        expect(resOutput001.budget)
            .to.equal(verifyFixture.budget);
        expect(resOutput001.isUnlimitedBudget)
            .to.equal(verifyFixture.isUnlimitedBudget);
        expect(resOutput001.budgetAllocated)
            .to.equal(verifyFixture.budgetAllocated);
        expect(resOutput001.spend)
            .to.equal(verifyFixture.spend);
        expect(resOutput001.impressions)
            .to.equal(verifyFixture.impressions);
        expect(resOutput001.startDate)
            .to.equal(sendBody001.startDate);
        expect(resOutput001.endDate)
            .to.equal(sendBody001.endDate);
        expect(resOutput001.admin.hash)
            .to.equal(verifyFixture.admin.hash);
        expect(resOutput001.executive.hash)
            .to.equal(verifyFixture.executive.hash);
        expect(resOutput001.trafficker.hash)
            .to.equal(verifyFixture.trafficker.hash);
        expect(resOutput001.referenceNumber)
            .to.equal(verifyFixture.referenceNumber);
        expect(resOutput001.externalId)
            .to.equal(verifyFixture.externalId);
        expect(resOutput001.agencyCampaign)
            .to.equal(verifyFixture.agencyCampaign);
        expect(resOutput001.adServer)
            .to.equal(verifyFixture.adServer);
        expect(resOutput001.paymentTerms)
            .to.equal(verifyFixture.paymentTerms);
        done();
    });

    it('create campaign - ssp - direct sold - ' +
    'newsletter - currency - cpm - 2nd price', function(done) {

        sendBody002 = Object.assign({}, testFixture2);

        sendBody002.name += '001' + timeStampLong;

        sendBody002.insertionOrder = resOutput001.id;

        request(targetServer)
            .post(util.format(targetEndpoint.campaignCreate))
            .set(authHeaders)
            .send(sendBody002)
            .then( function(res) {
            // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                res002 = res;
                resText002 = JSON.parse(res.text);
                resOutput002 = resText002.output;
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    it('response have status of 201', function(done) {
        expect(res002.status).to.equal(201);
        done();
    });

});
