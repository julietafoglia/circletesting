'use strict';

// vendor dependencies
const chance = require('chance').Chance();
const chai = require('chai');


const expect = chai.expect; // use bdd chai
const moment = require('moment');


const request = require('supertest-as-promised');
const util = require('util');
const validator = require('validator');

// runtime variables
const rootPath =
    process.env.ROOT_PATH;
const targetEndpoint =
    require(rootPath + '/config/iceman/endpoints');
const targetEnvironment =
    require(rootPath + '/config/iceman/' + process.env.NODE_ENV);
const targetServer =
    targetEnvironment.server;
const clientToken =
    targetEnvironment.clientToken;

// generates auth request headers
const genAuthTokenHeaders = function(inputToken) {
    let authTokenHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + inputToken
    };
    return authTokenHeaders;
};

// generates auth request body
const genAuthTokenBody = function(inputUser) {
    let authTokenBody = {
        'username': inputUser.username,
        'password': inputUser.password,
        'grant_type': 'password'
    };
    return authTokenBody;
};

module.exports = function(user) {

    const authTokenHeaders = genAuthTokenHeaders(clientToken);
    const authTokenBody = genAuthTokenBody(user);

    return new Promise( function(resolve, reject) {

        request(targetServer)
            .post(targetEndpoint.oauthToken)
            .set(authTokenHeaders)
            .send(authTokenBody)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // parse and resolve access token
                const authRes = res.text;
                const authResJson = JSON.parse(authRes);
                const authToken = authResJson.access_token;
                resolve(authToken);
            })
            .catch( function(err) {
                reject(err);
            });
    });
};
