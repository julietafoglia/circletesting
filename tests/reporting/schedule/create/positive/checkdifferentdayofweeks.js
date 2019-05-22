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
const scheduleWeeklyFixture =
    require(rootPath + '/fixtures/reporting/schedule/weeklyscheduledata.json');

// shared test variable(s)
let authHeaders;
let basicReportBody;
let scheduleWeeklyBody;

let queryOutput1;
let queryOutput2;

let schdlDayOut;
let schdlWekendOut;

describe('{{REPORTING}} <SMOKE> /schedule report @ADMIN >>> ' +
    '(+) check scheduling different dayOfWeek options ' +
    'on weekly afternoon reports >>>', function() {

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

    before('schedule weekly afternoon report dayOfWeek as day of the week',
        function(done) {
            scheduleWeeklyBody = Object.assign({}, scheduleWeeklyFixture);
            scheduleWeeklyBody.queryId = queryOutput1.id;
            scheduleWeeklyBody.dayOfWeek = 'tuesday';

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(scheduleWeeklyBody)
                .then( function(response) {

                // basic response verification
                    expect(response.body).to.exist;
                    expect(response.status).to.equal(200);

                    // assign shared test variable(s)
                    schdlDayOut = (JSON.parse(response.text)).data;
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('schedule weekly afternoon report dayOfWeek as day from weekend.',
        function(done) {
            scheduleWeeklyBody = Object.assign({}, scheduleWeeklyFixture);
            scheduleWeeklyBody.queryId = queryOutput2.id;
            scheduleWeeklyBody.dayOfWeek = 'sunday';

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(scheduleWeeklyBody)
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

    it('Check weekly afternoon schedule on week day body response',
        function(done) {
            expect(validator.isInt(schdlDayOut.id + ''))
                .to.be.true;
            expect(schdlDayOut.type)
                .to.equal('ScheduledReport');
            expect(schdlDayOut.attributes.recipients.text)
                .to.equal(scheduleWeeklyFixture.recipients.text);
            expect(validator.isISO8601(schdlDayOut.attributes.lastSent))
                .to.be.true;
            expect(schdlDayOut.attributes.type)
                .to.equal(scheduleWeeklyFixture.type);
            expect(schdlDayOut.attributes.timeOfDay)
                .to.equal(scheduleWeeklyFixture.timeOfDay);
            expect(schdlDayOut.attributes.endDate)
                .to.equal(scheduleWeeklyFixture.endDate + 'T00:00:00.000Z');
            expect(schdlDayOut.attributes.dayOfWeek)
                .to.equal('tuesday');
            expect(schdlDayOut.attributes.queryId)
                .to.equal(queryOutput1.id);
            expect(/^[a-f0-9]{32}$/.test(schdlDayOut.attributes.userId))
                .to.be.true;
            expect(validator.isISO8601(schdlDayOut.attributes.updated_at))
                .to.be.true;
            expect(validator.isISO8601(schdlDayOut.attributes.created_at))
                .to.be.true;
            done();
        });

    it('Check weekly afternoon schedule on weekend day body response',
        function(done) {
            expect(validator.isInt(schdlWekendOut.id + ''))
                .to.be.true;
            expect(schdlWekendOut.type)
                .to.equal('ScheduledReport');
            expect(schdlWekendOut.attributes.recipients.text)
                .to.equal(scheduleWeeklyFixture.recipients.text);
            expect(validator.isISO8601(schdlWekendOut.attributes.lastSent))
                .to.be.true;
            expect(schdlWekendOut.attributes.type)
                .to.equal(scheduleWeeklyFixture.type);
            expect(schdlWekendOut.attributes.timeOfDay)
                .to.equal(scheduleWeeklyFixture.timeOfDay);
            expect(schdlWekendOut.attributes.endDate)
                .to.equal(scheduleWeeklyFixture.endDate + 'T00:00:00.000Z');
            expect(schdlWekendOut.attributes.dayOfWeek)
                .to.equal('sunday');
            expect(schdlWekendOut.attributes.queryId)
                .to.equal(queryOutput2.id);
            expect(/^[a-f0-9]{32}$/.test(schdlWekendOut.attributes.userId))
                .to.be.true;
            expect(validator.isISO8601(schdlWekendOut.attributes.updated_at))
                .to.be.true;
            expect(validator.isISO8601(schdlWekendOut.attributes.created_at))
                .to.be.true;
            done();
        });

    after('delete reports', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.scheduleDelete, schdlDayOut.id))
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

    after('delete reports', function(done) {
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
