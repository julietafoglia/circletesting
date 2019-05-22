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
const characterPool =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// shared test variable(s)
let authHeaders;
let res001;
let resText001;
let sendBody001;

describe('{{MERLIN}} /media-group {create} @ADMIN >>> ' +
    '(-) body - invalid required fields >>>', function() {

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

    before('create media-group - invalid required', function(done) {

        sendBody001 = {};

        // assign invalid values
        sendBody001.name =
            chance.string({length: 129, pool: characterPool});
        sendBody001.salesforceId =
            chance.string({length: 33, pool: characterPool});
        sendBody001.tier =
            chance.string({length: 5, pool: characterPool});
        sendBody001.contact = {};
        sendBody001.contact.company =
            chance.string({length: 129, pool: characterPool});
        sendBody001.contact.emailAddress =
            chance.word() + '@' + chance.word();
        sendBody001.contact.phone =
            chance.string({length: 10, pool: characterPool});
        sendBody001.contact.address1 =
            chance.string({length: 129, pool: characterPool});
        sendBody001.contact.address2 =
            chance.string({length: 129, pool: characterPool});
        sendBody001.contact.city =
            chance.string({length: 129, pool: characterPool});
        sendBody001.contact.state =
            chance.string({length: 33, pool: characterPool});
        sendBody001.contact.postalCode =
            chance.string({length: 33, pool: characterPool});
        sendBody001.contact.country =
            chance.string({length: 33, pool: characterPool});
        sendBody001.contractType =
            chance.string({length: 10, pool: characterPool});
        sendBody001.feeStructure =
            chance.string({length: 10, pool: characterPool});
        sendBody001.liPaymentTerms =
            chance.string({length: 10, pool: characterPool});
        sendBody001.dspFee = chance.integer({min: 100});
        sendBody001.sspFee = chance.integer({min: 100});

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
            {'id': 'E1000', 'code': 'INV', 'details': 'name'},
            {'id': 'E1000', 'code': 'INV', 'details': 'salesforceId'},
            {'id': 'E1000', 'code': 'INV', 'details': 'tier'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:company'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:emailAddress'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:phone'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:address1'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:address2'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:city'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:state'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:postalCode'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contact:country'},
            {'id': 'E1000', 'code': 'INV', 'details': 'contractType'},
            {'id': 'E1000', 'code': 'INV', 'details': 'feeStructure'},
            {'id': 'E1000', 'code': 'INV', 'details': 'liPaymentTerms'},
            {'id': 'E1000', 'code': 'INV', 'details': 'dspFee'},
            {'id': 'E1000', 'code': 'INV', 'details': 'sspFee'}
        ]);
    });

});
