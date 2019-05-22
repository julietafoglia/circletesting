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
    require(rootPath + '/fixtures/common/publisher/create001');
const testFixture =
    require(rootPath + '/fixtures/common/newsletter/create002');

// shared test variable(s)
let authHeaders;
let res003;
let resOutput001;
let resOutput002;
let resOutput003;
let resText001;
let resText002;
let resText003;
let sendBody001;
let sendBody002;
let sendBody003;

describe('{{MERLIN}} <SMOKE> /newsletter {create} >>> ' +
    '(+) body - all valid fields >>>', function() {

    // set timeout for test suite
    this.timeout(requestTimeOut);

    before('generate auth headers', function(done) {
        // generate auth headers
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('create media group - minimum required fields', function(done) {

        sendBody001 = Object.assign({}, setupFixture001);

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

    before('create publisher - minimum required fields', function(done) {

        sendBody002 = Object.assign({}, setupFixture002);

        // assign name and media-group to publisher
        sendBody002.name += timeStamp;
        sendBody002.mediaGroup = resOutput001.id;

        request(targetServer)
            .post(util.format(targetEndpoint.publisherCreate))
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
                expect(/^[a-f0-9]{32}$/.test(resOutput002.id))
                    .to.be.true;
                expect(resOutput002.name)
                    .to.have.length.of.at.most(255);
                expect(/^[a-f0-9]{32}$/.test(resOutput002.mediaGroup))
                    .to.be.true;
                expect(resOutput002.mediaGroup)
                    .to.equal(sendBody002.mediaGroup);
                expect(resOutput002.name)
                    .to.equal(sendBody002.name);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create newsletter - all valid fields', function(done) {

        sendBody003 = Object.assign({}, testFixture);

        // assign name and publisher to newsletter
        sendBody003.name += timeStamp;
        sendBody003.publisher = resOutput002.id;

        request(targetServer)
            .post(util.format(targetEndpoint.newsletterCreate))
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
        expect(/^[a-f0-9]{32}$/.test(resOutput003.id)).to.be.true;
        expect(validator.isInt(resOutput003.refId + '')).to.be.true;
        expect(validator.isInt(resOutput003.version + '')).to.be.true;
        expect(resOutput003.status).to.be.oneOf([
            'pending', 'inactive', 'active'
        ]);
        expect(/^[a-f0-9]{32}$/.test(resOutput003.publisher)).to.be.true;
        if (resOutput003.externalId != null) {
            expect(resOutput003.externalId).to.have.length.of.at.most(128);
        }
        expect(validator.isInt(resOutput003.category + '', {'min': 1}))
            .to.be.true;
        expect(resOutput003.secondaryCategories)
            .to.be.an('array');
        expect(resOutput003.name)
            .to.have.length.of.at.most(48);
        if (resOutput003.description != null) {
            expect(resOutput003.description).to.be.a('string');
        }
        if (resOutput003.tagsUrlPrefix != null) {
            expect(resOutput003.tagsUrlPrefix).to.have.length.of.at.most(128);
        }
        if (resOutput003.tagsUrlPrefixInvalid != null) {
            expect(resOutput003.tagsUrlPrefixInvalid).to.be.a('boolean');
        }
        expect(resOutput003.isSafeRtb)
            .to.be.a('boolean');
        expect(resOutput003.isSafeRtbV2)
            .to.be.a('boolean');
        expect(validator.isInt(resOutput003.estimatedInventory + ''))
            .to.be.true;
        // ssp control object
        expect(resOutput003.sspControl).to.be.an('object');
        if (resOutput003.sspControl.exchangeAllow !== null) {
            expect(resOutput003.sspControl.exchangeAllow)
                .to.be.a('boolean');
        }
        if (resOutput003.sspControl.rtbAllow !== null) {
            expect(resOutput003.sspControl.rtbAllow)
                .to.be.a('boolean');
        }
        if (resOutput003.sspControl.rtbTransparency !== null) {
            expect(resOutput003.sspControl.rtbTransparency)
                .to.be.a('boolean');
        }
        if (resOutput003.sspControl.rtbFloor !== null) {
            expect(/^(\d{1,10}\.?(\d{1,2})?)$/
                .test(resOutput003.sspControl.rtbFloor)).to.be.true;
        }
        if (resOutput003.sspControl.uniqueAds !== null) {
            expect(resOutput003.sspControl.uniqueAds).to.be.oneOf([
                'inherit', 'off', 'advertiser'
            ]);
        }
        if (resOutput003.sspControl.demandAllocationDirect !== null) {
            expect(validator.isInt(
                resOutput003.sspControl.demandAllocationDirect + ''
            )).to.be.true;
        }
        if (resOutput003.sspControl.demandAllocationHouse !== null) {
            expect(validator.isInt(
                resOutput003.sspControl.demandAllocationHouse + ''
            )).to.be.true;
        }
        if (resOutput003.sspControl.directoryExpose !== null) {
            expect(resOutput003.sspControl.directoryExpose)
                .to.be.a('boolean');
        }
        if (resOutput003.sspControl.directoryExposePublic !== null) {
            expect(resOutput003.sspControl.directoryExposePublic)
                .to.be.a('boolean');
        }
        // created and modified
        expect(validator.isISO8601(resOutput003.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput003.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.modifiedBy)).to.be.true;
    });

    it('response object key values should match test object', function() {
        expect(resOutput003.publisher)
            .to.equal(resOutput002.id);
        expect(resOutput003.category)
            .to.equal(sendBody003.category);
        expect(resOutput003.secondaryCategories)
            .to.eql(sendBody003.secondaryCategories);
        expect(resOutput003.name)
            .to.equal(sendBody003.name);
        expect(resOutput003.externalId)
            .to.equal(sendBody003.externalId);
        expect(resOutput003.description)
            .to.equal(sendBody003.description);
        expect(resOutput003.tagsUrlPrefix)
            .to.equal(sendBody003.tagsUrlPrefix);
        expect(resOutput003.estimatedInventory)
            .to.equal(sendBody003.estimatedInventory);
        // ssp-control object
        expect(resOutput003.sspControl.exchangeAllow)
            .to.equal(sendBody003.sspControl.exchangeAllow);
        expect(resOutput003.sspControl.exchangeFloor)
            .to.equal(sendBody003.sspControl.exchangeFloor);
        expect(resOutput003.sspControl.rtbAllow)
            .to.equal(sendBody003.sspControl.rtbAllow);
        expect(resOutput003.sspControl.rtbFloor)
            .to.equal(sendBody003.sspControl.rtbFloor);
        expect(resOutput003.sspControl.uniqueAds)
            .to.equal(sendBody003.sspControl.uniqueAds);
        expect(resOutput003.sspControl.userMatchAllow)
            .to.equal(sendBody003.sspControl.userMatchAllow);
        expect(resOutput003.sspControl.demandAllocationHouse)
            .to.equal(sendBody003.sspControl.demandAllocationHouse);
        expect(resOutput003.sspControl.demandAllocationDirect)
            .to.equal(sendBody003.sspControl.demandAllocationDirect);
        expect(resOutput003.sspControl.directoryExpose)
            .to.equal(sendBody003.sspControl.directoryExpose);
        expect(resOutput003.sspControl.directoryExposePublic)
            .to.equal(sendBody003.sspControl.directoryExposePublic);
    });

    after('delete newsletter', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.newsletterDelete, resOutput003.id))
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

    after('delete publisher', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.publisherDelete, resOutput002.id))
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

    after('delete media group', function(done) {
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
