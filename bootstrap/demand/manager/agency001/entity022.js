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
let targetPixel;
let targetBootstrapUser;

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/campaign/create013');
const verifyFixture =
    require(rootPath + '/fixtures/common/campaign/create013-verify');

// shared test variable(s)
let authHeaders;
let res001;
let resOutput001;
let resText001;
let sendBody001;

describe('{{BOOTSTRAP}} <SETUP> [[AGENCY]] 022 >>> ' +
    'agency001 - advertiser001 - insertionOrder002 - campaign003 >>> ' +
    'exchange - 2nd price - cpm >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('get bootstrap object(s)', function() {
        entitiesObj = require(rootPath + '/bootstrap/entities-dsp.json');
        targetAgency = entitiesObj.agency001;
        targetAdvertiser = targetAgency.children.advertiser001;
        targetInsertionOrder = targetAdvertiser.children.insertionOrder002;
        targetPixel = targetAdvertiser.children.pixel001;
    });

    before('generate auth headers', function(done) {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('create campaign - dsp - exchange - ' +
        '1st price - cpm', function(done) {

        sendBody001 = Object.assign({}, testFixture);

        sendBody001.insertionOrder = targetInsertionOrder.id;
        sendBody001.name += '003' + timeStampLong + ' (perf max clicks)';
        sendBody001.conversionPixel = targetPixel.id;

        request(targetServer)
            .post(util.format(targetEndpoint.campaignCreate))
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
        expect(validator.isInt(resOutput001.version + '')).to.be.true;
        expect(validator.isInt(resOutput001.refId + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.advertiser)).to.be.true;
        expect(validator.isInt(resOutput001.insertionOrder + '')).to.be.true;
        expect(validator.isInt(resOutput001.category + '')).to.be.true;
        if (resOutput001.secondaryCategories !== null) {
            expect(resOutput001.secondaryCategories).to.be.an('array');
        }
        if (resOutput001.externalId !== null) {
            expect(resOutput001.externalId)
                .to.have.length.of.at.most(128);
        }
        if (resOutput001.conversionPixel !== null) {
            expect(/^[a-f0-9]{32}$/.test(resOutput001.conversionPixel))
                .to.be.true;
        }
        expect(resOutput001.name).to.have.length.of.at.most(255);
        if (resOutput001.demandType !== null) {
            expect(resOutput001.demandType).to.be.oneOf([
                'house', 'direct', 'exchange'
            ]);
        }
        expect(resOutput001.status)
            .to.be.oneOf(['active', 'inactive', 'pending']);
        expect(resOutput001.type).to.be.oneOf([
            'dedicated', 'display', 'newsletter', 'takeover', 'roadblock'
        ]);
        expect(resOutput001.system).to.be.oneOf(['ssp', 'dsp']);
        expect(resOutput001.budgetType)
            .to.be.oneOf(['currency', 'impressions']);
        expect(resOutput001.pricingModel).to.be.oneOf(['CPM', 'CPC', 'CPA']);
        expect(resOutput001.clearingMethod)
            .to.be.oneOf(['1stPrice', '2ndPrice']);
        expect(resOutput001.bidAmount).to.be.a('number');
        if (resOutput001.goal !== null) {
            expect(resOutput001.goal).to.be.oneOf([
                'MaxCTR', 'MaxConversionRate', 'CPM', 'CPC', 'CPA'
            ]);
        }
        expect(resOutput001.ecpm).to.be.a('number');
        expect(resOutput001.minCpm).to.be.a('number');
        expect(resOutput001.maxCpm).to.be.a('number');
        expect(resOutput001.guaranteed).to.be.a('boolean');
        expect(resOutput001.clickDecision).to.be.a('boolean');
        if (resOutput001.dspFee !== null) {
            expect(validator.isInt(resOutput001.dspFee + '', {'max': 99}))
                .to.be.true;
        }
        if (resOutput001.sspFee !== null) {
            expect(validator.isInt(resOutput001.sspFee + '', {'max': 99}))
                .to.be.true;
        }
        expect(validator.isInt(resOutput001.shareOfVoice + '', {'max': 999}))
            .to.be.true;
        if (resOutput001.frequencyCapCount !== null) {
            expect(validator.isInt(resOutput001.frequencyCapCount + ''))
                .to.be.true;
        }
        if (resOutput001.frequencyCapPeriod !== null) {
            expect(resOutput001.frequencyCapPeriod).to.be.oneOf([
                'minute', 'hourly', 'daily', 'weekly', 'monthly'
            ]);
        }
        expect(resOutput001.budget).to.be.a('number');
        expect(resOutput001.failed).to.be.a('boolean');
        expect(resOutput001.special).to.be.a('boolean');
        expect(resOutput001.spend).to.be.a('number');
        expect(validator.isInt(resOutput001.impressions + '')).to.be.true;
        expect(validator.isInt(resOutput001.clicks + '')).to.be.true;
        expect(validator.isInt(resOutput001.conversions + '')).to.be.true;
        expect(resOutput001.pace).to.be.a('number');
        expect(validator.isDate(resOutput001.insertionOrderStartDate))
            .to.be.true;
        expect(validator.isDate(resOutput001.insertionOrderEndDate))
            .to.be.true;
        if (resOutput001.description !== null) {
            expect(resOutput001.description).to.have.length.of.at.most(255);
        }
        expect(resOutput001.hasStats).to.be.a('boolean');
        // created and modified
        expect(validator.isISO8601(resOutput001.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput001.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.modifiedBy)).to.be.true;
        done();
    });

    it('response object key values ' +
        'should match verify object(s)', function(done) {
        expect(resOutput001.version)
            .to.equal(verifyFixture.version);
        expect(resOutput001.advertiser)
            .to.equal(targetAdvertiser.id);
        expect(resOutput001.insertionOrder)
            .to.equal(targetInsertionOrder.id);
        expect(resOutput001.category)
            .to.equal(verifyFixture.category);
        expect(resOutput001.secondaryCategories)
            .to.eql(verifyFixture.secondaryCategories);
        expect(resOutput001.externalId)
            .to.equal(verifyFixture.externalId);
        expect(resOutput001.conversionPixel)
            .to.equal(sendBody001.conversionPixel);
        expect(resOutput001.name)
            .to.equal(sendBody001.name);
        expect(resOutput001.status)
            .to.equal(verifyFixture.status);
        expect(resOutput001.type)
            .to.equal(verifyFixture.type);
        expect(resOutput001.system)
            .to.equal(sendBody001.system);
        expect(resOutput001.budgetType)
            .to.equal(sendBody001.budgetType);
        expect(resOutput001.pricingModel)
            .to.equal(sendBody001.pricingModel);
        expect(resOutput001.clearingMethod)
            .to.equal(sendBody001.clearingMethod);
        expect(resOutput001.bidAmount)
            .to.equal(verifyFixture.bidAmount);
        expect(resOutput001.bidAmount)
            .to.equal(verifyFixture.bidAmount);
        expect(resOutput001.goal)
            .to.equal(sendBody001.goal);
        expect(resOutput001.ecpm)
            .to.equal(verifyFixture.ecpm);
        expect(resOutput001.minCpm)
            .to.equal(verifyFixture.minCpm);
        expect(resOutput001.maxCpm)
            .to.equal(verifyFixture.maxCpm);
        expect(resOutput001.guaranteed)
            .to.equal(verifyFixture.guaranteed);
        expect(resOutput001.clickDecision)
            .to.equal(verifyFixture.clickDecision);
        expect(resOutput001.dspFee)
            .to.equal(verifyFixture.dspFee);
        expect(resOutput001.sspFee)
            .to.equal(verifyFixture.sspFee);
        expect(resOutput001.shareOfVoice)
            .to.equal(verifyFixture.shareOfVoice);
        expect(resOutput001.frequencyCapCount)
            .to.equal(verifyFixture.frequencyCapCount);
        expect(resOutput001.frequencyCapPeriod)
            .to.equal(verifyFixture.frequencyCapPeriod);
        expect(resOutput001.budget)
            .to.equal(verifyFixture.budget);
        expect(resOutput001.failed)
            .to.equal(verifyFixture.failed);
        expect(resOutput001.special)
            .to.equal(verifyFixture.special);
        expect(resOutput001.spend)
            .to.equal(verifyFixture.spend);
        expect(resOutput001.impressions)
            .to.equal(verifyFixture.impressions);
        expect(resOutput001.clicks)
            .to.equal(verifyFixture.clicks);
        expect(resOutput001.conversions)
            .to.equal(verifyFixture.conversions);
        expect(resOutput001.pace)
            .to.equal(verifyFixture.pace);
        expect(resOutput001.description)
            .to.equal(verifyFixture.description);
        expect(resOutput001.hasStats)
            .to.equal(verifyFixture.hasStats);
        done();
    });

    after('write entity to json file', function(done) {

        let baseEntityObj = targetInsertionOrder;

        const createdEntity = {
            type: 'campaign',
            permission: 'admin/manager',
            name: resOutput001.name,
            id: resOutput001.id,
            refId: resOutput001.refId,
            system: resOutput001.system,
            pricingModel: resOutput001.pricingModel,
            clearingMethod: resOutput001.clearingMethod,
            goal: resOutput001.goal,
            goalDescription: 'performance - maximize conversions',
            startDate: resOutput001.startDate,
            endDate: resOutput001.endDate,
            conversionPixel: resOutput001.conversionPixel
        };

        // write entity details to object
        if (!baseEntityObj.children) {
            baseEntityObj.children = {};
        }
        baseEntityObj.children.campaign003 = {};
        baseEntityObj.children.campaign003 = createdEntity;

        // save object to file
        const writeEntitiesObjToFile = jsonWriteFile(
            rootPath + '/bootstrap/entities-dsp.json',
            entitiesObj
        );
        writeEntitiesObjToFile.then(() => done());
    });
});
