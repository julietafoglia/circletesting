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

// fixture(s)
const setupFixture001 =
    require(rootPath + '/fixtures/common/media-group/create001');
const setupFixture002 =
    require(rootPath + '/fixtures/common/publisher/create002');
const testFixture =
    require(rootPath + '/fixtures/common/newsletter/create001');

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

describe('{{MERLIN}} /newsletter {create} >>> ' +
    '(+) body - ssp-control fields default values >>>', function() {

    // set timeout for test suite
    this.timeout(requestTimeOut);

    const timeStamp = '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');

    before('generate auth headers', (done) => {
        // generate auth headers
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('create media group - minimum required fields', (done) => {

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

    before('create publisher - all required fields', (done) => {

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

    before('create newsletter - minimum required fields', (done) => {

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

    it('response should have status of 201', () => {
        expect(res003.status).to.equal(201);
    });

    it('notices and errors should not exist', () => {
        expect(resText003.notices).to.not.exist;
        expect(resText003.errors).to.not.exist;
    });

    it('response object property types should match spec', () => {
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
        // created and modified
        expect(validator.isISO8601(resOutput003.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput003.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.modifiedBy)).to.be.true;
    });

    it('response object key values should match test object', () => {
        expect(resOutput003.publisher)
            .to.equal(resOutput002.id);
        expect(resOutput003.category)
            .to.equal(sendBody003.category);
        expect(resOutput003.secondaryCategories)
            .to.eql(sendBody003.secondaryCategories);
        expect(resOutput003.name)
            .to.equal(sendBody003.name);
    });

    it('ssp-control fields should have default values', () => {
        expect(resOutput003.sspControl.rtbAllow).to.equal(null);
        expect(resOutput003.sspControl.rtbTransparency).to.equal(null);
        expect(resOutput003.sspControl.rtbFloor).to.equal(null);
        expect(resOutput003.sspControl.userMatchAllow).to.equal(null);
    });

    after('delete newsletter', (done) => {
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

    after('delete publisher', (done) => {
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

    after('delete media group', (done) => {
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
