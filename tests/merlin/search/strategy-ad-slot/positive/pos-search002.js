'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const moment = require('moment');
const request = require('supertest-as-promised');
const util = require('util');
const validator = require('validator');

// runtime variables
const rootPath = process.env.ROOT_PATH;
const targetEndpoint = require(rootPath + '/config/merlin/endpoints');
const targetEnvironment =
    require(rootPath + '/config/merlin/' + process.env.NODE_ENV);
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const targetUser = usersTargetEnvironment.admin;
const merlinAuthHeaders = require(rootPath + '/helpers/merlin-auth-headers');
const requestTimeOut = 20000;
const timeStamp = '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');

// fixture(s)
// SSP
const mediaGroupFixture =
    require(rootPath + '/fixtures/common/media-group/create001');
const publisherFixture =
    require(rootPath + '/fixtures/common/publisher/create001');
const newsletterFixture =
    require(rootPath + '/fixtures/common/newsletter/create001');
const adSlotFixture =
    require(rootPath + '/fixtures/common/ad-slot/create002');
// DSP
const advertiserFixture =
    require(rootPath + '/fixtures/common/advertiser/create001');
const ioFixture =
    require(rootPath + '/fixtures/common/insertion-order/create001');
const campaignFixture =
    require(rootPath + '/fixtures/common/campaign/create002');
const strategyFixture =
    require(rootPath + '/fixtures/common/strategy/create001');
const setupFixture006 =
    require(rootPath + '/fixtures/common/creative/create006');

// shared test variable(s)
let authHeaders;
let res012;
let res013;
let resText001;
let resText002;
let resText003;
let resText004;
let resText005;
let resText006;
let resText007;
let resText008;
let resText010;
let resText013;
let resOutput001;
let resOutput002;
let resOutput003;
let resOutput004;
let resOutput005;
let resOutput006;
let resOutput007;
let resOutput008;
let resOutput010;
let resText011;
let resText012;
let resOutput011;
let sendBody001;
let sendBody002;
let sendBody003;
let sendBody004;
let sendBody005;
let sendBody006;
let sendBody007;
let sendBody008;
let sendBody011;
let sendBody012;

describe('{{MERLIN}} /search/strategy/ad-slot >>> ' +
    '(+) ad-slot - one linked strategy >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('generate auth headers', (done) => {
        // generate auth headers
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then((headers) => {
            authHeaders = headers;
            done();
        });
    });

    before('create media-group - minimum required fields', (done) => {

        sendBody001 = Object.assign({}, mediaGroupFixture);

        // assign name to media-group
        sendBody001.name = 'mda-grp@' + timeStamp;

        request(targetServer)
            .post(util.format(targetEndpoint.mediaGroupCreate))
            .set(authHeaders)
            .send(sendBody001)
            .then((res) => {
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
            .catch((err) => {
                done(err);
            });
    });

    before('create publisher - minimum required fields', (done) => {

        sendBody002 = Object.assign({}, publisherFixture);

        // assign name and media group to publisher
        sendBody002.name = 'pub@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');
        sendBody002.mediaGroup = resOutput001.id;

        request(targetServer)
            .post(util.format(targetEndpoint.publisherCreate))
            .set(authHeaders)
            .send(sendBody002)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText002 = JSON.parse(res.text);
                resOutput002 = resText002.output;

                // spot check response
                expect(/^[a-f0-9]{32}$/.test(resOutput002.id))
                    .to.be.true;
                expect(resOutput002.name)
                    .to.have.length.of.at.most(255);
                expect(resOutput002.name)
                    .to.equal(sendBody002.name);
                expect(resOutput002.mediaGroup)
                    .to.equal(sendBody002.mediaGroup);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    before('create newsletter - minimum required fields', (done) => {

        sendBody003 = Object.assign({}, newsletterFixture);

        // assign name and publisher to newsletter
        sendBody003.name = 'news@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');
        sendBody003.publisher = resOutput002.id;

        request(targetServer)
            .post(util.format(targetEndpoint.newsletterCreate))
            .set(authHeaders)
            .send(sendBody003)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText003 = JSON.parse(res.text);
                resOutput003 = resText003.output;

                // spot check response
                expect(/^[a-f0-9]{32}$/.test(resOutput003.id)).to.be.true;
                expect(resOutput003.name).to.have.length.of.at.most(48);
                expect(resOutput003.name).to.equal(sendBody003.name);
                expect(resOutput003.publisher).to.equal(sendBody003.publisher);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    before('create ad-slot - all valid fields', (done) => {

        sendBody004 = Object.assign({}, adSlotFixture);

        // assign name and newsletter to ad-slot
        sendBody004.name = 'ads@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');
        sendBody004.newsletter = resOutput003.id;
        sendBody004.mediaType = 'newsletter';

        request(targetServer)
            .post(util.format(targetEndpoint.adSlotCreate))
            .set(authHeaders)
            .send(sendBody004)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText004 = JSON.parse(res.text);
                resOutput004 = resText004.output;

                // spot check response
                expect(resOutput004.publisher).to.equal(resOutput002.id);
                expect(resOutput004.newsletter).to.equal(resOutput003.id);
                expect(resOutput004.type).to.equal(sendBody004.type);
                expect(resOutput004.name).to.equal(sendBody004.name);
                expect(resOutput004.mediaType).to.equal(sendBody004.mediaType);
                expect(resOutput004.sspControl.exchangeAllow)
                    .to.equal(sendBody004.sspControl.exchangeAllow);
                expect(resOutput004.sspControl.exchangeFloor)
                    .to.equal(sendBody004.sspControl.exchangeFloor);
                expect(resOutput004.sspControl.userMatchAllow).to.equal(null);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    // Demand Side - create strategy
    before('create advertiser', (done) => {
        sendBody005 = Object.assign({}, advertiserFixture);
        sendBody005.name += timeStamp;

        // assign owner
        sendBody005.owner.type = 'Media Group';
        sendBody005.owner.id = resOutput001.id;

        request(targetServer)
            .post(util.format(targetEndpoint.advertiserCreate))
            .set(authHeaders)
            .send(sendBody005)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText005 = JSON.parse(res.text);
                resOutput005 = resText005.output;

                // spot check response
                expect(/^[a-f0-9]{32}$/.test(resOutput005.id)).to.be.true;
                expect(resOutput005.name).to.have.length.of.at.most(255);
                expect(resOutput005.owner.id).to.equal(sendBody005.owner.id);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    before('create insertion-order', (done) => {
        sendBody006 = Object.assign({}, ioFixture);
        sendBody006.name += timeStamp;

        // assign advertiser
        sendBody006.advertiser = resOutput005.id;

        request(targetServer)
            .post(util.format(targetEndpoint.insertionOrderCreate))
            .set(authHeaders)
            .send(sendBody006)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText006 = JSON.parse(res.text);
                resOutput006 = resText006.output;

                // spot check response
                expect(validator.isInt(resOutput006.id + '')).to.be.true;
                expect(resOutput006.name).to.have.length.of.at.most(128);
                expect(/^[a-f0-9]{32}$/.test(resOutput006.admin.hash))
                    .to.be.true;
                expect(resOutput006.advertiser)
                    .to.equal(sendBody006.advertiser);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    before('create campaign', (done) => {
        sendBody007 = Object.assign({}, campaignFixture);
        sendBody007.name += timeStamp;
        sendBody007.system = 'ssp';
        sendBody007.type = 'newsletter';
        sendBody007.demandType = 'direct';
        sendBody007.budgetType = 'currency';
        sendBody007.pricingModel = 'CPM';
        sendBody007.clearingMethod = '1stPrice';

        // assign insertion-order
        sendBody007.insertionOrder = resOutput006.id;

        request(targetServer)
            .post(util.format(targetEndpoint.campaignCreate))
            .set(authHeaders)
            .send(sendBody007)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText007 = JSON.parse(res.text);
                resOutput007 = resText007.output;

                // spot check response
                expect(/^[a-f0-9]{32}$/.test(resOutput007.id)).to.be.true;
                expect(resOutput007.budgetType)
                    .to.be.oneOf(['currency', 'impressions']);
                expect(validator.isInt(resOutput007.refId + '')).to.be.true;
                expect(resOutput007.ecpm).to.be.a('number');
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    before('create strategy', (done) => {
        sendBody008 = Object.assign({}, strategyFixture);
        sendBody008.name += timeStamp;

        // assign campaign
        sendBody008.campaign = resOutput007.id;

        request(targetServer)
            .post(util.format(targetEndpoint.strategyCreate))
            .set(authHeaders)
            .send(sendBody008)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText008 = JSON.parse(res.text);
                resOutput008 = resText008.output;

                // strategy and adslot should have same media type
                expect(resOutput004.mediaType).to.equal(resOutput008.mediaType);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    before('create test creative - url', function(done) {
        sendBody011 = {};
        Object.assign(
            sendBody011,
            setupFixture006
        );
        sendBody011.name += timeStamp;

        // assign advertiser
        sendBody011.advertiser = resOutput005.id;

        request(targetServer)
            .post(util.format(targetEndpoint.creativeCreate))
            .set(authHeaders)
            .send(sendBody011)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText011 = JSON.parse(res.text);
                resOutput011 = resText011.output;

                // spot check response
                expect(validator.isInt(resOutput011.refId + '')).to.be.true;
                expect(resOutput011.name).to.have.length.of.at.most(255);
                expect(/^[a-f0-9]{32}$/.test(resOutput011.advertiser))
                    .to.be.true;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });


    before('strategy - link creatives', function(done) {
        sendBody012 = {};
        sendBody012.version = resOutput008.version;

        // assign creatives
        sendBody012.creatives = [
            resOutput011.id
        ];

        request(targetServer)
            .post(util.format(
                targetEndpoint.strategyLinkCreatives, resOutput008.id
            )
            )
            .set(authHeaders)
            .send(sendBody012)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res012 = res;
                resText012 = JSON.parse(res.text);
                // resOutput012 = resText012.output;

                // check spot response
                expect(res012.status).to.equal(200);
                expect(resText012.notices).to.not.exist;
                expect(resText012.errors).to.not.exist;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('link strategy to ad-slot', (done) => {
        let payload = {
            'version': resOutput004.version,
            'strategies': [resOutput008.id]
        };
        request(targetServer)
            .post(
                util.format(
                    targetEndpoint.adSlotLinkStrategies, resOutput004.id
                )
            )
            .send(payload)
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res013 = res;
                resText013 = JSON.parse(res.text);

                // check spot response
                expect(res013.status).to.equal(200);
                expect(resText013.notices).to.not.exist;
                expect(resText013.errors).to.not.exist;
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    before('search linked strategies', (done) => {
        request(targetServer)
            .get(
                util.format(
                    targetEndpoint.searchStrategyAdSlot, resOutput004.id
                )
            )
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                resText010 = JSON.parse(res.text);
                resOutput010 = resText010.output;
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('notices and errors should not exist', () => {
        expect(resText010.notices).to.not.exist;
        expect(resText010.errors).to.not.exist;
    });

    it('should have a linked strategy', () => {
        expect(resOutput010).to.have.lengthOf(1);
    });

    it('response should match linked strategy', () => {
        expect(resOutput010[0].adSlot).to.equal(resOutput004.id);
        expect(resOutput010[0].id).to.equal(resOutput008.id);
        expect(resOutput010[0].refId).to.equal(resOutput008.refId);
        expect(resOutput010[0].campaign).to.equal(resOutput008.campaign);
        expect(resOutput010[0].advertiser).to.equal(resOutput008.advertiser);
        expect(resOutput010[0].name).to.equal(resOutput008.name);
        expect(resOutput010[0].externalId).to.equal(resOutput008.externalId);
        expect(resOutput010[0].mediaType).to.equal(resOutput008.mediaType);
        expect(resOutput010[0].status).to.equal(resOutput008.status);
        expect(resOutput010[0].pricingModel)
            .to.equal(resOutput008.pricingModel);
        expect(resOutput010[0].pacing).to.equal(resOutput008.pacing);
        expect(resOutput010[0].startDate).to.equal(resOutput008.startDate);
        expect(resOutput010[0].endDate).to.equal(resOutput008.endDate);
        expect(resOutput010[0].pace).to.equal(resOutput008.pace);
    });

    after('delete strategy', (done) => {
        request(targetServer)
            .del(util.format(
                targetEndpoint.strategyDelete, resOutput008.id
            )
            )
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    after('delete campaign', (done) => {
        request(targetServer)
            .del(util.format(targetEndpoint.campaignDelete, resOutput007.id))
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    after('delete insertion-order', (done) => {
        request(targetServer)
            .del(util.format(
                targetEndpoint.insertionOrderDelete, resOutput006.id
            )
            )
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    after('delete advertiser', (done) => {
        request(targetServer)
            .del(util.format(targetEndpoint.advertiserDelete, resOutput005.id))
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    after('delete ad-slot', (done) => {
        request(targetServer)
            .del(util.format(targetEndpoint.adSlotDelete, resOutput004.id))
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    after('delete newsletter', (done) => {
        request(targetServer)
            .del(util.format(targetEndpoint.newsletterDelete, resOutput003.id))
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    after('delete publisher', (done) => {
        request(targetServer)
            .del(util.format(targetEndpoint.publisherDelete, resOutput002.id))
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    after('delete media-group', (done) => {
        request(targetServer)
            .del(util.format(targetEndpoint.mediaGroupDelete, resOutput001.id))
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });
});
