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

const invalidScheduleFixture =
    require(rootPath + '/fixtures/reporting/schedule/invalidvaluesdata.json');

// shared test variable(s)
let authHeaders;
let queryOutput1;
let invAllFieldsOut;
let invalidValuesBody;

describe('{{REPORTING}} <SMOKE> /schedule report @ADMIN >>> ' +
    '(-) check errors updating scheduled report ' +
        'with invalid body >>>', function() {

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

    before('Get existing user scheduled report', function(done) {
        request(targetServer)
            .get(util.format(targetEndpoint.scheduleGetUserCollection))
            .set(authHeaders)
            .then( function(response) {
                // basic response verification
                expect(response.body).to.exist;
                expect(response.status).to.equal(200);
                // assign shared test variable(s)
                queryOutput1 = (JSON.parse(response.text)[0]);
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    before('update the scheduled report for a given id', function(done) {
        invalidValuesBody = Object.assign({}, invalidScheduleFixture);
        request(targetServer)
            .put(util.format(targetEndpoint.scheduleUpdate,
                queryOutput1.data.id))
            .set(authHeaders)
            .send(invalidValuesBody)
            .then( function(response) {

                // assign shared test variable(s)
                invAllFieldsOut = (JSON.parse(response.text));
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });


    it('Check errors sending a scheduled report with invalid multiple fields',
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

});
