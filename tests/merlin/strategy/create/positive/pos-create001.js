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
const timeStamp =
    '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');

// fixture(s)
const setupFixture001 =
    require(rootPath + '/fixtures/common/media-group/create001');
const setupFixture002 =
    require(rootPath + '/fixtures/common/advertiser/create001');
const setupFixture003 =
    require(rootPath + '/fixtures/common/insertion-order/create001');
const setupFixture004 =
    require(rootPath + '/fixtures/common/campaign/create002');
const testFixture =
    require(rootPath + '/fixtures/common/strategy/create001');
const verifyFixture =
    require(rootPath + '/fixtures/common/strategy/create001-verify');

// shared test variable(s)
let authHeaders;
let res005;
let resText001;
let resText002;
let resText003;
let resText004;
let resText005;
let resOutput001;
let resOutput002;
let resOutput003;
let resOutput004;
let resOutput005;
let sendBody001;
let sendBody002;
let sendBody003;
let sendBody004;
let sendBody005;

describe('{{MERLIN}} <SMOKE> /strategy {create} @ADMIN >>> ' +
    '(+) body - media-group - basic verification >>>', function() {

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

    before('create media-group', function(done) {
        sendBody001 = {};
        Object.assign(
            sendBody001,
            setupFixture001
        );
        sendBody001.name += timeStamp;

        request(targetServer)
            .post(util.format(targetEndpoint.mediaGroupCreate))
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
                expect(/^[a-f0-9]{32}$/.test(resOutput001.id)).to.be.true;
                expect(resOutput001.name).to.have.length.of.at.most(128);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create advertiser', function(done) {
        sendBody002 = {};
        Object.assign(
            sendBody002,
            setupFixture002
        );
        sendBody002.name += timeStamp;

        // assign owner
        sendBody002.owner.type =
            'Media Group';
        sendBody002.owner.id =
            resOutput001.id;

        request(targetServer)
            .post(util.format(targetEndpoint.advertiserCreate))
            .set(authHeaders)
            .send(sendBody002)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText002 = JSON.parse(res.text);
                resOutput002 = resText002.output;

                // spot check response
                expect(/^[a-f0-9]{32}$/.test(resOutput002.id)).to.be.true;
                expect(resOutput002.name).to.have.length.of.at.most(255);
                expect(resOutput002.owner.id).to.equal(sendBody002.owner.id);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create insertion-order', function(done) {
        sendBody003 = {};
        Object.assign(
            sendBody003,
            setupFixture003
        );
        sendBody003.name += timeStamp;

        // assign advertiser
        sendBody003.advertiser = resOutput002.id;

        request(targetServer)
            .post(util.format(targetEndpoint.insertionOrderCreate))
            .set(authHeaders)
            .send(sendBody003)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText003 = JSON.parse(res.text);
                resOutput003 = resText003.output;

                // spot check response
                expect(validator.isInt(resOutput003.id + '')).to.be.true;
                expect(resOutput003.name).to.have.length.of.at.most(128);
                expect(/^[a-f0-9]{32}$/.test(resOutput003.admin.hash))
                    .to.be.true;
                expect(resOutput003.advertiser)
                    .to.equal(sendBody003.advertiser);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create campaign', function(done) {
        sendBody004 = {};
        Object.assign(
            sendBody004,
            setupFixture004
        );
        sendBody004.name += timeStamp;

        // assign insertion-order
        sendBody004.insertionOrder = resOutput003.id;

        request(targetServer)
            .post(util.format(targetEndpoint.campaignCreate))
            .set(authHeaders)
            .send(sendBody004)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText004 = JSON.parse(res.text);
                resOutput004 = resText004.output;

                // spot check response
                expect(/^[a-f0-9]{32}$/.test(resOutput004.id)).to.be.true;
                expect(resOutput004.budgetType)
                    .to.be.oneOf(['currency', 'impressions']);
                expect(validator.isInt(resOutput004.refId + '')).to.be.true;
                expect(resOutput004.ecpm).to.be.a('number');
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create strategy', function(done) {
        sendBody005 = {};
        Object.assign(
            sendBody005,
            testFixture
        );
        sendBody005.name += timeStamp;

        // assign campaign
        sendBody005.campaign = resOutput004.id;

        request(targetServer)
            .post(util.format(targetEndpoint.strategyCreate))
            .set(authHeaders)
            .send(sendBody005)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                res005 = res;
                resText005 = JSON.parse(res.text);
                resOutput005 = resText005.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response have status of 201', function() {
        expect(res005.status).to.equal(201);
    });

    it('notices and errors should not exist', function() {
        expect(resText005.notices).to.not.exist;
        expect(resText005.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput005.id)).to.be.true;
        expect(validator.isInt(resOutput005.refId + '')).to.be.true;
        expect(validator.isInt(resOutput005.version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005.advertiser)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005.campaign)).to.be.true;
        expect(resOutput005.name).to.have.length.of.at.most(255);
        if (resOutput005.externalId !== null) {
            expect(resOutput005.externalId).to.have.length.of.at.most(128);
        }
        if (resOutput005.mediaType !== null) {
            expect(resOutput005.mediaType).to.be.oneOf([
                'dedicated', 'display', 'newsletter', 'takeover'
            ]);
        }
        if (resOutput005.status !== null) {
            expect(resOutput005.status)
                .to.be.oneOf(['active', 'inactive', 'paused']);
        }
        if (resOutput005.budgetType !== null &&
            resOutput005.budgetType !== undefined) {

            expect(resOutput005.budgetType)
                .to.be.oneOf(['currency', 'impressions']);
        }
        if (resOutput005.pricingModel !== null) {
            expect(resOutput005.pricingModel)
                .to.be.oneOf(['CPM', 'CPC', 'CPA']);
        }
        if (resOutput005.clearingMethod !== null) {
            expect(resOutput005.clearingMethod)
                .to.be.oneOf(['1stPrice', '2ndPrice']);
        }
        if (resOutput005.bidAmount !== null &&
            resOutput005.bidAmount !== undefined) {

            expect(/^(\d{1,10}(\.\d{0,2})?)$/
                .test(resOutput005.bidAmount)).to.be.true;
        }
        if (resOutput005.goal !== null) {
            expect(resOutput005.goal).to.be.oneOf([
                'none', 'MaxCTR', 'MaxConversionRate', 'targetCPM',
                'targetCPC', 'targetCPA'
            ]);
        }
        if (resOutput005.ecpm !== null) {
            expect(/^(\d{1,10}(\.\d{0,2})?)$/
                .test(resOutput005.ecpm)).to.be.true;
        }
        if (resOutput005.minCpm !== null) {
            expect(/^(\d{1,10}(\.\d{0,2})?)$/
                .test(resOutput005.minCpm)).to.be.true;
        }
        if (resOutput005.maxCpm !== null) {
            expect(/^(\d{1,10}(\.\d{0,2})?)$/
                .test(resOutput005.maxCpm)).to.be.true;
        }
        if (resOutput005.pacing !== null) {
            expect(resOutput005.pacing)
                .to.be.oneOf(['asap', 'even', 'unlimited']);
        }
        expect(resOutput005.isVideo).to.be.be.a('boolean');
        expect(resOutput005.isServer2Server).to.be.be.a('boolean');
        expect(resOutput005.hasLinkedAds).to.be.be.a('boolean');
        expect(validator.isDate(resOutput005.startDate)).to.be.true;
        expect(validator.isDate(resOutput005.endDate)).to.be.true;
        if (resOutput005.budget !== null) {
            expect(/^(\d{1,18}(\.\d{0,2})?)$/
                .test(resOutput005.budget)).to.be.true;
        }
        if (resOutput005.dailyCap !== null) {
            expect(/^(\d{1,18}(\.\d{0,2})?)$/
                .test(resOutput005.dailyCap)).to.be.true;
        }
        if (resOutput005.spend !== null) {
            expect(/^(\d{1,18}(\.\d{0,2})?)$/
                .test(resOutput005.spend)).to.be.true;
        }
        if (resOutput005.impressions !== null) {
            expect(validator.isInt(resOutput005.impressions + ''))
                .to.be.true;
        }
        if (resOutput005.clicks !== null) {
            expect(validator.isInt(resOutput005.clicks + ''))
                .to.be.true;
        }
        if (resOutput005.conversions !== null) {
            expect(validator.isInt(resOutput005.conversions + ''))
                .to.be.true;
        }
        expect(/^(\d{1,16}(\.\d{0,2})?)$/.test(resOutput005.pace))
            .to.be.true;
        if (resOutput005.trackingUrl1 !== null) {
            expect(resOutput005.trackingUrl1).to.have.length.of.at.most(255);
        }
        if (resOutput005.trackingUrl2 !== null) {
            expect(resOutput005.trackingUrl2).to.have.length.of.at.most(255);
        }
        if (resOutput005.positionTargeting !== null) {
            expect(resOutput005.positionTargeting)
                .to.be.oneOf([
                    'unknown', 'above the fold', 'below the fold'
                ]);
        }
        expect(resOutput005.targetUsOnly).to.be.a('boolean');
        if (resOutput005.geoTargetingType !== null) {
            expect(resOutput005.geoTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput005.geos !== null) {
            expect(resOutput005.geos).to.be.an('object');
        }
        if (resOutput005.postalCodes !== null) {
            expect(resOutput005.postalCodes).to.be.an('array');
        }
        if (resOutput005.bundles !== null) {
            expect(resOutput005.bundles).to.be.an('array');
        }
        if (resOutput005.categoryTargetingType !== null) {
            expect(resOutput005.categoryTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput005.categories !== null) {
            expect(resOutput005.categories).to.be.an('array');
        }
        if (resOutput005.inventoryTargetingType !== null) {
            expect(resOutput005.inventoryTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput005.inventoryTargeting !== null) {
            expect(resOutput005.inventoryTargeting).to.be.an('object');
        }
        if (resOutput005.deviceTypeTargetingType !== null) {
            expect(resOutput005.deviceTypeTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput005.deviceTypes !== null) {
            expect(resOutput005.deviceTypes).to.be.an('array');
        }
        if (resOutput005.deviceMakerTargetingType !== null) {
            expect(resOutput005.deviceMakerTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput005.deviceMakers !== null) {
            expect(resOutput005.deviceMakers).to.be.an('array');
        }
        if (resOutput005.operatingSystemTargetingType !== null) {
            expect(resOutput005.operatingSystemTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput005.operatingSystems !== null) {
            expect(resOutput005.operatingSystems).to.be.an('array');
        }
        if (resOutput005.browserTargetingType !== null) {
            expect(resOutput005.browserTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput005.browsers !== null) {
            expect(resOutput005.browsers).to.be.an('array');
        }
        if (resOutput005.audienceTargeting !== null) {
            expect(resOutput005.audienceTargeting).to.be.an('object');
        }
        if (resOutput005.liveramp !== null) {
            expect(resOutput005.liveramp).to.be.an('object');
        }
        if (resOutput005.dataProviderSegments !== null) {
            expect(resOutput005.dataProviderSegments).to.be.an('object');
        }
        if (resOutput005.dayTargetingType !== null) {
            expect(resOutput005.dayTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput005.days !== null) {
            expect(resOutput005.days).to.be.an('object');
        }
        if (resOutput005.hours !== null) {
            expect(resOutput005.hours).to.be.an('object');
        }
        if (resOutput005.ispTargetingType !== null) {
            expect(resOutput005.ispTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput005.isps !== null) {
            expect(resOutput005.isps).to.be.an('array');
        }
        if (resOutput005.cookieSegmentTargetingType !== null) {
            expect(resOutput005.cookieSegmentTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput005.cookieSegments !== null) {
            expect(resOutput005.cookieSegments).to.be.an('array');
        }
        if (resOutput005.placementId !== null) {
            expect(resOutput005.placementId)
                .to.have.length.of.at.most(1024);
        }
        if (resOutput005.listId !== null) {
            expect(resOutput005.listId).to.be.an('array');
        }
        if (resOutput005.domainTargetingType !== null) {
            expect(resOutput005.domainTargetingType)
                .to.be.oneOf(['include', 'exclude', 'inherit']);
        }
        if (resOutput005.domains !== null) {
            expect(resOutput005.domains).to.be.an('array');
        }
        if (resOutput005.keyValues !== null) {
            expect(resOutput005.keyValues).to.be.an('array');
        }
        if (resOutput005.keyValuesTargetingType !== null) {
            expect(resOutput005.keyValuesTargetingType)
                .to.be.oneOf(['include', 'exclude', null]);
        }
        if (resOutput005.keyValuesOperator !== null) {
            expect(resOutput005.keyValuesOperator)
                .to.be.oneOf(['any', 'all']);
        }
        if (resOutput005.adSlots !== null) {
            expect(resOutput005.adSlots).to.be.an('array');
        }
        if (resOutput005.creatives !== null) {
            expect(resOutput005.creatives).to.be.an('array');
        }
        // created and modified
        expect(validator.isISO8601(resOutput005.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput005.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005.modifiedBy)).to.be.true;
    });

    it('response object key values should match test object', function() {
        expect(resOutput005.version)
            .to.equal(verifyFixture.version);
        expect(resOutput005.advertiser)
            .to.equal(resOutput002.id);
        expect(resOutput005.campaign)
            .to.equal(resOutput004.id);
        expect(resOutput005.name)
            .to.equal(sendBody005.name);
        expect(resOutput005.externalId)
            .to.equal(verifyFixture.externalId);
        expect(resOutput005.mediaType)
            .to.equal(verifyFixture.mediaType);
        expect(resOutput005.status)
            .to.equal(verifyFixture.status);
        expect(resOutput005.budgetType)
            .to.equal(verifyFixture.budgetType);
        expect(resOutput005.pricingModel)
            .to.equal(verifyFixture.pricingModel);
        expect(resOutput005.clearingMethod)
            .to.equal(verifyFixture.clearingMethod);
        expect(resOutput005.bidAmount)
            .to.equal(verifyFixture.bidAmount);
        expect(resOutput005.goal)
            .to.equal(verifyFixture.goal);
        expect(resOutput005.ecpm)
            .to.equal(verifyFixture.ecpm);
        expect(resOutput005.minCpm)
            .to.equal(verifyFixture.minCpm);
        expect(resOutput005.maxCpm)
            .to.equal(verifyFixture.maxCpm);
        expect(resOutput005.pacing)
            .to.equal(verifyFixture.pacing);
        expect(resOutput005.isVideo)
            .to.equal(verifyFixture.isVideo);
        expect(resOutput005.isServer2Server)
            .to.equal(verifyFixture.isServer2Server);
        expect(resOutput005.hasLinkedAds)
            .to.equal(verifyFixture.hasLinkedAds);
        expect(resOutput005.startDate)
            .to.equal(verifyFixture.startDate);
        expect(resOutput005.endDate)
            .to.equal(verifyFixture.endDate);
        expect(resOutput005.budget)
            .to.equal(verifyFixture.budget);
        expect(resOutput005.dailyCap)
            .to.equal(verifyFixture.dailyCap);
        expect(resOutput005.spend)
            .to.equal(verifyFixture.spend);
        expect(resOutput005.impressions)
            .to.equal(verifyFixture.impressions);
        expect(resOutput005.clicks)
            .to.equal(verifyFixture.clicks);
        expect(resOutput005.conversions)
            .to.equal(verifyFixture.conversions);
        expect(resOutput005.pace)
            .to.equal(verifyFixture.pace);
        expect(resOutput005.trackingUrl1)
            .to.equal(verifyFixture.trackingUrl1);
        expect(resOutput005.trackingUrl2)
            .to.equal(verifyFixture.trackingUrl2);
        expect(resOutput005.positionTargeting)
            .to.equal(verifyFixture.positionTargeting);
        expect(resOutput005.targetUsOnly)
            .to.equal(verifyFixture.targetUsOnly);
        expect(resOutput005.geoTargetingType)
            .to.equal(verifyFixture.geoTargetingType);
        expect(resOutput005.geos)
            .to.eql(verifyFixture.geos);
        expect(resOutput005.postalCodes)
            .to.eql(verifyFixture.postalCodes);
        expect(resOutput005.bundles)
            .to.eql(verifyFixture.bundles);
        expect(resOutput005.categoryTargetingType)
            .to.equal(verifyFixture.categoryTargetingType);
        expect(resOutput005.categories)
            .to.eql(verifyFixture.categories);
        expect(resOutput005.inventoryTargetingType)
            .to.equal(verifyFixture.inventoryTargetingType);
        expect(resOutput005.inventoryTargeting)
            .to.eql(verifyFixture.inventoryTargeting);
        expect(resOutput005.deviceTypeTargetingType)
            .to.equal(verifyFixture.deviceTypeTargetingType);
        expect(resOutput005.deviceTypes)
            .to.eql(verifyFixture.deviceTypes);
        expect(resOutput005.deviceMakerTargetingType)
            .to.equal(verifyFixture.deviceMakerTargetingType);
        expect(resOutput005.deviceMakers)
            .to.eql(verifyFixture.deviceMakers);
        expect(resOutput005.operatingSystemTargetingType)
            .to.equal(verifyFixture.operatingSystemTargetingType);
        expect(resOutput005.operatingSystems)
            .to.eql(verifyFixture.operatingSystems);
        expect(resOutput005.browserTargetingType)
            .to.equal(verifyFixture.browserTargetingType);
        expect(resOutput005.browsers)
            .to.eql(verifyFixture.browsers);
        expect(resOutput005.audiences)
            .to.eql(verifyFixture.audiences);
        expect(resOutput005.liveramp)
            .to.equal(verifyFixture.liveramp);
        expect(resOutput005.dataProviderSegments)
            .to.eql(verifyFixture.dataProviderSegments);
        expect(resOutput005.dayTargetingType)
            .to.equal(verifyFixture.dayTargetingType);
        expect(resOutput005.days)
            .to.eql(verifyFixture.days);
        expect(resOutput005.hours)
            .to.eql(verifyFixture.hours);
        expect(resOutput005.ispTargetingType)
            .to.equal(verifyFixture.ispTargetingType);
        expect(resOutput005.isps)
            .to.eql(verifyFixture.isps);
        expect(resOutput005.cookieSegmentTargetingType)
            .to.equal(verifyFixture.cookieSegmentTargetingType);
        expect(resOutput005.cookieSegments)
            .to.eql(verifyFixture.cookieSegments);
        expect(resOutput005.placementId
        ).to.equal(verifyFixture.placementId);
        expect(resOutput005.listId)
            .to.eql(verifyFixture.listId);
        expect(resOutput005.domainTargetingType)
            .to.equal(verifyFixture.domainTargetingType);
        expect(resOutput005.domains)
            .to.eql(verifyFixture.domains);
        expect(resOutput005.keyValues)
            .to.eql(verifyFixture.keyValues);
        expect(resOutput005.keyValuesTargetingType)
            .to.equal(verifyFixture.keyValuesTargetingType);
        expect(resOutput005.keyValuesOperator)
            .to.equal(verifyFixture.keyValuesOperator);
        expect(resOutput005.adSlots)
            .to.eql(verifyFixture.adSlots);
        expect(resOutput005.creatives)
            .to.eql(verifyFixture.creatives);
    });

    after('delete strategy', function(done) {
        request(targetServer)
            .del(util.format(
                targetEndpoint.strategyDelete, resOutput005.id
            )
            )
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    after('delete campaign', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.campaignDelete, resOutput004.id))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    after('delete insertion-order', function(done) {
        request(targetServer)
            .del(util.format(
                targetEndpoint.insertionOrderDelete, resOutput003.id
            )
            )
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    after('delete advertiser', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.advertiserDelete, resOutput002.id))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    after('delete media-group', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.mediaGroupDelete, resOutput001.id))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });
});
