'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const moment = require('moment');
const request = require('supertest-as-promised');
const util = require('util');
const validator = require('validator');
const jsonfile = require('jsonfile');

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
const jsonWriteFile =
    require(rootPath + '/helpers/json-write-file');
const targetUser =
    usersTargetEnvironment.admin;
const merlinAuthHeaders =
    require(rootPath + '/helpers/merlin-auth-headers');
const requestTimeOut = 10000;
const timeToday =
    moment().format('YYYY-MM-DD HH:mm:ss');

// bootstrap variable(s)
let entitiesObj = require(rootPath + '/bootstrap/entities-dsp.json');
let targetMediaGroup, targetAdvertiser, targetInsertionOrder, targetCampaigns;

// fixture(s)
let testFixture =
    require(rootPath + '/fixtures/common/strategy/create001');

// shared test variable(s)
let authHeaders;
let mockList = require(rootPath + '/fixtures/common/campaign/create-ssp');

describe('{{BOOTSTRAP}} <SETUP> [[MEDIA-GROUP]] 025 >>> ' +
    'mediaGroup001 - advertiser001 - insertionOrder001 - SSP campaigns ' +
    'all line item types >>> ', function() {

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

    before('get bootstrap object(s)',function(done) {
        targetMediaGroup = entitiesObj.mediaGroup001;
        targetAdvertiser = targetMediaGroup.children.advertiser001;
        targetInsertionOrder = targetAdvertiser.children.insertionOrder001;
        targetCampaigns = targetInsertionOrder.children.sspCampaigns;
        done();
    });

    mockList.forEach((sspC, index) => {
        let res001;
        let resText001;
        let resOutput001;
        let sendBody001;

        sendBody001 = Object.assign({}, testFixture);
        sendBody001.startDate = timeToday;
        sendBody001.endDate =
            moment().add(29, 'days').format('YYYY-MM-DD HH:mm:ss');

        it(`${sspC.name} - create strategy`, function(done) {
            sendBody001.campaign = targetCampaigns[index].id;
            sendBody001.name += ' ' + sspC.name;
            sendBody001.dailyBudget = '20.01';
            sendBody001.budget = '600.3';

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

        it('---> response have status of 201', function(done) {
            expect(res001.status).to.equal(201);
            done();
        });

        it('---> notices and errors should not exist', function(done) {
            expect(resText001.notices).to.not.exist;
            expect(resText001.errors).to.not.exist;
            done();
        });

        it('---> response object property types should ' +
            'match spec', function(done) {
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
                expect(resOutput001.trackingUrl1)
                    .to.have.length.of.at.most(255);
            }
            if (resOutput001.trackingUrl2 !== null) {
                expect(resOutput001.trackingUrl2)
                    .to.have.length.of.at.most(255);
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
            //Strategy card id
            expect(resOutput001.strategyCardId).to.be.null;
            // created and modified
            expect(validator.isISO8601(resOutput001.created)).to.be.true;
            expect(/^[a-f0-9]{32}$/.test(resOutput001.createdBy)).to.be.true;
            expect(validator.isISO8601(resOutput001.modified)).to.be.true;
            expect(/^[a-f0-9]{32}$/.test(resOutput001.modifiedBy)).to.be.true;
            done();
        });

        it('---> write entity to json file', function(done) {

            let baseEntityObj = sspC;
    
            const createdEntity = {
                type: 'line-item',
                permission: 'admin/manager',
                name: resOutput001.name,
                id: resOutput001.id,
                refId: resOutput001.refId,
                startDate: resOutput001.startDate,
                endDate: resOutput001.endDate,
                clearingMethod: resOutput001.clearingMethod,
                mediaType: resOutput001.mediaType
            };
    
            // write entity details to object
            if (!baseEntityObj.children) {
                baseEntityObj.children = {};
            }
            baseEntityObj.children.lineItem001 = {};
            baseEntityObj.children.lineItem001 = createdEntity;
    
            // save object to file
            jsonfile.writeFile(
                rootPath + '/bootstrap/entities-dsp.json', entitiesObj, (err) => {
                    if (err) {
                        throw err;
                    }
            });

            done();
        });

    });
});
