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
const basicScheduleFixture =
    require(rootPath + '/fixtures/reporting/schedule/dailyscheduledata.json');
const invalidScheduleFixture =
    require(rootPath + '/fixtures/reporting/schedule/invalidvaluesdata.json');

// shared test variable(s)
let authHeaders;
let basicReportBody;
let invalidValuesBody;

let queryOutput1;

let invTypeOut;
let invQueryIdOut;
let invTimeOfDayOut;
let invEndDateOut;
let invRecipientsOut;
let invWeekendsOut;
let invLastDayOfMonthOut;
let invDayOfWeekOut;
let invDayOfMonthOut;
let invAllFieldsOut;

describe('{{REPORTING}} <SMOKE> /schedule report @ADMIN >>> ' +
    '(-) check errors scheduling with invalid values >>>', function() {

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

    before('Try to schedule with invalid type',
        function(done) {
            invalidValuesBody = Object.assign({}, basicScheduleFixture);
            invalidValuesBody.queryId = queryOutput1.id;
            invalidValuesBody.type = 'test';

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(invalidValuesBody)
                .then( function(response) {
                    invTypeOut = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('Try to schedule with invalid queryId',
        function(done) {
            invalidValuesBody = Object.assign({}, basicScheduleFixture);
            invalidValuesBody.queryId = 'test';

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(invalidValuesBody)
                .then( function(response) {
                    invQueryIdOut = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('Try to schedule with invalid timeOfDay',
        function(done) {
            invalidValuesBody = Object.assign({}, basicScheduleFixture);
            invalidValuesBody.queryId = queryOutput1.id;
            invalidValuesBody.timeOfDay = 'test';

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(invalidValuesBody)
                .then( function(response) {
                    invTimeOfDayOut = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('Try to schedule with invalid endDate',
        function(done) {
            invalidValuesBody = Object.assign({}, basicScheduleFixture);
            invalidValuesBody.queryId = queryOutput1.id;
            invalidValuesBody.endDate = 'test';

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(invalidValuesBody)
                .then( function(response) {
                    invEndDateOut = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('Try to schedule with invalid recipients',
        function(done) {
            invalidValuesBody = Object.assign({}, basicScheduleFixture);
            invalidValuesBody.queryId = queryOutput1.id;
            invalidValuesBody.recipients = 'test';

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(invalidValuesBody)
                .then( function(response) {
                    invRecipientsOut = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('Try to schedule with invalid weekends',
        function(done) {
            invalidValuesBody = Object.assign({}, basicScheduleFixture);
            invalidValuesBody.queryId = queryOutput1.id;
            invalidValuesBody.weekends = 'test';

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(invalidValuesBody)
                .then( function(response) {
                    invWeekendsOut = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('Try to schedule with invalid dayOfWeek',
        function(done) {
            invalidValuesBody = Object.assign({}, basicScheduleFixture);
            invalidValuesBody.queryId = queryOutput1.id;
            invalidValuesBody.type = 'weekly';
            invalidValuesBody.dayOfWeek = 'test';

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(invalidValuesBody)
                .then( function(response) {
                    invDayOfWeekOut = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('Try to schedule with invalid lastDayOfMonth',
        function(done) {
            invalidValuesBody = Object.assign({}, basicScheduleFixture);
            invalidValuesBody.queryId = queryOutput1.id;
            invalidValuesBody.type = 'monthly';
            invalidValuesBody.lastDayOfMonth = 'test';

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(invalidValuesBody)
                .then( function(response) {
                    invLastDayOfMonthOut = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('Try to schedule with invalid dayOfMonth',
        function(done) {
            invalidValuesBody = Object.assign({}, basicScheduleFixture);
            invalidValuesBody.queryId = queryOutput1.id;
            invalidValuesBody.type = 'monthly';
            invalidValuesBody.dayOfMonth = 'test';

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(invalidValuesBody)
                .then( function(response) {
                    invDayOfMonthOut = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('Try to schedule with invalid values in all fields',
        function(done) {
            invalidValuesBody = Object.assign({}, invalidScheduleFixture);
            invalidValuesBody.queryId = queryOutput1.id;

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(invalidValuesBody)
                .then( function(response) {
                    invAllFieldsOut = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    it('Check errors scheduling with invalid type', function(done) {
        expect(invTypeOut.statusCode).to.equal(400);
        expect(invTypeOut.error).to.equal('Bad Request');
        expect(invTypeOut.validation.source).to.equal('payload');
        expect(invTypeOut.validation.keys[0]).to.equal('type');
        expect(invTypeOut.message).to.equal('child "type" fails because ' +
            '["type" must be one of [daily, weekly, monthly]]');
        done();
    });

    it('Check errors scheduling with invalid queryId', function(done) {
        expect(invQueryIdOut.statusCode).to.equal(400);
        expect(invQueryIdOut.error).to.equal('Bad Request');
        expect(invQueryIdOut.validation.source).to.equal('payload');
        expect(invQueryIdOut.validation.keys[0]).to.equal('queryId');
        expect(invQueryIdOut.message).to.equal('child "queryId" ' +
        'fails because ["queryId" must be a number]');
        done();
    });

    it('Check errors scheduling with invalid timeOfDay', function(done) {
        expect(invTimeOfDayOut.statusCode).to.equal(400);
        expect(invTimeOfDayOut.error).to.equal('Bad Request');
        expect(invTimeOfDayOut.validation.source).to.equal('payload');
        expect(invTimeOfDayOut.validation.keys[0]).to.equal('timeOfDay');
        expect(invTimeOfDayOut.message).to.equal('child "timeOfDay" ' +
        'fails because ["timeOfDay" must be one of ' +
        '[morning, afternoon, evening]]');
        done();
    });

    it('Check errors scheduling with invalid endDate', function(done) {
        expect(invEndDateOut.statusCode).to.equal(400);
        expect(invEndDateOut.error).to.equal('Bad Request');
        expect(invEndDateOut.validation.source).to.equal('payload');
        expect(invEndDateOut.validation.keys[0]).to.equal('endDate');
        expect(invEndDateOut.message).to.equal('child "endDate" ' +
        'fails because ["endDate" must be a number of milliseconds ' +
        'or valid date string]');
        done();
    });

    it('Check errors scheduling with invalid recipients', function(done) {
        expect(invRecipientsOut.statusCode).to.equal(400);
        expect(invRecipientsOut.error).to.equal('Bad Request');
        expect(invRecipientsOut.validation.source).to.equal('payload');
        expect(invRecipientsOut.validation.keys[0]).to.equal('recipients');
        expect(invRecipientsOut.message).to.equal('child "recipients" ' +
        'fails because ["recipients" must be an array]');
        done();
    });

    it('Check errors scheduling with invalid weekends', function(done) {
        expect(invWeekendsOut.statusCode).to.equal(400);
        expect(invWeekendsOut.error).to.equal('Bad Request');
        expect(invWeekendsOut.validation.source).to.equal('payload');
        expect(invWeekendsOut.validation.keys[0]).to.equal('weekends');
        expect(invWeekendsOut.message).to.equal('child "weekends" ' +
        'fails because ["weekends" must be a boolean]');
        done();
    });

    it('Check errors scheduling with invalid lastDayOfMonth', function(done) {
        expect(invLastDayOfMonthOut.statusCode).to.equal(400);
        expect(invLastDayOfMonthOut.error).to.equal('Bad Request');
        expect(invLastDayOfMonthOut.validation.source).to.equal('payload');
        expect(invLastDayOfMonthOut.validation.keys[0]).
            to.equal('lastDayOfMonth');
        expect(invLastDayOfMonthOut.message).
            to.equal('child "lastDayOfMonth" ' +
        'fails because ["lastDayOfMonth" must be a boolean]');
        done();
    });

    it('Check errors scheduling with invalid dayOfWeek', function(done) {
        expect(invDayOfWeekOut.statusCode).to.equal(400);
        expect(invDayOfWeekOut.error).to.equal('Bad Request');
        expect(invDayOfWeekOut.validation.source).to.equal('payload');
        expect(invDayOfWeekOut.validation.keys[0]).to.equal('dayOfWeek');
        expect(invDayOfWeekOut.message).to.equal('child "dayOfWeek" ' +
        'fails because ["dayOfWeek" must be one of ' +
        '[monday, tuesday, wednesday, thursday, friday, saturday, sunday, ]]');
        done();
    });

    it('Check errors scheduling with invalid dayOfMonth', function(done) {
        expect(invDayOfMonthOut.statusCode).to.equal(400);
        expect(invDayOfMonthOut.error).to.equal('Bad Request');
        expect(invDayOfMonthOut.validation.source).to.equal('payload');
        expect(invDayOfMonthOut.validation.keys[0]).to.equal('dayOfMonth');
        expect(invDayOfMonthOut.message).to.equal('child "dayOfMonth" ' +
        'fails because ["dayOfMonth" must be a number]');
        done();
    });

    it('Check errors scheduling with invalid multiple fields',
        function(done) {
            expect(invAllFieldsOut.statusCode).to.equal(400);
            expect(invAllFieldsOut.error).to.equal('Bad Request');
            expect(invAllFieldsOut.validation.source).to.equal('payload');
            expect(invAllFieldsOut.validation.keys[0]).to.equal('type');
            expect(invAllFieldsOut.validation.keys[1]).to.equal('startDate');
            expect(invAllFieldsOut.validation.keys[2]).to.equal('endDate');
            expect(invAllFieldsOut.validation.keys[3]).to.equal('timeOfDay');
            expect(invAllFieldsOut.validation.keys[4]).to.equal('weekends');
            expect(invAllFieldsOut.validation.keys[5]).to.equal('recipients.0');
            expect(invAllFieldsOut.message).
                to.equal('child "type" fails because ' +
            '["type" must be one of [daily, weekly, monthly]]. ' +
            'child "startDate" fails because ' +
            '["startDate" must be a number of milliseconds ' +
            'or valid date string]. ' +
            'child "endDate" fails because ' +
            '["endDate" must be a number of milliseconds ' +
            'or valid date string]. ' +
            'child "timeOfDay" fails because ' +
            '["timeOfDay" must be one of [morning, afternoon, evening]]. ' +
            'child "weekends" fails because ' +
            '["weekends" must be a boolean]. ' +
            'child "recipients" fails because ' +
            '["recipients" at position 0 fails because ' +
            '["0" must be a valid email]]');
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
