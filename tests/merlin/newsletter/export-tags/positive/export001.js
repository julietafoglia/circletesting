'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const moment = require('moment');
const request = require('supertest-as-promised');
const util = require('util');

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
const mediaGroupFixture =
    require(rootPath + '/fixtures/common/media-group/create001');
const publisherFixture =
    require(rootPath + '/fixtures/common/publisher/create001');
const newsletterFixture =
    require(rootPath + '/fixtures/common/newsletter/create001');

// shared test variable(s)
let authHeaders;
let res004;
let resOutput001;
let resOutput002;
let resOutput003;
let resText001;
let resText002;
let resText003;
let sendBody001;
let sendBody002;
let sendBody003;

describe('{{MERLIN}} /newsletter {id export-tags} >>> ' +
    '(+) export tags >>>', function() {

    // set timeout for test suite
    this.timeout(requestTimeOut);

    const timeStamp = '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');

    before('generate auth headers', (done) => {
        // generate auth headers
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then((headers) => {
            authHeaders = headers;
            done();
        }, (err) => {
            done(err);
        });
    });

    before('create media group - minimum required fields', (done) => {

        sendBody001 = Object.assign({}, mediaGroupFixture);

        sendBody001.name += timeStamp;

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
                throw(err);
            });
    });

    before('create publisher - minimum required fields', (done) => {

        sendBody002 = Object.assign({}, publisherFixture);

        // assign name and media-group to publisher
        sendBody002.name += timeStamp;
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
                expect(/^[a-f0-9]{32}$/.test(resOutput002.mediaGroup))
                    .to.be.true;
                expect(resOutput002.mediaGroup)
                    .to.equal(sendBody002.mediaGroup);
                expect(resOutput002.name)
                    .to.equal(sendBody002.name);
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    before('create newsletter - minimum required fields', (done) => {

        sendBody003 = Object.assign({}, newsletterFixture);

        // assign name and publisher to newsletter
        sendBody003.name += timeStamp;
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
                throw(err);
            });
    });

    before('export tags - excel file', (done) => {
        // modify headers
        let headers = Object.assign({}, authHeaders);
        headers['Accept'] = 'application/vnd.ms-excel';
        request(targetServer)
            .get(
                util.format(
                    targetEndpoint.newsletterExportTags, resOutput003.id
                )
            )
            .set(headers)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res004 = res;
                done();
            })
            .catch((err) => {
                throw(err);
            });
    });

    it('response should have a status of 200', () => {
        expect(res004.status).to.equal(200);
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

    after('delete media group', (done) => {
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
