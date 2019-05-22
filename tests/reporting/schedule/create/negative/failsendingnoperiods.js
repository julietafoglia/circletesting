'use strict';

// vendor dependencies
const chai = require('chai');


const expect = chai.expect; // use bdd chai

const request = require('supertest-as-promised');
const util = require('util');

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
const noPeriodScheduleFixture =
    require(rootPath + '/fixtures/reporting/schedule/noperiodschdldata.json');

// shared test variable(s)
let authHeaders;
let basicReportBody;
let missingPeriodsBody;

let queryOutput1;

let noWeekendBodyOut;
let noDayOfWeekOut;
let noDayOfMonthOut;

describe('{{REPORTING}} <SMOKE> /schedule report @ADMIN >>> ' +
    '(-) check errors scheduling without periods in request >>>', function() {

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

    before('Create basic query for scheduling', function(done) {
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

    before('Try to schedule daily report without weekend period',
        function(done) {
            missingPeriodsBody = Object.assign({}, noPeriodScheduleFixture);
            missingPeriodsBody.queryId = queryOutput1.id;
            missingPeriodsBody.type = 'daily';

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(missingPeriodsBody)
                .then( function(response) {
                    noWeekendBodyOut = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('Try to schedule weekly report without dayOfWeek period',
        function(done) {
            missingPeriodsBody = Object.assign({}, noPeriodScheduleFixture);
            missingPeriodsBody.queryId = queryOutput1.id;
            missingPeriodsBody.type = 'weekly';

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(missingPeriodsBody)
                .then( function(response) {
                    noDayOfWeekOut = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('Try to schedule monthly report without dayOfMonth period',
        function(done) {
            missingPeriodsBody = Object.assign({}, noPeriodScheduleFixture);
            missingPeriodsBody.queryId = queryOutput1.id;
            missingPeriodsBody.type = 'monthly';
            missingPeriodsBody.lastDayOfMonth = 'false';

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(missingPeriodsBody)
                .then( function(response) {
                    noDayOfMonthOut = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    it('Check errors scheduling daily report without weekends period',
        function(done) {
            expect(noWeekendBodyOut.statusCode).to.equal(400);
            expect(noWeekendBodyOut.error).to.equal('Bad Request');
            expect(noWeekendBodyOut.validation.source).to.equal('payload');
            expect(noWeekendBodyOut.validation.keys[0]).to.equal('weekends');
            expect(noWeekendBodyOut.message).to.equal('child "weekends" ' +
        'fails because ["weekends" is required]');
            done();
        });

    it('Check errors scheduling weekly report without dayOfWeek period',
        function(done) {
            expect(noDayOfWeekOut.statusCode).to.equal(400);
            expect(noDayOfWeekOut.error).to.equal('Bad Request');
            expect(noDayOfWeekOut.validation.source).to.equal('payload');
            expect(noDayOfWeekOut.validation.keys[0]).to.equal('dayOfWeek');
            expect(noDayOfWeekOut.message).to.equal('child "dayOfWeek" ' +
        'fails because ["dayOfWeek" is required]');
            done();
        });

    it('Check errors scheduling monthly report without dayOfMonth period',
        function(done) {
            expect(noDayOfMonthOut.statusCode).to.equal(400);
            expect(noDayOfMonthOut.error).to.equal('Bad Request');
            expect(noDayOfMonthOut.validation.source).to.equal('payload');
            expect(noDayOfMonthOut.validation.keys[0]).to.equal('dayOfMonth');
            expect(noDayOfMonthOut.message).to.equal('child "dayOfMonth" ' +
        'fails because ["dayOfMonth" is required]');
            done();
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
