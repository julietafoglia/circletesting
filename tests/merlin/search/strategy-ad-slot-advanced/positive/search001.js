'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const moment = require('moment');
const request = require('supertest-as-promised');
const util = require('util');

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
const requestTimeOut = 10000;

// fixture(s)
const mediaGroupFixture =
    require(rootPath + '/fixtures/common/media-group/create002');
const publisherFixture =
    require(rootPath + '/fixtures/common/publisher/create001');
const newsletterFixture =
    require(rootPath + '/fixtures/common/newsletter/create001');
const adSlotFixture =
    require(rootPath + '/fixtures/common/ad-slot/create002');

// shared test variable(s)
let authHeaders;
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

describe('{{MERLIN}}  >>> ' +
    '(+) no linked strategies >>>', function() {

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
        sendBody001.name = 'mda-grp@' +
            moment().format('YYYY-MM-DDTHH:mm:ss.SS');

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


    before('search linked strategies', (done) => {

        let payload = {
            'conditions': [
                {'field': 'adSlot', 'value': resOutput004.id}
            ]
        };

        request(targetServer)
            .post(util.format(targetEndpoint.searchStrategyAdSlotAdvanced))
            .send(payload)
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                resText005 = JSON.parse(res.text);
                resOutput005 = resText005.output;
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('notices and errors should not exist', () => {
        expect(resText005.notices).to.not.exist;
        expect(resText005.errors).to.not.exist;
    });

    it('should have no linked strategies', () => {
        expect(resOutput005).to.have.lengthOf(0);
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
