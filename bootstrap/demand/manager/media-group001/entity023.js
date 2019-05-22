'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const jsonfile = require('jsonfile');
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

// bootstrap variable(s)
let entitiesObj;
let targetMediaGroup;
let targetAdvertiser;
let targetInsertionOrder;
let targetPixel;
let resOutputs;

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/campaign/create-ssp');

// shared test variable(s)
let authHeaders;

describe('<DEBUG> {{BOOTSTRAP}} <SETUP> [[MEDIA-GROUP]] >>> ' +
    'mediaGroup001 - advertiser001 - insertionOrder001 - ' +
    'diff ssp campaign types >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);
    resOutputs = [];

    before('get bootstrap object(s)', function() {
        entitiesObj = require(rootPath + '/bootstrap/entities-dsp.json');
        targetMediaGroup = entitiesObj.mediaGroup001;
        targetAdvertiser = targetMediaGroup.children.advertiser001;
        targetInsertionOrder = targetAdvertiser.children.insertionOrder001;
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

    testFixture.forEach((campaign) => {
        let res001;
        let resOutput001;
        let resText001;
        let sendBody001;

        before(`create campaign - ${campaign.name}`, function(done) {

            sendBody001 = Object.assign({}, campaign);

            sendBody001.insertionOrder = targetInsertionOrder.id;
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
                    resOutputs.push(resOutput001);
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

        it(`${campaign.name} response have status of 201`, function(done) {
            expect(res001.status).to.equal(201);
            done();
        });

        it(`---> notices and errors should not ` +
            `exist`, function(done) {
            expect(resText001.notices).to.not.exist;
            expect(resText001.errors).to.not.exist;
            done();
        });

        it(`---> response object property types should` +
            `match spec`, function(done) {
            expect(/^[a-f0-9]{32}$/.test(resOutput001.id)).to.be.true;
            expect(validator.isInt(resOutput001.version + '')).to.be.true;
            expect(validator.isInt(resOutput001.refId + '')).to.be.true;
            expect(/^[a-f0-9]{32}$/.test(resOutput001.advertiser)).to.be.true;
            expect(validator.isInt(resOutput001.insertionOrder + ''))
                .to.be.true;
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
            expect(resOutput001.pricingModel)
                .to.be.oneOf(['CPM', 'CPC', 'CPA']);
            expect(resOutput001.clearingMethod)
                .to.be.oneOf(['1stPrice', '2ndPrice']);
            expect(resOutput001.bidAmount).to.be.a('number');
            if (resOutput001.goal !== null) {
                expect(resOutput001.goal).to.be.oneOf([
                    'MaxCTR', 'MaxCR', 'CPM', 'CPC', 'CPA'
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
            expect(validator.isInt(resOutput001
                .shareOfVoice + '', {'max': 999})).to.be.true;
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

        it(`---> response object key values ` +
        `should match verify object(s)`, function(done) {
            expect(resOutput001.system).to.equal(sendBody001.system);
            expect(resOutput001.demandType).to.equal(sendBody001.demandType);
            expect(resOutput001.type).to.equal(sendBody001.type);
            expect(resOutput001.budgetType).to.equal(sendBody001.budgetType);
            expect(resOutput001.pricingModel)
                .to.equal(sendBody001.pricingModel);
            expect(resOutput001.clearingMethod)
                .to.equal(sendBody001.clearingMethod);
            done();
        });

    });

    after('save campaigns to file', (done) => {
        targetInsertionOrder.children[`sspCampaigns`] = resOutputs;
        jsonfile.writeFile(
            rootPath + '/bootstrap/entities-dsp.json', entitiesObj, (err) => {
                if (err) {
                    throw err;
                }
                done();
            });
    });
});
