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
    require(rootPath + '/fixtures/common/publisher/create002');

// shared test variables
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

describe('{{MERLIN}} <SMOKE> /search/ssp-control/publisher' +
    ' {advanced} @ADMIN >>> ' +
    '(+) body - basic verification - created publisher >>>', function() {

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

    before('create media group - minimum required', function(done) {

        sendBody001 = Object.assign({}, setupFixture001);

        // assign name
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

    before('create publisher - all valid fields', function(done) {

        sendBody002 = Object.assign({}, setupFixture002);

        // assign name and media-group to publisher
        sendBody002.name += timeStamp;
        sendBody002.mediaGroup = resOutput001.id;

        // add random values to empty fields
        sendBody002.externalId = chance.word({length: 5});
        sendBody002.emailTagReplacement = chance.word({length: 10});
        sendBody002.placementTagReplacement = chance.word({length: 10});

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
                expect(resOutput002.mediaGroup)
                    .to.equal(sendBody002.mediaGroup);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('search ssp-control-publisher', function(done) {

        sendBody003 = {};

        // specify publisher-id to search for
        sendBody003.publisherId = resOutput002.id;

        request(targetServer)
            .post(util.format(targetEndpoint.searchSspControlPublisherAdvanced))
            .set(authHeaders)
            .send(sendBody003)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

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

    it('response should have status of 200', function() {
        expect(res003.status).to.equal(200);
    });

    it('notices and errors should not exist', function() {
        expect(resText003.notices).to.not.exist;
        expect(resText003.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(resOutput003).to.be.an('array');
        expect(/^[a-f0-9]{32}$/.test(resOutput003[0].publisherId))
            .to.be.true;
        expect(resOutput003[0].targetingType).to.be.oneOf([
            'include', 'exclude'
        ]);
        expect(resOutput003[0].applyBlocklists).to.be.a('boolean');
        expect(resOutput003[0].rtbAllow).to.be.a('boolean');
        expect(/^(\d{1,10}\.?\d{0,2})$/.test(resOutput003[0].rtbFloor))
            .to.be.true;
        expect(resOutput003[0].uniqueAds).to.be.oneOf([
            'inherit', 'off', 'advertiser'
        ]);
        expect(resOutput003[0].userMatchAllow).to.be.a('boolean');
        expect(resOutput003[0].directoryExpose).to.be.a('boolean');
        expect(resOutput003[0].directoryExposePublic).to.be.a('boolean');
        if (resOutput003[0].demandAllocationHouse !== null) {
            expect(
                validator.isInt(resOutput003[0].demandAllocationHouse + '')
            ).to.be.true;
        }
        if (resOutput003[0].demandAllocationHouse !== null) {
            expect(
                validator.isInt(resOutput003[0].demandAllocationDirect + '')
            ).to.be.true;
        }
    });

    it('response objects should match test object', function() {
        expect(resOutput003.length).to.equal(1);
        expect(resOutput003[0].publisherId).to.equal(resOutput002.id);
        expect(resOutput003[0].targetingType)
            .to.equal(resOutput002.sspControl.targetingType);
        expect(resOutput003[0].applyBlocklists)
            .to.equal(resOutput002.sspControl.applyBlocklists);
        expect(resOutput003[0].rtbAllow)
            .to.equal(resOutput002.sspControl.rtbAllow);
        expect(resOutput003[0].rtbFloor)
            .to.equal(resOutput002.sspControl.rtbFloor);
        expect(resOutput003[0].uniqueAds)
            .to.equal(resOutput002.sspControl.uniqueAds);
        expect(resOutput003[0].userMatchAllow)
            .to.equal(resOutput002.sspControl.userMatchAllow);
        expect(resOutput003[0].directoryExpose)
            .to.equal(resOutput002.sspControl.directoryExpose);
        expect(resOutput003[0].directoryExposePublic)
            .to.equal(resOutput002.sspControl.directoryExposePublic);
        expect(resOutput003[0].demandAllocationHouse)
            .to.equal(resOutput002.sspControl.demandAllocationHouse);
        expect(resOutput003[0].demandAllocationHouse)
            .to.equal(resOutput002.sspControl.demandAllocationHouse);
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
