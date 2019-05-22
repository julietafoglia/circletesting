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
const testFixture =
    require(rootPath + '/fixtures/common/creative/create001');
const verifyFixture =
    require(rootPath + '/fixtures/common/creative/create001-verify');

// shared test variable(s)
let authHeaders;
let res003;
let resText001;
let resText002;
let resText003;
let resOutput001;
let resOutput002;
let resOutput003;
let sendBody001;
let sendBody002;
let sendBody003;

describe('{{MERLIN}} <SMOKE> /creative/{id details} @ADMIN >>> ' +
    '(+) body - minimum required - url file >>>', function() {

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

    before('create creative - minimum required - url', function(done) {
        sendBody003 = {};
        Object.assign(
            sendBody003,
            testFixture
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
                res003 = res;
                resText003 = JSON.parse(res.text);
                resOutput003 = resText003.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 201', function() {
        expect(res003.status).to.equal(201);
    });

    it('notices and errors should not exist', function() {
        expect(resText003.notices).to.not.exist;
        expect(resText003.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(validator.isInt(resOutput003.version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.id)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.advertiser)).to.be.true;
        expect(validator.isInt(resOutput003.refId + '')).to.be.true;
        expect(resOutput003.status).to.be.oneOf([
            'active', 'inactive', 'pending', 'rejected', 'deleted'
        ]);
        expect(resOutput003.type).to.be.oneOf([
            'image', 'marquee', 'left', 'right', 'video_poster', 'flash'
        ]);
        expect(resOutput003.name).to.have.length.of.at.most(255);
        if (resOutput003.externalId !== null) {
            expect(resOutput003.externalId).to.have.length.of.at.most(128);
        }
        expect(validator.isInt(resOutput003.width + '')).to.be.true;
        expect(validator.isInt(resOutput003.height + '')).to.be.true;
        expect(resOutput003.isServices).to.be.a('boolean');
        if (resOutput003.frequencyCapPeriod !== null) {
            expect(resOutput003.frequencyCapPeriod).to.be.oneOf([
                'minute', 'hourly', 'daily', 'weekly', 'monthly'
            ]);
        }
        if (resOutput003.frequencyCapCount !== null) {
            expect(validator.isInt(resOutput003.frequencyCapCount + ''))
                .to.be.true;
        }
        if (resOutput003.priority !== null) {
            expect(resOutput003.priority).to.be.oneOf(['low', 'normal']);
        }
        expect(resOutput003.isArchived).to.be.a('boolean');
        if (resOutput003.rejectReason !== null) {
            expect(resOutput003.rejectReason).to.have.length.of.at.most(255);
        }
        expect(resOutput003.bidderVisibility).to.be.a('boolean');
        expect(validator.isURL(resOutput003.mediaUrl)).to.be.true;
        if (resOutput003.urlCachedCopy !== null) {
            expect(validator.isURL(resOutput003.urlCachedCopy)).to.be.true;
        }
        expect(validator.isURL(resOutput003.clickUrl)).to.be.true;
        if (resOutput003.iabAttributes !== null) {
            expect(resOutput003.iabAttributes).to.be.an('array');
        }
        if (resOutput003.urlTracking1 !== null) {
            expect(validator.isURL(resOutput003.urlTracking1)).to.be.true;
        }
        if (resOutput003.urlTracking2 !== null) {
            expect(validator.isURL(resOutput003.urltracking2)).to.be.true;
        }
        if (resOutput003.hostedTag !== null) {
            expect(resOutput003.hostedTag).to.have.length.of.at.most(1024);
        }
        // created and modified
        expect(validator.isISO8601(resOutput003.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput003.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.modifiedBy)).to.be.true;
    });

    it('response object key values should match test object', function() {
        expect(resOutput003.version)
            .to.equal(verifyFixture.version);
        expect(resOutput003.advertiser)
            .to.equal(sendBody003.advertiser);
        expect(resOutput003.status)
            .to.equal(verifyFixture.status);
        expect(resOutput003.type)
            .to.equal(verifyFixture.type);
        expect(resOutput003.name)
            .to.equal(verifyFixture.name);
        expect(resOutput003.externalId)
            .to.equal(verifyFixture.externalId);
        expect(resOutput003.width)
            .to.equal(verifyFixture.width);
        expect(resOutput003.height)
            .to.equal(verifyFixture.height);
        expect(resOutput003.isServices)
            .to.equal(resOutput003.isServices);
        expect(resOutput003.frequencyCapPeriod)
            .to.equal(verifyFixture.frequencyCapPeriod);
        expect(resOutput003.frequencyCapCount)
            .to.equal(verifyFixture.frequencyCapCount);
        expect(resOutput003.priority)
            .to.equal(verifyFixture.priority);
        expect(resOutput003.isArchived)
            .to.equal(verifyFixture.isArchived);
        expect(resOutput003.rejectReason)
            .to.equal(verifyFixture.rejectReason);
        expect(resOutput003.bidderVisibility)
            .to.equal(verifyFixture.bidderVisibility);
        expect(resOutput003.iabAttributes)
            .to.eql(verifyFixture.iabAttributes);
        expect(resOutput003.urltracking1)
            .to.equal(verifyFixture.urltracking1);
        expect(resOutput003.urltracking2)
            .to.equal(verifyFixture.urltracking2);
        expect(resOutput003.hostedTag)
            .to.equal(verifyFixture.hostedTag);
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
