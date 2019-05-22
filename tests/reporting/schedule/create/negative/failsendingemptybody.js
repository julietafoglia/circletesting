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

// shared test variable(s)
let authHeaders;
let emptyBodyScheduling;

let emptyBodySchdlErr;

describe('{{REPORTING}} <SMOKE> /schedule report @ADMIN >>> ' +
    '(-) check errors scheduling without body >>>', function() {

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


    // before('generate auth headers', function(done) {
    //     authHeaders = {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json',
    //         'Accept-Language': 'en',
    //         'Authorization': 'Bearer dc11509244e7c8cdff513abeb8cb932c'
    //     };
    //     done();
    // });

    before('Try to schedule daily report without body',
        function(done) {
            emptyBodyScheduling = Object.assign({}, {});

            request(targetServer)
                .post(util.format(targetEndpoint.scheduleCreate))
                .set(authHeaders)
                .send(emptyBodyScheduling)
                .then( function(response) {
                    emptyBodySchdlErr = (JSON.parse(response.text));
                    done();
                })
                .catch( function(err) {
                    throw(err);
                });
        });

    it('Check errors scheduling without sending body',
        function(done) {
            expect(emptyBodySchdlErr.statusCode).to.equal(400);
            expect(emptyBodySchdlErr.error).to.equal('Bad Request');
            expect(emptyBodySchdlErr.validation.source).to.equal('payload');
            expect(emptyBodySchdlErr.validation.keys[0]).to.equal('type');
            expect(emptyBodySchdlErr.validation.keys[1]).to.equal('startDate');
            expect(emptyBodySchdlErr.validation.keys[2]).to.equal('endDate');
            expect(emptyBodySchdlErr.validation.keys[3]).to.equal('timeOfDay');
            expect(emptyBodySchdlErr.validation.keys[4]).to.equal('recipients');
            expect(emptyBodySchdlErr.validation.keys[5]).to.equal('queryId');
            expect(emptyBodySchdlErr.message).to.equal(
                'child "type" fails because ["type" ' +
                'is required]. ' +
                'child "startDate" fails because ["startDate" ' +
                'is required]. ' +
                'child "endDate" fails because ["endDate" is required]. ' +
                'child "timeOfDay" fails because ["timeOfDay" ' +
                'is required]. ' +
                'child "recipients" fails because ' +
                '["recipients" is required]. ' +
                'child "queryId" fails because ["queryId" is required]');
            done();
        });

});
