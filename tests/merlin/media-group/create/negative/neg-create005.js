'use strict';

// vendor dependencies
const chance = require('chance').Chance();
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const moment = require('moment');
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
const timeStamp =
    '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');
const characterPool =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/media-group/create004');

// shared test variable(s)
let authHeaders;
let res001;
let resText001;
let sendBody001;

describe('{{MERLIN}} /media-group {create} @ADMIN >>> ' +
    '(-) body - invalid non-required fields >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('generate auth headers', function(done) {

        // generate auth headers
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('create media-group - invalid non-required', function(done) {

        sendBody001 = Object.assign({}, testFixture);

        // clone test fixture's contact and contract objects
        sendBody001.contact = Object.assign({}, testFixture.contact);
        sendBody001.contract = Object.assign({}, testFixture.contract);

        // assign name to media-group
        sendBody001.name += timeStamp;

        // assign invalid values to non-required fields
        sendBody001.tagsUrlPrefix =
            chance.string({length: 129, pool: characterPool});
        sendBody001.lotame =
            chance.string({length: 49, pool: characterPool});
        sendBody001.contact.firstName =
            chance.string({length: 33, pool: characterPool});
        sendBody001.contact.lastName =
            chance.string({length: 33, pool: characterPool});
        sendBody001.promotionalRights =
            chance.string({length: 10, pool: characterPool});
        sendBody001.clientPaymentTerms =
            chance.string({length: 10, pool: characterPool});
        sendBody001.agreedRepurposing =
            chance.string({length: 10, pool: characterPool});
        sendBody001.agreedExclusivity =
            chance.string({length: 10, pool: characterPool});
        sendBody001.agreedPoweredBy =
            chance.string({length: 10, pool: characterPool});
        sendBody001.agreedAdChoices =
             chance.string({length: 10, pool: characterPool});
        sendBody001.agreedUserMatching =
            chance.string({length: 10, pool: characterPool});
        sendBody001.flatFee =
            chance.integer({min: 100000000});
        sendBody001.adServingFee =
            chance.integer({min: 1000000});
        sendBody001.tierType =
            chance.string({length: 10, pool: characterPool});
        sendBody001.monthlyMinimum =
            chance.integer({min: 100000000});
        sendBody001.feesEffectiveDate =
            chance.date({string: true});
        sendBody001.marginalFee =
            chance.string({length: 10, pool: characterPool});
        sendBody001.includedCampaigns =
            chance.string({length: 5, pool: characterPool});

        request(targetServer)
            .post(util.format(targetEndpoint.mediaGroupCreate))
            .set(authHeaders)
            .send(sendBody001)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(400);

                // assign shared test variable(s)
                res001 = res;
                resText001 = JSON.parse(res.text);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 400', function() {
        expect(res001.status).to.equal(400);
    });

    it('response should contain an error for each invalid field', function() {
        expect(resText001.errors).to.deep.include.members([
            {'id': 'E1000', 'code': 'INV', 'details': 'tagsUrlPrefix'},
            {'id': 'E1000', 'code': 'INV', 'details': 'lotame'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:firstName'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:lastName'},
            {'id': 'E1000', 'code': 'INV', 'details': 'promotionalRights'},
            {'id': 'E1000', 'code': 'INV', 'details': 'clientPaymentTerms'},
            {'id': 'E1000', 'code': 'INV', 'details': 'agreedRepurposing'},
            {'id': 'E1000', 'code': 'INV', 'details': 'agreedExclusivity'},
            {'id': 'E1000', 'code': 'INV', 'details': 'agreedPoweredBy'},
            {'id': 'E1000', 'code': 'INV', 'details': 'agreedAdChoices'},
            {'id': 'E1000', 'code': 'INV', 'details': 'agreedUserMatching'},
            {'id': 'E1000', 'code': 'INV', 'details': 'adServingFee'},
            {'id': 'E1000', 'code': 'INV', 'details': 'tierType'},
            {'id': 'E1000', 'code': 'INV', 'details': 'monthlyMinimum'},
            {'id': 'E1000', 'code': 'INV', 'details': 'marginalFee'},
            {'id': 'E1000', 'code': 'INV', 'details': 'includedCampaigns'},
            {'id': 'E1000', 'code': 'INV', 'details': 'flatFee'},
            {'id': 'E1000', 'code': 'INV', 'details': 'feesEffectiveDate'}
        ]);
    });

});
