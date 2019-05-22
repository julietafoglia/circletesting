'use strict';

// vendor dependencies
const request = require('supertest-as-promised');
const chai = require('chai');


const expect = chai.expect; // use bdd chai

// runtime variables
const rootPath = process.env.ROOT_PATH;
const targetEndpoint = require(rootPath + '/config/merlin/endpoints');
const targetEnvironment =
    require(rootPath + '/config/merlin/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;

// generates initial auth login request body
function genAuthLoginBody(inputUser) {
    return {
        'username': inputUser.username,
        'password': inputUser.password
    };
}

// generates auth login tokenized headers
function genAuthLoginTokenHeaders(inputToken) {
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': 'en',
        'Authorization': 'Bearer ' + inputToken
    };
}

module.exports = function(user) {

    const authLoginBody = genAuthLoginBody(user);

    return new Promise( function(resolve, reject) {
        request(targetServer)
            .post(targetEndpoint.authLogin)
            .set({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
            .send(authLoginBody)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // parse token and generate tokenized headers
                const authRes = res.text;
                const authResJson = JSON.parse(authRes);
                const token = authResJson.token;
                resolve(genAuthLoginTokenHeaders(token));
            }, (err) => {
                reject(err);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
