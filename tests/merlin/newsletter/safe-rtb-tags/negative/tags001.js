'use strict';

// vendor dependencies
const chance = require('chance').Chance();
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const request = require('supertest-as-promised');
const util = require('util');

// runtime variables
const rootPath =
    process.env.ROOT_PATH;
const targetEndpoint =
    require(rootPath + '/config/merlin/endpoints');
const targetEnvironment =
    require(rootPath + '/config/merlin/' + process.env.NODE_ENV);
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetServer =
    targetEnvironment.server;
const targetUser =
    usersTargetEnvironment.admin;
const merlinAuthHeaders =
    require(rootPath + '/helpers/merlin-auth-headers');
const requestTimeOut = 10000;

// shared test variable(s)
let authHeaders;
let res001;

describe('{{MERLIN}} /newsletter {id safe-rtb-tags} >>> ' +
    '(-) get safe-rtb tags - invalid id >>>', function() {

    // set timeout for test suite
    this.timeout(requestTimeOut);

    before('generate auth headers', (done) => {
        // generate auth headers
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then((headers) => {
            authHeaders = headers;
            done();
        }, (err) => {
            done(err);
        });
    });

    before('get safe-rtb tags', (done) => {
        // modify headers to accept text/html
        let headers = Object.assign({}, authHeaders);
        headers['Accept'] = 'text/html';
        request(targetServer)
            .get(
                util.format(
                    targetEndpoint.newsletterSafeRtbTags,
                    chance.hash({length: 27})
                )
            )
            .set(headers)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(400);

                // assign shared test variable(s)
                res001 = res;
                done();
            })
            .catch((err) => {
                throw(err);
            });
    });

    it('should return a 400 status', () => {
        expect(res001.status).to.equal(400);
    });

});
