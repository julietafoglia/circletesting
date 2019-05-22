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
    require(rootPath + '/config/reporting/endpoints');
const targetEnvironment =
    require(rootPath + '/config/reporting/' + process.env.NODE_ENV);
const targetServer =
    targetEnvironment.server;
const icemanAuthToken =
    require(rootPath + '/helpers/iceman-auth-token');
let authToken;

// generates auth tokenized headers
const genAuthTokenHeaders = function(inputToken) {
    let authTokenHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': 'en',
        'Authorization': 'Bearer ' + inputToken
    };
    return authTokenHeaders;
};

module.exports = function(user) {

    return new Promise( function(resolve, reject) {
        try {
            const genAuthToken =
                icemanAuthToken(user);
            genAuthToken.then( function(token) {
                const authTokenHeaders =
                    genAuthTokenHeaders(token);
                resolve(authTokenHeaders);
            });
        } catch (err) {
            reject(err);
        }
    });
};
