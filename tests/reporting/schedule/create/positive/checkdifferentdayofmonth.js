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
const scheduleMonthlyFixture =
    require(rootPath + '/fixtures/reporting/schedule/monthlyscheduledata.json');

// shared test variable(s)
let authHeaders;
let basicReportBody;
let scheduleWeeklyBody;

let queryOutput1;

let schdlLastDayOfMonth;
let schdlFirstDayOfMonth;
let schdl15thDayOfMonth;

describe('{{REPORTING}} <SMOKE> /schedule report @ADMIN >>> ' +
    '(+) check scheduling different dayOfMonth options ' +
    'on monthly evening reports >>>', function() {

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

    before('create basic querie for scheduling', function(done) {
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

    before('schedule monthly evening report dayOfMonth = 0 (last day)',
        function(done) {
            scheduleWeeklyBody = Object.assign({}, scheduleMonthlyFixture);
            scheduleWeeklyBody.queryId = queryOutput1.id;
            scheduleWeeklyBody.lastDayOfMonth = 'false';
            scheduleWeeklyBody.dayOfMonth = 0;
            scheduleWeeklyBody.daysOfMonth = ['1'];

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(scheduleWeeklyBody)
                .then( function(response) {

                // basic response verification
                    expect(response.body).to.exist;
                    expect(response.status).to.equal(200);
                    // assign shared test variable(s)
                    schdlLastDayOfMonth = (JSON.parse(response.text)).data;
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('schedule monthly evening report dayOfMonth = 1',
        function(done) {
            scheduleWeeklyBody = Object.assign({}, scheduleMonthlyFixture);
            scheduleWeeklyBody.queryId = queryOutput1.id;
            scheduleWeeklyBody.dayOfMonth = 1;

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(scheduleWeeklyBody)
                .then( function(response) {

                // basic response verification
                    expect(response.body).to.exist;
                    expect(response.status).to.equal(200);
                    // assign shared test variable(s)
                    schdlFirstDayOfMonth = (JSON.parse(response.text)).data;
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('schedule monthly evening report dayOfMonth = 15',
        function(done) {
            scheduleWeeklyBody = Object.assign({}, scheduleMonthlyFixture);
            scheduleWeeklyBody.queryId = queryOutput1.id;
            scheduleWeeklyBody.dayOfMonth = 15;

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(scheduleWeeklyBody)
                .then( function(response) {

                // basic response verification
                    expect(response.body).to.exist;
                    expect(response.status).to.equal(200);

                    // assign shared test variable(s)
                    schdl15thDayOfMonth = (JSON.parse(response.text)).data;
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    it('Check monthly evening schedule on dayOfMonth = 0 (last day) ' +
    'body response',
    function() {
        expect(validator.isInt(schdlLastDayOfMonth.id + ''))
            .to.be.true;
        expect(schdlLastDayOfMonth.type)
            .to.equal('ScheduledReport');
        expect(schdlLastDayOfMonth.attributes.recipients.text)
            .to.equal(scheduleMonthlyFixture.recipients.text);
        expect(validator.isISO8601(schdlLastDayOfMonth.attributes.lastSent))
            .to.be.true;
        expect(schdlLastDayOfMonth.attributes.type)
            .to.equal(scheduleMonthlyFixture.type);
        expect(schdlLastDayOfMonth.attributes.timeOfDay)
            .to.equal(scheduleMonthlyFixture.timeOfDay);
        expect(schdlLastDayOfMonth.attributes.endDate)
            .to.equal(scheduleMonthlyFixture.endDate + 'T00:00:00.000Z');
        expect(schdlLastDayOfMonth.attributes.dayOfMonth)
            .to.equal(0);
        expect(schdlLastDayOfMonth.attributes.lastDayOfMonth)
            .to.false;
        expect(schdlLastDayOfMonth.attributes.daysOfMonth.text)
            .to.equal(scheduleMonthlyFixture.daysOfMonth.text);
        expect(schdlLastDayOfMonth.attributes.queryId)
            .to.equal(queryOutput1.id);
        expect(/^[a-f0-9]{32}$/.test(schdlLastDayOfMonth.attributes.userId))
            .to.be.true;
        expect(validator.isISO8601(schdlLastDayOfMonth.attributes.updated_at))
            .to.be.true;
        expect(validator.isISO8601(schdlLastDayOfMonth.attributes.created_at))
            .to.be.true;

    });

    it('Check monthly evening schedule on dayOfMonth = 1 body response',
        function() {
            expect(validator.isInt(schdlFirstDayOfMonth.id + ''))
                .to.be.true;
            expect(schdlFirstDayOfMonth.type)
                .to.equal('ScheduledReport');
            expect(schdlFirstDayOfMonth.attributes.recipients.text)
                .to.equal(scheduleMonthlyFixture.recipients.text);
            expect(validator.isISO8601(schdlFirstDayOfMonth
                .attributes.lastSent))
                .to.be.true;
            expect(schdlFirstDayOfMonth.attributes.type)
                .to.equal(scheduleMonthlyFixture.type);
            expect(schdlFirstDayOfMonth.attributes.timeOfDay)
                .to.equal(scheduleMonthlyFixture.timeOfDay);
            expect(schdlFirstDayOfMonth.attributes.endDate)
                .to.equal(scheduleMonthlyFixture.endDate + 'T00:00:00.000Z');
            expect(schdlFirstDayOfMonth.attributes.dayOfMonth)
                .to.equal(1);
            expect(schdlFirstDayOfMonth.attributes.queryId)
                .to.equal(queryOutput1.id);
            expect(/^[a-f0-9]{32}$/.test(schdlFirstDayOfMonth
                .attributes.userId))
                .to.be.true;
            expect(validator.isISO8601(schdlFirstDayOfMonth
                .attributes.updated_at))
                .to.be.true;
            expect(validator.isISO8601(schdlFirstDayOfMonth
                .attributes.created_at))
                .to.be.true;
        });

    it('Check monthly evening schedule on dayOfMonth = 15 body response',
        function() {
            expect(validator.isInt(schdl15thDayOfMonth.id + ''))
                .to.be.true;
            expect(schdl15thDayOfMonth.type)
                .to.equal('ScheduledReport');
            expect(schdl15thDayOfMonth.attributes.recipients.text)
                .to.equal(scheduleMonthlyFixture.recipients.text);
            expect(validator.isISO8601(schdl15thDayOfMonth.attributes.lastSent))
                .to.be.true;
            expect(schdl15thDayOfMonth.attributes.type)
                .to.equal(scheduleMonthlyFixture.type);
            expect(schdl15thDayOfMonth.attributes.timeOfDay)
                .to.equal(scheduleMonthlyFixture.timeOfDay);
            expect(schdl15thDayOfMonth.attributes.endDate)
                .to.equal(scheduleMonthlyFixture.endDate + 'T00:00:00.000Z');
            expect(schdl15thDayOfMonth.attributes.dayOfMonth)
                .to.equal(15);
            expect(schdl15thDayOfMonth.attributes.queryId)
                .to.equal(queryOutput1.id);
            expect(/^[a-f0-9]{32}$/.test(schdl15thDayOfMonth.attributes.userId))
                .to.be.true;
            expect(validator.isISO8601(schdl15thDayOfMonth
                .attributes.updated_at)).to.be.true;
            expect(validator.isISO8601(schdl15thDayOfMonth
                .attributes.created_at)).to.be.true;
        });

    after('delete report1', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.scheduleDelete,
                schdlLastDayOfMonth.id))
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

    after('delete report2', function(done) {

        request(targetServer)
            .del(util.format(targetEndpoint.scheduleDelete,
                schdlFirstDayOfMonth.id))
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

    after('delete report3', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.scheduleDelete,
                schdl15thDayOfMonth.id))
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

    after('delete query', function(done) {
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

});
