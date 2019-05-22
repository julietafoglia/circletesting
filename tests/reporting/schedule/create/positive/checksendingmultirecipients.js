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
const scheduleManyUsersFixture =
    require(rootPath + '/fixtures/reporting/schedule/multirecipientsdata.json');

// shared test variable(s)
let authHeaders;
let basicReportBody;
let scheduleManyUsersBody;

let queryOutput1;

let schdlManyRecipientsOut;

describe('{{REPORTING}} <SMOKE> /schedule report @ADMIN >>> ' +
    '(+) check scheduling to multiple recipients >>>', function() {

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

    before('create basic query for scheduling', function(done) {
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

    before('schedule query to many recipients',
        function(done) {
            scheduleManyUsersBody = Object.assign({}, scheduleManyUsersFixture);
            scheduleManyUsersBody.queryId = queryOutput1.id;
            scheduleManyUsersBody.dayOfMonth = 1;

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(scheduleManyUsersBody)
                .then( function(response) {

                // basic response verification
                    expect(response.body).to.exist;
                    expect(response.status).to.equal(200);

                    // assign shared test variable(s)
                    schdlManyRecipientsOut = (JSON.parse(response.text)).data;
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    it('Check schedule to many recipients body response',
        function(done) {
            expect(validator.isInt(schdlManyRecipientsOut.id + ''))
                .to.be.true;
            expect(schdlManyRecipientsOut.type)
                .to.equal('ScheduledReport');
            expect(schdlManyRecipientsOut.attributes.recipients.text)
                .to.equal(scheduleManyUsersFixture.recipients.text);
            expect(validator.isISO8601(schdlManyRecipientsOut
                .attributes.lastSent)).to.be.true;
            expect(schdlManyRecipientsOut.attributes.type)
                .to.equal(scheduleManyUsersFixture.type);
            expect(schdlManyRecipientsOut.attributes.timeOfDay)
                .to.equal(scheduleManyUsersFixture.timeOfDay);
            expect(schdlManyRecipientsOut.attributes.endDate)
                .to.equal(scheduleManyUsersFixture.endDate + 'T00:00:00.000Z');
            expect(schdlManyRecipientsOut.attributes.weekends)
                .to.equal(false);
            expect(schdlManyRecipientsOut.attributes.queryId)
                .to.equal(queryOutput1.id);
            expect(/^[a-f0-9]{32}$/.test(schdlManyRecipientsOut.
                attributes.userId)).to.be.true;
            expect(validator.isISO8601(schdlManyRecipientsOut.
                attributes.updated_at)).to.be.true;
            expect(validator.isISO8601(schdlManyRecipientsOut.
                attributes.created_at))
                .to.be.true;
            done();
        });

    after('delete report', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.scheduleDelete,
                schdlManyRecipientsOut.id))
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
