'use strict';

// vendor dependencies
const chance = require('chance').Chance();
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
const setupFixture003 =
    require(rootPath + '/fixtures/common/newsletter/create001');
const setupFixture004 =
    require(rootPath + '/fixtures/common/ad-slot/create001');

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

describe('{{MERLIN}} /ad-slot {id save} >>> ' +
    '(+) body - string fields maximum length >>>', function() {

    // set time out for requests
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

        // assign name and media group to publisher
        sendBody002.name = 'pub@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');
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
                expect(resOutput002.name)
                    .to.equal(sendBody002.name);
                expect(resOutput002.mediaGroup)
                    .to.equal(sendBody002.mediaGroup);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create newsletter - minimum required fields', function(done) {

        sendBody003 = Object.assign({}, setupFixture003);

        // assign name and publisher to newsletter
        sendBody003.name = 'news@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');
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

                // spot check response
                expect(/^[a-f0-9]{32}$/.test(resOutput003.id)).to.be.true;
                expect(resOutput003.name).to.have.length.of.at.most(48);
                expect(resOutput003.name).to.equal(sendBody003.name);
                expect(resOutput003.publisher).to.equal(sendBody003.publisher);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create ad-slot - all valid fields', function(done) {

        sendBody004 = Object.assign({}, setupFixture004);

        // assign name and newsletter to ad-slot
        sendBody004.name = 'ads@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');
        sendBody004.newsletter = resOutput003.id;

        request(targetServer)
            .post(util.format(targetEndpoint.adSlotCreate))
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
                expect(/^[a-f0-9]{32}$/.test(resOutput004.id))
                    .to.be.true;
                expect(resOutput004.name)
                    .to.have.length.of.at.most(255);
                expect(resOutput004.name)
                    .to.equal(sendBody004.name);
                expect(resOutput004.type)
                    .to.equal(sendBody004.type);
                expect(resOutput004.mediaType)
                    .to.equal(sendBody004.mediaType);
                expect(resOutput004.newsletter)
                    .to.equal(sendBody004.newsletter);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('save ad-slot - string fields max length', function(done) {

        sendBody005 = {};

        // assign version, max length name and external-id to ad-slot
        sendBody005.version = resOutput004.version;
        sendBody005.name = 'ads@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS') +
            chance.word({length: 229});
        sendBody005.externalId = chance.word({length: 128});

        request(targetServer)
            .post(util.format(targetEndpoint.adSlotSave, resOutput004.id))
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

    it('response have status of 200', function() {
        expect(res005.status).to.equal(200);
    });

    it('notices and errors should not exist', function() {
        expect(resText005.notices).to.not.exist;
        expect(resText005.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput005.id)).to.be.true;
        expect(validator.isInt(resOutput005.refId + '')).to.be.true;
        expect(validator.isInt(resOutput005.version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005.publisher)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005.newsletter))
            .to.be.true;
        expect(resOutput005.type).to.be.oneOf([
            'image', 'tracking', 'powered_by', 'ad_choices', 'cookie_jar',
            'video', 'ad_choices_icon', 'marquee', 'left', 'right'
        ]);
        expect(resOutput005.status).to.be.oneOf([
            'pending', 'inactive', 'active'
        ]);
        expect(resOutput005.name)
            .to.have.length.of.at.most(255);
        expect(resOutput005.type).to.be.oneOf([
            'image', 'video', 'marquee', 'native'
        ]);
        if (resOutput005.salesforceId != null) {
            expect(resOutput005.externalId)
                .to.have.length.of.at.most(128);
        }
        expect(resOutput005.position).to.be.oneOf([
            'unknown', 'above the fold', 'may be below the fold',
            'below the fold'
        ]);
        if (resOutput005.sspFee !== null) {
            expect(validator.isInt(resOutput005.sspFee + '',
                {'max': 99})).to.be.true;
        }
        expect(resOutput005.urlImage).to.be.a('string');
        expect(resOutput005.urlClick).to.be.a('string');
        expect(resOutput005.urlUnsubscribe).to.be.a('string');
        expect(resOutput005.tag).to.be.a('string');
        expect(resOutput005.fullTag).to.be.a('string');
        // ssp control object
        expect(resOutput005.sspControl).to.be.an('object');
        if (resOutput005.sspControl.exchangeAllow !== null) {
            expect(resOutput005.sspControl.exchangeAllow)
                .to.be.a('boolean');
        }
        if (resOutput005.sspControl.rtbAllow !== null) {
            expect(resOutput005.sspControl.rtbAllow)
                .to.be.a('boolean');
        }
        if (resOutput005.sspControl.rtbTransparency !== null) {
            expect(resOutput005.sspControl.rtbTransparency)
                .to.be.a('boolean');
        }
        if (resOutput005.sspControl.rtbFloor !== null) {
            expect(/^(\d{1,10}\.\d{1,2})$/
                .test(resOutput005.sspControl.rtbFloor)).to.be.true;
        }
        if (resOutput005.sspControl.demandAllocationDirect !== null) {
            expect(validator.isInt(
                resOutput005.sspControl.demandAllocationDirect + ''
            )).to.be.true;
        }
        if (resOutput005.sspControl.demandAllocationHouse !== null) {
            expect(validator.isInt(
                resOutput005.sspControl.demandAllocationHouse + ''
            )).to.be.true;
        }
        // created and modified
        expect(validator.isISO8601(resOutput005.created))
            .to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005.createdBy))
            .to.be.true;
        expect(validator.isISO8601(resOutput005.modified))
            .to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput005.modifiedBy))
            .to.be.true;
    });

    it('response object key values should match created object', function() {
        expect(resOutput005.id)
            .to.equal(resOutput004.id);
        expect(resOutput005.refId)
            .to.equal(resOutput004.refId);
        expect(resOutput005.version)
            .to.equal(resOutput004.version + 1);
        expect(resOutput005.publisher)
            .to.equal(resOutput004.publisher);
        expect(resOutput005.newsletter)
            .to.equal(resOutput004.newsletter);
        expect(resOutput005.externalId)
            .to.equal(sendBody005.externalId);
        expect(resOutput005.type)
            .to.equal(resOutput004.type);
        expect(resOutput005.name)
            .to.equal(sendBody005.name);
        expect(resOutput005.status)
            .to.equal(resOutput004.status);
        expect(resOutput005.mediaType)
            .to.equal(resOutput004.mediaType);
        expect(resOutput005.width)
            .to.equal(resOutput004.width);
        expect(resOutput005.height)
            .to.equal(resOutput004.height);
        expect(resOutput005.position)
            .to.equal(resOutput004.position);
        expect(resOutput005.sspFee)
            .to.equal(resOutput004.sspFee);
        expect(resOutput005.urlImage)
            .to.equal(resOutput004.urlImage);
        expect(resOutput005.urlClick)
            .to.equal(resOutput004.urlClick);
        expect(resOutput005.urlUnsubscribe)
            .to.equal(resOutput004.urlUnsubscribe);
        expect(resOutput005.tag)
            .to.equal(resOutput004.tag);
        expect(resOutput005.fullTag)
            .to.equal(resOutput004.fullTag);
        expect(resOutput005.sspControl.exchangeAllow)
            .to.equal(resOutput004.sspControl.exchangeAllow);
        expect(resOutput005.sspControl.exchangeFloor)
            .to.equal(resOutput004.sspControl.exchangeFloor);
        expect(resOutput005.sspControl.targetingType)
            .to.equal(resOutput004.sspControl.targetingType);
        expect(resOutput005.sspControl.applyBlockLists)
            .to.eql(resOutput004.sspControl.applyBlockLists);
        expect(resOutput005.sspControl.rtbAllow)
            .to.equal(resOutput004.sspControl.rtbAllow);
        expect(resOutput005.sspControl.rtbTransparency)
            .to.equal(resOutput004.sspControl.rtbTransparency);
        expect(resOutput005.sspControl.rtbFloor)
            .to.equal(resOutput004.sspControl.rtbFloor);
        expect(resOutput005.sspControl.uniqueAds)
            .to.equal(resOutput004.sspControl.uniqueAds);
        expect(resOutput005.sspControl.userMatchAllow)
            .to.equal(resOutput004.sspControl.userMatchAllow);
        expect(resOutput005.sspControl.demandAllocationHouse)
            .to.equal(resOutput004.sspControl.demandAllocationHouse);
        expect(resOutput005.sspControl.demandAllocationDirect)
            .to.equal(resOutput004.sspControl.demandAllocationDirect);
        expect(resOutput005.sspControl.tier)
            .to.equal(resOutput004.sspControl.tier);
        expect(resOutput005.sspControl.directoryExpose)
            .to.equal(resOutput004.sspControl.directoryExpose);
        expect(resOutput005.sspControl.directoryExposePublic)
            .to.equal(resOutput004.sspControl.directoryExposePublic);
        // created and modified
        expect(resOutput005.created).to.equal(resOutput004.created);
        expect(resOutput005.createdBy).to.equal(resOutput004.createdBy);
    });

    after('delete ad-slot', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.adSlotDelete, resOutput004.id))
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
