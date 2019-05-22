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
const setupFixture005 =
    require(rootPath + '/fixtures/common/strategy/create001');

// shared test variable(s)
let authHeaders;
let res006;
let resText001;
let resText002;
let resText003;
let resText004;
let resText005;
let resText006;
let resOutput001;
let resOutput002;
let resOutput003;
let resOutput004;
let resOutput005;
let resOutput006;
let sendBody001;
let sendBody002;
let sendBody003;
let sendBody004;
let sendBody005;
let sendBody006;

describe('{{MERLIN}} <SMOKE> /strategy/{id save} @ADMIN >>> ' +
    '(+) body - media-group - save new days and hours values >>>', function() {

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
            setupFixture005
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
                resText005 = JSON.parse(res.text);
                resOutput005 = resText005.output;

                // spot check response
                expect(validator.isInt(resOutput005.refId + ''))
                    .to.be.true;
                expect(resOutput005.name).to.have.length.of.at.most(255);
                expect(/^[a-f0-9]{32}$/.test(resOutput005.advertiser))
                    .to.be.true;
                expect(/^[a-f0-9]{32}$/.test(resOutput005.campaign))
                    .to.be.true;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('save strategy - save new days and hours values', function(done) {
        sendBody006 = {};
        sendBody006.version = resOutput005.version;
        sendBody006.name = resOutput005.name + '@v2';

        sendBody006.dayTargetingType = 'include';
        sendBody006.days = [0, 1, 2, 3, 6];
        sendBody006.hours = [0, 1, 2, 3, 4, 5, 6, 21, 22, 23, 23];

        request(targetServer)
            .post(util.format(
                targetEndpoint.strategySave, resOutput005.id
            )
            )
            .set(authHeaders)
            .send(sendBody006)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res006 = res;
                resText006 = JSON.parse(res.text);
                resOutput006 = resText006.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('reponse have status of 200', function() {
        expect(res006.status).to.equal(200);
    });

    it('notices and errors should not exist', function() {
        expect(resText006.notices).to.not.exist;
        expect(resText006.errors).to.not.exist;
    });

    it('version should be request object version + 1', function() {
        expect(resOutput006.version).to.equal(
            resOutput005.version + 1
        );
    });

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput006.id)).to.be.true;
        expect(validator.isInt(resOutput006.refId + '')).to.be.true;
        expect(validator.isInt(resOutput006.version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput006.advertiser)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput006.campaign)).to.be.true;
        expect(resOutput006.name).to.have.length.of.at.most(255);
        if (resOutput006.externalId !== null) {
            expect(resOutput006.externalId).to.have.length.of.at.most(128);
        }
        if (resOutput006.mediaType !== null) {
            expect(resOutput006.mediaType).to.be.oneOf([
                'dedicated', 'display', 'newsletter', 'takeover'
            ]);
        }
        if (resOutput006.status !== null) {
            expect(resOutput006.status)
                .to.be.oneOf(['active', 'inactive', 'paused']);
        }
        if (resOutput006.budgetType !== null &&
            resOutput006.budgetType !== undefined) {

            expect(resOutput006.budgetType)
                .to.be.oneOf(['currency', 'impressions']);
        }
        if (resOutput006.pricingModel !== null) {
            expect(resOutput006.pricingModel)
                .to.be.oneOf(['CPM', 'CPC', 'CPA']);
        }
        if (resOutput006.clearingMethod !== null) {
            expect(resOutput006.clearingMethod)
                .to.be.oneOf(['1stPrice', '2ndPrice']);
        }
        if (resOutput006.bidAmount !== null &&
            resOutput006.bidAmount !== undefined) {

            expect(/^(\d{1,10}(\.\d{0,2})?)$/
                .test(resOutput006.bidAmount)).to.be.true;
        }
        if (resOutput006.goal !== null) {
            expect(resOutput006.goal).to.be.oneOf([
                'none', 'MaxCTR', 'MaxConversionRate', 'targetCPM',
                'targetCPC', 'targetCPA'
            ]);
        }
        if (resOutput006.ecpm !== null) {
            expect(/^(\d{1,10}(\.\d{0,2})?)$/
                .test(resOutput006.ecpm)).to.be.true;
        }
        if (resOutput006.minCpm !== null) {
            expect(/^(\d{1,10}(\.\d{0,2})?)$/
                .test(resOutput006.minCpm)).to.be.true;
        }
        if (resOutput006.maxCpm !== null) {
            expect(/^(\d{1,10}(\.\d{0,2})?)$/
                .test(resOutput006.maxCpm)).to.be.true;
        }
        if (resOutput006.pacing !== null) {
            expect(resOutput006.pacing)
                .to.be.oneOf(['asap', 'even', 'unlimited']);
        }
        expect(resOutput006.isVideo).to.be.be.a('boolean');
        expect(resOutput006.isServer2Server).to.be.be.a('boolean');
        expect(resOutput006.hasLinkedAds).to.be.be.a('boolean');
        expect(validator.isDate(resOutput006.startDate)).to.be.true;
        expect(validator.isDate(resOutput006.endDate)).to.be.true;
        if (resOutput006.budget !== null) {
            expect(/^(\d{1,18}(\.\d{0,2})?)$/
                .test(resOutput006.budget)).to.be.true;
        }
        if (resOutput006.dailyCap !== null) {
            expect(/^(\d{1,18}(\.\d{0,2})?)$/
                .test(resOutput006.dailyCap)).to.be.true;
        }
        if (resOutput006.spend !== null) {
            expect(/^(\d{1,18}(\.\d{0,2})?)$/
                .test(resOutput006.spend)).to.be.true;
        }
        if (resOutput006.impressions !== null) {
            expect(validator.isInt(resOutput006.impressions + ''))
                .to.be.true;
        }
        if (resOutput006.clicks !== null) {
            expect(validator.isInt(resOutput006.clicks + ''))
                .to.be.true;
        }
        if (resOutput006.conversions !== null) {
            expect(validator.isInt(resOutput006.conversions + ''))
                .to.be.true;
        }
        expect(/^(\d{1,16}(\.\d{0,2})?)$/.test(resOutput006.pace))
            .to.be.true;
        if (resOutput006.trackingUrl1 !== null) {
            expect(resOutput006.trackingUrl1).to.have.length.of.at.most(255);
        }
        if (resOutput006.trackingUrl2 !== null) {
            expect(resOutput006.trackingUrl2).to.have.length.of.at.most(255);
        }
        if (resOutput006.positionTargeting !== null) {
            expect(resOutput006.positionTargeting)
                .to.be.oneOf([
                    'unknown', 'above the fold', 'below the fold'
                ]);
        }
        expect(resOutput006.targetUsOnly).to.be.a('boolean');
        if (resOutput006.geoTargetingType !== null) {
            expect(resOutput006.geoTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput006.geos !== null) {
            expect(resOutput006.geos).to.be.an('object');
        }
        if (resOutput006.postalCodes !== null) {
            expect(resOutput006.postalCodes).to.be.an('array');
        }
        if (resOutput006.bundles !== null) {
            expect(resOutput006.bundles).to.be.an('array');
        }
        if (resOutput006.categoryTargetingType !== null) {
            expect(resOutput006.categoryTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput006.categories !== null) {
            expect(resOutput006.categories).to.be.an('array');
        }
        if (resOutput006.inventoryTargetingType !== null) {
            expect(resOutput006.inventoryTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput006.inventoryTargeting !== null) {
            expect(resOutput006.inventoryTargeting).to.be.an('object');
        }
        if (resOutput006.deviceTypeTargetingType !== null) {
            expect(resOutput006.deviceTypeTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput006.deviceTypes !== null) {
            expect(resOutput006.deviceTypes).to.be.an('array');
        }
        if (resOutput006.deviceMakerTargetingType !== null) {
            expect(resOutput006.deviceMakerTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput006.deviceMakers !== null) {
            expect(resOutput006.deviceMakers).to.be.an('array');
        }
        if (resOutput006.operatingSystemTargetingType !== null) {
            expect(resOutput006.operatingSystemTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput006.operatingSystems !== null) {
            expect(resOutput006.operatingSystems).to.be.an('array');
        }
        if (resOutput006.browserTargetingType !== null) {
            expect(resOutput006.browserTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput006.browsers !== null) {
            expect(resOutput006.browsers).to.be.an('array');
        }
        if (resOutput006.audienceTargeting !== null) {
            expect(resOutput006.audienceTargeting).to.be.an('object');
        }
        if (resOutput006.liveramp !== null) {
            expect(resOutput006.liveramp).to.be.an('object');
        }
        if (resOutput006.dataProviderSegments !== null) {
            expect(resOutput006.dataProviderSegments).to.be.an('object');
        }
        if (resOutput006.dayTargetingType !== null) {
            expect(resOutput006.dayTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput006.days !== null) {
            expect(resOutput006.days).to.be.an('object');
        }
        if (resOutput006.hours !== null) {
            expect(resOutput006.hours).to.be.an('object');
        }
        if (resOutput006.ispTargetingType !== null) {
            expect(resOutput006.ispTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput006.isps !== null) {
            expect(resOutput006.isps).to.be.an('array');
        }
        if (resOutput006.cookieSegmentTargetingType !== null) {
            expect(resOutput006.cookieSegmentTargetingType)
                .to.be.oneOf(['include', 'exclude']);
        }
        if (resOutput006.cookieSegments !== null) {
            expect(resOutput006.cookieSegments).to.be.an('array');
        }
        if (resOutput006.placementId !== null) {
            expect(resOutput006.placementId)
                .to.have.length.of.at.most(1024);
        }
        if (resOutput006.listId !== null) {
            expect(resOutput006.listId).to.be.an('array');
        }
        if (resOutput006.domainTargetingType !== null) {
            expect(resOutput006.domainTargetingType)
                .to.be.oneOf(['include', 'exclude', 'inherit']);
        }
        if (resOutput006.domains !== null) {
            expect(resOutput006.domains).to.be.an('array');
        }
        if (resOutput006.keyValues !== null) {
            expect(resOutput006.keyValues).to.be.an('array');
        }
        if (resOutput006.keyValuesTargetingType !== null) {
            expect(resOutput006.keyValuesTargetingType)
                .to.be.oneOf(['include', 'exclude', null]);
        }
        if (resOutput006.keyValuesOperator !== null) {
            expect(resOutput006.keyValuesOperator)
                .to.be.oneOf(['any', 'all']);
        }
        if (resOutput006.adSlots !== null) {
            expect(resOutput006.adSlots).to.be.an('array');
        }
        if (resOutput006.creatives !== null) {
            expect(resOutput006.creatives).to.be.an('array');
        }
        // created and modified
        expect(validator.isISO8601(resOutput006.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput006.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput006.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput006.modifiedBy)).to.be.true;
    });

    it('response object key values should match test object', function() {
        expect(resOutput006.name).to.equal(resOutput005.name + '@v2');
        expect(resOutput006.dayTargetingType)
            .to.equal(sendBody006.dayTargetingType);
        expect(resOutput006.days)
            .to.have.property(sendBody006.days[0]);
        expect(resOutput006.days)
            .to.have.property(sendBody006.days[3]);
        expect(resOutput006.hourTargetingType)
            .to.equal(sendBody006.hourTargetingType);
        expect(resOutput006.hours)
            .to.have.property(sendBody006.hours[0]);
        expect(resOutput006.hours)
            .to.have.property(sendBody006.hours[5]);
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
