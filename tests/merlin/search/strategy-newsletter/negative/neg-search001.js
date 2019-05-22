'use strict';

// vendor dependencies
const chance = require('chance').Chance();
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const request = require('supertest-as-promised');
const util = require('util');

// runtime variables
const rootPath = process.env.ROOT_PATH;
const targetEndpoint = require(rootPath + '/config/merlin/endpoints');
const targetEnvironment =
    require(rootPath + '/config/merlin/' + process.env.NODE_ENV);
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const targetUser = usersTargetEnvironment.admin;
const merlinAuthHeaders = require(rootPath + '/helpers/merlin-auth-headers');
const requestTimeOut = 10000;

// shared test variable(s)
let authHeaders;
let resText001;

describe('{{MERLIN}} /search/strategy/newsletter >>> ' +
    '(-) invalid newsletter id >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('generate auth headers', (done) => {
        // generate auth headers
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then((headers) => {
            authHeaders = headers;
            done();
        });
    });

    before('search linked strategies - invalid id', (done) => {
        request(targetServer)
            .get(
                util.format(
                    targetEndpoint.searchStrategyNewsletter,
                    chance.hash({length: 31})
                )
            )
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(400);

                // assign shared test variable(s)
                resText001 = JSON.parse(res.text);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return a 400 status code', () => {
        expect(resText001.statusCode).to.equal(400);
    });

    it('should return a invalid id error message', () => {
        expect(resText001.message).to.contain(
            'fails to match the required pattern: /^[a-z0-9]{32}$/'
        );
    });
});
