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
const setupFixture006 =
    require(rootPath + '/fixtures/common/creative/create006');
const setupFixture007 =
    require(rootPath + '/fixtures/common/creative/create007');

// shared test variable(s)
let authHeaders;
let res012;
let resText001;
let resText002;
let resText003;
let resText004;
let resText005;
let resText006;
let resText007;
let resText008;
let resText009;
let resText010;
let resText011;
let resText012;
let resOutput001;
let resOutput002;
let resOutput003;
let resOutput004;
let resOutput005;
let resOutput006;
let resOutput007;
let resOutput008;
let resOutput009;
let resOutput010;
let resOutput011;
let sendBody001;
let sendBody002;
let sendBody003;
let sendBody004;
let sendBody005;
let sendBody006;
let sendBody007;
let sendBody008;
let sendBody009;
let sendBody010;
let sendBody011;
let sendBody012;

describe('{{MERLIN}} /strategy/link-creatives/{id} @ADMIN >>> ' +
    '(-) body - media-group - missing required - ' +
    'array of creatives >>>', function() {

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
                expect(validator.isInt(resOutput005.refId + '')).to.be.true;
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

    before('create first test creative - url', function(done) {
        sendBody006 = {};
        Object.assign(
            sendBody006,
            setupFixture006
        );
        sendBody006.name += timeStamp;

        // assign advertiser
        sendBody006.advertiser = resOutput002.id;

        request(targetServer)
            .post(util.format(targetEndpoint.creativeCreate))
            .set(authHeaders)
            .send(sendBody006)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText006 = JSON.parse(res.text);
                resOutput006 = resText006.output;

                // spot check response
                expect(validator.isInt(resOutput006.refId + '')).to.be.true;
                expect(resOutput006.name).to.have.length.of.at.most(255);
                expect(/^[a-f0-9]{32}$/.test(resOutput006.advertiser))
                    .to.be.true;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('approve first test creative - url', function(done) {
        sendBody007 = {};
        sendBody007.version = resOutput006.version;

        request(targetServer)
            .post(util.format(
                targetEndpoint.creativeApprove,
                resOutput006.id, resOutput006.approvalKey
            )
            )
            .set(authHeaders)
            .send(sendBody007)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                resText007 = JSON.parse(res.text);
                resOutput007 = resText007.output;

                // spot check response
                expect(validator.isInt(resOutput007.refId + '')).to.be.true;
                expect(resOutput007.name).to.have.length.of.at.most(255);
                expect(/^[a-f0-9]{32}$/.test(resOutput007.advertiser))
                    .to.be.true;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create second test creative - base 64 image', function(done) {
        sendBody008 = {};
        Object.assign(
            sendBody008,
            setupFixture007
        );
        sendBody008.name += timeStamp;

        // assign advertiser
        sendBody008.advertiser = resOutput002.id;

        request(targetServer)
            .post(util.format(targetEndpoint.creativeCreate))
            .set(authHeaders)
            .send(sendBody008)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText008 = JSON.parse(res.text);
                resOutput008 = resText008.output;

                // spot check response
                expect(validator.isInt(resOutput008.refId + '')).to.be.true;
                expect(resOutput008.name).to.have.length.of.at.most(255);
                expect(/^[a-f0-9]{32}$/.test(resOutput008.advertiser))
                    .to.be.true;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('approve second test creative - base 64 image', function(done) {
        sendBody009 = {};
        sendBody009.version = resOutput008.version;

        request(targetServer)
            .post(util.format(
                targetEndpoint.creativeApprove,
                resOutput008.id, resOutput008.approvalKey
            )
            )
            .set(authHeaders)
            .send(sendBody009)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                resText009 = JSON.parse(res.text);
                resOutput009 = resText009.output;

                // spot check response
                expect(validator.isInt(resOutput009.refId + '')).to.be.true;
                expect(resOutput009.name).to.have.length.of.at.most(255);
                expect(/^[a-f0-9]{32}$/.test(resOutput009.advertiser))
                    .to.be.true;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('creative third test creative - base 64 image', function(done) {
        sendBody010 = {};
        Object.assign(
            sendBody010,
            setupFixture007
        );
        sendBody010.name += timeStamp;

        // assign advertiser
        sendBody010.advertiser = resOutput002.id;

        request(targetServer)
            .post(util.format(targetEndpoint.creativeCreate))
            .set(authHeaders)
            .send(sendBody010)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText010 = JSON.parse(res.text);
                resOutput010 = resText010.output;

                // spot check response
                expect(validator.isInt(resOutput010.refId + '')).to.be.true;
                expect(resOutput010.name).to.have.length.of.at.most(255);
                expect(/^[a-f0-9]{32}$/.test(resOutput010.advertiser))
                    .to.be.true;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('approve third test creative - base 64 image', function(done) {
        sendBody011 = {};
        sendBody011.version = resOutput010.version;

        request(targetServer)
            .post(util.format(
                targetEndpoint.creativeApprove,
                resOutput010.id, resOutput010.approvalKey
            )
            )
            .set(authHeaders)
            .send(sendBody011)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

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

    before('strategy - link creatives - ' +
        'missing required - array of creatives', function(done) {

        sendBody012 = {};
        sendBody012.version = resOutput005.version;

        request(targetServer)
            .post(util.format(
                targetEndpoint.strategyLinkCreatives, resOutput005.id
            )
            )
            .set(authHeaders)
            .send(sendBody012)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(400);

                // assign shared test variable(s)
                res012 = res;
                resText012 = JSON.parse(res.text);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 400', function() {
        expect(res012.status).to.equal(400);
    });

    it('errors should include required version', function() {
        expect(resText012.errors).to.deep.include.members([
            {'id': 'E1001', 'code':'REQ', 'details': 'creatives'}
        ]);
    });

    after('delete first creative', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.creativeDelete, resOutput006.id))
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

    after('delete second creative', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.creativeDelete, resOutput008.id))
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

    after('delete third creative', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.creativeDelete, resOutput010.id))
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

    after('delete strategy', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.strategyDelete, resOutput005.id))
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
