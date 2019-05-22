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
    require(rootPath + '/fixtures/common/strategy/create001');
const verifyFixture =
    require(rootPath + '/fixtures/common/strategy/create001-verify');

// shared test variable(s)
let authHeaders;
let res001;
let resOutput001;
let resText001;
let sendBody001;

describe('{{BOOTSTRAP}} <SETUP> [[SS-AGENCY]] 014 >>> ' +
    'agency002 - advertiser001 - insertionOrder001 - ' +
    'campaign001 - lineItem002 >>> ' +
    'dsp - exchange - currency - cpm - 1st price (delete) >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('get bootstrap object(s)', function() {
        entitiesObj = require(rootPath + '/bootstrap/entities-dsp.json');
        targetAgency = entitiesObj.agency002;
        targetAdvertiser = targetAgency.children.advertiser001;
        targetInsertionOrder = targetAdvertiser.children.insertionOrder001;
        targetCampaign = targetInsertionOrder.children.campaign001;
    });

    before('generate auth headers', function(done) {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('create strategy', function(done) {
        sendBody001 = Object.assign({}, testFixture);

        sendBody001.name += '002' + timeStampLong + ' (delete)';
        sendBody001.campaign = targetCampaign.id;
        sendBody001.startDate = timeToday;
        sendBody001.endDate =
            moment().add(30, 'days').format('YYYY-MM-DD HH:mm:ss');
        sendBody001.status = 'inactive';

        request(targetServer)
            .post(util.format(targetEndpoint.strategyCreate))
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
        expect(/^[a-f0-9]{32}$/.test(resOutput001.advertiser)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.campaign)).to.be.true;
        expect(resOutput001.name).to.have.length.of.at.most(255);
        if (resOutput001.externalId !== null) {
            expect(resOutput001.externalId).to.have.length.of.at.most(128);
        }
        if (resOutput001.mediaType !== null) {
            expect(resOutput001.mediaType).to.be.oneOf([
                'dedicated', 'display', 'newsletter', 'takeover'
            ]);
        }
        if (resOutput001.status !== null) {
            expect(resOutput001.status)
                .to.be.oneOf(['active', 'inactive', 'paused']);
        }
        if (resOutput001.budgetType !== null &&
            resOutput001.budgetType !== undefined) {

            expect(resOutput001.budgetType)
                .to.be.oneOf(['currency', 'impressions']);
        }
        if (resOutput001.pricingModel !== null) {
            expect(resOutput001.pricingModel)
                .to.be.oneOf(['CPM', 'CPC', 'CPA']);
        }
        if (resOutput001.clearingMethod !== null) {
            expect(resOutput001.clearingMethod)
                .to.be.oneOf(['1stPrice', '2ndPrice']);
        }
        if (resOutput001.bidAmount !== null &&
            resOutput001.bidAmount !== undefined) {

            expect(/^(\d{1,10}(\.\d{0,2})?)$/
                .test(resOutput001.bidAmount)).to.be.true;
        }
        if (resOutput001.goal !== null) {
            expect(resOutput001.goal).to.be.oneOf([
                'none', 'MaxCTR', 'MaxConversionRate', 'targetCPM',
                'targetCPC', 'targetCPA'
            ]);
        }
        if (resOutput001.ecpm !== null) {
            expect(/^(\d{1,10}(\.\d{0,2})?)$/
                .test(resOutput001.ecpm)).to.be.true;
        }
        if (resOutput001.minCpm !== null) {
            expect(/^(\d{1,10}(\.\d{0,2})?)$/
                .test(resOutput001.minCpm)).to.be.true;
        }
        if (resOutput001.maxCpm !== null) {
            expect(/^(\d{1,10}(\.\d{0,2})?)$/
                .test(resOutput001.maxCpm)).to.be.true;
        }
        if (resOutput001.pacing !== null) {
            expect(resOutput001.pacing)
                .to.be.oneOf(['asap', 'even', 'unlimited']);
        }
        expect(resOutput001.isVideo).to.be.be.a('boolean');
        expect(resOutput001.isServer2Server).to.be.be.a('boolean');
        expect(resOutput001.hasLinkedAds).to.be.be.a('boolean');
        expect(validator.isDate(resOutput001.startDate)).to.be.true;
        expect(validator.isDate(resOutput001.endDate)).to.be.true;
        if (resOutput001.budget !== null) {
            expect(/^(\d{1,18}(\.\d{0,2})?)$/
                .test(resOutput001.budget)).to.be.true;
        }
        if (resOutput001.dailyCap !== null) {
            expect(/^(\d{1,18}(\.\d{0,2})?)$/
                .test(resOutput001.dailyCap)).to.be.true;
        }
        if (resOutput001.spend !== null) {
            expect(/^(\d{1,18}(\.\d{0,2})?)$/
                .test(resOutput001.spend)).to.be.true;
        }
        if (resOutput001.impressions !== null) {
            expect(validator.isInt(resOutput001.impressions + ''))
                .to.be.true;
        }
        if (resOutput001.clicks !== null) {
            expect(validator.isInt(resOutput001.clicks + ''))
                .to.be.true;
        }
        if (resOutput001.conversions !== null) {
            expect(validator.isInt(resOutput001.conversions + ''))
                .to.be.true;
        }
        expect(/^(\d{1,16}(\.\d{0,2})?)$/.test(resOutput001.pace))
            .to.be.true;
        if (resOutput001.trackingUrl1 !== null) {
            expect(resOutput001.trackingUrl1).to.have.length.of.at.most(255);
        }
        if (resOutput001.trackingUrl2 !== null) {
            expect(resOutput001.trackingUrl2).to.have.length.of.at.most(255);
        }
        if (resOutput001.positionTargeting !== null) {
            expect(resOutput001.positionTargeting)
                .to.be.oneOf([
                    'unknown', 'above the fold', 'below the fold'
                ]);
        }
        expect(resOutput001.targetUsOnly).to.be.a('boolean');
        if (resOutput001.geoTargetingType !== null) {
            expect(resOutput001.geoTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput001.geos !== null) {
            expect(resOutput001.geos).to.be.an('object');
        }
        if (resOutput001.postalCodes !== null) {
            expect(resOutput001.postalCodes).to.be.an('array');
        }
        if (resOutput001.bundles !== null) {
            expect(resOutput001.bundles).to.be.an('array');
        }
        if (resOutput001.categoryTargetingType !== null) {
            expect(resOutput001.categoryTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput001.categories !== null) {
            expect(resOutput001.categories).to.be.an('array');
        }
        if (resOutput001.inventoryTargetingType !== null) {
            expect(resOutput001.inventoryTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput001.inventoryTargeting !== null) {
            expect(resOutput001.inventoryTargeting).to.be.an('object');
        }
        if (resOutput001.deviceTypeTargetingType !== null) {
            expect(resOutput001.deviceTypeTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput001.deviceTypes !== null) {
            expect(resOutput001.deviceTypes).to.be.an('array');
        }
        if (resOutput001.deviceMakerTargetingType !== null) {
            expect(resOutput001.deviceMakerTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput001.deviceMakers !== null) {
            expect(resOutput001.deviceMakers).to.be.an('array');
        }
        if (resOutput001.operatingSystemTargetingType !== null) {
            expect(resOutput001.operatingSystemTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput001.operatingSystems !== null) {
            expect(resOutput001.operatingSystems).to.be.an('array');
        }
        if (resOutput001.browserTargetingType !== null) {
            expect(resOutput001.browserTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput001.browsers !== null) {
            expect(resOutput001.browsers).to.be.an('array');
        }
        if (resOutput001.audienceTargeting !== null) {
            expect(resOutput001.audienceTargeting).to.be.an('object');
        }
        if (resOutput001.liveramp !== null) {
            expect(resOutput001.liveramp).to.be.an('object');
        }
        if (resOutput001.dataProviderSegments !== null) {
            expect(resOutput001.dataProviderSegments).to.be.an('object');
        }
        if (resOutput001.dayTargetingType !== null) {
            expect(resOutput001.dayTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput001.days !== null) {
            expect(resOutput001.days).to.be.an('object');
        }
        if (resOutput001.hours !== null) {
            expect(resOutput001.hours).to.be.an('object');
        }
        if (resOutput001.ispTargetingType !== null) {
            expect(resOutput001.ispTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput001.isps !== null) {
            expect(resOutput001.isps).to.be.an('array');
        }
        if (resOutput001.cookieSegmentTargetingType !== null) {
            expect(resOutput001.cookieSegmentTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput001.cookieSegments !== null) {
            expect(resOutput001.cookieSegments).to.be.an('array');
        }
        if (resOutput001.placementId !== null) {
            expect(resOutput001.placementId)
                .to.have.length.of.at.most(1024);
        }
        if (resOutput001.listId !== null) {
            expect(resOutput001.listId).to.be.an('array');
        }
        if (resOutput001.domainTargetingType !== null) {
            expect(resOutput001.domainTargetingType)
                .to.be.oneOf(['include', 'exclude', 'inherit']);
        }
        if (resOutput001.domains !== null) {
            expect(resOutput001.domains).to.be.an('array');
        }
        if (resOutput001.keyValues !== null) {
            expect(resOutput001.keyValues).to.be.an('array');
        }
        if (resOutput001.keyValuesTargetingType !== null) {
            expect(resOutput001.keyValuesTargetingType)
                .to.be.oneOf(['include', 'exclude', null]);
        }
        if (resOutput001.keyValuesOperator !== null) {
            expect(resOutput001.keyValuesOperator)
                .to.be.oneOf(['any', 'all']);
        }
        if (resOutput001.adSlots !== null) {
            expect(resOutput001.adSlots).to.be.an('array');
        }
        // if (resOutput001.newsletters !== null) {
        //     expect(resOutput001.newsletters).to.be.an('array');
        // }
        if (resOutput001.creatives !== null) {
            expect(resOutput001.creatives).to.be.an('array');
        }
        // created and modified
        expect(validator.isISO8601(resOutput001.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput001.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.modifiedBy)).to.be.true;
        done();
    });

    it('response object key values should match test object', function() {
        expect(resOutput001.version)
            .to.equal(verifyFixture.version);
        expect(resOutput001.advertiser)
            .to.equal(targetAdvertiser.id);
        expect(resOutput001.campaign)
            .to.equal(targetCampaign.id);
        expect(resOutput001.name)
            .to.equal(sendBody001.name);
        expect(resOutput001.externalId)
            .to.equal(verifyFixture.externalId);
        expect(resOutput001.mediaType)
            .to.equal(verifyFixture.mediaType);
        expect(resOutput001.status)
            .to.equal('inactive');
        expect(resOutput001.pricingModel)
            .to.equal(verifyFixture.pricingModel);
        expect(resOutput001.clearingMethod)
            .to.equal(verifyFixture.clearingMethod);
        expect(resOutput001.bidAmount)
            .to.equal(verifyFixture.bidAmount);
        expect(resOutput001.goal)
            .to.equal(verifyFixture.goal);
        expect(resOutput001.ecpm)
            .to.equal(verifyFixture.ecpm);
        expect(resOutput001.minCpm)
            .to.equal(verifyFixture.minCpm);
        expect(resOutput001.maxCpm)
            .to.equal(verifyFixture.maxCpm);
        expect(resOutput001.pacing)
            .to.equal(verifyFixture.pacing);
        expect(resOutput001.isVideo)
            .to.equal(verifyFixture.isVideo);
        expect(resOutput001.isServer2Server)
            .to.equal(verifyFixture.isServer2Server);
        expect(resOutput001.hasLinkedAds)
            .to.equal(verifyFixture.hasLinkedAds);
        expect(resOutput001.startDate)
            .to.equal(sendBody001.startDate);
        expect(resOutput001.endDate)
            .to.equal(sendBody001.endDate);
        expect(resOutput001.budget)
            .to.equal(verifyFixture.budget);
        expect(resOutput001.dailyCap)
            .to.equal(verifyFixture.dailyCap);
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
        expect(resOutput001.trackingUrl1)
            .to.equal(verifyFixture.trackingUrl1);
        expect(resOutput001.trackingUrl2)
            .to.equal(verifyFixture.trackingUrl2);
        expect(resOutput001.positionTargeting)
            .to.equal(verifyFixture.positionTargeting);
        expect(resOutput001.targetUsOnly)
            .to.equal(verifyFixture.targetUsOnly);
        expect(resOutput001.geoTargetingType)
            .to.equal(verifyFixture.geoTargetingType);
        expect(resOutput001.geos)
            .to.eql(verifyFixture.geos);
        expect(resOutput001.postalCodes)
            .to.eql(verifyFixture.postalCodes);
        expect(resOutput001.bundles)
            .to.eql(verifyFixture.bundles);
        expect(resOutput001.categoryTargetingType)
            .to.equal(verifyFixture.categoryTargetingType);
        expect(resOutput001.categories)
            .to.eql(verifyFixture.categories);
        expect(resOutput001.inventoryTargetingType)
            .to.equal(verifyFixture.inventoryTargetingType);
        expect(resOutput001.inventoryTargeting)
            .to.eql(verifyFixture.inventoryTargeting);
        expect(resOutput001.deviceTypeTargetingType)
            .to.equal(verifyFixture.deviceTypeTargetingType);
        expect(resOutput001.deviceTypes)
            .to.eql(verifyFixture.deviceTypes);
        expect(resOutput001.deviceMakerTargetingType)
            .to.equal(verifyFixture.deviceMakerTargetingType);
        expect(resOutput001.deviceMakers)
            .to.eql(verifyFixture.deviceMakers);
        expect(resOutput001.operatingSystemTargetingType)
            .to.equal(verifyFixture.operatingSystemTargetingType);
        expect(resOutput001.operatingSystems)
            .to.eql(verifyFixture.operatingSystems);
        expect(resOutput001.browserTargetingType)
            .to.equal(verifyFixture.browserTargetingType);
        expect(resOutput001.browsers)
            .to.eql(verifyFixture.browsers);
        expect(resOutput001.audienceTargeting)
            .to.eql(verifyFixture.audienceTargeting);
        expect(resOutput001.liveramp)
            .to.equal(verifyFixture.liveramp);
        expect(resOutput001.dataProviderSegments)
            .to.eql(verifyFixture.dataProviderSegments);
        expect(resOutput001.dayTargetingType)
            .to.equal(verifyFixture.dayTargetingType);
        expect(resOutput001.days)
            .to.eql(verifyFixture.days);
        expect(resOutput001.hours)
            .to.eql(verifyFixture.hours);
        expect(resOutput001.ispTargetingType)
            .to.equal(verifyFixture.ispTargetingType);
        expect(resOutput001.isps)
            .to.eql(verifyFixture.isps);
        expect(resOutput001.cookieSegmentTargetingType)
            .to.equal(verifyFixture.cookieSegmentTargetingType);
        expect(resOutput001.cookieSegments)
            .to.eql(verifyFixture.cookieSegments);
        expect(resOutput001.placementId
        ).to.equal(verifyFixture.placementId);
        expect(resOutput001.listId)
            .to.eql(verifyFixture.listId);
        expect(resOutput001.domainTargetingType)
            .to.equal(verifyFixture.domainTargetingType);
        expect(resOutput001.domains)
            .to.eql(verifyFixture.domains);
        expect(resOutput001.keyValues)
            .to.eql(verifyFixture.keyValues);
        expect(resOutput001.keyValuesTargetingType)
            .to.equal(verifyFixture.keyValuesTargetingType);
        expect(resOutput001.keyValuesOperator)
            .to.equal(verifyFixture.keyValuesOperator);
        expect(resOutput001.adSlots)
            .to.eql(verifyFixture.adSlots);
        // expect(resOutput001.newsletters)
        //     .to.eql(verifyFixture.newsletters);
        expect(resOutput001.creatives)
            .to.eql(verifyFixture.creatives);
    });

    after('write entity to json file', function(done) {

        let baseEntityObj = targetCampaign;

        const createdEntity = {
            type: 'line-item (delete)',
            permission: 'client/self-service',
            name: resOutput001.name,
            id: resOutput001.id,
            refId: resOutput001.refId,
            startDate: resOutput001.startDate,
            endDate: resOutput001.endDate,
            status: resOutput001.status,
            clearingMethod: resOutput001.clearingMethod,
            mediaType: resOutput001.mediaType
        };

        // write entity details to object
        if (!baseEntityObj.children) {
            baseEntityObj.children = {};
        }
        baseEntityObj.children.lineItem002 = {};
        baseEntityObj.children.lineItem002 = createdEntity;

        // save object to file
        const writeEntitiesObjToFile = jsonWriteFile(
            rootPath + '/bootstrap/entities-dsp.json',
            entitiesObj
        );
        writeEntitiesObjToFile.then(() => done());
    });
});
