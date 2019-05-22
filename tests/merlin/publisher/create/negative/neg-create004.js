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
const setupFixture001 =
    require(rootPath + '/fixtures/common/media-group/create001');
const testFixture =
    require(rootPath + '/fixtures/common/publisher/create002');

// shared test variable(s)
let authHeaders;
let res002;
let resOutput001;
let resText001;
let resText002;
let sendBody001;
let sendBody002;

describe('{{MERLIN}} /publisher {create} >>> ' +
    '(-) body - multiple invalid fields >>>', function() {

    // set timeout for test suite
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

    before('create media group - minimum required', function(done) {

        sendBody001 = Object.assign({}, setupFixture001);

        // assign name
        sendBody001.name += timeStamp;

        request(targetServer)
            .post(util.format(targetEndpoint.mediaGroupCreate))
            .set(authHeaders)
            .send(sendBody001)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText001 = JSON.parse(res.text);
                resOutput001 = resText001.output;

                // spot check response
                expect(/^[a-f0-9]{32}$/.test(resOutput001.id)).to.be.true;
                expect(resOutput001.name).to.have.length.of.at.most(128);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create publisher - multiple invalid fields', function(done) {

        sendBody002 = Object.assign({}, testFixture);

        // assign name and media-group to publisher
        sendBody002.name += timeStamp;
        sendBody002.mediaGroup = resOutput001.id;

        // add invalid fields
        sendBody002.category =
            chance.string({length: 5, pool: characterPool});
        sendBody002.executive =
            chance.hash({length: 32});
        sendBody002.domain =
            chance.string({length: 129, pool: characterPool});
        sendBody002.contactEmails =
            chance.email();
        sendBody002.emailTagReplacement =
            chance.string({length: 129, pool: characterPool});
        sendBody002.placementTagReplacement =
            chance.string({length: 129, pool: characterPool});
        sendBody002.categories =
            chance.n(chance.word, 5);
        sendBody002.blocklistCategories =
            chance.n(chance.word, 5);
        sendBody002.iabCreativeAttribute =
            chance.n(chance.integer, {min: 100});
        sendBody002.targetedAdvertisers =
            chance.n(chance.hash, 5, {length: 32});
        sendBody002.keyValuesCount =
            chance.string({pool: characterPool});

        // invalid ssp control fields
        sendBody002.sspControl = {};
        sendBody002.sspControl.targetingType =
            chance.string({pool: characterPool});
        sendBody002.sspControl.applyBlocklists =
            chance.string({pool: characterPool});
        sendBody002.sspControl.rbtAllow =
            chance.string({pool: characterPool});
        sendBody002.sspControl.rbtFloor =
            chance.string({pool: characterPool});
        sendBody002.sspControl.uniqueAds = 'campaign';
        sendBody002.sspControl.targetingType =
            chance.string({pool: characterPool});
        sendBody002.sspControl.userMatchAllow =
            chance.string({pool: characterPool});
        sendBody002.sspControl.demandAllocationHouse =
            chance.floating();

        // invalid contact fields
        sendBody002.contact = {};
        sendBody002.contact.company =
            chance.string({length: 129, pool: characterPool});
        sendBody002.contact.email =
            chance.string({length: 32, pool: characterPool});
        sendBody002.contact.firstName =
            chance.string({length: 33, pool: characterPool});
        sendBody002.contact.lastName =
            chance.string({length: 33, pool: characterPool});
        sendBody002.contact.phone =
            chance.string({length: 10, pool: characterPool});
        sendBody002.contact.address1 =
            chance.string({length: 129, pool: characterPool});
        sendBody002.contact.city =
            chance.string({length: 65, pool: characterPool});
        sendBody002.contact.state =
            chance.string({length: 33, pool: characterPool});
        sendBody002.contact.postalCode =
            chance.string({length: 33, pool: characterPool});
        sendBody002.contact.country =
            chance.string({length: 33, pool: characterPool});

        // invalid key values
        sendBody002.keyValues = {'s': ['xyz'],'sz': ['xyz'],'e': ['xyz'],
            'm': ['xyz'], 'u': ['xyz'], 'sh': ['xyz'],
            'p': ['xyz'],'c': ['xyz'], 'ci': ['xyz'],
            'debug': ['xyz'],'no_dart': ['xyz'],
            'test': ['xyz'], 't': ['xyz'], 'dom': ['xyz'],
            '__browser': ['xyz'],'__debug': ['xyz'],
            '__fdd': ['xyz'], '__ip': ['xyz'],
            '__test': ['xyz'],'__track_off': ['xyz'],
            '__ul': ['xyz'], 'layout': ['xyz'],
            'li': ['xyz']};

        request(targetServer)
            .post(util.format(targetEndpoint.publisherCreate))
            .set(authHeaders)
            .send(sendBody002)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(400);

                // assign shared test variable(s)
                res002 = res;
                resText002 = JSON.parse(res.text);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 400', function() {
        expect(res002.status).to.equal(400);
    });

    it('response should contain an error for each invalid field', function() {
        expect(resText002.errors).to.deep.include.members([
            {id: 'E1000', code: 'INV', details: 'keyValuesCount'},
            {id: 'E1000', code: 'INV', details: 'keyValues'},
            {id: 'E1000', code: 'INV', details: 'category'},
            {id: 'E1000', code: 'INV', details: 'domain'},
            {id: 'E1000', code: 'INV', details: 'emailTagReplacement'},
            {id: 'E1000', code: 'INV', details: 'placementTagReplacement'},
            {id: 'E1000', code: 'INV', details: 'contactEmails'},
            {id: 'E1000', code: 'INV', details: 'categories'},
            {id: 'E1000', code: 'INV', details: 'blocklistCategories'},
            {id: 'E1000', code: 'INV', details: 'sspControl:targetingType'},
            {id: 'E1000', code: 'INV', details: 'sspControl:applyBlocklists'},
            {id: 'E1000', code: 'INV', details: 'sspControl:uniqueAds'},
            {id: 'E1000', code: 'INV', details: 'sspControl:userMatchAllow'},
            {id: 'E1000',
                code: 'INV',
                details: 'sspControl:demandAllocationHouse'},
            {id: 'E1000', code: 'INV', details: 'contact:company'},
            {id: 'E1000', code: 'INV', details: 'contact:email'},
            {id: 'E1000', code: 'INV', details: 'contact:firstName'},
            {id: 'E1000', code: 'INV', details: 'contact:lastName'},
            {id: 'E1000', code: 'INV', details: 'contact:phone'},
            {id: 'E1000', code: 'INV', details: 'contact:address1'},
            {id: 'E1000', code: 'INV', details: 'contact:city'},
            {id: 'E1000', code: 'INV', details: 'contact:postalCode'},
            {id: 'E1000', code: 'INV', details: 'contact:state'},
            {id: 'E1000', code: 'INV', details: 'contact:country'}
        ]);

    });

    after('delete media-group', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.mediaGroupDelete, resOutput001.id))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

});
