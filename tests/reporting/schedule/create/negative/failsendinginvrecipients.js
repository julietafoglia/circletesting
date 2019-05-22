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

// shared test variable(s)
let authHeaders;
let basicReportBody;
let invRecipientsBody;

let queryOutput1;

let emptyStringBodyOut;
let noAtBodyOut;
let noDomainBodyOut;

describe('{{REPORTING}} <SMOKE> /schedule report @ADMIN >>> ' +
    '(-) check errors scheduling with invalid recipients >>>', function() {

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

    before('Try to schedule a query with empty string on recipients',
        function(done) {
            invRecipientsBody = Object.assign({}, basicScheduleFixture);
            invRecipientsBody.queryId = queryOutput1.id;
            invRecipientsBody.recipients = '';

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(invRecipientsBody)
                .then( function(response) {
                    emptyStringBodyOut = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('Try to schedule a query without "@" on recipient',
        function(done) {
            invRecipientsBody = Object.assign({}, basicScheduleFixture);
            invRecipientsBody.queryId = queryOutput1.id;
            invRecipientsBody.recipients = ['rodrigo.vaamondevaltech.com'];

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(invRecipientsBody)
                .then( function(response) {
                    noAtBodyOut = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    before('Try to schedule a query without domain on recipient',
        function(done) {
            invRecipientsBody = Object.assign({}, basicScheduleFixture);
            invRecipientsBody.queryId = queryOutput1.id;
            invRecipientsBody.recipients = ['rodrigo.vaamonde@'];

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(invRecipientsBody)
                .then( function(response) {
                    noDomainBodyOut = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    it('Check errors scheduling a query with empty string on recipients',
        function(done) {
            expect(emptyStringBodyOut.statusCode).to.equal(400);
            expect(emptyStringBodyOut.error).to.equal('Bad Request');
            expect(emptyStringBodyOut.validation.source).to.equal('payload');
            expect(emptyStringBodyOut.validation.keys[0]).
                to.equal('recipients');
            expect(emptyStringBodyOut.message).
                to.equal('child "recipients" ' +
        'fails because ["recipients" must be an array]');
            done();
        });

    it('Check errors scheduling a query without "@" on recipients',
        function(done) {
            expect(noAtBodyOut.statusCode).to.equal(400);
            expect(noAtBodyOut.error).to.equal('Bad Request');
            expect(noAtBodyOut.validation.source).to.equal('payload');
            expect(noAtBodyOut.validation.keys[0]).to.equal('recipients.0');
            expect(noAtBodyOut.message).to.equal('child "recipients" ' +
        'fails because ["recipients" at position 0 fails ' +
        'because ["0" must be a valid email]]');
            done();
        });

    it('Check errors scheduling a query without domain on recipient',
        function(done) {
            expect(noDomainBodyOut.statusCode).to.equal(400);
            expect(noDomainBodyOut.error).to.equal('Bad Request');
            expect(noDomainBodyOut.validation.source).to.equal('payload');
            expect(noDomainBodyOut.validation.keys[0]).to.equal('recipients.0');
            expect(noDomainBodyOut.message).to.equal('child "recipients" ' +
        'fails because ["recipients" at position 0 fails ' +
        'because ["0" must be a valid email]]');
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
