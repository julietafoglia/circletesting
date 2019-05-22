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
    require(rootPath + '/config/reporting/endpoints');
const targetEnvironment =
    require(rootPath + '/config/merlin/' + process.env.NODE_ENV);
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser =
    usersTargetEnvironment.admin;
const merlinAuthHeaders =
    require(rootPath + '/helpers/merlin-auth-headers');
const targetServer =
    targetEnvironment.server;
const requestTimeOut = 8000;

// fixture(s)
const basicReportFixture =
    require(rootPath + '/fixtures/reporting/schedule/basicreportdata.json');
const scheduleDailyFixture =
    require(rootPath + '/fixtures/reporting/schedule/dailyscheduledata.json');

// shared test variable(s)
let authHeaders;
let basicReportBody;
let scheduleDailyBody;

let queryOutput1;
let queryOutput2;

let schdlWekendOut;
let schdlNotWekendOut;

describe('{{REPORTING}} <SMOKE> /schedule report @ADMIN >>> ' +
    '(+) check scheduling different weekends options ' +
    'on daily morning reports >>>', function() {

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

    before('create basic queries for scheduling', function(done) {
        basicReportBody = Object.assign({}, basicReportFixture);

        request(targetServer)
            .post(util.format(targetEndpoint.queryList))
            .set(authHeaders)
            .send(basicReportBody)
            .then( function(response) {

                // basic response verification
                expect(response.body).to.exist;
                expect(response.status).to.equal(200);

                // assign shared test variable(s)
                queryOutput1 = (JSON.parse(response.text)).data;
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    before('create basic queries for scheduling', function(done) {
        basicReportBody = Object.assign({}, basicReportFixture);

        request(targetServer)
            .post(util.format(targetEndpoint.queryList))
            .set(authHeaders)
            .send(basicReportBody)
            .then( function(response) {

                // basic response verification
                expect(response.body).to.exist;
                expect(response.status).to.equal(200);

                // assign shared test variable(s)
                queryOutput2 = (JSON.parse(response.text)).data;
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    before('schedule daily morning report weekend=true',
        function(done) {
            scheduleDailyBody = Object.assign({}, scheduleDailyFixture);
            scheduleDailyBody.queryId = queryOutput1.id;
            scheduleDailyBody.weekends = true;

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(scheduleDailyBody)
                .then( function(response) {

                // basic response verification
                    expect(response.body).to.exist;
                    expect(response.status).to.equal(200);

                    // assign shared test variable(s)
                    schdlWekendOut = (JSON.parse(response.text)).data;
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('schedule daily morning report weekend=false', function(done) {
        scheduleDailyBody = Object.assign({}, scheduleDailyFixture);
        scheduleDailyBody.queryId = queryOutput2.id;
        scheduleDailyBody.weekends = false;

        request(targetServer)
            .post(util.format(targetEndpoint.scheduleCreate))
            .set(authHeaders)
            .send(scheduleDailyBody)
            .then( function(response) {

                // basic response verification
                expect(response.body).to.exist;
                expect(response.status).to.equal(200);

                // assign shared test variable(s)
                schdlNotWekendOut = (JSON.parse(response.text)).data;
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    it('Check daily morning schedule weekend=true body response',
        function(done) {
            expect(validator.isInt(schdlWekendOut.id + ''))
                .to.be.true;
            expect(schdlWekendOut.type)
                .to.equal('ScheduledReport');
            expect(schdlWekendOut.attributes.recipients.text)
                .to.equal(scheduleDailyFixture.recipients.text);
            expect(validator.isISO8601(schdlWekendOut.attributes.lastSent))
                .to.be.true;
            expect(schdlWekendOut.attributes.type)
                .to.equal(scheduleDailyFixture.type);
            expect(schdlWekendOut.attributes.timeOfDay)
                .to.equal(scheduleDailyFixture.timeOfDay);
            expect(schdlWekendOut.attributes.endDate)
                .to.equal(scheduleDailyFixture.endDate + 'T00:00:00.000Z');
            expect(schdlWekendOut.attributes.weekends)
                .to.equal(true);
            expect(schdlWekendOut.attributes.queryId)
                .to.equal(queryOutput1.id);
            expect(/^[a-f0-9]{32}$/.test(schdlWekendOut.attributes.userId))
                .to.be.true;
            expect(validator.isISO8601(schdlWekendOut.attributes.updated_at))
                .to.be.true;
            expect(validator.isISO8601(schdlWekendOut.attributes.created_at))
                .to.be.true;
            done();
        });

    it('Check daily morning schedule weekend=false body response',
        function(done) {
            expect(validator.isInt(schdlNotWekendOut.id + ''))
                .to.be.true;
            expect(schdlNotWekendOut.type)
                .to.equal('ScheduledReport');
            expect(schdlNotWekendOut.attributes.recipients.text)
                .to.equal(scheduleDailyFixture.recipients.text);
            expect(validator.isISO8601(schdlNotWekendOut.attributes.lastSent))
                .to.be.true;
            expect(schdlNotWekendOut.attributes.type)
                .to.equal(scheduleDailyFixture.type);
            expect(schdlNotWekendOut.attributes.timeOfDay)
                .to.equal(scheduleDailyFixture.timeOfDay);
            expect(schdlNotWekendOut.attributes.endDate)
                .to.equal(scheduleDailyFixture.endDate + 'T00:00:00.000Z');
            expect(schdlNotWekendOut.attributes.weekends)
                .to.equal(false);
            expect(schdlNotWekendOut.attributes.queryId)
                .to.equal(queryOutput2.id);
            expect(/^[a-f0-9]{32}$/.test(schdlNotWekendOut.attributes.userId))
                .to.be.true;
            expect(validator.isISO8601(schdlNotWekendOut.attributes.updated_at))
                .to.be.true;
            expect(validator.isISO8601(schdlNotWekendOut.attributes.created_at))
                .to.be.true;
            done();
        });

    after('delete schedules', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.scheduleDelete,schdlWekendOut.id))
            .set(authHeaders)
            .then( function(response) {
                // basic response verification
                expect(response.status).to.equal(200);
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    after('delete schedules', function(done) {

        request(targetServer)
            .del(util.format(targetEndpoint.scheduleDelete,
                schdlNotWekendOut.id))
            .set(authHeaders)
            .then( function(response) {
                // basic response verification
                expect(response.status).to.equal(200);
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    after('delete queries', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.queryDelete, queryOutput1.id))
            .set(authHeaders)
            .then( function(response) {
                // basic response verification
                expect(response.status).to.equal(200);
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    after('delete queries', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.queryDelete, queryOutput2.id))
            .set(authHeaders)
            .then( function(response) {
                // basic response verification
                expect(response.status).to.equal(200);
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

});
