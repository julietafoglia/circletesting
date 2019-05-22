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
const merlinAuthHeaders =
    require(rootPath + '/helpers/merlin-auth-headers');
const requestTimeOut = 10000;
const timeStamp = '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');

// fixture(s)
const setupFixture001 =
    require(rootPath + '/fixtures/common/media-group/create001');
const setupFixture002 =
    require(rootPath + '/fixtures/common/publisher/create001');
const setupFixture003 =
    require(rootPath + '/fixtures/common/newsletter/create001');
const testFixture =
    require(rootPath + '/fixtures/common/ad-slot/create004');

// shared test variable(s)
let authHeaders;
let res004;
let resText001;
let resText002;
let resText003;
let resText004;
let resOutput001;
let resOutput002;
let resOutput003;
let resOutput004;
let sendBody001;
let sendBody002;
let sendBody003;
let sendBody004;

describe('{{MERLIN}} /ad-slot {create} >>> ' +
    '(+) native ad-slots - text-ad - in article >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('generate auth headers', (done) => {
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

    before('create publisher - minimum required fields', (done) => {

        sendBody002 = Object.assign({}, setupFixture002);

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
                throw(err);
            });
    });

    before('create newsletter - minimum required fields', function(done) {

        sendBody003 = Object.assign({}, setupFixture003);

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
                resText003 = JSON.parse(res.text);
                resOutput003 = resText003.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create ad-slot - all valid fields', (done) => {

        sendBody004 = Object.assign({}, testFixture);

        // assign name and newsletter to ad-slot
        sendBody004.name = 'ads@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');
        sendBody004.newsletter = resOutput003.id;

        request(targetServer)
            .post(util.format(targetEndpoint.adSlotCreate))
            .set(authHeaders)
            .send(sendBody004)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                res004 = res;
                resText004 = JSON.parse(res.text);
                resOutput004 = resText004.output;
                done();
            })
            .catch((err) => {
                throw(err);
            });
    });

    it('response have status of 201', () => {
        expect(res004.status).to.equal(201);
    });

    it('notices and errors should not exist', () => {
        expect(resText004.notices).to.exist;
        expect(resText004.errors).to.not.exist;
    });

    it('response object property types should match spec', () => {
        expect(/^[a-f0-9]{32}$/.test(resOutput004.id)).to.be.true;
        expect(validator.isInt(resOutput004.refId + '')).to.be.true;
        expect(validator.isInt(resOutput004.version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.publisher)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.newsletter))
            .to.be.true;
        expect(resOutput004.type).to.be.oneOf([
            'image', 'tracking', 'powered_by', 'ad_choices', 'cookie_jar',
            'video', 'ad_choices_icon', 'marquee', 'left', 'right', 'native'
        ]);
        expect(resOutput004.status).to.be.oneOf([
            'pending', 'inactive', 'active'
        ]);
        expect(resOutput004.name)
            .to.have.length.of.at.most(255);
        expect(resOutput004.mediaType).to.be.oneOf([
            'newsletter', 'dedicated', 'content'
        ]);
        if (resOutput004.salesforceId != null) {
            expect(resOutput004.externalId)
                .to.have.length.of.at.most(128);
        }
        expect(resOutput004.position).to.be.oneOf([
            'unknown', 'above the fold', 'may be below the fold',
            'below the fold'
        ]);
        expect(resOutput004.native).to.be.an('object');
        if (resOutput004.sspFee !== null) {
            expect(validator.isInt(resOutput004.sspFee + '',
                {'max': 99})).to.be.true;
        }
        expect(resOutput004.urlImage).to.be.a('string');
        expect(resOutput004.urlClick).to.be.a('string');
        expect(resOutput004.urlUnsubscribe).to.be.a('string');
        expect(resOutput004.tag).to.be.a('string');
        expect(resOutput004.fullTag).to.be.a('string');
        // ssp control object
        expect(resOutput004.sspControl).to.be.an('object');
        if (resOutput004.sspControl.exchangeAllow !== null) {
            expect(resOutput004.sspControl.exchangeAllow)
                .to.be.a('boolean');
        }
        if (resOutput004.sspControl.rtbAllow !== null) {
            expect(resOutput004.sspControl.rtbAllow)
                .to.be.a('boolean');
        }
        if (resOutput004.sspControl.rtbTransparency !== null) {
            expect(resOutput004.sspControl.rtbTransparency)
                .to.be.a('boolean');
        }
        if (resOutput004.sspControl.rtbFloor !== null) {
            expect(/^(\d{1,10}\.\d{1,2})$/
                .test(resOutput004.sspControl.rtbFloor)).to.be.true;
        }
        if (resOutput004.sspControl.demandAllocationDirect !== null) {
            expect(validator.isInt(
                resOutput004.sspControl.demandAllocationDirect + ''
            )).to.be.true;
        }
        if (resOutput004.sspControl.demandAllocationHouse !== null) {
            expect(validator.isInt(
                resOutput004.sspControl.demandAllocationHouse + ''
            )).to.be.true;
        }
        // created and modified
        expect(validator.isISO8601(resOutput004.created))
            .to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.createdBy))
            .to.be.true;
        expect(validator.isISO8601(resOutput004.modified))
            .to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.modifiedBy))
            .to.be.true;
    });

    it('response object key values should match test object', function() {
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
                throw(err);
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
                throw(err);
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
                throw(err);
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
                throw(err);
            });
    });
});
