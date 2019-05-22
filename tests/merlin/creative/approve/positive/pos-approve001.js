'use strict';

// vendor dependencies
const chai = require('chai');

const expect = chai.expect; // use bdd chai

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

// fixture(s)
const setupFixture001 =
    require(rootPath + '/fixtures/common/media-group/create001');
const setupFixture002 =
    require(rootPath + '/fixtures/common/advertiser/create001');
const setupFixture003 =
    require(rootPath + '/fixtures/common/creative/create002');

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

describe('{{MERLIN}} <SMOKE> /creative/approve/{id}/{approvalKey} @ADMIN >>> ' +
    '(+) body - basic verification - base 64 file >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('generate auth login headers', function(done) {
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

    before('create creative - base 64 file', function(done) {
        sendBody003 = {};
        Object.assign(
            sendBody003,
            setupFixture003
        );

        // assign advertiser
        sendBody003.advertiser = resOutput002.id;

        request(targetServer)
            .post(util.format(targetEndpoint.creativeCreate))
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
                expect(/^[a-f0-9]{32}$/.test(resOutput003.id)).to.be.true;
                expect(resOutput003.name).to.have.length.of.at.most(255);
                expect(/^[a-f0-9]{32}$/.test(resOutput003.advertiser))
                    .to.be.true;
                expect(resOutput003.isArchived).to.be.a('boolean');
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('reject creative', function(done) {
        sendBody004 = {};
        sendBody004.version = resOutput003.version;
        sendBody004.rejectReason = 'Digital monkies were harmed in the ' +
            'production of this creative';

        request(targetServer)
            .post(util.format(
                targetEndpoint.creativeReject, resOutput003.id,
                resOutput003.approvalKey
            )
            )
            .set(authHeaders)
            .send(sendBody004)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                resText004 = JSON.parse(res.text);
                resOutput004 = resText004.output;

                // spot check response
                expect(/^[a-f0-9]{32}$/.test(resOutput004.id)).to.be.true;
                expect(resOutput004.version).to.equal(
                    resOutput003.version + 1
                );
                expect(resOutput004.status).to.equal('rejected');
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('approve creative', function(done) {
        sendBody005 = {};
        sendBody005.version = resOutput004.version;

        request(targetServer)
            .post(util.format(
                targetEndpoint.creativeApprove, resOutput003.id,
                resOutput003.approvalKey
            )
            )
            .set(authHeaders)
            .send(sendBody005)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

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

    it('response should have status of 200', function() {
        expect(res005.status).to.equal(200);
    });

    it('notices and errors should not exist', function() {
        expect(resText005.notices).to.not.exist;
        expect(resText005.errors).to.not.exist;
    });

    it('version should be request object version + 1', function() {
        expect(resOutput005.version).to.equal(
            resOutput003.version + 1
        );
    });

    it('creative status should be active', function() {
        expect(resOutput005.status).to.equal('active');
    });

    it('response object property types should match spec', function() {
        expect(validator.isInt(resOutput005.version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005.id)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005.advertiser)).to.be.true;
        expect(validator.isInt(resOutput005.refId + '')).to.be.true;
        expect(resOutput005.status).to.be.oneOf([
            'active', 'inactive', 'pending', 'rejected', 'deleted'
        ]);
        expect(resOutput005.type).to.be.oneOf([
            'image', 'marquee', 'left', 'right', 'video_poster', 'flash'
        ]);
        expect(resOutput005.name).to.have.length.of.at.most(255);
        if (resOutput005.externalId !== null) {
            expect(resOutput005.externalId).to.have.length.of.at.most(128);
        }
        expect(validator.isInt(resOutput005.width + '')).to.be.true;
        expect(validator.isInt(resOutput005.height + '')).to.be.true;
        expect(resOutput005.isServices).to.be.a('boolean');
        if (resOutput005.frequencyCapPeriod !== null) {
            expect(resOutput005.frequencyCapPeriod).to.be.oneOf([
                'minute', 'hourly', 'daily', 'weekly', 'monthly'
            ]);
        }
        if (resOutput005.frequencyCapCount !== null) {
            expect(validator.isInt(resOutput005.frequencyCapCount + ''))
                .to.be.true;
        }
        if (resOutput005.priority !== null) {
            expect(resOutput005.priority).to.be.oneOf(['low', 'normal']);
        }
        expect(resOutput005.isArchived).to.be.a('boolean');
        if (resOutput005.rejectReason !== null) {
            expect(resOutput005.rejectReason).to.have.length.of.at.most(255);
        }
        expect(resOutput005.bidderVisibility).to.be.a('boolean');
        expect(validator.isURL(resOutput005.mediaUrl)).to.be.true;
        if (resOutput005.urlCachedCopy !== null) {
            expect(validator.isURL(resOutput005.urlCachedCopy)).to.be.true;
        }
        expect(validator.isURL(resOutput005.clickUrl)).to.be.true;
        if (resOutput005.iabAttributes !== null) {
            expect(resOutput005.iabAttributes).to.be.an('array');
        }
        if (resOutput005.urlTracking1 !== null) {
            expect(validator.isURL(resOutput005.urlTracking1)).to.be.true;
        }
        if (resOutput005.urlTracking2 !== null) {
            expect(validator.isURL(resOutput005.urlTracking2)).to.be.true;
        }
        if (resOutput005.hostedTag !== null) {
            expect(resOutput005.hostedTag).to.have.length.of.at.most(1024);
        }
        // created and modified
        expect(validator.isISO8601(resOutput005.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput005.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005.modifiedBy)).to.be.true;
    });

    it('response object key values should match test object', function() {
        expect(resOutput005.version)
            .to.equal(resOutput003.version + 1);
        expect(resOutput005.id)
            .to.equal(resOutput003.id);
        expect(resOutput005.advertiser)
            .to.equal(resOutput003.advertiser);
        expect(resOutput005.refId)
            .to.equal(resOutput003.refId);
        expect(resOutput005.status)
            .to.equal('active'); // check updated
        expect(resOutput005.type)
            .to.equal(resOutput003.type);
        expect(resOutput005.name)
            .to.equal(resOutput003.name);
        expect(resOutput005.externalId)
            .to.equal(resOutput003.externalId);
        expect(resOutput005.width)
            .to.equal(resOutput003.width);
        expect(resOutput005.height)
            .to.equal(resOutput003.height);
        expect(resOutput005.frequencyCapPeriod)
            .to.equal(resOutput003.frequencyCapPeriod);
        expect(resOutput005.frequencyCapCount)
            .to.equal(resOutput003.frequencyCapCount);
        expect(resOutput005.priority)
            .to.equal(resOutput003.priority);
        expect(resOutput005.isArchived)
            .to.equal(resOutput003.isArchived);
        expect(resOutput005.rejectReason)
            .to.equal(resOutput004.rejectReason);
        expect(resOutput005.bidderVisibility)
            .to.equal(resOutput003.bidderVisibility);
        expect(resOutput005.mediaUrl)
            .to.equal(resOutput003.mediaUrl);
        expect(resOutput005.urlCachedCopy)
            .to.equal(resOutput003.urlCachedCopy);
        expect(resOutput005.clickUrl)
            .to.equal(resOutput003.clickUrl);
        expect(resOutput005.iabAttributes)
            .to.eql(resOutput003.iabAttributes);
        expect(resOutput005.urltracking1)
            .to.equal(resOutput003.urltracking1);
        expect(resOutput005.urltracking2)
            .to.equal(resOutput003.urltracking2);
        expect(resOutput005.approvalKey)
            .to.equal(resOutput003.approvalKey);
        expect(resOutput005.hostedTag)
            .to.equal(resOutput003.hostedTag);
    });

    after('delete creative', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.creativeDelete, resOutput003.id))
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
