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

describe('{{MERLIN}}  >>> ' +
    '(-) invalid ad-slot id >>>', function() {

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

    before('search linked strategies - invalid ad-slot id', (done) => {

        let payload = {
            'conditions': [
                {'field': 'adSlot', 'value': chance.hash({length: 30})}
            ]
        };

        request(targetServer)
            .post(util.format(targetEndpoint.searchStrategyAdSlotAdvanced))
            .send(payload)
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

    it('should return a invalid ad-slot id error', () => {
        expect(resText001.errors).to.deep.include.members([{
            'id': 'E1000', 'code': 'INV', 'details': 'condition:adSlot'
        }]);
    });
});
