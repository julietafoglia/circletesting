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
let invPeriodCombBody;

let queryOutput1;

let invDailyCombBodyOut;
let invWeeklyCombBodyOut;
let invMonthlyCombBodyOut;

describe('{{REPORTING}} <SMOKE> /schedule report @ADMIN >>> ' +
    '(-) check errors scheduling with invalid period combinations >>>',
function() {

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

    before('Try to schedule daily report with invalid combinations',
        function(done) {
            invPeriodCombBody = Object.assign({}, noPeriodScheduleFixture);
            invPeriodCombBody.queryId = queryOutput1.id;
            invPeriodCombBody.type = 'daily';
            invPeriodCombBody.dayOfWeek = 'monday';
            invPeriodCombBody.lastDayOfMonth = 'false';
            invPeriodCombBody.dayOfMonth = 0;

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(invPeriodCombBody)
                .then( function(response) {
                    invDailyCombBodyOut = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('Try to schedule weekly report with invalid combinations',
        function(done) {
            invPeriodCombBody = Object.assign({}, noPeriodScheduleFixture);
            invPeriodCombBody.queryId = queryOutput1.id;
            invPeriodCombBody.type = 'weekly';
            invPeriodCombBody.weekends = true;
            invPeriodCombBody.lastDayOfMonth = 'false';
            invPeriodCombBody.dayOfMonth = 0;

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(invPeriodCombBody)
                .then( function(response) {
                    invWeeklyCombBodyOut = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('Try to schedule monthly report with invalid combinations',
        function(done) {
            invPeriodCombBody = Object.assign({}, noPeriodScheduleFixture);
            invPeriodCombBody.queryId = queryOutput1.id;
            invPeriodCombBody.type = 'monthly';
            invPeriodCombBody.weekends = true;
            invPeriodCombBody.lastDayOfMonth = 'false';
            invPeriodCombBody.dayOfWeek = 'monday';

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(invPeriodCombBody)
                .then( function(response) {
                    invMonthlyCombBodyOut = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    it('Check errors scheduling daily report with invalid combinations',
        function(done) {
            expect(invDailyCombBodyOut.statusCode).to.equal(400);
            expect(invDailyCombBodyOut.error).to.equal('Bad Request');
            expect(invDailyCombBodyOut.validation.source).to.equal('payload');
            expect(invDailyCombBodyOut.validation.keys[0]).to.equal('weekends');
            expect(invDailyCombBodyOut.message).to.equal('child "weekends" ' +
        'fails because ["weekends" is required]');
            done();
        });

    it('Check errors scheduling weekly report with invalid combinations',
        function(done) {
            expect(invWeeklyCombBodyOut.statusCode).to.equal(400);
            expect(invWeeklyCombBodyOut.error).to.equal('Bad Request');
            expect(invWeeklyCombBodyOut.validation.source).to.equal('payload');
            expect(invWeeklyCombBodyOut.validation.keys[0])
                .to.equal('dayOfWeek');
            expect(invWeeklyCombBodyOut.message)
                .to.equal('child "dayOfWeek" ' +
        'fails because ["dayOfWeek" is required]');
            done();
        });

    it('Check errors scheduling monthly report with invalid combinations',
        function(done) {
            expect(invMonthlyCombBodyOut.statusCode).to.equal(400);
            expect(invMonthlyCombBodyOut.error).to.equal('Bad Request');
            expect(invMonthlyCombBodyOut.validation.source).to.equal('payload');
            expect(invMonthlyCombBodyOut.validation.keys[0])
                .to.equal('dayOfMonth');
            expect(invMonthlyCombBodyOut.message)
                .to.equal('child "dayOfMonth" ' +
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
                done(err);
            });
    });

});
